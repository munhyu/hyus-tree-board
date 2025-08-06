package com.munhyu.board_back.dto.response.board;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.munhyu.board_back.common.ResponseCode;
import com.munhyu.board_back.common.ResponseMessage;
import com.munhyu.board_back.dto.response.ResponseDto;

import lombok.Getter;

@Getter
public class PatchBoardResponseDto extends ResponseDto {

  private PatchBoardResponseDto() {
    super(ResponseCode.SUCCESS, ResponseMessage.SUCCESS);
  }

  public static ResponseEntity<PatchBoardResponseDto> success() {
    PatchBoardResponseDto result = new PatchBoardResponseDto();
    return ResponseEntity.status(HttpStatus.OK).body(result);
  }

  public static ResponseEntity<ResponseDto> noPermission() {
    ResponseDto result = new ResponseDto(ResponseCode.NO_PERMISSION, ResponseMessage.NO_PERMISSION);
    return ResponseEntity.status(HttpStatus.FORBIDDEN).body(result);
  }

}
