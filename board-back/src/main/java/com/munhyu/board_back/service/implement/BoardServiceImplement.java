package com.munhyu.board_back.service.implement;

import java.util.ArrayList;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.munhyu.board_back.dto.request.board.PostBoardRequestDto;
import com.munhyu.board_back.dto.response.ResponseDto;
import com.munhyu.board_back.dto.response.board.PostBoardResponseDto;
import com.munhyu.board_back.entity.BoardEntity;
import com.munhyu.board_back.entity.ImageEntity;
import com.munhyu.board_back.repository.BoardRepository;
import com.munhyu.board_back.repository.ImageRepository;
import com.munhyu.board_back.repository.UserRepository;
import com.munhyu.board_back.service.BoardService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BoardServiceImplement implements BoardService {

  private final UserRepository userRepository;
  private final BoardRepository boardRepository;
  private final ImageRepository imageRepository;

  @Override
  public ResponseEntity<? super PostBoardResponseDto> postBoard(PostBoardRequestDto dto, String email) {

    try {

      boolean existedEmail = userRepository.existsByEmail(email);
      if (!existedEmail) {
        return PostBoardResponseDto.notExistUser();
      }

      BoardEntity boardEntity = new BoardEntity(dto, email);
      boardRepository.save(boardEntity);

      // save하면 boardEntity에 boardNumber가 자동으로 할당됨
      int boardNumber = boardEntity.getBoardNumber();

      List<String> boardImageList = dto.getBoardImageList();
      List<ImageEntity> imageEntities = new ArrayList<>();

      for (String image : boardImageList) {
        ImageEntity imageEntity = new ImageEntity(boardNumber, image);
        imageEntities.add(imageEntity);
      }

      // 반복문으로 여러번 save를 호출하는 대신, saveAll을 사용하여 한 번에 저장하는게 효율적
      imageRepository.saveAll(imageEntities);

    } catch (Exception e) {
      e.printStackTrace();
      return ResponseDto.databaseError();
    }

    return PostBoardResponseDto.success();
  }

}
