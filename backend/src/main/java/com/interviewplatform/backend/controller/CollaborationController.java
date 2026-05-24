package com.interviewplatform.backend.controller;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;

import com.interviewplatform.backend.dto.CollaborationMessage;

import lombok.RequiredArgsConstructor;

@Controller
@RequiredArgsConstructor
@CrossOrigin(origins = {
    "http://localhost:3000",
    "https://interview-platform-delta-eight.vercel.app"
})
public class CollaborationController {

  private final SimpMessagingTemplate messagingTemplate;

  // Track active rooms and users
  private final Map<String, Map<String, String>> activeRooms = new ConcurrentHashMap<>();

  @MessageMapping("/collab/join")
  public void joinRoom(
      @Payload CollaborationMessage message,
      SimpMessageHeaderAccessor headerAccessor) {

    String roomId = message.getRoomId();
    String sender = message.getSender();

    // Add user to room
    activeRooms.computeIfAbsent(roomId,
        k -> new ConcurrentHashMap<>())
        .put(sender, sender);

    message.setType("USER_JOINED");
    message.setTimestamp(LocalDateTime.now().toString());
    message.setContent(sender + " joined the room");

    messagingTemplate.convertAndSend(
        "/topic/room/" + roomId, message);

    System.out.println("User " + sender
        + " joined room " + roomId);
  }

  @MessageMapping("/collab/code")
  public void sendCode(@Payload CollaborationMessage message) {
    message.setType("CODE_UPDATE");
    message.setTimestamp(LocalDateTime.now().toString());
    messagingTemplate.convertAndSend(
        "/topic/room/" + message.getRoomId(), message);
  }

  @MessageMapping("/collab/chat")
  public void sendChat(@Payload CollaborationMessage message) {
    message.setType("CHAT_MESSAGE");
    message.setTimestamp(LocalDateTime.now().toString());
    messagingTemplate.convertAndSend(
        "/topic/room/" + message.getRoomId(), message);
  }

  @MessageMapping("/collab/language")
  public void changeLanguage(@Payload CollaborationMessage message) {
    message.setType("LANGUAGE_CHANGE");
    message.setTimestamp(LocalDateTime.now().toString());
    messagingTemplate.convertAndSend(
        "/topic/room/" + message.getRoomId(), message);
  }

  @MessageMapping("/collab/leave")
  public void leaveRoom(@Payload CollaborationMessage message) {
    String roomId = message.getRoomId();
    String sender = message.getSender();

    if (activeRooms.containsKey(roomId)) {
      activeRooms.get(roomId).remove(sender);
    }

    message.setType("USER_LEFT");
    message.setTimestamp(LocalDateTime.now().toString());
    message.setContent(sender + " left the room");

    messagingTemplate.convertAndSend(
        "/topic/room/" + roomId, message);
  }
}