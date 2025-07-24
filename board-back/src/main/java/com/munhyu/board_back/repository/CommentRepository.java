package com.munhyu.board_back.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.munhyu.board_back.entity.CommentEntity;
import com.munhyu.board_back.repository.resultSet.GetCommentListResultSet;

@Repository
public interface CommentRepository extends JpaRepository<CommentEntity, Integer> {

  CommentEntity findByCommentNumber(Integer commentNumber);

  @Query(value = "SELECT u.nickname AS nickname, "
      + "u.profile_image AS profileImage, "
      + "c.write_datetime AS writeDatetime, "
      + "c.content AS content "
      + "FROM comment AS c "
      + "INNER JOIN user AS u ON c.user_email = u.email "
      + "WHERE c.board_number = ?1 "
      + "ORDER BY c.write_datetime DESC", nativeQuery = true)
  List<GetCommentListResultSet> getCommentList(Integer boardNumber);

}
