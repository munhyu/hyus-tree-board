package com.munhyu.board_back.OAuth2;

import java.util.Map;

import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import com.munhyu.board_back.entity.UserEntity;
import com.munhyu.board_back.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

  private final UserRepository userRepository;

  @Override
  public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {

    // OAuth2 사용자 정보 로드
    OAuth2User oauth2User = super.loadUser(userRequest);

    // provider 정보 추출
    String registrationId = userRequest.getClientRegistration().getRegistrationId();
    Map<String, Object> attributes = oauth2User.getAttributes();

    OAuth2UserInfo oauth2UserInfo = null;

    // provider별 사용자 정보 매핑
    if ("google".equals(registrationId)) {
      oauth2UserInfo = new GoogleUserInfo(attributes);
    }

    if (oauth2UserInfo == null) {
      throw new OAuth2AuthenticationException("지원하지 않는 OAuth2 제공자입니다.");
    }

    // 사용자 정보로 회원 조회 또는 생성
    String email = oauth2UserInfo.getEmail();
    UserEntity userEntity = userRepository.findByEmail(email);

    if (userEntity == null) {
      // 신규 사용자 생성
      String nickname = oauth2UserInfo.getName();
      // 중복 닉네임 처리
      String uniqueNickname = generateUniqueNickname(nickname);

      userEntity = new UserEntity(
          email,
          uniqueNickname,
          null,
          oauth2UserInfo.getProvider(),
          oauth2UserInfo.getProviderId());

      userRepository.save(userEntity);
    }

    return oauth2User;
  }

  // 고유 닉네임 생성
  private String generateUniqueNickname(String baseName) {
    String nickname = baseName;
    int count = 1;

    while (userRepository.existsByNickname(nickname)) {
      nickname = baseName + count;
      count++;
    }

    return nickname;
  }
}