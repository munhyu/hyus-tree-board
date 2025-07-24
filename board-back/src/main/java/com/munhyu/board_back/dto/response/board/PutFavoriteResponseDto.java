package com.munhyu.board_back.dto.response.board;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.munhyu.board_back.common.ResponseCode;
import com.munhyu.board_back.common.ResponseMessage;
import com.munhyu.board_back.dto.response.ResponseDto;

import lombok.Getter;

@Getter
public class PutFavoriteResponseDto extends ResponseDto {

  private PutFavoriteResponseDto() {
    super(ResponseCode.SUCCESS, ResponseMessage.SUCCESS);
  }

  public static ResponseEntity<PutFavoriteResponseDto> success() {
    PutFavoriteResponseDto result = new PutFavoriteResponseDto();
    return ResponseEntity.status(HttpStatus.OK).body(result);
  }

}
