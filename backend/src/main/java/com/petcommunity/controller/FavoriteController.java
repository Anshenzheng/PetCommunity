package com.petcommunity.controller;

import com.petcommunity.dto.PetDTO;
import com.petcommunity.entity.Favorite;
import com.petcommunity.service.FavoriteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/favorites")
@RequiredArgsConstructor
public class FavoriteController {
    
    private final FavoriteService favoriteService;
    
    @GetMapping
    public ResponseEntity<List<PetDTO>> getMyFavorites() {
        return ResponseEntity.ok(favoriteService.findMyFavorites());
    }
    
    @GetMapping("/check/{petId}")
    public ResponseEntity<Map<String, Boolean>> isFavorited(@PathVariable Long petId) {
        boolean favorited = favoriteService.isFavorited(petId);
        Map<String, Boolean> response = new HashMap<>();
        response.put("favorited", favorited);
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/{petId}")
    public ResponseEntity<Map<String, Object>> toggleFavorite(@PathVariable Long petId) {
        Favorite result = favoriteService.toggleFavorite(petId);
        Map<String, Object> response = new HashMap<>();
        if (result == null) {
            response.put("message", "已取消收藏");
            response.put("favorited", false);
        } else {
            response.put("message", "收藏成功");
            response.put("favorited", true);
        }
        return ResponseEntity.ok(response);
    }
}
