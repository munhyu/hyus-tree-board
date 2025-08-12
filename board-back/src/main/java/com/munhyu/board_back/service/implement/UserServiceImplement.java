package com.munhyu.board_back.service.implement;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.munhyu.board_back.dto.request.user.PatchNicknameRequestDto;
import com.munhyu.board_back.dto.request.user.PatchProfileImageRequestDto;
import com.munhyu.board_back.dto.response.ResponseDto;
import com.munhyu.board_back.dto.response.user.GetSignInUserResponseDto;
import com.munhyu.board_back.dto.response.user.GetUserResponseDto;
import com.munhyu.board_back.dto.response.user.PatchNicknameResponseDto;
import com.munhyu.board_back.dto.response.user.PatchProfileImageResponseDto;
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

    try {

      userEntity = userRepository.findByEmail(email);

      if (userEntity == null) {
        return GetUserResponseDto.notExistUser();
      }

    } catch (Exception e) {
      e.printStackTrace();
      return ResponseDto.databaseError();
    }

    return GetUserResponseDto.success(userEntity);
  }

  @Override
  public ResponseEntity<? super PatchNicknameResponseDto> patchNickname(String email, PatchNicknameRequestDto dto) {

    try {
      UserEntity userEntity = userRepository.findByEmail(email);
      if (userEntity == null) {
        return PatchNicknameResponseDto.notExistUser();
      }

      String nickname = dto.getNickname();

      boolean existedNickname = userRepository.existsByNickname(nickname);
      if (existedNickname) {
        return PatchNicknameResponseDto.duplicateNickname();
      }

      userEntity.setNickname(nickname);
      userRepository.save(userEntity);

    } catch (Exception e) {
      e.printStackTrace();
      return ResponseDto.databaseError();
    }

    return PatchNicknameResponseDto.success();
  }

  @Override
  public ResponseEntity<? super PatchProfileImageResponseDto> patchProfileImage(String email,
      PatchProfileImageRequestDto dto) {

    try {
      UserEntity userEntity = userRepository.findByEmail(email);
      if (userEntity == null) {
        return PatchProfileImageResponseDto.notExistUser();
      }

      String profileImage = dto.getProfileImage();
      userEntity.setProfileImage(profileImage);
      userRepository.save(userEntity);

    } catch (Exception e) {
      e.printStackTrace();
      return ResponseDto.databaseError();
    }

    return PatchProfileImageResponseDto.success();
  }

}
