package com.munhyu.board_back.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.munhyu.board_back.dto.response.user.GetSignInUserResponseDto;
import com.munhyu.board_back.dto.response.user.GetUserResponseDto;
import com.munhyu.board_back.service.UserService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
@RequestMapping("api/v1/user")
@RequiredArgsConstructor
public class UserController {

  private final UserService userService;

  @GetMapping("")
  public ResponseEntity<? super GetSignInUserResponseDto> getSignInUser(
      @AuthenticationPrincipal String email) {
    ResponseEntity<? super GetSignInUserResponseDto> response = userService.getSignInUser(email);
    return response;
  }

  @GetMapping("/{email}")
  public ResponseEntity<? super GetUserResponseDto> getUser(
      @PathVariable("email") String email) {
    ResponseEntity<? super GetUserResponseDto> response = userService.getUser(email);
    return response;
  }

}
