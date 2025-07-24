package com.munhyu.board_back.dto.response.board;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.munhyu.board_back.common.ResponseCode;
import com.munhyu.board_back.common.ResponseMessage;
import com.munhyu.board_back.dto.object.FavoriteListItem;
import com.munhyu.board_back.dto.response.ResponseDto;
import com.munhyu.board_back.repository.resultSet.GetFavoriteListResultSet;

import lombok.Getter;

@Getter
public class GetFavoriteListResponseDto extends ResponseDto {

  private List<FavoriteListItem> favoriteList;

  private GetFavoriteListResponseDto(List<GetFavoriteListResultSet> resultSets) {
    super(ResponseCode.SUCCESS, ResponseMessage.SUCCESS);
    this.favoriteList = FavoriteListItem.copyList(resultSets);
  }

  public static ResponseEntity<GetFavoriteListResponseDto> success(List<GetFavoriteListResultSet> resultSets) {
    GetFavoriteListResponseDto result = new GetFavoriteListResponseDto(resultSets);
    return ResponseEntity.status(HttpStatus.OK)
        .body(result);
  }

}
