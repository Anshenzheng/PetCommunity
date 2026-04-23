package com.petcommunity.repository;

import com.petcommunity.entity.Pet;
import com.petcommunity.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PetRepository extends JpaRepository<Pet, Long> {
    Page<Pet> findByApprovedTrueOrderByCreatedAtDesc(Pageable pageable);
    Page<Pet> findByApprovedTrueAndStatusOrderByCreatedAtDesc(String status, Pageable pageable);
    List<Pet> findByOwnerOrderByCreatedAtDesc(User owner);
    Page<Pet> findByApprovedFalseOrderByCreatedAtDesc(Pageable pageable);
    
    @Query("SELECT p FROM Pet p WHERE p.approved = true AND " +
           "(LOWER(p.name) LIKE LOWER(CONCAT('%', ?1, '%')) OR " +
           "LOWER(p.breed) LIKE LOWER(CONCAT('%', ?1, '%')) OR " +
           "LOWER(p.species) LIKE LOWER(CONCAT('%', ?1, '%')))")
    Page<Pet> searchPets(String keyword, Pageable pageable);
    
    @Query("SELECT p FROM Pet p JOIN Favorite f ON p = f.pet WHERE f.user = ?1")
    List<Pet> findFavoritePetsByUser(User user);
}
