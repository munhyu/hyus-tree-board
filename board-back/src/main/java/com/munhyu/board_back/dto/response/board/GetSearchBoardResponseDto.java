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
public class GetSearchBoardResponseDto extends ResponseDto {

  private List<BoardListItem> searchList;
  private int totalPages; // 총 페이지 수
  private long totalElements; // 총 게시물 수
  private boolean hasNext; // 다음 페이지가 있는지 여부
  private int currentPage; // 현재 페이지 번호

  private GetSearchBoardResponseDto(Page<BoardListViewEntity> searchBoardPage) {
    super(ResponseCode.SUCCESS, ResponseMessage.SUCCESS);
    this.searchList = BoardListItem.getList(searchBoardPage);
    this.totalPages = searchBoardPage.getTotalPages();
    this.totalElements = searchBoardPage.getTotalElements();
    this.hasNext = searchBoardPage.hasNext();
    this.currentPage = searchBoardPage.getNumber();

  }

  public static ResponseEntity<GetSearchBoardResponseDto> success(Page<BoardListViewEntity> searchBoardPage) {
    GetSearchBoardResponseDto result = new GetSearchBoardResponseDto(searchBoardPage);
    return ResponseEntity.status(HttpStatus.OK).body(result);
  }

}
