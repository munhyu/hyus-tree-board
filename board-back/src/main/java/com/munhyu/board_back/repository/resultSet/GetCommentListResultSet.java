package com.munhyu.board_back.repository.resultSet;

public interface GetCommentListResultSet {

  int getCommentNumber();

  String getNickname();

  String getProfileImage();

  String getWriteDatetime();

  String getContent();
}
