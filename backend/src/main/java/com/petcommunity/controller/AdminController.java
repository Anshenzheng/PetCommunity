package com.petcommunity.controller;

import com.petcommunity.dto.AdoptionApplicationDTO;
import com.petcommunity.dto.CommentDTO;
import com.petcommunity.dto.PetDTO;
import com.petcommunity.entity.AdoptionApplication;
import com.petcommunity.entity.Comment;
import com.petcommunity.entity.Pet;
import com.petcommunity.service.AdoptionService;
import com.petcommunity.service.CommentService;
import com.petcommunity.service.PetService;
import com.petcommunity.service.UserService;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {
    
    private final PetService petService;
    private final AdoptionService adoptionService;
    private final CommentService commentService;
    private final UserService userService;
    
    @PostConstruct
    public void init() {
        userService.initAdmin();
    }
    
    @GetMapping("/pets/pending")
    public ResponseEntity<Page<PetDTO>> getPendingPets(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(petService.findPendingApprovals(pageable));
    }
    
    @PostMapping("/pets/{id}/approve")
    public ResponseEntity<PetDTO> approvePet(@PathVariable Long id) {
        Pet pet = petService.approvePet(id);
        return ResponseEntity.ok(petService.toDTO(pet));
    }
    
    @PostMapping("/pets/{id}/reject")
    public ResponseEntity<Map<String, String>> rejectPet(@PathVariable Long id) {
        petService.rejectPet(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "已拒绝");
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/adoptions")
    public ResponseEntity<Page<AdoptionApplicationDTO>> getAllApplications(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(adoptionService.findAllApplications(pageable));
    }
    
    @GetMapping("/adoptions/pending")
    public ResponseEntity<Page<AdoptionApplicationDTO>> getPendingApplications(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(adoptionService.findPendingApplications(pageable));
    }
    
    @PostMapping("/adoptions/{id}/approve")
    public ResponseEntity<AdoptionApplicationDTO> approveApplication(
            @PathVariable Long id,
            @RequestBody(required = false) Map<String, String> body) {
        String comment = body != null ? body.get("comment") : null;
        AdoptionApplication application = adoptionService.approveApplication(id, comment);
        return ResponseEntity.ok(adoptionService.toDTO(application));
    }
    
    @PostMapping("/adoptions/{id}/reject")
    public ResponseEntity<AdoptionApplicationDTO> rejectApplication(
            @PathVariable Long id,
            @RequestBody(required = false) Map<String, String> body) {
        String comment = body != null ? body.get("comment") : null;
        AdoptionApplication application = adoptionService.rejectApplication(id, comment);
        return ResponseEntity.ok(adoptionService.toDTO(application));
    }
    
    @GetMapping("/comments/pending")
    public ResponseEntity<List<CommentDTO>> getPendingComments() {
        return ResponseEntity.ok(commentService.findPendingComments());
    }
    
    @PostMapping("/comments/{id}/approve")
    public ResponseEntity<CommentDTO> approveComment(@PathVariable Long id) {
        Comment comment = commentService.approveComment(id);
        return ResponseEntity.ok(commentService.toDTO(comment));
    }
    
    @DeleteMapping("/comments/{id}")
    public ResponseEntity<Void> deleteComment(@PathVariable Long id) {
        commentService.deleteComment(id);
        return ResponseEntity.noContent().build();
    }
}
