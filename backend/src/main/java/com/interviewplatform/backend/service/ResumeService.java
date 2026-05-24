package com.interviewplatform.backend.service;

import java.io.IOException;
import java.util.List;

import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.interviewplatform.backend.entity.ResumeAnalysis;
import com.interviewplatform.backend.entity.User;
import com.interviewplatform.backend.repository.ResumeAnalysisRepository;
import com.interviewplatform.backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ResumeService {

    private final ResumeAnalysisRepository resumeAnalysisRepository;
    private final UserRepository userRepository;
    private final AIService aiService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext()
                .getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public ResumeAnalysis analyzeResume(
            MultipartFile file, String jobRole) throws IOException {

        User user = getCurrentUser();

        String extractedText = extractTextFromPDF(file);

        if (extractedText == null || extractedText.trim().isEmpty()) {
            throw new RuntimeException(
                    "Could not extract text from PDF.");
        }

        System.out.println("Extracted text length: "
                + extractedText.length());
        // Limit text to 3000 chars to avoid token limits
        String truncatedText = extractedText.length() > 3000
                ? extractedText.substring(0, 3000)
                : extractedText;

        String aiResponse = aiService.analyzeResume(
                truncatedText, jobRole);
        ;

        System.out.println("AI Response: " + aiResponse);

        int atsScore = 0;
        String skills = "[]";
        String missingKeywords = "[]";
        String suggestions = "[]";

        try {
            // Clean response in case Gemini adds markdown
            String cleanResponse = aiResponse.trim();
            if (cleanResponse.startsWith("```json")) {
                cleanResponse = cleanResponse.substring(7);
            }
            if (cleanResponse.startsWith("```")) {
                cleanResponse = cleanResponse.substring(3);
            }
            if (cleanResponse.endsWith("```")) {
                cleanResponse = cleanResponse.substring(
                        0, cleanResponse.length() - 3);
            }
            cleanResponse = cleanResponse.trim();

            System.out.println("Clean AI Response: " + cleanResponse);

            JsonNode node = objectMapper.readTree(cleanResponse);
            atsScore = node.has("atsScore")
                    ? node.get("atsScore").asInt()
                    : 0;
            skills = node.has("skills")
                    ? node.get("skills").toString()
                    : "[]";
            missingKeywords = node.has("missingKeywords")
                    ? node.get("missingKeywords").toString()
                    : "[]";
            suggestions = node.has("suggestions")
                    ? node.get("suggestions").toString()
                    : "[]";

            System.out.println("Parsed ATS Score: " + atsScore);

        } catch (Exception e) {
            System.err.println("Failed to parse AI response: "
                    + e.getMessage());
            System.err.println("Raw response was: " + aiResponse);
        }
        ResumeAnalysis analysis = ResumeAnalysis.builder()
                .user(user)
                .fileName(file.getOriginalFilename())
                .extractedText(extractedText.substring(
                        0, Math.min(extractedText.length(), 5000)))
                .atsScore(atsScore)
                .skills(skills)
                .missingKeywords(missingKeywords)
                .suggestions(suggestions)
                .build();

        return resumeAnalysisRepository.save(analysis);
    }

    public List<ResumeAnalysis> getMyResumes() {
        User user = getCurrentUser();
        return resumeAnalysisRepository
                .findByUserIdOrderByAnalyzedAtDesc(user.getId());
    }

    private String extractTextFromPDF(MultipartFile file)
            throws IOException {
        try {
            byte[] bytes = file.getBytes();
            PDDocument document = Loader.loadPDF(bytes);
            PDFTextStripper stripper = new PDFTextStripper();
            String text = stripper.getText(document);
            document.close();
            System.out.println("PDF extracted. Length: "
                    + text.length());
            return text;
        } catch (Exception e) {
            System.err.println("PDF extraction error: "
                    + e.getMessage());
            throw new IOException(
                    "Failed to read PDF: " + e.getMessage());
        }
    }
}