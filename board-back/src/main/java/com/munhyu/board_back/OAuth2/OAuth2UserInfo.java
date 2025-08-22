package com.munhyu.board_back.OAuth2;

public interface OAuth2UserInfo {

  String getProvider();

  String getProviderId();

  String getEmail();

  String getName();

}
