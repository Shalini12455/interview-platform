package com.interviewplatform.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "resume_analyses")
public class ResumeAnalysis {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "user_id", nullable = false)
  private User user;

  @Column(nullable = false)
  private String fileName;

  @Column(columnDefinition = "TEXT")
  private String extractedText;

  @Column
  private Integer atsScore;

  @Column(columnDefinition = "TEXT")
  private String missingKeywords;

  @Column(columnDefinition = "TEXT")
  private String suggestions;

  @Column(columnDefinition = "TEXT")
  private String skills;

  @CreationTimestamp
  private LocalDateTime analyzedAt;
}