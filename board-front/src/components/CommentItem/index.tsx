import React from "react";
import "./style.css";
import { CommentListItem } from "types/interface";

import defaultProfileImage from "assets/image/default-profile-image.png";

import dayjs from "dayjs";
import { useLoginUserStore } from "stores";
import { deleteCommentRequest } from "apis";
import { Cookies, useCookies } from "react-cookie";
import { DeleteCommentResponseDto } from "apis/response/board";
import ResponseDto from "apis/response/response.dto";

interface Props {
  commentListItem: CommentListItem;
}

//                 component: Comment List Item 컴포넌트
export default function CommentItem({ commentListItem }: Props) {
  //                props: Comment List Item              //
  const { commentNumber, nickname, profileImage, writeDatetime, content } =
    commentListItem;
  //                state: 로그인 유저 정보 상태          //
  const { loginUser } = useLoginUserStore();
  //          state: 쿠키 상태          //
  const [cookies, setCookie] = useCookies();

  //          function: 작성일 경과시간 함수          //
  const getElapsedTime = (writeDatetime: string) => {
    const now = dayjs().add(9, "hour"); // 한국 시간으로 변환
    const elapsedTime = now.diff(dayjs(writeDatetime));
    const seconds = Math.floor(elapsedTime / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}일 전`;
    if (hours > 0) return `${hours}시간 전`;
    if (minutes > 0) return `${minutes}분 전`;
    return `${seconds}초 전`;
  };
  //          function: deleteCommentResponse 처리 함수          //
  const deleteCommentResponse = (
    responseBody: DeleteCommentResponseDto | ResponseDto | null
  ) => {
    if (!responseBody) return;
    const { code } = responseBody;
    if (code === "NB") alert("존재하지 않는 게시물입니다.");
    if (code === "DBE") alert("데이터 베이스 오류입니다.");
    if (code === "NC") alert("존재하지 않는 댓글입니다.");
    if (code === "AF") alert("인증에 실패했습니다.");
    if (code === "NP") alert("권한이 없습니다.");
    if (code === "VF") alert("잘못된 접근입니다.");
    if (code !== "SU") {
      alert(commentNumber);
      alert(code);
      alert("댓글 삭제에 실패했습니다.");
      return;
    }

    window.location.reload();
  };

  //          event handler: 댓글 삭제 버튼 클릭 이벤트 처리 함수          //
  const onDeleteCommentHandler = () => {
    if (!loginUser || !cookies.accessToken) return;
    const accessToken = cookies.accessToken;
    deleteCommentRequest(commentNumber, accessToken).then(
      deleteCommentResponse
    );
  };

  //                render: Comment List Item 렌더링           //
  return (
    <div className="comment-list-item">
      <div className="comment-list-item-top">
        <div className="comment-list-item-profile-box">
          <div
            className="comment-list-item-profile-image"
            style={{
              backgroundImage: `url(${
                profileImage ? profileImage : defaultProfileImage
              })`,
            }}
          ></div>
        </div>
        <div className="comment-list-item-nickname">{nickname}</div>
        <div className="comment-list-item-divider">{"|"}</div>
        <div className="comment-list-item-time">
          {getElapsedTime(writeDatetime)}
        </div>
        {loginUser?.nickname === nickname && (
          <div className="icon-button" onClick={onDeleteCommentHandler}>
            <div className="icon close-icon"></div>
          </div>
        )}
      </div>
      <div className="comment-list-item-main">
        <div className="comment-list-item-content">{content}</div>
      </div>
    </div>
  );
}
