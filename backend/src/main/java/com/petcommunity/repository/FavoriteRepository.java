package com.petcommunity.repository;

import com.petcommunity.entity.Favorite;
import com.petcommunity.entity.Pet;
import com.petcommunity.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface FavoriteRepository extends JpaRepository<Favorite, Long> {
    List<Favorite> findByUserOrderByCreatedAtDesc(User user);
    Optional<Favorite> findByUserAndPet(User user, Pet pet);
    boolean existsByUserAndPet(User user, Pet pet);
    void deleteByUserAndPet(User user, Pet pet);
}
