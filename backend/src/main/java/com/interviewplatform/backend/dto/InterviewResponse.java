package com.interviewplatform.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class InterviewResponse {
  private Long id;
  private String title;
  private String type;
  private String status;
  private String questionsJson;
  private String feedback;
  private Integer score;
  private String createdAt;
}