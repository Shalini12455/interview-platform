package com.interviewplatform.backend.dto;

import lombok.Data;

@Data
public class AnswerRequest {
  private Long interviewId;
  private String question;
  private String answer;
  private String jobRole;
}