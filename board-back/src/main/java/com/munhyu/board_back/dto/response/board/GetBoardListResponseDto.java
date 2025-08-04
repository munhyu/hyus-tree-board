package com.munhyu.board_back.dto.response.board;

import java.util.ArrayList;
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
public class GetBoardListResponseDto extends ResponseDto {

  private List<BoardListItem> boardList;
  private int totalPages; // 총 페이지 수
  private long totalElements; // 총 게시물 수
  private boolean hasNext; // 다음 페이지가 있는지 여부
  private int currentPage; // 현재 페이지 번호

  private GetBoardListResponseDto(Page<BoardListViewEntity> boardPage) {
    super(ResponseCode.SUCCESS, ResponseMessage.SUCCESS);

    List<BoardListItem> boardListItems = new ArrayList<>();
    for (BoardListViewEntity entity : boardPage.getContent()) {
      BoardListItem boardListItem = new BoardListItem(
          entity.getBoardNumber(),
          entity.getTitle(),
          entity.getContent(),
          entity.getTitleImage(),
          entity.getFavoriteCount(),
          entity.getCommentCount(),
          entity.getViewCount(),
          entity.getWriteDatetime(),
          entity.getWriterNickname(),
          entity.getWriterProfileImage());
      boardListItems.add(boardListItem);
    }
    this.boardList = boardListItems;
    this.totalPages = boardPage.getTotalPages();
    this.totalElements = boardPage.getTotalElements();
    this.hasNext = boardPage.hasNext();
    this.currentPage = boardPage.getNumber();
  }

  public static ResponseEntity<GetBoardListResponseDto> success(Page<BoardListViewEntity> boardPage) {
    GetBoardListResponseDto result = new GetBoardListResponseDto(boardPage);
    return ResponseEntity.status(HttpStatus.OK).body(result);
  }

}
