package com.munhyu.board_back.service.implement;

import java.text.SimpleDateFormat;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.munhyu.board_back.dto.request.board.PatchBoardRequestDto;
import com.munhyu.board_back.dto.request.board.PostBoardRequestDto;
import com.munhyu.board_back.dto.request.board.PostCommentRequestDto;
import com.munhyu.board_back.dto.response.ResponseDto;
import com.munhyu.board_back.dto.response.board.DeleteBoardResponseDto;
import com.munhyu.board_back.dto.response.board.DeleteCommentResponseDto;
import com.munhyu.board_back.dto.response.board.GetBoardLatestListResponseDto;
import com.munhyu.board_back.dto.response.board.GetBoardResponseDto;
import com.munhyu.board_back.dto.response.board.GetBoardTop3ListResponseDto;
import com.munhyu.board_back.dto.response.board.GetCommentListResponseDto;
import com.munhyu.board_back.dto.response.board.GetFavoriteListResponseDto;
import com.munhyu.board_back.dto.response.board.GetSearchBoardResponseDto;
import com.munhyu.board_back.dto.response.board.IncreaseViewCountResponseDto;
import com.munhyu.board_back.dto.response.board.PatchBoardResponseDto;
import com.munhyu.board_back.dto.response.board.PostBoardResponseDto;
import com.munhyu.board_back.dto.response.board.PostCommentResponseDto;
import com.munhyu.board_back.dto.response.board.PutFavoriteResponseDto;
import com.munhyu.board_back.entity.BoardEntity;
import com.munhyu.board_back.entity.BoardListViewEntity;
import com.munhyu.board_back.entity.CommentEntity;
import com.munhyu.board_back.entity.FavoriteEntity;
import com.munhyu.board_back.entity.ImageEntity;
import com.munhyu.board_back.entity.SearchLogEntity;
import com.munhyu.board_back.repository.*;
import com.munhyu.board_back.repository.resultSet.GetBoardResultSet;
import com.munhyu.board_back.repository.resultSet.GetCommentListResultSet;
import com.munhyu.board_back.repository.resultSet.GetFavoriteListResultSet;
import com.munhyu.board_back.service.BoardService;
import com.munhyu.board_back.service.FileService;

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
  private final SearchLogRepository searchLogRepository;
  private final FileService fileService;

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
  public ResponseEntity<? super GetBoardLatestListResponseDto> getBoardLatestList(int page) {

    Page<BoardListViewEntity> boardPage = null;

    try {

      boardPage = boardListViewRepository
          .findAll(PageRequest.of(page - 1, 10, Sort.by("writeDatetime").descending()));

    } catch (Exception e) {
      e.printStackTrace();
      return ResponseDto.databaseError();
    }

    return GetBoardLatestListResponseDto.success(boardPage);

  }

  @Override
  public ResponseEntity<? super GetBoardTop3ListResponseDto> getBoardTop3List() {

    List<BoardListViewEntity> boardListViewEntities = null;

    try {

      // 현재 날짜 기준으로 일주일 전
      Date beforeWeek = Date.from(Instant.now().minus(7, ChronoUnit.DAYS));
      SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
      String beforeWeekStr = dateFormat.format(beforeWeek);

      boardListViewEntities = boardListViewRepository
          .findTop3ByWriteDatetimeGreaterThanOrderByFavoriteCountDescCommentCountDescViewCountDescWriteDatetimeDesc(
              beforeWeekStr);

    } catch (Exception e) {
      e.printStackTrace();
      return ResponseDto.databaseError();
    }

    return GetBoardTop3ListResponseDto.success(boardListViewEntities);
  }

  @Override
  public ResponseEntity<? super GetSearchBoardResponseDto> getSearchBoardListResponseEntity(int page, String searchWord,
      String preSearchWord) {

    Page<BoardListViewEntity> boardPage = null;

    try {

      Pageable pageable = PageRequest.of(page - 1, 10, Sort.by("writeDatetime").descending());

      boardPage = boardListViewRepository
          .findByTitleContainingOrContentContaining(searchWord, searchWord, pageable);

      if (page == 1) {
        SearchLogEntity searchLogEntity = new SearchLogEntity(searchWord, preSearchWord, false);
        searchLogRepository.save(searchLogEntity);

        boolean relation = preSearchWord != null;
        if (relation) {
          searchLogEntity = new SearchLogEntity(preSearchWord, searchWord, relation);
          searchLogRepository.save(searchLogEntity);
        }

      }

    } catch (Exception e) {
      e.printStackTrace();
      return ResponseDto.databaseError();
    }

    return GetSearchBoardResponseDto.success(boardPage);

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
  public ResponseEntity<? super PatchBoardResponseDto> patchBoard(PatchBoardRequestDto dto, Integer boardNumber,
      String email) {

    try {
      boolean existedEmail = userRepository.existsByEmail(email);
      if (!existedEmail) {
        return PatchBoardResponseDto.notExistUser();
      }

      BoardEntity boardEntity = boardRepository.findByBoardNumber(boardNumber);
      if (boardEntity == null) {
        return PatchBoardResponseDto.notExistBoard();
      }

      boolean isWriter = boardEntity.getWriterEmail().equals(email);
      if (!isWriter) {
        return PatchBoardResponseDto.noPermission();
      }

      boardEntity.patchBoard(dto);
      boardRepository.save(boardEntity);

      List<ImageEntity> existingImages = imageRepository.findByBoardNumber(boardNumber);
      for (ImageEntity imageEntity : existingImages) {
        fileService.deleteImage(imageEntity.getImage());
      }

      imageRepository.deleteByBoardNumber(boardNumber);
      List<String> boardImageList = dto.getBoardImageList();

      List<ImageEntity> imageEntities = new ArrayList<>();
      for (String image : boardImageList) {
        ImageEntity imageEntity = new ImageEntity(boardNumber, image);
        imageEntities.add(imageEntity);
      }
      imageRepository.saveAll(imageEntities);

    } catch (Exception e) {
      e.printStackTrace();
      return ResponseDto.databaseError();
    }

    return PatchBoardResponseDto.success();
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

      List<ImageEntity> imageEntities = imageRepository.findByBoardNumber(boardNumber);
      for (ImageEntity imageEntity : imageEntities) {
        fileService.deleteImage(imageEntity.getImage());
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
