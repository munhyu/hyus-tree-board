package com.munhyu.board_back.entity;

import com.munhyu.board_back.dto.request.auth.SignUpRequestDto;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Entity(name = "user")
@Table(name = "user")
public class UserEntity {

  @Id
  private String email;
  private String password;
  private String nickname;
  private String profileImage;
  private boolean agreedPersonal;
  // field: OAuth2 제공자 (google, kakao 등) //
  private String provider;
  // field: OAuth2 제공자에서의 고유 ID //
  private String providerId;

  public UserEntity(SignUpRequestDto dto) {
    this.email = dto.getEmail();
    this.password = dto.getPassword();
    this.nickname = dto.getNickname();
    this.agreedPersonal = dto.getAgreedPersonal();
    this.provider = "local";
    this.providerId = "local";
  }

  // OAuth2 회원가입용 생성자 //
  public UserEntity(String email, String nickname, String profileImage, String provider, String providerId) {
    this.email = email;
    this.password = "OAuth2";
    this.nickname = nickname;
    this.profileImage = profileImage;
    this.agreedPersonal = true;
    this.provider = provider;
    this.providerId = providerId;
  }

  public void setNickname(String nickname) {
    this.nickname = nickname;
  }

  public void setProfileImage(String profileImage) {
    this.profileImage = profileImage;
  }

}
