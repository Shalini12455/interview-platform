package com.interviewplatform.backend.service;

import com.interviewplatform.backend.dto.AuthResponse;
import com.interviewplatform.backend.dto.LoginRequest;
import com.interviewplatform.backend.dto.RegisterRequest;
import com.interviewplatform.backend.entity.User;
import com.interviewplatform.backend.repository.UserRepository;
import com.interviewplatform.backend.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;
  private final JwtUtil jwtUtil;
  private final AuthenticationManager authenticationManager;
  private final UserDetailsService userDetailsService;

  public AuthResponse register(RegisterRequest request) {
    if (userRepository.existsByEmail(request.getEmail())) {
      throw new RuntimeException("Email already registered");
    }

    User user = User.builder()
        .firstName(request.getFirstName())
        .lastName(request.getLastName())
        .email(request.getEmail())
        .password(passwordEncoder.encode(request.getPassword()))
        .role(User.Role.STUDENT)
        .isActive(true)
        .build();

    userRepository.save(user);

    UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
    String token = jwtUtil.generateToken(userDetails);

    return AuthResponse.builder()
        .token(token)
        .email(user.getEmail())
        .firstName(user.getFirstName())
        .lastName(user.getLastName())
        .role(user.getRole().name())
        .message("Registration successful")
        .build();
  }

  public AuthResponse login(LoginRequest request) {
    authenticationManager.authenticate(
        new UsernamePasswordAuthenticationToken(
            request.getEmail(),
            request.getPassword()));

    UserDetails userDetails = userDetailsService.loadUserByUsername(request.getEmail());
    String token = jwtUtil.generateToken(userDetails);
    User user = userRepository.findByEmail(request.getEmail())
        .orElseThrow();

    return AuthResponse.builder()
        .token(token)
        .email(user.getEmail())
        .firstName(user.getFirstName())
        .lastName(user.getLastName())
        .role(user.getRole().name())
        .message("Login successful")
        .build();
  }
}