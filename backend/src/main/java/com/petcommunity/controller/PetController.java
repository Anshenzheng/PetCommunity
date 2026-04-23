package com.petcommunity.controller;

import com.petcommunity.dto.PetDTO;
import com.petcommunity.entity.Pet;
import com.petcommunity.service.PetService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/pets")
@RequiredArgsConstructor
public class PetController {
    
    private final PetService petService;
    
    @GetMapping("/public")
    public ResponseEntity<Page<PetDTO>> getApprovedPets(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(petService.findApprovedPets(pageable));
    }
    
    @GetMapping("/public/status/{status}")
    public ResponseEntity<Page<PetDTO>> getPetsByStatus(
            @PathVariable String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(petService.findApprovedPetsByStatus(status, pageable));
    }
    
    @GetMapping("/public/search")
    public ResponseEntity<Page<PetDTO>> searchPets(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(petService.searchPets(keyword, pageable));
    }
    
    @GetMapping("/public/{id}")
    public ResponseEntity<PetDTO> getPetById(@PathVariable Long id) {
        Pet pet = petService.findById(id);
        return ResponseEntity.ok(petService.toDTO(pet));
    }
    
    @GetMapping("/my")
    public ResponseEntity<List<PetDTO>> getMyPets() {
        return ResponseEntity.ok(petService.findMyPets());
    }
    
    @PostMapping
    public ResponseEntity<PetDTO> createPet(@Valid @RequestBody PetDTO dto) {
        Pet pet = petService.createPet(dto);
        return ResponseEntity.ok(petService.toDTO(pet));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<PetDTO> updatePet(@PathVariable Long id, @Valid @RequestBody PetDTO dto) {
        Pet pet = petService.updatePet(id, dto);
        return ResponseEntity.ok(petService.toDTO(pet));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePet(@PathVariable Long id) {
        petService.deletePet(id);
        return ResponseEntity.noContent().build();
    }
}
