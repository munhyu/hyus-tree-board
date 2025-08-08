import React, { useEffect, useState } from "react";
import "./style.css";
import BoardPagination from "components/BoardPagination";
import { useBoardPagination } from "hooks";
import BoardItem from "components/BoardItem";
import Top3Item from "components/Top3Item";
import { BoardListItem } from "types/interface";
import { useNavigate } from "react-router-dom";
import { SEARCH_PATH } from "constant";
import { getBoardTop3ListRequest, getPopularListRequest } from "apis";
import { GetBoardTop3ListResponseDto } from "apis/response/board";
import { ResponseDto } from "apis/response";
import { GetPopularListResponseDto } from "apis/response/search";

//               component: 메인 화면 컴포넌트          //

export default function Main() {
  //          component: 메인 화면 상단 컴포넌트          //
  const MainTop = () => {
    //          state: 주간 top3 게시물 리스트 상태          //
    const [top3BoardList, setTop3BoardList] = useState<BoardListItem[]>([]);

    //          function: get board top3 list response 처리 함수          //
    const getBoardTop3ListResponse = (
      responseBody: GetBoardTop3ListResponseDto | ResponseDto | null
    ) => {
      if (!responseBody) return;
      const { code } = responseBody;
      if (code === "DBE") alert("데이터 베이스 오류입니다.");
      if (code !== "SU") return;

      const { top3List } = responseBody as GetBoardTop3ListResponseDto;
      setTop3BoardList(top3List);
    };

    //          effect: 첫 마운트 시 실행될 함수          //
    useEffect(() => {
      getBoardTop3ListRequest().then(getBoardTop3ListResponse);
    }, []);

    //          render: 메인 화면 상단 컴포넌트 렌더링          //
    return (
      <div id="main-top-wrapper">
        <div className="main-top-container">
          <div className="main-top-title">
            {"Hyu's Tree에 오신 것을 환영합니다."}
          </div>
          <div className="main-top-contents-box">
            <div className="main-top-contents-title">{"주간 TOP3"}</div>
            <div className="main-top-contents">
              {top3BoardList.map((top3ListItem, index) => (
                <Top3Item key={index} top3ListItem={top3ListItem} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };
  //          component: 메인 화면 하단 컴포넌트          //
  const MainBottom = () => {
    //          function: 네비게이트 함수          //
    const navigate = useNavigate();
    //          state: 최신 게시물 리스트 상태          //
    const { currentPage, setCurrentPage, boardList, totalPages } =
      useBoardPagination();
    //          state: 인기 검색어 리스트 상태          //
    const [popularWordList, setPopularWordList] = useState<string[]>([]);

    //          function: get popular list response 처리 함수          //
    const getPopularListResponse = (
      responseBody: GetPopularListResponseDto | ResponseDto | null
    ) => {
      if (!responseBody) return;
      const { code } = responseBody;
      if (code === "DBE") alert("데이터 베이스 오류입니다.");
      if (code !== "SU") return;

      const { popularWordList } = responseBody as GetPopularListResponseDto;
      setPopularWordList(popularWordList);
    };
    //          event handler: 인기 검색어 클릭 이벤트 처리 함수          //
    const onPopularWordClickHandler = (word: string) => {
      navigate(SEARCH_PATH(word));
    };

    //          effect: 첫 마운트 시 실행될 함수          //
    useEffect(() => {
      getPopularListRequest().then(getPopularListResponse);
    }, []);

    //          render: 메인 화면 하단 컴포넌트 렌더링          //
    return (
      <div id="main-bottom-wrapper">
        <div className="main-bottom-container">
          <div className="main-bottom-title"></div>
          <div className="main-bottom-contents-box">
            <div className="main-bottom-latest-contents">
              {boardList.map((board, index) => (
                <div key={index} className="board-item">
                  <BoardItem boardListItem={board} />
                </div>
              ))}
            </div>
            <div className="main-bottom-popular-word-box">
              <div className="main-bottom-popular-word-card">
                <div className="main-bottom-popular-word-card-box">
                  <div className="main-bottom-popular-word-card-title">
                    {"인기 검색어"}
                  </div>
                  <div className="main-bottom-popular-word-card-contents">
                    {popularWordList.map((word, index) => (
                      <div
                        className="word-badge"
                        key={index}
                        onClick={() => onPopularWordClickHandler(word)}
                      >
                        {word}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="main-bottom-pagination-box">
            <BoardPagination
              currentPage={currentPage}
              totalPages={totalPages}
              setCurrentPage={setCurrentPage}
            />
          </div>
        </div>
      </div>
    );
  };

  //               render: 메인 화면 컴포넌트 렌더링          //

  return (
    <div>
      <MainTop />
      <MainBottom />
    </div>
  );
}
