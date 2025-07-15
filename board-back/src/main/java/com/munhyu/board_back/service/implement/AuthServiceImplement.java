package com.munhyu.board_back.service.implement;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.munhyu.board_back.dto.request.auth.SignInRequestDto;
import com.munhyu.board_back.dto.request.auth.SignUpRequestDto;
import com.munhyu.board_back.dto.response.ResponseDto;
import com.munhyu.board_back.dto.response.auth.SignInResponseDto;
import com.munhyu.board_back.dto.response.auth.SignUpResponseDto;
import com.munhyu.board_back.entity.UserEntity;
import com.munhyu.board_back.provider.JwtProvider;
import com.munhyu.board_back.repository.UserRepository;
import com.munhyu.board_back.service.AuthService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthServiceImplement implements AuthService {

  // @Autowired
  // public AuthServiceImplement(UserRepository userRepository) {
  // this.userRepository = userRepository;
  // }

  // RequiredArgsConstructor과 final 이용하면 위와 동일한 효과
  private final UserRepository userRepository;
  private final JwtProvider jwtProvider;

  private PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

  @Override
  public ResponseEntity<? super SignUpResponseDto> signUp(SignUpRequestDto dto) {

    try {

      // 중복 확인
      String email = dto.getEmail();
      boolean isEmailExist = userRepository.existsByEmail(email);
      if (isEmailExist) {
        return SignUpResponseDto.duplicateEmail();
      }

      String nickname = dto.getNickname();
      boolean isNicknameExist = userRepository.existsByNickname(nickname);
      if (isNicknameExist) {
        return SignUpResponseDto.duplicateNickname();
      }

      // 패스워드 인코더 사용
      String password = dto.getPassword();
      String encodedPassword = passwordEncoder.encode(password);
      dto.setPassword(encodedPassword);

      UserEntity userEntity = new UserEntity(dto);
      userRepository.save(userEntity);

    } catch (Exception e) {
      e.printStackTrace();
      return ResponseDto.databaseError();
    }

    return SignUpResponseDto.success();
  }

  @Override
  public ResponseEntity<? super SignInResponseDto> signIn(SignInRequestDto dto) {

    String token = null;

    try {

      String email = dto.getEmail();
      UserEntity userEntity = userRepository.findByEmail(email);
      if (userEntity == null) {
        return SignInResponseDto.signInFail();
      }

      String password = dto.getPassword();
      String encodedPassword = userEntity.getPassword();
      boolean isMatched = passwordEncoder.matches(password, encodedPassword);
      if (!isMatched) {
        return SignInResponseDto.signInFail();
      }

      token = jwtProvider.create(email);

    } catch (Exception e) {
      e.printStackTrace();
      return ResponseDto.databaseError();
    }

    return SignInResponseDto.success(token);
  }

}
