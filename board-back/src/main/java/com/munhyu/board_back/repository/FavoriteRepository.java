package com.munhyu.board_back.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.munhyu.board_back.entity.FavoriteEntity;
import com.munhyu.board_back.entity.primaryKey.FavoritePk;
import com.munhyu.board_back.repository.resultSet.GetFavoriteListResultSet;

@Repository
public interface FavoriteRepository extends JpaRepository<FavoriteEntity, FavoritePk> {

  FavoriteEntity findByBoardNumberAndUserEmail(Integer boardNumber, String userEmail);

  @Query(value = "SELECT " +
      "  u.email AS email," +
      "  u.nickname AS nickname," +
      "  u.profile_image AS profileImage" +
      " FROM favorite AS f" +
      " INNER JOIN user AS u" +
      " ON f.user_email = u.email" +
      " WHERE f.board_number = ?1", nativeQuery = true)
  List<GetFavoriteListResultSet> getFavoriteList(Integer boardNumber);

}
