package com.munhyu.board_back.dto.response.user;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.munhyu.board_back.common.ResponseCode;
import com.munhyu.board_back.common.ResponseMessage;
import com.munhyu.board_back.dto.response.ResponseDto;

public class PatchProfileImageResponseDto extends ResponseDto {

  private PatchProfileImageResponseDto() {
    super(ResponseCode.SUCCESS, ResponseMessage.SUCCESS);
  }

  public static ResponseEntity<PatchProfileImageResponseDto> success() {
    PatchProfileImageResponseDto result = new PatchProfileImageResponseDto();
    return ResponseEntity.status(HttpStatus.OK)
        .body(result);
  }

}
