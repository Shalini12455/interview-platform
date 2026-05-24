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
@Table(name = "interviews")
public class Interview {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "user_id", nullable = false)
  private User user;

  @Column(nullable = false)
  private String title;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private InterviewType type;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private Status status;

  @Column(columnDefinition = "TEXT")
  private String questionsJson;

  @Column(columnDefinition = "TEXT")
  private String answersJson;

  @Column
  private Integer score;

  @Column(columnDefinition = "TEXT")
  private String feedback;

  @Column
  private Integer durationMinutes;

  @CreationTimestamp
  private LocalDateTime createdAt;

  public enum InterviewType {
    TECHNICAL, HR, BEHAVIORAL, CODING
  }

  public enum Status {
    PENDING, IN_PROGRESS, COMPLETED, CANCELLED
  }
}