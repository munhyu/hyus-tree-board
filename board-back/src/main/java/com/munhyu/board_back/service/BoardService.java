package com.munhyu.board_back.service;

import org.springframework.http.ResponseEntity;

import com.munhyu.board_back.dto.request.board.PostBoardRequestDto;
import com.munhyu.board_back.dto.response.board.GetBoardResponseDto;
import com.munhyu.board_back.dto.response.board.PostBoardResponseDto;

public interface BoardService {

  ResponseEntity<? super GetBoardResponseDto> getBoard(Integer boardNumber);

  ResponseEntity<? super PostBoardResponseDto> postBoard(PostBoardRequestDto dto, String email);

}
