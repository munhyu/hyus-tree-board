package com.munhyu.board_back.config;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Configurable;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.CsrfConfigurer;
import org.springframework.security.config.annotation.web.configurers.HttpBasicConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.munhyu.board_back.filter.JwtAuthenticationFilter;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Configurable
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class WebSecurityConfig {

  private final JwtAuthenticationFilter jwtAuthenticationFilter;

  @Bean
  protected SecurityFilterChain configure(HttpSecurity httpSecurity) throws Exception {

    httpSecurity
        .cors(cors -> cors.configurationSource(corsConfigurationSource()))
        .csrf(CsrfConfigurer::disable)
        .httpBasic(HttpBasicConfigurer::disable)
        .sessionManagement(sessionManagement -> sessionManagement
            .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .authorizeHttpRequests(request -> request
            .requestMatchers("/", "/api/v1/auth/**", "/api/v1/search/**", "/file/**").permitAll()
            .requestMatchers(HttpMethod.GET, "/api/v1/board/**", "/api/v1/user/*").permitAll()
            // .requestMatchers("/api/v1/user/**").hasRole("USER") 나중에 추가
            // .requestMatchers("/api/v1/admin/**").hasRole("ADMIN")
            .anyRequest().authenticated())
        .exceptionHandling(exceptionHandling -> exceptionHandling
            .authenticationEntryPoint(new FailedAuthenticationEntryPoint()))
        .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

    // 스프링부트2버전 설정
    // httpSecurity
    // .cors().and()
    // .csrf().disable()
    // .httpBasic().disable()
    // .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS).and()
    // .authorizeHttpRequests()
    // .antMatchers("/", "/api/v1/auth/**", "/api/v1/search/**",
    // "/file/**").permitAll()
    // .antMatchers(HttpMethod.GET, "/api/v1/board/**",
    // "/api/v1/user/*").permitAll()
    // .anyRequest().authenticated().and()
    // .exceptionHandling()
    // .authenticationEntryPoint(new FailedAuthenticationEntryPoint());
    // httpSecurity.addFilterBefore(jwtAuthenticationFilter,
    // UsernamePasswordAuthenticationFilter.class);

    return httpSecurity.build();
  }

  @Bean
  protected CorsConfigurationSource corsConfigurationSource() {

    CorsConfiguration corsConfiguration = new CorsConfiguration();
    corsConfiguration.addAllowedOrigin("*");
    corsConfiguration.addAllowedMethod("*");
    corsConfiguration.addAllowedHeader("*");

    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", corsConfiguration);

    return source;
  }

}

class FailedAuthenticationEntryPoint implements AuthenticationEntryPoint {

  @Override
  public void commence(HttpServletRequest request, HttpServletResponse response,
      AuthenticationException authException) throws IOException, ServletException {
    response.setContentType("application/json");
    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
    response.getWriter().write("{\"code\": \"AF\", \"message\": \"Authorization Failed.\"}");
  }

}
