package com.interviewplatform.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
public class AIService {

  @Value("${gemini.api.key}")
  private String apiKey;

  private final RestTemplate restTemplate = new RestTemplate();

  private static final String GEMINI_BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models/";

  private static final String[] GEMINI_MODELS = {
      "gemini-2.0-flash-lite",
      "gemini-2.0-flash",
      "gemini-2.5-flash",
      "gemini-2.0-flash-001"
  };

  public String generateInterviewQuestions(
      String jobRole, String difficulty, String type) {
    String prompt = String.format("""
        Generate 5 %s interview questions for a %s position.
        Difficulty level: %s.
        Format your response as a JSON array:
        [
          {
            "id": 1,
            "question": "question text here",
            "category": "category name",
            "difficulty": "%s",
            "hints": ["hint1", "hint2"]
          }
        ]
        Return ONLY the JSON array, no extra text, no markdown.
        """, type, jobRole, difficulty, difficulty);
    return callGemini(prompt);
  }

  public String evaluateAnswer(
      String question, String answer, String jobRole) {
    String prompt = String.format("""
        You are a senior technical interviewer for %s positions.
        Question: %s
        Candidate's Answer: %s
        Evaluate and respond in JSON:
        {
          "score": <0-100>,
          "rating": "<Excellent/Good/Average/Poor>",
          "feedback": "<detailed feedback>",
          "strengths": ["strength1", "strength2"],
          "improvements": ["improvement1", "improvement2"],
          "sampleAnswer": "<brief ideal answer>"
        }
        Return ONLY the JSON, no extra text, no markdown.
        """, jobRole, question, answer);
    return callGemini(prompt);
  }

  public String generateCodingProblem(
      String difficulty, String topic) {
    String prompt = String.format("""
        Generate a coding problem about %s with %s difficulty.
        Respond in JSON format:
        {
          "title": "problem title",
          "description": "detailed problem description",
          "examples": [
            {
              "input": "example input",
              "output": "example output",
              "explanation": "explanation"
            }
          ],
          "constraints": ["constraint1", "constraint2"],
          "hints": ["hint1", "hint2"],
          "starterCode": {
            "java": "public class Solution {\\n    \\n}",
            "python": "def solution():\\n    pass",
            "javascript": "function solution() {\\n    \\n}"
          }
        }
        Return ONLY the JSON, no extra text, no markdown.
        """, topic, difficulty);
    return callGemini(prompt);
  }

  public String evaluateCode(
      String code, String language, String problem) {
    String prompt = String.format("""
        You are a senior software engineer reviewing code.
        Problem: %s
        Language: %s
        Code: %s
        Evaluate and respond in JSON:
        {
          "score": <0-100>,
          "isCorrect": <true/false>,
          "timeComplexity": "O(?)",
          "spaceComplexity": "O(?)",
          "feedback": "detailed feedback",
          "issues": ["issue1", "issue2"],
          "suggestions": ["suggestion1", "suggestion2"],
          "optimizedApproach": "brief description"
        }
        Return ONLY the JSON, no extra text, no markdown.
        """, problem, language, code);
    return callGemini(prompt);
  }

  public String analyzeResume(String resumeText, String jobRole) {
    String prompt = String.format("""
        Analyze this resume for a %s position and respond ONLY with valid JSON.
        Resume: %s
        Respond with:
        {
          "atsScore": 75,
          "skills": ["skill1", "skill2", "skill3"],
          "missingKeywords": ["keyword1", "keyword2"],
          "suggestions": ["suggestion1", "suggestion2"],
          "strengths": ["strength1", "strength2"],
          "overallFeedback": "brief feedback here"
        }
        Rules:
        - atsScore must be 0-100
        - Each array max 5 items
        - Return ONLY the JSON object
        """, jobRole, resumeText);
    return callGemini(prompt);
  }

  private String callGemini(String prompt) {
    for (String model : GEMINI_MODELS) {
      try {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> requestBody = Map.of(
            "contents", List.of(
                Map.of("parts", List.of(
                    Map.of("text", prompt)))),
            "generationConfig", Map.of(
                "temperature", 0.7,
                "maxOutputTokens", 8192));

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        String url = GEMINI_BASE_URL + model
            + ":generateContent?key=" + apiKey;

        System.out.println("Trying model: " + model);

        ResponseEntity<Map> response = restTemplate.exchange(
            url, HttpMethod.POST, entity, Map.class);

        System.out.println("Success with model: " + model);

        Map<String, Object> body = response.getBody();
        if (body != null && body.containsKey("candidates")) {
          List<Map<String, Object>> candidates = (List<Map<String, Object>>) body.get("candidates");
          if (!candidates.isEmpty()) {
            Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
            List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
            if (!parts.isEmpty()) {
              String text = (String) parts.get(0).get("text");
              text = text.trim();
              if (text.startsWith("```json")) {
                text = text.substring(7);
              }
              if (text.startsWith("```")) {
                text = text.substring(3);
              }
              if (text.endsWith("```")) {
                text = text.substring(
                    0, text.length() - 3);
              }
              return text.trim();
            }
          }
        }

      } catch (HttpClientErrorException e) {
        System.err.println("Model " + model
            + " failed: " + e.getStatusCode());
        if (e.getStatusCode().value() == 429
            || e.getStatusCode().value() == 404) {
          continue;
        }
        return "{\"error\": \""
            + e.getResponseBodyAsString() + "\"}";
      } catch (Exception e) {
        System.err.println("Model " + model
            + " error: " + e.getMessage());
        continue;
      }
    }
    return "{\"error\": \"All models quota exceeded. Try again tomorrow.\"}";
  }
}