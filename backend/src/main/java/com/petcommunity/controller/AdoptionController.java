package com.petcommunity.controller;

import com.petcommunity.dto.AdoptionApplicationDTO;
import com.petcommunity.entity.AdoptionApplication;
import com.petcommunity.service.AdoptionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/adoptions")
@RequiredArgsConstructor
public class AdoptionController {
    
    private final AdoptionService adoptionService;
    
    @GetMapping("/my")
    public ResponseEntity<List<AdoptionApplicationDTO>> getMyApplications() {
        return ResponseEntity.ok(adoptionService.findMyApplications());
    }
    
    @GetMapping("/pet/{petId}")
    public ResponseEntity<List<AdoptionApplicationDTO>> getByPet(@PathVariable Long petId) {
        return ResponseEntity.ok(adoptionService.findByPet(petId));
    }
    
    @PostMapping
    public ResponseEntity<AdoptionApplicationDTO> submitApplication(@Valid @RequestBody AdoptionApplicationDTO dto) {
        AdoptionApplication application = adoptionService.submitApplication(dto);
        return ResponseEntity.ok(adoptionService.toDTO(application));
    }
}
