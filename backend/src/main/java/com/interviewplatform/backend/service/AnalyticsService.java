package com.interviewplatform.backend.service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.OptionalDouble;
import java.util.OptionalInt;
import java.util.stream.Collectors;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.interviewplatform.backend.dto.AnalyticsResponse;
import com.interviewplatform.backend.entity.Interview;
import com.interviewplatform.backend.entity.User;
import com.interviewplatform.backend.repository.CodingSubmissionRepository;
import com.interviewplatform.backend.repository.InterviewRepository;
import com.interviewplatform.backend.repository.ResumeAnalysisRepository;
import com.interviewplatform.backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final InterviewRepository interviewRepository;
    private final CodingSubmissionRepository codingSubmissionRepository;
    private final ResumeAnalysisRepository resumeAnalysisRepository;
    private final UserRepository userRepository;

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext()
                .getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public AnalyticsResponse getAnalytics() {
        User user = getCurrentUser();
        Long userId = user.getId();

        // Get all interviews
        List<Interview> allInterviews = interviewRepository.findByUserIdOrderByCreatedAtDesc(userId);

        List<Interview> completedInterviews = allInterviews.stream()
                .filter(i -> i.getStatus() == Interview.Status.COMPLETED)
                .collect(Collectors.toList());

        // Calculate average score
        OptionalDouble avgScore = completedInterviews.stream()
                .filter(i -> i.getScore() != null)
                .mapToInt(Interview::getScore)
                .average();

        // Highest score
        OptionalInt highScore = completedInterviews.stream()
                .filter(i -> i.getScore() != null)
                .mapToInt(Interview::getScore)
                .max();

        // Score history (last 10 interviews)
        List<Map<String, Object>> scoreHistory = completedInterviews
                .stream()
                .limit(10)
                .filter(i -> i.getScore() != null)
                .map(i -> {
                    Map<String, Object> entry = new HashMap<>();
                    entry.put("date", i.getCreatedAt() != null
                            ? i.getCreatedAt().toLocalDate().toString()
                            : "N/A");
                    entry.put("score", i.getScore());
                    entry.put("title", i.getTitle());
                    return entry;
                })
                .collect(Collectors.toList());

        Collections.reverse(scoreHistory);

        // Interviews by type
        Map<String, Long> typeCount = allInterviews.stream()
                .collect(Collectors.groupingBy(
                        i -> i.getType().name(),
                        Collectors.counting()));

        List<Map<String, Object>> interviewsByType = typeCount.entrySet().stream()
                .map(e -> {
                    Map<String, Object> entry = new HashMap<>();
                    entry.put("type", e.getKey());
                    entry.put("count", e.getValue());
                    return entry;
                })
                .collect(Collectors.toList());

        // Weekly activity (last 7 days)
        // Weekly activity — real data from last 7 days
        List<Map<String, Object>> weeklyActivity = new ArrayList<>();
        java.time.LocalDate today = java.time.LocalDate.now();
        String[] dayNames = { "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun" };

        for (int i = 6; i >= 0; i--) {
            java.time.LocalDate day = today.minusDays(i);
            String dayName = dayNames[day.getDayOfWeek().getValue() - 1];

            long count = allInterviews.stream()
                    .filter(interview -> interview.getCreatedAt() != null
                            && interview.getCreatedAt().toLocalDate().equals(day))
                    .count();

            Map<String, Object> entry = new HashMap<>();
            entry.put("day", dayName);
            entry.put("date", day.toString());
            entry.put("interviews", count);
            weeklyActivity.add(entry);
        }

        // Resume analytics
        List<com.interviewplatform.backend.entity.ResumeAnalysis> resumes = resumeAnalysisRepository
                .findByUserIdOrderByAnalyzedAtDesc(userId);

        int avgAtsScore = resumes.stream()
                .mapToInt(r -> r.getAtsScore() != null
                        ? r.getAtsScore()
                        : 0)
                .sum();
        if (!resumes.isEmpty()) {
            avgAtsScore = avgAtsScore / resumes.size();
        }

        // Coding submissions
        Long totalSubs = codingSubmissionRepository.countByUserId(userId);
        Long acceptedSubs = codingSubmissionRepository
                .countByUserIdAndStatus(
                        userId,
                        com.interviewplatform.backend.entity.CodingSubmission.Status.ACCEPTED);

        return AnalyticsResponse.builder()
                .totalInterviews((long) allInterviews.size())
                .completedInterviews((long) completedInterviews.size())
                .totalSubmissions(totalSubs)
                .acceptedSubmissions(acceptedSubs)
                .averageScore(avgScore.isPresent()
                        ? Math.round(avgScore.getAsDouble() * 10.0) / 10.0
                        : 0.0)
                .highestScore(highScore.isPresent()
                        ? highScore.getAsInt()
                        : 0)
                .scoreHistory(scoreHistory)
                .interviewsByType(interviewsByType)
                .weeklyActivity(weeklyActivity)
                .currentStreak(completedInterviews.size())
                .resumeCount(resumes.size())
                .averageAtsScore(avgAtsScore)
                .build();
    }
}