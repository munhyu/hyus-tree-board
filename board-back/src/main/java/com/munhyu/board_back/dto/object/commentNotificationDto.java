package com.munhyu.board_back.dto.object;

import com.munhyu.board_back.entity.CommentEntity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class commentNotificationDto {

  private int boardNumber;
  private int commentNumber;
  private String boardTitle;
  private String commentContent;
  private String commentWriterNickname;

  public commentNotificationDto(String boardTitle, String commentWriterNickname, CommentEntity commentEntity) {
    final int MAX_TITLE_LENGTH = 10;
    final int MAX_CONTENT_LENGTH = 20;

    this.boardNumber = commentEntity.getBoardNumber();
    this.commentNumber = commentEntity.getCommentNumber();
    this.commentWriterNickname = commentWriterNickname;

    if (boardTitle != null && boardTitle.length() > MAX_TITLE_LENGTH) {
      this.boardTitle = boardTitle.substring(0, MAX_TITLE_LENGTH) + "...";
    } else {
      this.boardTitle = boardTitle;
    }

    String commentContent = commentEntity.getContent();
    if (commentContent != null && commentContent.length() > MAX_CONTENT_LENGTH) {
      this.commentContent = commentContent.substring(0, MAX_CONTENT_LENGTH) + "...";
    } else {
      this.commentContent = commentContent;
    }
  }
}
