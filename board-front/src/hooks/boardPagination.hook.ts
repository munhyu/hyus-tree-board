import { getBoardLatestListRequest } from "../apis";
import ResponseDto from "../apis/response/response.dto";
import { GetBoardLatestListResponseDto } from "../apis/response/board";
import { useEffect, useState } from "react";
import { BoardListItem } from "../types/interface";

const useBoardPagination = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [boardList, setBoardList] = useState<BoardListItem[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  //          function: get board list response 처리 함수          //
  const getBoardListResponse = (
    responseBody: GetBoardLatestListResponseDto | ResponseDto | null
  ) => {
    if (!responseBody) return;
    const { code } = responseBody;
    if (code === "DBE") alert("데이터 베이스 오류입니다.");
    if (code !== "SU") {
      setIsLoading(false);
      return;
    }
    const { boardList, totalPages } =
      responseBody as GetBoardLatestListResponseDto;
    setBoardList(boardList);
    setTotalPages(totalPages);
    setIsLoading(false);
  };

  //          effect: 현재 페이지가 변경될 때 마다 실행될 함수          //
  useEffect(() => {
    if (isLoading) return;

    setIsLoading(true);
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
