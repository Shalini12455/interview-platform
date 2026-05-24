package com.interviewplatform.backend.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.interviewplatform.backend.dto.CodingProblemRequest;
import com.interviewplatform.backend.entity.CodingSubmission;
import com.interviewplatform.backend.service.CodingService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/coding")
@RequiredArgsConstructor
@CrossOrigin(origins = {
    "http://localhost:3000",
    "https://interview-platform-delta-eight.vercel.app"
})
public class CodingController {

  private final CodingService codingService;

  @PostMapping("/generate-problem")
  public ResponseEntity<String> generateProblem(
      @RequestBody CodingProblemRequest request) {
    return ResponseEntity.ok(
        codingService.generateProblem(request));
  }

  @PostMapping("/submit")
  public ResponseEntity<String> submitCode(
      @RequestBody Map<String, String> body) {
    String feedback = codingService.evaluateCode(
        body.get("code"),
        body.get("language"),
        body.get("problem"),
        body.get("topic"),
        body.get("difficulty"));
    return ResponseEntity.ok(feedback);
  }

  @GetMapping("/my-submissions")
  public ResponseEntity<List<CodingSubmission>> getMySubmissions() {
    return ResponseEntity.ok(codingService.getMySubmissions());
  }
}