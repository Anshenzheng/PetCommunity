package com.petcommunity.repository;

import com.petcommunity.entity.Comment;
import com.petcommunity.entity.Pet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByPetAndApprovedTrueOrderByCreatedAtDesc(Pet pet);
    List<Comment> findByApprovedFalseOrderByCreatedAtDesc();
}
