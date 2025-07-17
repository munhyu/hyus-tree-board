import React from "react";
import "./style.css";

//         component: Footer 레이아웃          //
export default function Footer() {
  //         render: Footer 컴포넌트 렌더링         //
  return (
    <div id="footer" className="footer">
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-logo-box">
            <div className="icon-box">
              <div className="icon logo-light-icon"></div>
            </div>
            <div className="footer-logo-text">{"Hyu's Tree"}</div>
          </div>
          <div className="footer-link-box">
            {/* <div className="footer-email-link">{""}</div> */}
            <div className="icon-button">
              {/* <div className="icon insta-icon"></div> */}
            </div>
            <div className="icon-button">
              {/* <div className="icon naver-blog-icon"></div> */}
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="footer-copyright">
            {"Copyright © 2025 Munhyu. All Rights Reserved."}
          </div>
        </div>
      </div>
    </div>
  );
}
