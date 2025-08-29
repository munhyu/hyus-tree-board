import React, {
  ChangeEvent,
  KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import "./style.css";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  AUTH_PATH,
  BOARD_DETAIL_PATH,
  BOARD_PATH,
  BOARD_UPDATE_PATH,
  BOARD_WRITE_PATH,
  MAIN_PATH,
  SEARCH_PATH,
  USER_PATH,
} from "constant";
import { useCookies } from "react-cookie";
import { useBoardStore, useLoginUserStore } from "stores";
import { fileUploadRequest, patchBoardRequest, postBoardRequest } from "apis";
import { PatchBoardRequestDto, PostBoardRequestDto } from "apis/request/board";
import ResponseDto from "apis/response/response.dto";
import {
  PatchBoardResponseDto,
  PostBoardResponseDto,
} from "apis/response/board";

//                      component: 헤더 레이아웃              //
export default function Header() {
  //               state: 로그인 유저 상태               //
  const { loginUser, setLoginUser, resetLoginUser } = useLoginUserStore();
  //                state: cookie 상태                   //
  const [cookies, setCookie] = useCookies();

  //               state: path 상태                   //
  const { pathname } = useLocation();
  //                      state: 페이지 상태                //
  const isAuthPage = pathname.startsWith(AUTH_PATH());
  const isMainPage = pathname === MAIN_PATH();
  const isSearchPage = pathname.startsWith(SEARCH_PATH(""));
  const isUserPage = pathname.startsWith(USER_PATH(""));
  const isBoardDetailPage = pathname.startsWith(
    BOARD_PATH() + "/" + BOARD_DETAIL_PATH("")
  );
  const isBoardWritePage = pathname.startsWith(
    BOARD_PATH() + "/" + BOARD_WRITE_PATH()
  );
  const isBoardUpdatePage = pathname.startsWith(
    BOARD_PATH() + "/" + BOARD_UPDATE_PATH("")
  );

  //                      function: 네비게이트 함수            //
  const navigate = useNavigate();

  //                  event handler: 로고 클릭 이벤트 처리 함수    //
  const onLogoClickHandler = () => {
    navigate(MAIN_PATH());
  };

  //                      component: 검색 버튼 컴포넌트       //
  const SearchButton = () => {
    //              state: 검색 버튼 요소 참조 상태              //
    const searchButtonRef = useRef<HTMLInputElement>(null);
    //              state: 검색 버튼 상태              //
    const [searchStatus, setSearchStatus] = useState<Boolean>(false);
    //              state: 검색어 상태              //
    const [word, setWord] = useState<string>("");
    // state: 검색어 path variable 상태 //
    const { searchWord, setSearchWord } = useParams();

    //          event handler:  검색어 입력 이벤트 처리 함수  //
    const onSearchWordChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
      setWord(e.target.value);
    };

    //          event handler:  검색어 키 이벤트 처리 함수  //
    const onSearchWordKeyDownHandler = (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key !== "Enter") return;
      if (!searchButtonRef.current) return;
      searchButtonRef.current.click();
    };

    //          event handler: 검색 아이콘 클릭 이벤트 처리 함수  //
    const onSearchButtonClickHandler = () => {
      if (!searchStatus) {
        setSearchStatus(!searchStatus);
        return;
      }
      if (word.trim() === "") {
        setSearchStatus(!searchStatus);
        return;
      }
      navigate(SEARCH_PATH(word));
    };

    // effect: 검색어 path variable 변경 될 때 마다 실행될 함수 //
    useEffect(() => {
      if (searchWord) {
        setWord(searchWord);
        setSearchStatus(true);
      }
    }, [searchWord]);

    if (!searchStatus) {
      //   render: 검색 버튼 컴포넌트 렌더링(클릭 false 상태)      //
      return (
        <div
          className="icon-button false-search-icon"
          onClick={onSearchButtonClickHandler}
        >
          <div className="icon search-light-icon"></div>
        </div>
      );
    }
    //   render: 검색 버튼 컴포넌트 렌더링(클릭 true 상태)      //
    return (
      <div className="header-search-input-box">
        <input
          className="header-search-input"
          type="text"
          placeholder="검색"
          value={word}
          onChange={onSearchWordChangeHandler}
          onKeyDown={onSearchWordKeyDownHandler}
        />
        <div
          ref={searchButtonRef}
          className="icon-button"
          onClick={onSearchButtonClickHandler}
        >
          <div className="icon search-light-icon"></div>
        </div>
      </div>
    );
  };

  // component: 마이페이지 버튼 컴포넌트    //
  const MypageButton = () => {
    // state: userEmail path variable 상태 //
    const { userEmail } = useParams();

    // event handler: 마이페이지 버튼 클릭 이벤트 처리 함수 //
    const onMypageButtonClickHandler = () => {
      if (!loginUser) return;
      navigate(USER_PATH(loginUser.email));
    };
    // event handler: 로그아웃 버튼 클릭 이벤트 처리 함수 //
    const onLogoutButtonClickHandler = () => {
      resetLoginUser();
      setCookie("accessToken", "", { path: MAIN_PATH(), expires: new Date() });
      navigate(MAIN_PATH());
    };
    // event handler: 로그인 버튼 클릭 이벤트 처리 함수 //
    const onLoginButtonClickHandler = () => {
      navigate(AUTH_PATH());
    };

    // render: 로그아웃 버튼 컴포넌트 렌더링    //
    if (loginUser && userEmail === loginUser?.email) {
      return (
        <div className="white-button" onClick={onLogoutButtonClickHandler}>
          {"로그아웃"}
        </div>
      );
    }
    if (loginUser) {
      // render: 마이페이지 버튼 컴포넌트 렌더링    //
      return (
        <div className="white-button" onClick={onMypageButtonClickHandler}>
          {"마이페이지"}
        </div>
      );
    }
    // render: 로그인 버튼 컴포넌트 렌더링    //
    return (
      <div className="black-button" onClick={onLoginButtonClickHandler}>
        {"로그인"}
      </div>
    );
  };

  // component: 업로드 버튼 컴포넌트   //
  const UploadButton = () => {
    //        state: 게시물 상태        //
    const { title, content, boardImageFileList, resetBoard } = useBoardStore();
    //        state: 게시물 번호 path variable 상태        //
    const { boardNumber } = useParams();

    //          function: post board response 처리 함수          //
    const postBoardResponse = (
      responseBody: PostBoardResponseDto | ResponseDto | null
    ) => {
      if (!responseBody) return;
      const { code } = responseBody;
      if (code === "AF" || code === "NU") navigate(AUTH_PATH());
      if (code === "VF") alert("게시물 작성에 실패했습니다.");
      if (code === "DBE") alert("데이터베이스 오류입니다.");
      if (code !== "SU") return;

      resetBoard();
      navigate(MAIN_PATH());
    };

    //          function: patch board response 처리 함수          //
    const patchBoardResponse = (
      responseBody: PatchBoardResponseDto | ResponseDto | null
    ) => {
      if (!responseBody) return;
      const { code } = responseBody;

      if (code === "AF" || code === "NU") navigate(AUTH_PATH());
      if (code === "NB") alert("존재하지 않는 게시물입니다.");
      if (code === "NP") alert("권한이 없습니다.");
      if (code === "VF") alert("게시물 수정에 실패했습니다.");
      if (code === "DBE") alert("데이터 베이스 오류입니다.");
      if (code !== "SU") return;

      resetBoard();
      if (!boardNumber) return;
      navigate(BOARD_PATH() + "/" + BOARD_DETAIL_PATH(boardNumber));
    };

    // event handler: 업로드 버튼 클릭 이벤트 처리 함수 //
    const onUploadButtonClickHandler = async () => {
      const accessToken = cookies.accessToken;
      if (!accessToken) return;

      const MAX_FILE_SIZE_BYTES = 20 * 1024 * 1024;

      for (const file of boardImageFileList) {
        if (file.size > MAX_FILE_SIZE_BYTES) {
          alert(`파일 크기가 너무 큽니다. 20MB 이하의 파일을 선택해주세요`);
          return;
        }
      }

      const boardImageList: string[] = [];
      for (const file of boardImageFileList) {
        const data = new FormData();
        data.append("file", file);

        const url = await fileUploadRequest(data);
        if (url) {
          boardImageList.push(url);
        }
      }

      if (isBoardWritePage) {
        const requestBody: PostBoardRequestDto = {
          title,
          content,
          boardImageList,
        };
        postBoardRequest(requestBody, accessToken).then(postBoardResponse);
      }

      if (isBoardUpdatePage) {
        const requestBody: PatchBoardRequestDto = {
          title,
          content,
          boardImageList,
        };
        if (!boardNumber) return;
        patchBoardRequest(boardNumber, requestBody, accessToken).then(
          patchBoardResponse
        );
      }
    };

    // render: 업로드 버튼 컴포넌트 렌더링    //
    if (title && content) {
      return (
        <div className="black-button" onClick={onUploadButtonClickHandler}>
          {isBoardWritePage ? "업로드" : "수정"}
        </div>
      );
    }
    // render: 업로드 불가 버튼 컴포넌트 렌더링    //
    return <div className="disable-button">{"업로드"}</div>;
  };

  //                 render: 헤더 레이아웃 렌더링          //
  return (
    <div id="header">
      <div className="header-container">
        <div className="header-left-box" onClick={onLogoClickHandler}>
          <div className="icon-box">
            <div className="icon logo-dark-icon"></div>
          </div>
          <div className="header-logo">{`Hyu's Tree`}</div>
        </div>
        <div className="header-right-box">
          {(isMainPage || isSearchPage || isBoardDetailPage || isUserPage) && (
            <SearchButton />
          )}
          {(isMainPage || isSearchPage || isBoardDetailPage || isUserPage) && (
            <MypageButton />
          )}
          {(isBoardWritePage || isBoardUpdatePage) && <UploadButton />}
        </div>
      </div>
    </div>
  );
}
