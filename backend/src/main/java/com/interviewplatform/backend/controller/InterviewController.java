package com.interviewplatform.backend.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.interviewplatform.backend.dto.AnswerRequest;
import com.interviewplatform.backend.dto.InterviewRequest;
import com.interviewplatform.backend.dto.InterviewResponse;
import com.interviewplatform.backend.service.InterviewService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/interviews")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class InterviewController {

  private final InterviewService interviewService;

  @PostMapping("/start")
  public ResponseEntity<InterviewResponse> startInterview(
      @RequestBody InterviewRequest request) {
    return ResponseEntity.ok(interviewService.startInterview(request));
  }

  @PostMapping("/evaluate-answer")
  public ResponseEntity<String> evaluateAnswer(
      @RequestBody AnswerRequest request) {
    return ResponseEntity.ok(interviewService.evaluateAnswer(request));
  }

  @PostMapping("/{id}/complete")
  public ResponseEntity<InterviewResponse> completeInterview(
      @PathVariable Long id,
      @RequestBody Map<String, Object> body) {
    String answersJson = (String) body.get("answersJson");
    Integer score = (Integer) body.get("score");
    return ResponseEntity.ok(
        interviewService.completeInterview(id, answersJson, score));
  }

  @GetMapping("/my-interviews")
  public ResponseEntity<List<InterviewResponse>> getMyInterviews() {
    return ResponseEntity.ok(interviewService.getUserInterviews());
  }
}