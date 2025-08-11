import { getBoardSearchListRequest } from "apis";
import { ResponseDto } from "apis/response";
import { GetBoardSearchListResponseDto } from "apis/response/board";
import { useEffect, useState } from "react";
import { BoardListItem } from "types/interface";

const useSearchBoardPagination = (searchWord: string) => {
  //          state: 검색어 상태          //
  const [word, setWord] = useState<string>("");
  //          state: 이전 검색어 상태          //
  const [prevWord, setPrevWord] = useState<string | undefined>(undefined);
  //          state: 현재 페이지 상태          //
  const [currentPage, setCurrentPage] = useState<number>(1);
  //          state: 검색 게시물 리스트 상태          //
  const [boardList, setBoardList] = useState<BoardListItem[]>([]);
  //          state: 검색 게시물 개수 상태          //
  const [searchCount, setSearchCount] = useState<number>(0);
  //          state: 총 페이지 수 상태          //
  const [totalPages, setTotalPages] = useState<number>(1);
  //          state: 로딩 상태          //
  const [isLoading, setIsLoading] = useState<boolean>(false);

  //          function: get board search list response 처리 함수          //
  const getBoardSearchListResponse = (
    responseBody: GetBoardSearchListResponseDto | ResponseDto | null
  ) => {
    if (!responseBody) return;
    const { code } = responseBody;
    if (code === "DBE") alert("데이터 베이스 오류입니다.");
    if (code !== "SU") {
      setIsLoading(false);
      return;
    }

    const { searchList, totalPages } =
      responseBody as GetBoardSearchListResponseDto;
    console.log("word", word);
    console.log("currentPage", currentPage);
    console.log("prevWord", prevWord);
    setBoardList(searchList);
    setSearchCount(searchList.length);
    setTotalPages(totalPages);
    setIsLoading(false);
  };

  //          effect: 검색어가 변경될 때 마다 페이지 초기화          //
  useEffect(() => {
    if (!searchWord) return;
    if (searchWord !== word) {
      setPrevWord(word);
      setWord(searchWord);
      setCurrentPage(1);
    }
  }, [searchWord]);

  //          effect: 현재 페이지가 변경될 때 마다 실행될 함수          //
  useEffect(() => {
    if (isLoading) return;
    if (!word) return;

    setIsLoading(true);
    getBoardSearchListRequest(word, currentPage, prevWord).then(
      getBoardSearchListResponse
    );
  }, [currentPage, word]);

  return {
    currentPage,
    setCurrentPage,
    boardList,
    searchCount,
    totalPages,
  };
};

export default useSearchBoardPagination;
