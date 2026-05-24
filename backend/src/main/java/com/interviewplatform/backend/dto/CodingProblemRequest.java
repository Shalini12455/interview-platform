package com.interviewplatform.backend.dto;

import lombok.Data;

@Data
public class CodingProblemRequest {
  private String topic;
  private String difficulty;
  private String language;
}