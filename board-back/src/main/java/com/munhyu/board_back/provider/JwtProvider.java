package com.munhyu.board_back.provider;

import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtParser;
import io.jsonwebtoken.Jwts;

@Component
public class JwtProvider {

  private final SecretKey secretKey;
  private final JwtParser jwtParser;

  public JwtProvider(@Value("${secret-key}") String secret) {
    this.secretKey = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
    this.jwtParser = Jwts.parser()
        .verifyWith(secretKey)
        .build();
  }

  public String create(String email) {
    Date expiredDate = Date.from(Instant.now().plus(5, ChronoUnit.HOURS));

    return Jwts.builder()
        .signWith(secretKey)
        .claim("email", email)
        .subject(email)
        .issuedAt(new Date())
        .expiration(expiredDate)
        .compact();
  }

  public String validate(String jwt) {

    Claims claims = null;

    try {
      claims = jwtParser
          .parseSignedClaims(jwt)
          .getPayload();
    } catch (ExpiredJwtException e) {
      System.out.println("JWT가 만료되었습니다.");
    } catch (Exception e) {
      e.printStackTrace();
    }
    return claims.getSubject();
  }
}
