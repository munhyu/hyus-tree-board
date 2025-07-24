package com.munhyu.board_back.dto.response.board;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.munhyu.board_back.common.ResponseCode;
import com.munhyu.board_back.common.ResponseMessage;
import com.munhyu.board_back.dto.object.CommentListItem;
import com.munhyu.board_back.dto.response.ResponseDto;
import com.munhyu.board_back.repository.resultSet.GetCommentListResultSet;

import lombok.Getter;

@Getter
public class GetCommentListResponseDto extends ResponseDto {

  private List<CommentListItem> commentList;

  private GetCommentListResponseDto(List<GetCommentListResultSet> resultSets) {
    super(ResponseCode.SUCCESS, ResponseMessage.SUCCESS);
    this.commentList = CommentListItem.copyList(resultSets);
  }

  public static ResponseEntity<GetCommentListResponseDto> success(List<GetCommentListResultSet> resultSets) {
    GetCommentListResponseDto result = new GetCommentListResponseDto(resultSets);
    return ResponseEntity.status(HttpStatus.OK).body(result);
  }

}
