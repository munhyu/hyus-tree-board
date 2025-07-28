package com.munhyu.board_back.dto.response.board;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.munhyu.board_back.common.ResponseCode;
import com.munhyu.board_back.common.ResponseMessage;
import com.munhyu.board_back.dto.response.ResponseDto;

public class IncreaseViewCountResponseDto extends ResponseDto {

  private IncreaseViewCountResponseDto() {
    super(ResponseCode.SUCCESS, ResponseMessage.SUCCESS);
  }

  public static ResponseEntity<IncreaseViewCountResponseDto> success() {
    IncreaseViewCountResponseDto result = new IncreaseViewCountResponseDto();
    return ResponseEntity.status(HttpStatus.OK).body(result);
  }

}
