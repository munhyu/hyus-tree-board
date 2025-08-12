package com.munhyu.board_back.service;

import org.springframework.http.ResponseEntity;

import com.munhyu.board_back.dto.request.user.PatchNicknameRequestDto;
import com.munhyu.board_back.dto.request.user.PatchProfileImageRequestDto;
import com.munhyu.board_back.dto.response.user.GetSignInUserResponseDto;
import com.munhyu.board_back.dto.response.user.GetUserResponseDto;
import com.munhyu.board_back.dto.response.user.PatchNicknameResponseDto;
import com.munhyu.board_back.dto.response.user.PatchProfileImageResponseDto;

public interface UserService {

  ResponseEntity<? super GetSignInUserResponseDto> getSignInUser(String email);

  ResponseEntity<? super GetUserResponseDto> getUser(String email);

  ResponseEntity<? super PatchNicknameResponseDto> patchNickname(String email, PatchNicknameRequestDto dto);

  ResponseEntity<? super PatchProfileImageResponseDto> patchProfileImage(String email,
      PatchProfileImageRequestDto dto);

}
