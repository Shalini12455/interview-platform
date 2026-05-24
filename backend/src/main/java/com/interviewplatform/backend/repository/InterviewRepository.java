package com.interviewplatform.backend.repository;

import com.interviewplatform.backend.entity.Interview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface InterviewRepository extends JpaRepository<Interview, Long> {
  List<Interview> findByUserIdOrderByCreatedAtDesc(Long userId);

  Long countByUserId(Long userId);

  Long countByUserIdAndStatus(Long userId, Interview.Status status);
}