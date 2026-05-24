package com.interviewplatform.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.interviewplatform.backend.dto.AnalyticsResponse;
import com.interviewplatform.backend.service.AnalyticsService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
@CrossOrigin(origins = {
    "http://localhost:3000",
    "https://interview-platform-delta-eight.vercel.app"
})
public class AnalyticsController {

  private final AnalyticsService analyticsService;

  @GetMapping("/my-stats")
  public ResponseEntity<AnalyticsResponse> getMyStats() {
    return ResponseEntity.ok(analyticsService.getAnalytics());
  }
}