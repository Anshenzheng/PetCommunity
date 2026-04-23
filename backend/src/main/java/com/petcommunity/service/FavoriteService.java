package com.petcommunity.service;

import com.petcommunity.entity.Favorite;
import com.petcommunity.entity.Pet;
import com.petcommunity.entity.User;
import com.petcommunity.repository.FavoriteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FavoriteService {
    
    private final FavoriteRepository favoriteRepository;
    private final PetService petService;
    private final UserService userService;
    
    @Transactional
    public Favorite toggleFavorite(Long petId) {
        User currentUser = userService.getCurrentUser();
        Pet pet = petService.findById(petId);
        
        if (favoriteRepository.existsByUserAndPet(currentUser, pet)) {
            favoriteRepository.deleteByUserAndPet(currentUser, pet);
            return null;
        }
        
        Favorite favorite = new Favorite();
        favorite.setUser(currentUser);
        favorite.setPet(pet);
        
        return favoriteRepository.save(favorite);
    }
    
    public List<com.petcommunity.dto.PetDTO> findMyFavorites() {
        User currentUser = userService.getCurrentUser();
        return favoriteRepository.findByUserOrderByCreatedAtDesc(currentUser)
            .stream()
            .map(Favorite::getPet)
            .map(petService::toDTO)
            .collect(Collectors.toList());
    }
    
    public boolean isFavorited(Long petId) {
        User currentUser = userService.getCurrentUser();
        Pet pet = petService.findById(petId);
        return favoriteRepository.existsByUserAndPet(currentUser, pet);
    }
}
