package com.interviewplatform.backend.service;

import java.util.List;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.interviewplatform.backend.dto.CodingProblemRequest;
import com.interviewplatform.backend.entity.CodingSubmission;
import com.interviewplatform.backend.entity.User;
import com.interviewplatform.backend.repository.CodingSubmissionRepository;
import com.interviewplatform.backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CodingService {

  private final CodingSubmissionRepository codingSubmissionRepository;
  private final UserRepository userRepository;
  private final AIService aiService;

  private User getCurrentUser() {
    String email = SecurityContextHolder.getContext()
        .getAuthentication().getName();
    return userRepository.findByEmail(email)
        .orElseThrow(() -> new RuntimeException("User not found"));
  }

  public String generateProblem(CodingProblemRequest request) {
    return aiService.generateCodingProblem(
        request.getDifficulty(),
        request.getTopic());
  }

  public String evaluateCode(
      String code,
      String language,
      String problem,
      String topic,
      String difficulty) {

    User user = getCurrentUser();
    String feedback = aiService.evaluateCode(code, language, problem);

    // Save submission
    try {
      com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
      com.fasterxml.jackson.databind.JsonNode node = mapper.readTree(feedback);

      int score = node.has("score")
          ? node.get("score").asInt()
          : 0;
      boolean isCorrect = node.has("isCorrect")
          && node.get("isCorrect").asBoolean();

      CodingSubmission submission = CodingSubmission.builder()
          .user(user)
          .problemTitle(topic + " - " + difficulty)
          .code(code)
          .language(language)
          .status(isCorrect
              ? CodingSubmission.Status.ACCEPTED
              : CodingSubmission.Status.WRONG_ANSWER)
          .aiFeedback(feedback)
          .difficulty(CodingSubmission.Difficulty
              .valueOf(difficulty.toUpperCase()))
          .build();

      codingSubmissionRepository.save(submission);
    } catch (Exception e) {
      System.err.println("Failed to save submission: "
          + e.getMessage());
    }

    return feedback;
  }

  public List<CodingSubmission> getMySubmissions() {
    User user = getCurrentUser();
    return codingSubmissionRepository
        .findByUserIdOrderBySubmittedAtDesc(user.getId());
  }
}