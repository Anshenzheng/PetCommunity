package com.petcommunity.controller;

import com.petcommunity.dto.CommentDTO;
import com.petcommunity.entity.Comment;
import com.petcommunity.service.CommentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/comments")
@RequiredArgsConstructor
public class CommentController {
    
    private final CommentService commentService;
    
    @GetMapping("/pet/{petId}")
    public ResponseEntity<List<CommentDTO>> getByPet(@PathVariable Long petId) {
        return ResponseEntity.ok(commentService.findByPet(petId));
    }
    
    @PostMapping
    public ResponseEntity<CommentDTO> createComment(@Valid @RequestBody CommentDTO dto) {
        Comment comment = commentService.createComment(dto);
        return ResponseEntity.ok(commentService.toDTO(comment));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteComment(@PathVariable Long id) {
        commentService.deleteComment(id);
        return ResponseEntity.noContent().build();
    }
}
