package com.petcommunity.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class CommentDTO {
    private Long id;
    private Long petId;
    
    private Long userId;
    private String userName;
    private String userAvatar;
    
    @NotBlank(message = "留言内容不能为空")
    private String content;
    private Boolean approved;
    
    private LocalDateTime createdAt;
}
