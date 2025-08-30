import React, { useEffect, useState } from "react";
import "./style.css";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useLoginUserStore } from "../../stores";
import type { CommentNotification } from "../../types/interface";
import { useNavigate } from "react-router-dom";
import { BOARD_DETAIL_PATH, BOARD_PATH } from "../../constant";

//          component: 코멘트 알림 컴포넌트          //

export default function CommentNotificationLayout() {
  //          function: 네비게이트 함수          //
  const navigate = useNavigate();
  //          state: loginUser 상태          //
  const { loginUser } = useLoginUserStore();
  //          state: STOMP 클라이언트 상태          //
  const [stompClient, setStompClient] = useState<Client | null>(null);
  //          state: 알림 수신 데이터 상태          //
  const [notifications, setNotifications] = useState<CommentNotification[]>([]);
  //              event handler: 댓글 알림 클릭 이벤트 처리 함수   //
  const onCommentNotificationClickHandler = (
    notification: CommentNotification
  ) => {
    if (notification) {
      navigate(
        BOARD_PATH() + "/" + BOARD_DETAIL_PATH(notification.boardNumber)
      );
    }
  };
  //          event handler:  알림 닫기 이벤트 처리 함수          //
  const onNotificationCloseHandler = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    setNotifications((prev) => {
      const updated = [...prev];
      updated.splice(index, 1);
      return updated;
    });
  };

  //          effect: loginUser 변경될 때 마다 실행될 함수          //
  useEffect(() => {
    if (!loginUser) {
      if (stompClient && stompClient.connected) {
        stompClient.deactivate();
      }
      setStompClient(null);
      return;
    }

    // 로그인 한 상태면 토픽 구독
    const DOMAIN = process.env.REACT_APP_API_BASE_URL;
    const client = new Client({
      webSocketFactory: () => new SockJS(`${DOMAIN}/hyustree`),

      // 배포시에는 디버그 비활성화
      debug: (str: string) => {
        // console.log("STOMP DEBUG: " + str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    // 연결 성공 시 실행
    client.onConnect = (frame) => {
      // 로그인 유저의 이메일로 된 알림 토픽 구독
      client.subscribe(
        `/user/${loginUser.email}/topic/comment_notification`,
        (message) => {
          try {
            const notificationData: CommentNotification = JSON.parse(
              message.body
            );
            // console.log("알림 수신:", notificationData);
            // 3개까지만 알림을 유지
            setNotifications((prev) => {
              const updated = [...prev, notificationData];
              return updated.slice(-3);
            });
          } catch (error) {
            console.error("메시지 파싱 오류:", error);
          }
        }
      );
    };

    client.activate();
    setStompClient(client);

    // 컴포넌트가 언마운트되거나 의존성이 변경될 때 연결 해제
    return () => {
      if (client.connected) {
        client.deactivate();
      }
    };
  }, [loginUser]);

  //          render: 코멘트 알림 컴포넌트 렌더링          //
  if (!loginUser) return null;
  return (
    <div id="comment-notification">
      <div className="comment-notification-container">
        {notifications.map((notification, index) => (
          <div
            key={notification.commentNumber}
            className="comment-notification-item"
            onClick={() => onCommentNotificationClickHandler(notification)}
          >
            <div className="comment-notification-board-title">
              {notification.boardTitle}
            </div>
            <div className="comment-notification-writer-nickname">
              {notification.commentWriterNickname}
            </div>
            <div className="comment-notification-content">
              {notification.commentContent}
            </div>
            <div>
              <div
                className="icon-button notification-close"
                onClick={(e) => {
                  onNotificationCloseHandler(e, index);
                }}
              >
                <div className="icon close-icon"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
