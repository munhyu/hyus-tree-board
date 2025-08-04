import React, { Dispatch, SetStateAction } from "react";
import "./style.css";

//          interface: 페이지네이션 컴포넌트 Properties          //
interface Props {
  currentPage: number;
  currentSection: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  setCurrentSection: Dispatch<SetStateAction<number>>;

  viewPageList: number[];
  totalSection: number;
}

//          component: 페이지네이션 컴포넌트          //
export default function Pagination(props: Props) {
  //          state: Properties          //
  const {
    currentPage,
    currentSection,
    setCurrentPage,
    setCurrentSection,
    viewPageList,
    totalSection,
  } = props;

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
    if (currentSection >= totalSection) return;
    setCurrentPage(currentSection * 10 + 1);
    setCurrentSection(currentSection + 1);
  };

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
