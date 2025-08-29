import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import "./style.css";
import { useLoginUserStore } from "stores";
import { useUserBoardPagination } from "hooks";
import BoardPagination from "components/BoardPagination";
import BoardItem from "components/BoardItem";
import defaultProfileImage from "assets/image/default-profile-image.png";
import { useNavigate, useParams } from "react-router-dom";
import {
  AUTH_PATH,
  BOARD_PATH,
  BOARD_WRITE_PATH,
  MAIN_PATH,
  USER_PATH,
} from "constant";
import { compressAndResizeImage } from "utils";
import {
  fileUploadRequest,
  getUserRequest,
  patchNicknameRequest,
  patchProfileImageRequest,
} from "apis";
import {
  GetUserResponseDto,
  PatchNicknameResponseDto,
  PatchProfileImageResponseDto,
} from "apis/response/user";
import ResponseDto from "apis/response/response.dto";
import {
  PatchNicknameRequestDto,
  PatchProfileImageRequestDto,
} from "apis/request/user";
import { useCookies } from "react-cookie";

//               component: 유저 화면 컴포넌트          //

export default function User() {
  //          state: 유저 상태          //
  const { loginUser } = useLoginUserStore();
  //          state: 마이페이지 여부 상태          //
  const [isMyPage, setIsMyPage] = useState(false);
  //          state: userEmail 상태          //
  const { userEmail } = useParams();
  //          state: 쿠키 상태          //
  const [cookies, setCookie] = useCookies();

  //          function: 네비게이트 함수          //
  const navigate = useNavigate();

  //          component: 유저 화면 상단 컴포넌트          //
  const UserTop = () => {
    //          state: 이미지 파일 인풋 참조 상태          //
    const imageInputRef = useRef<HTMLInputElement>(null);
    //          state: 닉네임 변경 인풋 참조 상태          //
    const nicknameInputRef = useRef<HTMLInputElement>(null);
    //          state: 닉네임 상태          //
    const [nickname, setNickname] = useState<string>("");
    //          state: 닉네임 변경 여부 상태          //
    const [isNicknameEditing, setIsNicknameEditing] = useState(false);
    //          state: 변경 닉네임 상태          //
    const [editNickname, setEditNickname] = useState<string>("");
    //          state: 프로필 이미지 상태          //
    const [profileImage, setProfileImage] = useState<string | null>(null);

    //          function: file upload response 함수          //
    const fileUploadResponse = (
      profileImage: string | null,
      previousProfileImage: string | null
    ) => {
      if (!profileImage) return;

      const requestBody: PatchProfileImageRequestDto = {
        profileImage,
        previousProfileImage,
      };
      patchProfileImageRequest(requestBody, cookies.accessToken).then(
        patchProfileImageResponse
      );
    };
    //          function: patch profile image response 함수          //
    const patchProfileImageResponse = (
      responseBody: PatchProfileImageResponseDto | ResponseDto | null
    ) => {
      if (!responseBody) return;
      const { code } = responseBody;
      if (code === "AF") alert("인증에 실패했습니다.");
      if (code === "NU") alert("존재하지 않는 유저입니다.");
      if (code === "DBE") alert("데이터 베이스 오류입니다.");
      if (code !== "SU") return;

      if (!userEmail) return;
      getUserRequest(userEmail).then(getUserResponse);
    };
    //          function: get user response 처리 함수          //
    const getUserResponse = (
      responseBody: GetUserResponseDto | ResponseDto | null
    ) => {
      if (!responseBody) return;
      const { code } = responseBody;
      if (code === "NU") alert("존재하지 않는 유저입니다.");
      if (code === "DBE") alert("데이터 베이스 오류입니다.");
      if (code !== "SU") {
        navigate(MAIN_PATH());
        return;
      }
      const { nickname, profileImage } = responseBody as GetUserResponseDto;
      setNickname(nickname);
      setProfileImage(profileImage);
    };
    //          function: patch nickname response 함수          //
    const patchNicknameResponse = (
      responseBody: PatchNicknameResponseDto | ResponseDto | null
    ) => {
      if (!responseBody) return;
      const { code } = responseBody;
      if (code === "VF") alert("잘못된 접근입니다.");
      if (code === "AF") alert("인증에 실패했습니다.");
      if (code === "DN") alert("이미 사용중인 닉네임입니다.");
      if (code === "NP") alert("권한이 없습니다.");
      if (code === "NU") alert("존재하지 않는 유저입니다.");
      if (code === "DBE") alert("데이터 베이스 오류입니다.");
      if (code !== "SU") return;

      if (!userEmail) return;
      getUserRequest(userEmail).then(getUserResponse);
    };

    //          event handler: 프로필 박스 클릭 이벤트 처리 함수          //
    const onProfileBoxClickHandler = () => {
      if (!isMyPage) return;
      if (!imageInputRef.current) return;
      imageInputRef.current.click();
    };
    //          event handler: 프로필 이미지 변경 이벤트 처리 함수          //
    const onProfileImageChangeHandler = async (
      event: ChangeEvent<HTMLInputElement>
    ) => {
      if (!event.target.files || event.target.files.length === 0) return;
      const MAX_PROFILE_IMAGE_SIZE_BYTES = 20 * 1024 * 1024;

      const file = event.target.files[0];
      if (file.size > MAX_PROFILE_IMAGE_SIZE_BYTES) {
        alert(`파일 크기가 너무 큽니다. 20MB 이하의 파일을 선택해주세요`);
        return;
      }

      const compressedFile = await compressAndResizeImage(file, 200, 200, 0.8);
      const data = new FormData();
      data.append("file", compressedFile);
      fileUploadRequest(data).then((response) => {
        fileUploadResponse(response, profileImage);
      });
    };

    //          event handler: 닉네임 수정 버튼 클릭 이벤트 처리 함수          //
    const onNicknameEditButtonClickHandler = () => {
      if (!isNicknameEditing) {
        setIsNicknameEditing(true);
        setEditNickname(nickname);
        return;
      }

      setIsNicknameEditing(false);
      if (editNickname === nickname) return;
      const requestBody: PatchNicknameRequestDto = {
        nickname: editNickname,
      };
      patchNicknameRequest(requestBody, cookies.accessToken).then(
        patchNicknameResponse
      );
    };
    //          effect: is nickname editing 변경 시 실행될 함수          //
    useEffect(() => {
      if (isNicknameEditing) {
        nicknameInputRef.current?.focus();
      }
    }, [isNicknameEditing]);

    //          effect: userEmail path variable 변경 시 실행될 함수          //
    useEffect(() => {
      if (!userEmail) return;
      getUserRequest(userEmail).then(getUserResponse);

      if (!loginUser) return;
      if (userEmail === loginUser.email) {
        setIsMyPage(true);
        setNickname(loginUser.nickname);
        setProfileImage(loginUser.profileImage);
      }
    }, [userEmail]);
    //          render: 유저 화면 상단 컴포넌트 렌더링          //
    if (!userEmail) return <></>;
    return (
      <div id="user-top-wrapper">
        <div className="user-top-container">
          {isMyPage ? (
            <div
              className="user-top-my-profile-image-box"
              onClick={onProfileBoxClickHandler}
            >
              {profileImage !== null ? (
                <div
                  className="user-top-profile-image"
                  style={{
                    backgroundImage: `url(${profileImage})`,
                  }}
                ></div>
              ) : (
                <div className="user-top-my-profile-image-nothing">
                  <div className="icon-box-large">
                    <div className="icon image-box-white-light-icon"></div>
                  </div>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                ref={imageInputRef}
                onChange={onProfileImageChangeHandler}
              />
            </div>
          ) : (
            <div className="user-top-profile-image-box">
              <div
                className="user-top-profile-image"
                style={{
                  backgroundImage: `url(${
                    profileImage ? profileImage : defaultProfileImage
                  })`,
                }}
              ></div>
            </div>
          )}

          <div className="user-top-info-box">
            <div className="user-top-info-nickname-box">
              {isMyPage ? (
                <>
                  {isNicknameEditing ? (
                    <input
                      className="user-top-info-nickname-input"
                      type="text"
                      size={editNickname.length + 1}
                      value={editNickname}
                      onChange={(e) => setEditNickname(e.target.value)}
                      ref={nicknameInputRef}
                    />
                  ) : (
                    <div className="user-top-info-nickname">{nickname}</div>
                  )}
                  <div
                    className="icon-button"
                    onClick={onNicknameEditButtonClickHandler}
                  >
                    <div className="icon edit-light-icon"></div>
                  </div>
                </>
              ) : (
                <div className="user-top-info-nickname">{nickname}</div>
              )}
            </div>
            <div className="user-top-info-email">{userEmail}</div>
          </div>
        </div>
      </div>
    );
  };
  //          component: 유저 화면 하단 컴포넌트          //
  const UserBottom = () => {
    //          state: 검색 게시물 리스트 상태          //
    const { currentPage, setCurrentPage, boardList, totalPages, boardCount } =
      useUserBoardPagination(userEmail);
    //          event handler: 사이드 카드 클릭 이벤트 처리 함수          //
    const onSideCardClickHandler = () => {
      if (isMyPage) {
        navigate(BOARD_PATH() + "/" + BOARD_WRITE_PATH());
      } else {
        if (loginUser) {
          navigate(USER_PATH(loginUser.email));
        } else {
          navigate(AUTH_PATH());
        }
      }
    };
    //          render: 유저 화면 하단 컴포넌트 렌더링          //
    return (
      <div id="user-bottom-wrapper">
        <div className="user-bottom-container">
          <div className="user-bottom-title">
            {"게시물 "}
            <span className="emphasis">{boardCount}</span>
          </div>
          <div className="user-bottom-contents-box">
            {boardCount === 0 ? (
              <div className="user-bottom-contents-nothing">
                게시물이 존재하지 않습니다.
              </div>
            ) : (
              <div className="user-bottom-contents">
                {boardList &&
                  boardList.map((board, index) => (
                    <div key={index} className="board-item">
                      <BoardItem boardListItem={board} />
                    </div>
                  ))}
              </div>
            )}
            <div className="user-bottom-side-box">
              <div
                className="user-bottom-side-card"
                onClick={onSideCardClickHandler}
              >
                <div className="user-bottom-side-container">
                  {isMyPage ? (
                    <>
                      <div className="icon-box">
                        <div className="icon edit-light-icon"></div>
                      </div>
                      <div className="user-bottom-side-text">{"글쓰기"}</div>
                    </>
                  ) : (
                    <>
                      <div className="user-bottom-side-text">
                        {"내 게시물로 이동"}
                      </div>
                      <div className="icon-box">
                        <div className="icon arrow-right-icon"></div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="user-bottom-pagination-box">
            <BoardPagination
              currentPage={currentPage}
              totalPages={totalPages}
              setCurrentPage={setCurrentPage}
            />
          </div>
        </div>
      </div>
    );
  };

  //               render: 유저 화면 컴포넌트 렌더링          //

  return (
    <div>
      <UserTop />
      <UserBottom />
    </div>
  );
}
