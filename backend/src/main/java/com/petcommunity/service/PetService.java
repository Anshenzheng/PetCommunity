package com.petcommunity.service;

import com.petcommunity.dto.PetDTO;
import com.petcommunity.entity.Pet;
import com.petcommunity.entity.User;
import com.petcommunity.repository.PetRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PetService {
    
    private final PetRepository petRepository;
    private final UserService userService;
    
    @Transactional
    public Pet createPet(PetDTO dto) {
        User currentUser = userService.getCurrentUser();
        
        if (User.Role.ADMIN.equals(currentUser.getRole())) {
            throw new RuntimeException("管理员身份不可发布宠物");
        }
        
        Pet pet = new Pet();
        pet.setName(dto.getName());
        pet.setSpecies(dto.getSpecies());
        pet.setBreed(dto.getBreed());
        pet.setAge(dto.getAge());
        pet.setGender(dto.getGender());
        pet.setColor(dto.getColor());
        pet.setPersonality(dto.getPersonality());
        pet.setDescription(dto.getDescription());
        pet.setPhotos(dto.getPhotos());
        pet.setStatus(Pet.Status.AVAILABLE.name());
        pet.setOwner(currentUser);
        pet.setApproved(false);
        
        return petRepository.save(pet);
    }
    
    @Transactional
    public Pet updatePet(Long id, PetDTO dto) {
        Pet pet = petRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("宠物不存在"));
        
        User currentUser = userService.getCurrentUser();
        if (!pet.getOwner().getId().equals(currentUser.getId()) && 
            !currentUser.getRole().equals(User.Role.ADMIN)) {
            throw new RuntimeException("无权修改此宠物信息");
        }
        
        pet.setName(dto.getName());
        pet.setSpecies(dto.getSpecies());
        pet.setBreed(dto.getBreed());
        pet.setAge(dto.getAge());
        pet.setGender(dto.getGender());
        pet.setColor(dto.getColor());
        pet.setPersonality(dto.getPersonality());
        pet.setDescription(dto.getDescription());
        if (dto.getPhotos() != null && !dto.getPhotos().isEmpty()) {
            pet.setPhotos(dto.getPhotos());
        }
        pet.setUpdatedAt(LocalDateTime.now());
        
        return petRepository.save(pet);
    }
    
    @Transactional
    public void deletePet(Long id) {
        Pet pet = petRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("宠物不存在"));
        
        User currentUser = userService.getCurrentUser();
        if (!pet.getOwner().getId().equals(currentUser.getId()) && 
            !currentUser.getRole().equals(User.Role.ADMIN)) {
            throw new RuntimeException("无权删除此宠物信息");
        }
        
        petRepository.delete(pet);
    }
    
    public Pet findById(Long id) {
        return petRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("宠物不存在"));
    }
    
    public Page<PetDTO> findApprovedPets(Pageable pageable) {
        return petRepository.findByApprovedTrueOrderByCreatedAtDesc(pageable)
            .map(this::toDTO);
    }
    
    public Page<PetDTO> findApprovedPetsByStatus(String status, Pageable pageable) {
        return petRepository.findByApprovedTrueAndStatusOrderByCreatedAtDesc(status, pageable)
            .map(this::toDTO);
    }
    
    public Page<PetDTO> searchPets(String keyword, Pageable pageable) {
        return petRepository.searchPets(keyword, pageable)
            .map(this::toDTO);
    }
    
    public List<PetDTO> findMyPets() {
        User currentUser = userService.getCurrentUser();
        return petRepository.findByOwnerOrderByCreatedAtDesc(currentUser)
            .stream()
            .map(this::toDTO)
            .collect(Collectors.toList());
    }
    
    public Page<PetDTO> findPendingApprovals(Pageable pageable) {
        return petRepository.findByApprovedFalseOrderByCreatedAtDesc(pageable)
            .map(this::toDTO);
    }
    
    @Transactional
    public Pet approvePet(Long id) {
        Pet pet = petRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("宠物不存在"));
        
        User currentUser = userService.getCurrentUser();
        if (!currentUser.getRole().equals(User.Role.ADMIN)) {
            throw new RuntimeException("无权限审核");
        }
        
        pet.setApproved(true);
        pet.setApprovedBy(currentUser);
        
        return petRepository.save(pet);
    }
    
    @Transactional
    public Pet rejectPet(Long id) {
        Pet pet = petRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("宠物不存在"));
        
        petRepository.delete(pet);
        return pet;
    }
    
    public PetDTO toDTO(Pet pet) {
        PetDTO dto = new PetDTO();
        dto.setId(pet.getId());
        dto.setName(pet.getName());
        dto.setSpecies(pet.getSpecies());
        dto.setBreed(pet.getBreed());
        dto.setAge(pet.getAge());
        dto.setGender(pet.getGender());
        dto.setColor(pet.getColor());
        dto.setPersonality(pet.getPersonality());
        dto.setDescription(pet.getDescription());
        dto.setPhotos(pet.getPhotos());
        dto.setStatus(pet.getStatus());
        dto.setApproved(pet.getApproved());
        dto.setCreatedAt(pet.getCreatedAt());
        dto.setUpdatedAt(pet.getUpdatedAt());
        
        if (pet.getOwner() != null) {
            dto.setOwnerId(pet.getOwner().getId());
            dto.setOwnerName(pet.getOwner().getUsername());
            dto.setOwnerAvatar(pet.getOwner().getAvatar());
        }
        
        return dto;
    }
}
