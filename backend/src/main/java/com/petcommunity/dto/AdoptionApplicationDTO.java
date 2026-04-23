package com.petcommunity.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class AdoptionApplicationDTO {
    private Long id;
    private Long petId;
    private String petName;
    private List<String> petPhotos;
    
    private Long applicantId;
    private String applicantName;
    private String applicantEmail;
    private String applicantPhone;
    
    @NotBlank(message = "领养原因不能为空")
    private String reason;
    private String livingEnvironment;
    private String petExperience;
    private String contactPhone;
    
    private String status;
    private String reviewComment;
    
    private LocalDateTime createdAt;
    private LocalDateTime reviewedAt;
}
