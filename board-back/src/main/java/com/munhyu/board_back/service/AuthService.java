package com.munhyu.board_back.service;

import org.springframework.http.ResponseEntity;

import com.munhyu.board_back.dto.request.auth.SignInRequestDto;
import com.munhyu.board_back.dto.request.auth.SignUpRequestDto;
import com.munhyu.board_back.dto.response.auth.SignInResponseDto;
import com.munhyu.board_back.dto.response.auth.SignUpResponseDto;

public interface AuthService {

  // ? super 해당 타입이나 부모 타입 어떤 것이든 올 수 있다.
  ResponseEntity<? super SignUpResponseDto> signUp(SignUpRequestDto dto);

  ResponseEntity<? super SignInResponseDto> signIn(SignInRequestDto dto);
}
