package com.munhyu.board_back.OAuth2;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import com.munhyu.board_back.entity.UserEntity;
import com.munhyu.board_back.provider.JwtProvider;
import com.munhyu.board_back.repository.UserRepository;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

  private final JwtProvider jwtProvider;
  private final UserRepository userRepository;
  @Value("${cors.allowed-origins}")
  private String allowedOrigins;

  @Override
  public void onAuthenticationSuccess(
      HttpServletRequest request,
      HttpServletResponse response,
      Authentication authentication) throws IOException, ServletException {

    // OAuth2 사용자 정보 추출
    OAuth2User oauth2User = (OAuth2User) authentication.getPrincipal();
    String email = oauth2User.getAttribute("email");

    // 사용자 정보 조회
    UserEntity userEntity = userRepository.findByEmail(email);

    if (userEntity == null) {
      response.sendRedirect(allowedOrigins + "/oauth2?error=user_not_found");
      return;
    }

    // JWT 토큰 생성
    String token = jwtProvider.create(email);

    // 프론트엔드로 토큰과 함께 리다이렉트
    String redirectUrl = String.format("%s/oauth2/redirect?token=%s&expirationTime=18000", allowedOrigins, token);
    response.sendRedirect(redirectUrl);
  }
}