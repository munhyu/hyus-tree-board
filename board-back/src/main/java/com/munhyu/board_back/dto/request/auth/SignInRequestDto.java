package com.munhyu.board_back.dto.request.auth;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class SignInRequestDto {

  @NotBlank
  private String email;
  @NotBlank
  private String password;

}
