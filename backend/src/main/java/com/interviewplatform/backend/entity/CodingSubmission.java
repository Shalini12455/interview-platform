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
@Table(name = "coding_submissions")
public class CodingSubmission {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "user_id", nullable = false)
  private User user;

  @Column(nullable = false)
  private String problemTitle;

  @Column(columnDefinition = "TEXT", nullable = false)
  private String code;

  @Column(nullable = false)
  private String language;

  @Enumerated(EnumType.STRING)
  private Status status;

  @Column(columnDefinition = "TEXT")
  private String output;

  @Column(columnDefinition = "TEXT")
  private String aiFeedback;

  @Column
  private Integer executionTimeMs;

  @Enumerated(EnumType.STRING)
  private Difficulty difficulty;

  @CreationTimestamp
  private LocalDateTime submittedAt;

  public enum Status {
    ACCEPTED, WRONG_ANSWER, TIME_LIMIT, RUNTIME_ERROR, PENDING
  }

  public enum Difficulty {
    EASY, MEDIUM, HARD
  }
}