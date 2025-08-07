package com.munhyu.board_back.dto.object;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.domain.Page;

import com.munhyu.board_back.entity.BoardListViewEntity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class BoardListItem {

  private int boardNumber;
  private String title;
  private String content;
  private String boardTitleImage;
  private int favoriteCount;
  private int commentCount;
  private int viewCount;
  private String writeDatetime;
  private String writerNickname;
  private String writerProfileImage;

  public BoardListItem(BoardListViewEntity boardListViewEntity) {
    this.boardNumber = boardListViewEntity.getBoardNumber();
    this.title = boardListViewEntity.getTitle();
    this.content = boardListViewEntity.getContent();
    this.boardTitleImage = boardListViewEntity.getTitleImage();
    this.favoriteCount = boardListViewEntity.getFavoriteCount();
    this.commentCount = boardListViewEntity.getCommentCount();
    this.viewCount = boardListViewEntity.getViewCount();
    this.writeDatetime = boardListViewEntity.getWriteDatetime();
    this.writerNickname = boardListViewEntity.getWriterNickname();
    this.writerProfileImage = boardListViewEntity.getWriterProfileImage();
  }

  public static List<BoardListItem> getList(Page<BoardListViewEntity> entities) {
    List<BoardListItem> list = new ArrayList<>();
    for (BoardListViewEntity entity : entities.getContent()) {
      list.add(new BoardListItem(entity));
    }
    return list;
  }

  public static List<BoardListItem> getList(List<BoardListViewEntity> entities) {
    List<BoardListItem> list = new ArrayList<>();
    for (BoardListViewEntity entity : entities) {
      list.add(new BoardListItem(entity));
    }
    return list;
  }

}
