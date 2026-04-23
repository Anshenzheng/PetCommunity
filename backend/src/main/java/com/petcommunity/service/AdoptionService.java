package com.petcommunity.service;

import com.petcommunity.dto.AdoptionApplicationDTO;
import com.petcommunity.entity.AdoptionApplication;
import com.petcommunity.entity.Pet;
import com.petcommunity.entity.User;
import com.petcommunity.repository.AdoptionApplicationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdoptionService {
    
    private final AdoptionApplicationRepository applicationRepository;
    private final PetService petService;
    private final UserService userService;
    
    @Transactional
    public AdoptionApplication submitApplication(AdoptionApplicationDTO dto) {
        User currentUser = userService.getCurrentUser();
        Pet pet = petService.findById(dto.getPetId());
        
        if (User.Role.ADMIN.equals(currentUser.getRole())) {
            throw new RuntimeException("管理员身份不可申请领养宠物");
        }
        
        if (pet.getOwner() != null && currentUser.getId().equals(pet.getOwner().getId())) {
            throw new RuntimeException("您不能领养自己发布的宠物");
        }
        
        if (!pet.getApproved()) {
            throw new RuntimeException("该宠物信息尚未审核通过");
        }
        if (!Pet.Status.AVAILABLE.name().equals(pet.getStatus())) {
            throw new RuntimeException("该宠物暂不可领养");
        }
        
        List<AdoptionApplication.ApplicationStatus> pendingStatuses = Arrays.asList(
            AdoptionApplication.ApplicationStatus.PENDING
        );
        if (applicationRepository.existsByPetAndApplicantAndStatusIn(pet, currentUser, pendingStatuses)) {
            throw new RuntimeException("您已提交过领养申请");
        }
        
        AdoptionApplication application = new AdoptionApplication();
        application.setPet(pet);
        application.setApplicant(currentUser);
        application.setReason(dto.getReason());
        application.setLivingEnvironment(dto.getLivingEnvironment());
        application.setPetExperience(dto.getPetExperience());
        application.setContactPhone(dto.getContactPhone());
        application.setStatus(AdoptionApplication.ApplicationStatus.PENDING);
        
        return applicationRepository.save(application);
    }
    
    public List<AdoptionApplicationDTO> findMyApplications() {
        User currentUser = userService.getCurrentUser();
        return applicationRepository.findByApplicantOrderByCreatedAtDesc(currentUser)
            .stream()
            .map(this::toDTO)
            .collect(Collectors.toList());
    }
    
    public List<AdoptionApplicationDTO> findByPet(Long petId) {
        Pet pet = petService.findById(petId);
        return applicationRepository.findByPetOrderByCreatedAtDesc(pet)
            .stream()
            .map(this::toDTO)
            .collect(Collectors.toList());
    }
    
    public Page<AdoptionApplicationDTO> findAllApplications(Pageable pageable) {
        return applicationRepository.findAllByOrderByCreatedAtDesc(pageable)
            .map(this::toDTO);
    }
    
    public Page<AdoptionApplicationDTO> findPendingApplications(Pageable pageable) {
        return applicationRepository.findByStatusOrderByCreatedAtDesc(
            AdoptionApplication.ApplicationStatus.PENDING, pageable
        ).map(this::toDTO);
    }
    
    @Transactional
    public AdoptionApplication approveApplication(Long id, String reviewComment) {
        AdoptionApplication application = applicationRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("申请不存在"));
        
        User currentUser = userService.getCurrentUser();
        if (!currentUser.getRole().equals(User.Role.ADMIN)) {
            throw new RuntimeException("无权限审核");
        }
        
        application.setStatus(AdoptionApplication.ApplicationStatus.APPROVED);
        application.setReviewComment(reviewComment);
        application.setReviewer(currentUser);
        application.setReviewedAt(LocalDateTime.now());
        
        Pet pet = application.getPet();
        pet.setStatus(Pet.Status.ADOPTED.name());
        
        return applicationRepository.save(application);
    }
    
    @Transactional
    public AdoptionApplication rejectApplication(Long id, String reviewComment) {
        AdoptionApplication application = applicationRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("申请不存在"));
        
        User currentUser = userService.getCurrentUser();
        if (!currentUser.getRole().equals(User.Role.ADMIN)) {
            throw new RuntimeException("无权限审核");
        }
        
        application.setStatus(AdoptionApplication.ApplicationStatus.REJECTED);
        application.setReviewComment(reviewComment);
        application.setReviewer(currentUser);
        application.setReviewedAt(LocalDateTime.now());
        
        return applicationRepository.save(application);
    }
    
    public AdoptionApplicationDTO toDTO(AdoptionApplication application) {
        AdoptionApplicationDTO dto = new AdoptionApplicationDTO();
        dto.setId(application.getId());
        dto.setReason(application.getReason());
        dto.setLivingEnvironment(application.getLivingEnvironment());
        dto.setPetExperience(application.getPetExperience());
        dto.setContactPhone(application.getContactPhone());
        dto.setStatus(application.getStatus().name());
        dto.setReviewComment(application.getReviewComment());
        dto.setCreatedAt(application.getCreatedAt());
        dto.setReviewedAt(application.getReviewedAt());
        
        if (application.getPet() != null) {
            dto.setPetId(application.getPet().getId());
            dto.setPetName(application.getPet().getName());
            dto.setPetPhotos(application.getPet().getPhotos());
        }
        
        if (application.getApplicant() != null) {
            dto.setApplicantId(application.getApplicant().getId());
            dto.setApplicantName(application.getApplicant().getUsername());
            dto.setApplicantEmail(application.getApplicant().getEmail());
            dto.setApplicantPhone(application.getApplicant().getPhone());
        }
        
        return dto;
    }
}
