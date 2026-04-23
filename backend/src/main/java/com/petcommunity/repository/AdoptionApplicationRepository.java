package com.petcommunity.repository;

import com.petcommunity.entity.AdoptionApplication;
import com.petcommunity.entity.Pet;
import com.petcommunity.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AdoptionApplicationRepository extends JpaRepository<AdoptionApplication, Long> {
    List<AdoptionApplication> findByApplicantOrderByCreatedAtDesc(User applicant);
    List<AdoptionApplication> findByPetOrderByCreatedAtDesc(Pet pet);
    Page<AdoptionApplication> findByStatusOrderByCreatedAtDesc(AdoptionApplication.ApplicationStatus status, Pageable pageable);
    Page<AdoptionApplication> findAllByOrderByCreatedAtDesc(Pageable pageable);
    boolean existsByPetAndApplicantAndStatusIn(Pet pet, User applicant, List<AdoptionApplication.ApplicationStatus> statuses);
}
