package com.munhyu.board_back.service.implement;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.munhyu.board_back.dto.request.board.PostBoardRequestDto;
import com.munhyu.board_back.dto.request.board.PostCommentRequestDto;
import com.munhyu.board_back.dto.response.ResponseDto;
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
import com.munhyu.board_back.entity.BoardEntity;
import com.munhyu.board_back.entity.BoardListViewEntity;
import com.munhyu.board_back.entity.CommentEntity;
import com.munhyu.board_back.entity.FavoriteEntity;
import com.munhyu.board_back.entity.ImageEntity;
import com.munhyu.board_back.repository.BoardListViewRepository;
import com.munhyu.board_back.repository.BoardRepository;
import com.munhyu.board_back.repository.CommentRepository;
import com.munhyu.board_back.repository.FavoriteRepository;
import com.munhyu.board_back.repository.ImageRepository;
import com.munhyu.board_back.repository.UserRepository;
import com.munhyu.board_back.repository.resultSet.GetBoardResultSet;
import com.munhyu.board_back.repository.resultSet.GetCommentListResultSet;
import com.munhyu.board_back.repository.resultSet.GetFavoriteListResultSet;
import com.munhyu.board_back.service.BoardService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BoardServiceImplement implements BoardService {

  private final UserRepository userRepository;
  private final BoardRepository boardRepository;
  private final ImageRepository imageRepository;
  private final CommentRepository commentRepository;
  private final FavoriteRepository favoriteRepository;
  private final BoardListViewRepository boardListViewRepository;

  @Override
  public ResponseEntity<? super GetBoardResponseDto> getBoard(Integer boardNumber) {

    GetBoardResultSet resultSet = null;
    List<ImageEntity> imageEntities = null;

    try {

      resultSet = boardRepository.getBoard(boardNumber);

      if (resultSet == null) {
        return GetBoardResponseDto.notExistBoard();
      }

      imageEntities = imageRepository.findByBoardNumber(boardNumber);

    } catch (Exception e) {
      e.printStackTrace();
      return ResponseDto.databaseError();
    }

    return GetBoardResponseDto.success(resultSet, imageEntities);
  }

  @Override
  public ResponseEntity<? super GetFavoriteListResponseDto> getFavoriteList(Integer boardNumber) {

    List<GetFavoriteListResultSet> resultSets = new ArrayList<>();

    try {

      boolean existedBoard = boardRepository.existsByBoardNumber(boardNumber);

      if (!existedBoard) {
        return GetFavoriteListResponseDto.notExistBoard();
      }

      resultSets = favoriteRepository.getFavoriteList(boardNumber);

    } catch (Exception e) {
      e.printStackTrace();
      return ResponseDto.databaseError();
    }

    return GetFavoriteListResponseDto.success(resultSets);
  }

  @Override
  public ResponseEntity<? super GetCommentListResponseDto> getCommentList(Integer boardNumber) {

    List<GetCommentListResultSet> resultSets = new ArrayList<>();

    try {

      boolean existedBoard = boardRepository.existsByBoardNumber(boardNumber);

      if (!existedBoard) {
        return ResponseDto.notExistBoard();
      }

      resultSets = commentRepository.getCommentList(boardNumber);

    } catch (Exception e) {
      e.printStackTrace();
      return ResponseDto.databaseError();
    }

    return GetCommentListResponseDto.success(resultSets);
  }

  @Override
  public ResponseEntity<? super GetBoardListResponseDto> getLatestBoardList(int page) {

    Page<BoardListViewEntity> boardPage = null;

    try {

      boardPage = boardListViewRepository
          .findAll(PageRequest.of(page - 1, 10, Sort.by("writeDatetime").descending()));

    } catch (Exception e) {
      e.printStackTrace();
      return ResponseDto.databaseError();
    }

    return GetBoardListResponseDto.success(boardPage);

  }

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

  @Override
  public ResponseEntity<? super PostCommentResponseDto> postComment(PostCommentRequestDto dto, Integer boardNumber,
      String email) {

    try {

      boolean existedEmail = userRepository.existsByEmail(email);
      if (!existedEmail) {
        return PostCommentResponseDto.notExistUser();
      }

      BoardEntity boardEntity = boardRepository.findByBoardNumber(boardNumber);
      if (boardEntity == null) {
        return PostCommentResponseDto.notExistBoard();
      }

      CommentEntity commentEntity = new CommentEntity(dto, boardNumber, email);
      commentRepository.save(commentEntity);

      boardEntity.increaseCommentCount();
      boardRepository.save(boardEntity);

    } catch (Exception e) {
      e.printStackTrace();
      return ResponseDto.databaseError();
    }

    return PostCommentResponseDto.success();
  }

  @Override
  public ResponseEntity<? super PutFavoriteResponseDto> putFavorite(Integer boardNumber, String email) {

    try {

      boolean existedEmail = userRepository.existsByEmail(email);
      if (!existedEmail) {
        return PutFavoriteResponseDto.notExistUser();
      }

      BoardEntity boardEntity = boardRepository.findByBoardNumber(boardNumber);
      if (boardEntity == null) {
        return PutFavoriteResponseDto.notExistBoard();
      }

      FavoriteEntity favoriteEntity = favoriteRepository.findByBoardNumberAndUserEmail(boardNumber, email);

      if (favoriteEntity == null) {
        favoriteEntity = new FavoriteEntity(email, boardNumber);
        favoriteRepository.save(favoriteEntity);
        boardEntity.increaseFavoriteCount();

      } else {
        favoriteRepository.delete(favoriteEntity);
        boardEntity.decreaseFavoriteCount();
      }

      boardRepository.save(boardEntity);

    } catch (Exception e) {
      e.printStackTrace();
      return ResponseDto.databaseError();
    }

    return PutFavoriteResponseDto.success();

  }

  @Override
  public ResponseEntity<? super DeleteCommentResponseDto> deleteComment(Integer commentNumber, String email) {

    try {

      boolean existedEmail = userRepository.existsByEmail(email);
      if (!existedEmail) {
        return DeleteCommentResponseDto.notExistUser();
      }

      CommentEntity commentEntity = commentRepository.findByCommentNumber(commentNumber);
      if (commentEntity == null) {
        return DeleteCommentResponseDto.notExistComment();
      }

      BoardEntity boardEntity = boardRepository.findByBoardNumber(commentEntity.getBoardNumber());
      if (boardEntity == null) {
        return DeleteCommentResponseDto.notExistBoard();
      }

      if (!commentEntity.getUserEmail().equals(email)) {
        return DeleteCommentResponseDto.noPermission();
      }

      commentRepository.delete(commentEntity);

      boardEntity.decreaseCommentCount();
      boardRepository.save(boardEntity);

    } catch (Exception e) {
      e.printStackTrace();
      return ResponseDto.databaseError();
    }

    return DeleteCommentResponseDto.success();

  }

  @Override
  public ResponseEntity<? super IncreaseViewCountResponseDto> increaseViewCount(Integer boardNumber) {

    try {

      BoardEntity boardEntity = boardRepository.findByBoardNumber(boardNumber);
      if (boardEntity == null) {
        return IncreaseViewCountResponseDto.notExistBoard();
      }
      boardEntity.increaseViewCount();
      boardRepository.save(boardEntity);

    } catch (Exception e) {
      e.printStackTrace();
      return ResponseDto.databaseError();
    }

    return IncreaseViewCountResponseDto.success();
  }

  @Override
  public ResponseEntity<? super DeleteBoardResponseDto> deleteBoard(Integer boardNumber, String email) {

    try {

      boolean existedEmail = userRepository.existsByEmail(email);
      if (!existedEmail) {
        return DeleteBoardResponseDto.notExistUser();
      }

      BoardEntity boardEntity = boardRepository.findByBoardNumber(boardNumber);
      if (boardEntity == null) {
        return DeleteBoardResponseDto.notExistBoard();
      }

      boolean isWriter = boardEntity.getWriterEmail().equals(email);
      if (!isWriter) {
        return DeleteBoardResponseDto.noPermission();
      }

      imageRepository.deleteByBoardNumber(boardNumber);
      favoriteRepository.deleteByBoardNumber(boardNumber);
      commentRepository.deleteByBoardNumber(boardNumber);
      boardRepository.delete(boardEntity);

    } catch (Exception e) {
      e.printStackTrace();
      return ResponseDto.databaseError();
    }

    return DeleteBoardResponseDto.success();

  }

}
