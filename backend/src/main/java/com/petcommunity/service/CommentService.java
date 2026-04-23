package com.petcommunity.service;

import com.petcommunity.dto.CommentDTO;
import com.petcommunity.entity.Comment;
import com.petcommunity.entity.Pet;
import com.petcommunity.entity.User;
import com.petcommunity.repository.CommentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommentService {
    
    private final CommentRepository commentRepository;
    private final PetService petService;
    private final UserService userService;
    
    @Transactional
    public Comment createComment(CommentDTO dto) {
        User currentUser = userService.getCurrentUser();
        Pet pet = petService.findById(dto.getPetId());
        
        Comment comment = new Comment();
        comment.setPet(pet);
        comment.setUser(currentUser);
        comment.setContent(dto.getContent());
        comment.setApproved(false);
        
        return commentRepository.save(comment);
    }
    
    public List<CommentDTO> findByPet(Long petId) {
        Pet pet = petService.findById(petId);
        return commentRepository.findByPetAndApprovedTrueOrderByCreatedAtDesc(pet)
            .stream()
            .map(this::toDTO)
            .collect(Collectors.toList());
    }
    
    public List<CommentDTO> findPendingComments() {
        return commentRepository.findByApprovedFalseOrderByCreatedAtDesc()
            .stream()
            .map(this::toDTO)
            .collect(Collectors.toList());
    }
    
    @Transactional
    public Comment approveComment(Long id) {
        Comment comment = commentRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("留言不存在"));
        
        User currentUser = userService.getCurrentUser();
        if (!currentUser.getRole().equals(User.Role.ADMIN)) {
            throw new RuntimeException("无权限审核");
        }
        
        comment.setApproved(true);
        comment.setApprovedBy(currentUser);
        
        return commentRepository.save(comment);
    }
    
    @Transactional
    public void deleteComment(Long id) {
        Comment comment = commentRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("留言不存在"));
        
        User currentUser = userService.getCurrentUser();
        if (!comment.getUser().getId().equals(currentUser.getId()) && 
            !currentUser.getRole().equals(User.Role.ADMIN)) {
            throw new RuntimeException("无权删除此留言");
        }
        
        commentRepository.delete(comment);
    }
    
    public CommentDTO toDTO(Comment comment) {
        CommentDTO dto = new CommentDTO();
        dto.setId(comment.getId());
        dto.setContent(comment.getContent());
        dto.setApproved(comment.getApproved());
        dto.setCreatedAt(comment.getCreatedAt());
        
        if (comment.getPet() != null) {
            dto.setPetId(comment.getPet().getId());
        }
        
        if (comment.getUser() != null) {
            dto.setUserId(comment.getUser().getId());
            dto.setUserName(comment.getUser().getUsername());
            dto.setUserAvatar(comment.getUser().getAvatar());
        }
        
        return dto;
    }
}
