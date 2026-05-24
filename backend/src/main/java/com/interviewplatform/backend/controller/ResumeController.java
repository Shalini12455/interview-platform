package com.interviewplatform.backend.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.interviewplatform.backend.entity.ResumeAnalysis;
import com.interviewplatform.backend.service.ResumeService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/resume")
@RequiredArgsConstructor
@CrossOrigin(origins = {
    "http://localhost:3000",
    "https://interview-platform-delta-eight.vercel.app"
})
public class ResumeController {

  private final ResumeService resumeService;

  @PostMapping("/analyze")
  public ResponseEntity<?> analyzeResume(
      @RequestParam("file") MultipartFile file,
      @RequestParam(value = "jobRole", defaultValue = "Software Engineer") String jobRole) {
    try {
      if (file.isEmpty()) {
        return ResponseEntity.badRequest()
            .body(Map.of("error", "Please upload a file"));
      }

      String fileName = file.getOriginalFilename();
      if (fileName == null ||
          !fileName.toLowerCase().endsWith(".pdf")) {
        return ResponseEntity.badRequest()
            .body(Map.of("error", "Only PDF files are supported"));
      }

      ResumeAnalysis analysis = resumeService.analyzeResume(file, jobRole);
      return ResponseEntity.ok(analysis);

    } catch (Exception e) {
      return ResponseEntity.internalServerError()
          .body(Map.of("error", e.getMessage()));
    }
  }

  @GetMapping("/my-resumes")
  public ResponseEntity<List<ResumeAnalysis>> getMyResumes() {
    return ResponseEntity.ok(resumeService.getMyResumes());
  }
}