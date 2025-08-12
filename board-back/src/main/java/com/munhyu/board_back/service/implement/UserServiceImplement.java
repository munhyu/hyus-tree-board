package com.munhyu.board_back.service.implement;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.munhyu.board_back.dto.response.ResponseDto;
import com.munhyu.board_back.dto.response.user.GetSignInUserResponseDto;
import com.munhyu.board_back.dto.response.user.GetUserResponseDto;
import com.munhyu.board_back.entity.UserEntity;
import com.munhyu.board_back.repository.UserRepository;
import com.munhyu.board_back.service.UserService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserServiceImplement implements UserService {

  private final UserRepository userRepository;

  @Override
  public ResponseEntity<? super GetSignInUserResponseDto> getSignInUser(String email) {

    UserEntity userEntity = null;

    try {

      userEntity = userRepository.findByEmail(email);
      if (userEntity == null) {
        return GetSignInUserResponseDto.notExistUser();
      }

    } catch (Exception e) {
      e.printStackTrace();
      return ResponseDto.databaseError();
    }

    return GetSignInUserResponseDto.success(userEntity);
  }

  @Override
  public ResponseEntity<? super GetUserResponseDto> getUser(String email) {
    UserEntity userEntity = null;

    System.out.println("Fetching user information for email: " + email);

    try {

      userEntity = userRepository.findByEmail(email);

      if (userEntity == null) {
        System.out.println("User not found for email: " + email);
        return GetUserResponseDto.notExistUser();
      }

    } catch (Exception e) {
      e.printStackTrace();
      return ResponseDto.databaseError();
    }

    System.out.println("User found for email: " + email);
    return GetUserResponseDto.success(userEntity);
  }

}
