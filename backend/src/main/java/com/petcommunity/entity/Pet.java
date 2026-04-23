package com.petcommunity.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@Table(name = "pets")
public class Pet {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(nullable = false)
    private String species;
    
    private String breed;
    
    private String age;
    
    private String gender;
    
    private String color;
    
    @Column(length = 2000)
    private String personality;
    
    @Column(length = 2000)
    private String description;
    
    @ElementCollection
    private List<String> photos = new ArrayList<>();
    
    @Column(nullable = false)
    private String status = "AVAILABLE";
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;
    
    @Column(nullable = false)
    private Boolean approved = false;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "approved_by")
    private User approvedBy;
    
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
    
    private LocalDateTime updatedAt;
    
    public enum Status {
        AVAILABLE,
        ADOPTED,
        PENDING
    }
}
