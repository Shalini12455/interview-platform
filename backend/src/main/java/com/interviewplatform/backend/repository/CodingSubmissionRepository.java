package com.interviewplatform.backend.repository;

import com.interviewplatform.backend.entity.CodingSubmission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CodingSubmissionRepository extends JpaRepository<CodingSubmission, Long> {
  List<CodingSubmission> findByUserIdOrderBySubmittedAtDesc(Long userId);

  Long countByUserId(Long userId);

  Long countByUserIdAndStatus(Long userId, CodingSubmission.Status status);
}