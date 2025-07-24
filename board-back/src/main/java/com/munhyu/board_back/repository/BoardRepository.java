package com.munhyu.board_back.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.munhyu.board_back.entity.BoardEntity;
import com.munhyu.board_back.repository.resultSet.GetBoardResultSet;

@Repository
public interface BoardRepository extends JpaRepository<BoardEntity, Integer> {

  @Query(value = "SELECT " +
      "  b.board_number AS boardNumber," +
      "  b.title AS title," +
      "  b.content AS content," +
      "  b.write_datetime AS writeDatetime," +
      "  b.writer_email AS writerEmail," +
      "  u.nickname AS writerNickname," +
      "  u.profile_image AS writerProfileImage" +
      "  FROM board b" +
      "  INNER JOIN user u" +
      "  ON b.writer_email = u.email" +
      "  WHERE b.board_number = ?1;", nativeQuery = true)
  GetBoardResultSet getBoard(Integer boardNumber);

  BoardEntity findByBoardNumber(Integer boardNumber);

  boolean existsByBoardNumber(Integer boardNumber);

}
