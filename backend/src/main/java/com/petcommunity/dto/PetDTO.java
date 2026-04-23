package com.petcommunity.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class PetDTO {
    private Long id;
    
    @NotBlank(message = "宠物名称不能为空")
    private String name;
    
    @NotBlank(message = "物种不能为空")
    private String species;
    
    private String breed;
    private String age;
    private String gender;
    private String color;
    private String personality;
    private String description;
    private List<String> photos;
    private String status;
    private Boolean approved;
    
    private Long ownerId;
    private String ownerName;
    private String ownerAvatar;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
