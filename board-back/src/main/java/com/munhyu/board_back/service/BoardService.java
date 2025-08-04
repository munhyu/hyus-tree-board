package com.munhyu.board_back.service;

import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;

import com.munhyu.board_back.dto.request.board.PostBoardRequestDto;
import com.munhyu.board_back.dto.request.board.PostCommentRequestDto;
import com.munhyu.board_back.dto.response.board.DeleteBoardResponseDto;
import com.munhyu.board_back.dto.response.board.DeleteCommentResponseDto;
import com.munhyu.board_back.dto.response.board.GetBoardListResponseDto;
import com.munhyu.board_back.dto.response.board.GetBoardResponseDto;
import com.munhyu.board_back.dto.response.board.GetCommentListResponseDto;
import com.munhyu.board_back.dto.response.board.GetFavoriteListResponseDto;
import com.munhyu.board_back.dto.response.board.IncreaseViewCountResponseDto;
import com.munhyu.board_back.dto.response.board.PostBoardResponseDto;
import com.munhyu.board_back.dto.response.board.PostCommentResponseDto;
import com.munhyu.board_back.dto.response.board.PutFavoriteResponseDto;

public interface BoardService {

  ResponseEntity<? super GetBoardResponseDto> getBoard(Integer boardNumber);

  ResponseEntity<? super GetFavoriteListResponseDto> getFavoriteList(Integer boardNumber);

  ResponseEntity<? super GetCommentListResponseDto> getCommentList(Integer boardNumber);

  ResponseEntity<? super GetBoardListResponseDto> getLatestBoardList(int page);

  ResponseEntity<? super PostBoardResponseDto> postBoard(PostBoardRequestDto dto, String email);

  ResponseEntity<? super PostCommentResponseDto> postComment(PostCommentRequestDto dto, Integer boardNumber,
      String email);

  ResponseEntity<? super PutFavoriteResponseDto> putFavorite(Integer boardNumber, String email);

  ResponseEntity<? super IncreaseViewCountResponseDto> increaseViewCount(Integer boardNumber);

  ResponseEntity<? super DeleteCommentResponseDto> deleteComment(Integer commentNumber, String email);

  ResponseEntity<? super DeleteBoardResponseDto> deleteBoard(Integer boardNumber, String email);

}
