import { getBoardLatestListRequest } from "apis";
import { ResponseDto } from "apis/response";
import { GetBoardLatestListResponseDto } from "apis/response/board";
import { useEffect, useState } from "react";
import { BoardListItem } from "types/interface";

const useBoardPagination = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [boardList, setBoardList] = useState<BoardListItem[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);

  //          function: get board list response 처리 함수          //
  const getBoardListResponse = (
    responseBody: GetBoardLatestListResponseDto | ResponseDto | null
  ) => {
    if (!responseBody) return;
    const { code } = responseBody;
    if (code === "DBE") alert("데이터 베이스 오류입니다.");
    if (code !== "SU") {
      return;
    }

    if ("boardList" in responseBody) {
      setBoardList(responseBody.boardList);
      setTotalPages(responseBody.totalPages);
    }
  };

  //          effect: 현재 페이지가 변경될 때 마다 실행될 함수          //
  useEffect(() => {
    getBoardLatestListRequest(currentPage).then(getBoardListResponse);
  }, [currentPage]);

  return {
    currentPage,
    setCurrentPage,
    boardList,
    totalPages,
  };
};

export default useBoardPagination;
