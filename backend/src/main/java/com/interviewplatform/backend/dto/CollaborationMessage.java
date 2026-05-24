package com.interviewplatform.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CollaborationMessage {
  private String type;
  private String roomId;
  private String sender;
  private String content;
  private String language;
  private String timestamp;
}