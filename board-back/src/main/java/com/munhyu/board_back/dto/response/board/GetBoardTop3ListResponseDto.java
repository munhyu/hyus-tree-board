package com.munhyu.board_back.dto.response.board;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.munhyu.board_back.common.ResponseCode;
import com.munhyu.board_back.common.ResponseMessage;
import com.munhyu.board_back.dto.object.BoardListItem;
import com.munhyu.board_back.dto.response.ResponseDto;
import com.munhyu.board_back.entity.BoardListViewEntity;

import lombok.Getter;

@Getter
public class GetBoardTop3ListResponseDto extends ResponseDto {

  private List<BoardListItem> top3List;

  public GetBoardTop3ListResponseDto(List<BoardListViewEntity> boardListViewEntities) {
    super(ResponseCode.SUCCESS, ResponseMessage.SUCCESS);
    this.top3List = BoardListItem.getList(boardListViewEntities);
  }

  public static ResponseEntity<GetBoardTop3ListResponseDto> success(List<BoardListViewEntity> boardListViewEntities) {
    GetBoardTop3ListResponseDto result = new GetBoardTop3ListResponseDto(
        boardListViewEntities);
    return ResponseEntity.status(HttpStatus.OK).body(result);
  }

}
