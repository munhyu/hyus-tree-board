import React from "react";
import "./style.css";
import BoardPagination from "components/BoardPagination";
import { useBoardPagination } from "hooks";
import BoardItem from "components/BoardItem";

//               component: 메인 화면 컴포넌트          //

export default function Main() {
  //               render: 메인 화면 컴포넌트 렌더링          //

  const { currentPage, setCurrentPage, boardList, totalPages } =
    useBoardPagination();

  return (
    <div>
      메인 화면
      <div className="board-list">
        {boardList.map((board, index) => (
          <div key={index} className="board-item">
            <BoardItem boardListItem={board} />
          </div>
        ))}
      </div>
      <BoardPagination
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
}
