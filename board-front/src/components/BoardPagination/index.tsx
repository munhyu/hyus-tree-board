import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import "./style.css";

//          interface: 페이지네이션 컴포넌트 Properties          //
interface Props {
  currentPage: number;
  totalPages: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
}

//          component: 보드페이지네이션 컴포넌트          //
export default function BoardPagination(props: Props) {
  //          state: Properties          //
  const { currentPage, setCurrentPage, totalPages } = props;

  //          state: 현재 섹션 상태          //
  const [currentSection, setCurrentSection] = useState<number>(1);
  //          state: 보여줄 페이지 번호 리스트 상태          //
  const [viewPageList, setViewPageList] = useState<number[]>([1]);

  //          event handler: 페이지 번호 클릭 이벤트 처리 함수          //
  const onPageClickHandler = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  //          event handler: 이전 클릭 이벤트 처리 함수          //
  const onPrevClickHandler = () => {
    if (currentSection <= 1) return;
    setCurrentPage((currentSection - 1) * 10);
    setCurrentSection(currentSection - 1);
  };
  //          event handler: 다음 클릭 이벤트 처리 함수          //
  const onNextClickHandler = () => {
    const totalSections = Math.ceil(totalPages / 10);

    if (currentSection >= totalSections) return;
    setCurrentPage(currentSection * 10 + 1);
    setCurrentSection(currentSection + 1);
  };
  //          effect: 현재 섹션이나 총 페이지 수가 변경될 때 마다 실행될 함수          //
  useEffect(() => {
    const newViewPageList = [];
    const startPage = (currentSection - 1) * 10 + 1;
    const endPage = Math.min(startPage + 9, totalPages);

    for (let i = startPage; i <= endPage; i++) {
      newViewPageList.push(i);
    }
    setViewPageList(newViewPageList);
  }, [currentSection, totalPages]);

  //          render: 페이지네이션 컴포넌트 렌더링          //
  return (
    <div id="pagination-wrapper">
      <div className="pagination-change-link-box">
        <div className="icon-box-small">
          <div className="icon left-icon"></div>
        </div>
        <div
          className="pagination-change-link-text"
          onClick={onPrevClickHandler}
        >
          {"이전"}
        </div>
      </div>
      <div className="pagination-divider">{"|"}</div>

      {viewPageList.map((page) =>
        page === currentPage ? (
          <div className="pagination-text-active">{page}</div>
        ) : (
          <div
            className="pagination-text"
            onClick={() => onPageClickHandler(page)}
          >
            {page}
          </div>
        )
      )}

      <div className="pagination-divider">{"|"}</div>
      <div className="pagination-change-link-box">
        <div
          className="pagination-change-link-text"
          onClick={onNextClickHandler}
        >
          {"다음"}
        </div>
        <div className="icon-box-small">
          <div className="icon right-icon"></div>
        </div>
      </div>
    </div>
  );
}
