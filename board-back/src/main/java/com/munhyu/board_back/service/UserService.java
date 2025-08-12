package com.munhyu.board_back.service;

import org.springframework.http.ResponseEntity;

import com.munhyu.board_back.dto.response.user.GetSignInUserResponseDto;
import com.munhyu.board_back.dto.response.user.GetUserResponseDto;

public interface UserService {

  ResponseEntity<? super GetSignInUserResponseDto> getSignInUser(String email);

  ResponseEntity<? super GetUserResponseDto> getUser(String email);
}
