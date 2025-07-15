package com.munhyu.board_back.dto.request.auth;

import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class SignUpRequestDto {

  @NotBlank
  @Email
  private String email;

  @NotBlank
  @Size(min = 8, max = 20)
  private String password;

  @NotBlank
  private String nickname;

  @NotNull
  @AssertTrue
  private Boolean agreedPersonal;

}
