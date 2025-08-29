import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useCookies } from "react-cookie";
import { AUTH_PATH, MAIN_PATH } from "../../constant";
import "./style.css";

//          component: OAuth2 리다이렉트 처리 컴포넌트          //
export default function OAuth2Redirect() {
  //          state: URLSearchParams 상태          //
  const [searchParams] = useSearchParams();
  //          state: 쿠키 상태          //
  const [cookies, setCookie] = useCookies();
  //          state: 네비게이터 상태          //
  const navigator = useNavigate();

  useEffect(() => {
    //         description: URL 파라미터에서 토큰 추출          //
    const token = searchParams.get("token");
    const expirationTime = searchParams.get("expirationTime");
    const error = searchParams.get("error");

    if (error) {
      //         description: 에러가 있는 경우 알림 후 로그인 페이지로 이동          //
      alert("소셜 로그인에 실패했습니다. 다시 시도해주세요.");
      console.log(`소셜 로그인 에러: ${error}`);
      navigator(AUTH_PATH());
      return;
    }

    if (token && expirationTime) {
      //          description: 토큰을 쿠키에 저장 후 메인 페이지로 이동          //
      const now = new Date().getTime();
      const expires = new Date(now + parseInt(expirationTime) * 1000);

      setCookie("accessToken", token, {
        expires,
        path: MAIN_PATH(),
      });

      navigator(MAIN_PATH());
    } else {
      //         description: 토큰이 없는 경우 로그인 페이지로 이동          //
      alert("로그인에 실패했습니다.");
      navigator(AUTH_PATH());
    }
  }, [searchParams, setCookie, navigator]);

  //          render: 로딩 화면          //
  return <div className="loading">로그인 처리 중...</div>;
}
