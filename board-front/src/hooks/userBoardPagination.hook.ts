import { getBoardLatestListRequest, getUserBoardListRequest } from "apis";
import { ResponseDto } from "apis/response";
import {
  GetBoardLatestListResponseDto,
  GetUserBoardListResponseDto,
} from "apis/response/board";
import { useEffect, useState } from "react";
import { useLoginUserStore } from "stores";
import { BoardListItem } from "types/interface";

const useUserBoardPagination = (userEmail: string | undefined) => {
  //          state: 유저 상태          //
  const { loginUser } = useLoginUserStore();
  //          state: 현재 페이지 상태          //
  const [currentPage, setCurrentPage] = useState<number>(1);
  //          state: 게시물 리스트 상태          //
  const [boardList, setBoardList] = useState<BoardListItem[]>([]);
  //          state: 게시물 개수 상태          //
  const [boardCount, setBoardCount] = useState<number>(0);
  //          state: 총 페이지 수 상태          //
  const [totalPages, setTotalPages] = useState<number>(1);
  //          state: 로딩 상태          //
  const [isLoading, setIsLoading] = useState<boolean>(false);

  //          function: get user board list response 처리 함수          //
  const getUserBoardListResponse = (
    responseBody: GetUserBoardListResponseDto | ResponseDto | null
  ) => {
    if (!responseBody) return;
    const { code } = responseBody;
    if (code === "DBE") alert("데이터 베이스 오류입니다.");
    if (code === "NU") alert("존재하지 않는 유저입니다.");
    if (code !== "SU") {
      setIsLoading(false);
      return;
    }
    const { userBoardList, totalPages } =
      responseBody as GetUserBoardListResponseDto;
    setBoardList(userBoardList);
    setBoardCount(userBoardList.length);
    setTotalPages(totalPages);
    setIsLoading(false);
  };
  //          effect: 유저가 변경될 때 마다 페이지 초기화          //
  useEffect(() => {
    if (!userEmail) return;
    setCurrentPage(1);
  }, [userEmail]);

  //          effect: 현재 페이지가 변경될 때 마다 실행될 함수          //
  useEffect(() => {
    if (!userEmail) return;
    if (isLoading) return;
    setIsLoading(true);
    getUserBoardListRequest(userEmail, currentPage).then(
      getUserBoardListResponse
    );
  }, [currentPage]);

  return {
    currentPage,
    setCurrentPage,
    boardList,
    boardCount,
    totalPages,
  };
};

export default useUserBoardPagination;
