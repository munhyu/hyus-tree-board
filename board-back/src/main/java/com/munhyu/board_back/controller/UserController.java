package com.munhyu.board_back.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.munhyu.board_back.dto.request.user.PatchNicknameRequestDto;
import com.munhyu.board_back.dto.request.user.PatchProfileImageRequestDto;
import com.munhyu.board_back.dto.response.user.GetSignInUserResponseDto;
import com.munhyu.board_back.dto.response.user.GetUserResponseDto;
import com.munhyu.board_back.dto.response.user.PatchNicknameResponseDto;
import com.munhyu.board_back.dto.response.user.PatchProfileImageResponseDto;
import com.munhyu.board_back.service.UserService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

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

  @PatchMapping("/nickname")
  public ResponseEntity<? super PatchNicknameResponseDto> patchNickname(
      @AuthenticationPrincipal String email,
      @RequestBody @Valid PatchNicknameRequestDto requestBody) {
    ResponseEntity<? super PatchNicknameResponseDto> response = userService.patchNickname(email, requestBody);
    return response;
  }

  @PatchMapping("/profile-image")
  public ResponseEntity<? super PatchProfileImageResponseDto> patchProfileImage(
      @AuthenticationPrincipal String email,
      @RequestBody @Valid PatchProfileImageRequestDto requestBody) {
    ResponseEntity<? super PatchProfileImageResponseDto> response = userService.patchProfileImage(email, requestBody);
    return response;
  }

}
