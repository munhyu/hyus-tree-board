import React, { useEffect, useState } from "react";
import "./style.css";
import { useNavigate, useParams } from "react-router-dom";
import ResponseDto from "apis/response/response.dto";
import BoardItem from "components/BoardItem";
import { useSearchBoardPagination } from "hooks";
import { SEARCH_PATH } from "constant";
import BoardPagination from "components/BoardPagination";
import { GetRelationListResponseDto } from "apis/response/search";
import { getRelationListRequest } from "apis";

//               component: 검색 화면 컴포넌트          //

export default function Search() {
  //          function: 네비게이트 함수          //
  const navigate = useNavigate();

  //          state: searchWord path variable 상태          //
  const { searchWord } = useParams();

  //          state: 검색 게시물 리스트 상태          //
  const { currentPage, setCurrentPage, boardList, searchCount, totalPages } =
    useSearchBoardPagination(searchWord || "");
  //          state: 연관 검색어 리스트 상태          //
  const [relationWordList, setRelationWordList] = useState<string[]>([]);

  //          event handler: 연관 검색어 클릭 이벤트 처리 함수          //
  const onRelationWordClickHandler = (word: string) => {
    navigate(SEARCH_PATH(word));
  };

  //          function: get relation list response 처리 함수          //
  const getRelationListResponse = (
    responseBody: GetRelationListResponseDto | ResponseDto | null
  ) => {
    if (!responseBody) return;
    const { code } = responseBody;
    if (code === "DBE") alert("데이터 베이스 오류입니다.");
    if (code !== "SU") return;
    const { relativeWordList } = responseBody as GetRelationListResponseDto;
    setRelationWordList(relativeWordList);
  };

  //          effect: 첫 마운트 시 실행될 함수          //
  useEffect(() => {
    if (!searchWord) return;
    getRelationListRequest(searchWord).then(getRelationListResponse);
  }, [searchWord]);

  //               render: 검색 화면 컴포넌트 렌더링          //
  if (!searchWord) return <div>검색어가 없습니다.</div>;
  return (
    <div id="search-wrapper">
      <div className="search-container">
        <div className="search-title-box">
          <div className="search-title">
            <span className="emphasis">{searchWord}</span>
            {"에 대한 검색 결과입니다. "}
            <span className="emphasis">{searchCount}</span>
          </div>
        </div>
        <div className="search-contents-box">
          {searchCount === 0 ? (
            <div className="search-contents-nothing">
              {"검색 결과가 없습니다."}
            </div>
          ) : (
            <div className="search-contents">
              {boardList &&
                boardList.map((board, index) => (
                  <div key={index} className="board-item">
                    <BoardItem boardListItem={board} />
                  </div>
                ))}
            </div>
          )}

          <div className="search-relation-word-box">
            <div className="search-relation-word-card-box">
              <div className="search-relation-word-card-container">
                <div className="search-relation-word-card-title">
                  {"연관 검색어"}
                </div>
                {relationWordList && relationWordList.length === 0 ? (
                  <div className="search-relation-word-card-contents-nothing">
                    {"연관 검색어가 없습니다."}
                  </div>
                ) : (
                  <div className="search-relation-word-card-contents">
                    {relationWordList &&
                      relationWordList.map((word, index) => (
                        <div
                          className="word-badge"
                          key={index}
                          onClick={() => onRelationWordClickHandler(word)}
                        >
                          {word}
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        {searchCount !== 0 && (
          <div className="search-pagination-box">
            <BoardPagination
              currentPage={currentPage}
              totalPages={totalPages}
              setCurrentPage={setCurrentPage}
            />
          </div>
        )}
      </div>
    </div>
  );
}
