package com.interviewplatform.backend.dto;

import lombok.Data;

@Data
public class InterviewRequest {
  private String jobRole;
  private String difficulty;
  private String type;
  private String title;
}