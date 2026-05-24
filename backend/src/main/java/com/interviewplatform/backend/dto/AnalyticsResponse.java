package com.interviewplatform.backend.dto;

import java.util.List;
import java.util.Map;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AnalyticsResponse {
  private Long totalInterviews;
  private Long completedInterviews;
  private Long totalSubmissions;
  private Long acceptedSubmissions;
  private Double averageScore;
  private Integer highestScore;
  private List<Map<String, Object>> scoreHistory;
  private List<Map<String, Object>> interviewsByType;
  private List<Map<String, Object>> weeklyActivity;
  private Integer currentStreak;
  private Integer resumeCount;
  private Integer averageAtsScore;
}