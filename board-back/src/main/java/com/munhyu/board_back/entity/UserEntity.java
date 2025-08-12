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

  public UserEntity(SignUpRequestDto dto) {
    this.email = dto.getEmail();
    this.password = dto.getPassword();
    this.nickname = dto.getNickname();
    this.agreedPersonal = dto.getAgreedPersonal();
  }

  public void setNickname(String nickname) {
    this.nickname = nickname;
  }

  public void setProfileImage(String profileImage) {
    this.profileImage = profileImage;
  }

}
