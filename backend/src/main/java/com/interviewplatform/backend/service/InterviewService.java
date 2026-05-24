package com.interviewplatform.backend.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.interviewplatform.backend.dto.AnswerRequest;
import com.interviewplatform.backend.dto.InterviewRequest;
import com.interviewplatform.backend.dto.InterviewResponse;
import com.interviewplatform.backend.entity.Interview;
import com.interviewplatform.backend.entity.User;
import com.interviewplatform.backend.repository.InterviewRepository;
import com.interviewplatform.backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class InterviewService {

  private final InterviewRepository interviewRepository;
  private final UserRepository userRepository;
  private final AIService aiService;

  private User getCurrentUser() {
    String email = SecurityContextHolder.getContext()
        .getAuthentication().getName();
    return userRepository.findByEmail(email)
        .orElseThrow(() -> new RuntimeException("User not found"));
  }

  public InterviewResponse startInterview(InterviewRequest request) {
    User user = getCurrentUser();

    String questionsJson = aiService.generateInterviewQuestions(
        request.getJobRole(),
        request.getDifficulty(),
        request.getType());

    Interview interview = Interview.builder()
        .user(user)
        .title(request.getTitle() != null ? request.getTitle()
            : request.getJobRole() + " - " + request.getType() + " Interview")
        .type(Interview.InterviewType.valueOf(request.getType().toUpperCase()))
        .status(Interview.Status.IN_PROGRESS)
        .questionsJson(questionsJson)
        .build();

    Interview saved = interviewRepository.save(interview);
    return mapToResponse(saved);
  }

  public String evaluateAnswer(AnswerRequest request) {
    return aiService.evaluateAnswer(
        request.getQuestion(),
        request.getAnswer(),
        request.getJobRole());
  }

  public InterviewResponse completeInterview(
      Long interviewId, String answersJson, Integer score) {

    Interview interview = interviewRepository.findById(interviewId)
        .orElseThrow(() -> new RuntimeException("Interview not found"));

    interview.setStatus(Interview.Status.COMPLETED);
    interview.setAnswersJson(answersJson);
    interview.setScore(score);

    Interview saved = interviewRepository.save(interview);
    return mapToResponse(saved);
  }

  public List<InterviewResponse> getUserInterviews() {
    User user = getCurrentUser();
    return interviewRepository
        .findByUserIdOrderByCreatedAtDesc(user.getId())
        .stream()
        .map(this::mapToResponse)
        .collect(Collectors.toList());
  }

  private InterviewResponse mapToResponse(Interview interview) {
    return InterviewResponse.builder()
        .id(interview.getId())
        .title(interview.getTitle())
        .type(interview.getType().name())
        .status(interview.getStatus().name())
        .questionsJson(interview.getQuestionsJson())
        .feedback(interview.getFeedback())
        .score(interview.getScore())
        .createdAt(interview.getCreatedAt() != null ? interview.getCreatedAt().toString() : null)
        .build();
  }
}