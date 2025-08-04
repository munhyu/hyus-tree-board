import { useEffect, useState } from "react";

const usePagination = <T>(countPerPage: number) => {
  //          state: 전체 객체 리스트 상태          //
  const [totalList, setTotalList] = useState<T[]>([]);
  //          state: 보여줄 객체 리스트 상태          //
  const [viewList, setViewList] = useState<T[]>([]);
  //          state: 현재 페이지 번호 상태          //
  const [currentPage, setCurrentPage] = useState<number>(1);
  //          state: 전체 페이지 번호 리스트 상태          //
  const [totalPageList, setTotalPageList] = useState<number[]>([1]);
  //          state: 보여줄 페이지 번호 리스트 상태          //
  const [viewPageList, setViewPageList] = useState<number[]>([1]);
  //          state: 현재 섹션 상태          //
  const [currentSection, setCurrentSection] = useState<number>(1);
  //          state: 전체 섹션 상태          //
  const [totalSection, setTotalSection] = useState<number>(1);

  //          function: 보여줄 객체 리스트 추출 함수          //
  const setView = () => {
    const startIndex = countPerPage * (currentPage - 1);
    const endIndex =
      totalList.length > countPerPage * currentPage
        ? countPerPage * currentPage
        : totalList.length;

    const viewList = totalList.slice(startIndex, endIndex);
    setViewList(viewList);
  };

  //          function: 보여줄 페이지 번호 리스트 추출 함수          //
  const setViewPage = () => {
    const startIndex = 10 * (currentSection - 1);
    const endIndex =
      totalPageList.length > 10 * currentSection
        ? 10 * currentSection
        : totalPageList.length;

    const viewPageList = totalPageList.slice(startIndex, endIndex);
    setViewPageList(viewPageList);
  };

  //          effect: total list가 변경될 때 마다 실행될 함수          //
  useEffect(() => {
    const totalPage = Math.ceil(totalList.length / countPerPage);
    const totalPageList: number[] = [];
    for (let i = 1; i <= totalPage; i++) {
      totalPageList.push(i);
    }
    setTotalPageList(totalPageList);

    const totalSection = Math.ceil(totalPage / 10);
    setTotalSection(totalSection);

    setCurrentPage(1);
    setCurrentSection(1);

    setView();
    setViewPage();
  }, [totalList]);
  //          effect: current page가 변경될 때 마다 실행될 함수          //
  useEffect(() => {
    setView();
  }, [currentPage]);
  //          effect: current section이 변경될 때 마다 실행될 함수          //
  useEffect(() => {
    setViewPage();
  }, [currentSection]);

  return {
    currentPage,
    setCurrentPage,
    currentSection,
    setCurrentSection,
    viewList,
    viewPageList,
    totalSection,
    setTotalList,
  };
};

export default usePagination;
