package com.munhyu.board_back.dto.response.board;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.munhyu.board_back.common.ResponseCode;
import com.munhyu.board_back.common.ResponseMessage;
import com.munhyu.board_back.dto.object.BoardListItem;
import com.munhyu.board_back.dto.response.ResponseDto;
import com.munhyu.board_back.entity.BoardListViewEntity;

import lombok.Getter;

@Getter
public class GetUserBoardResponseDto extends ResponseDto {

  private List<BoardListItem> userBoardList;
  private int totalPages; // 총 페이지 수
  private long totalElements; // 총 게시물 수
  private boolean hasNext; // 다음 페이지가 있는지 여부
  private int currentPage; // 현재 페이지 번호

  private GetUserBoardResponseDto(Page<BoardListViewEntity> boardListViewEntities) {
    super(ResponseCode.SUCCESS, ResponseMessage.SUCCESS);
    this.userBoardList = BoardListItem.getList(boardListViewEntities);
    this.totalPages = boardListViewEntities.getTotalPages();
    this.totalElements = boardListViewEntities.getTotalElements();
    this.hasNext = boardListViewEntities.hasNext();
    this.currentPage = boardListViewEntities.getNumber();

  }

  public static ResponseEntity<GetUserBoardResponseDto> success(Page<BoardListViewEntity> boardListViewEntities) {
    GetUserBoardResponseDto result = new GetUserBoardResponseDto(boardListViewEntities);
    return ResponseEntity.status(HttpStatus.OK).body(result);
  }

}
