import React, { ChangeEvent, KeyboardEvent, useRef, useState } from "react";
import "./style.css";
import InputBox from "../../components/InputBox";
import { SignInRequestDto, SignUpRequestDto } from "../../apis/request/auth";
import { signInRequest, signUpRequest } from "../../apis";
import { SignInResponseDto, SignUpResponseDto } from "../../apis/response/auth";
import ResponseDto from "../../apis/response/response.dto";
import { useCookies } from "react-cookie";
import { MAIN_PATH } from "../../constant";
import { useNavigate } from "react-router-dom";

//          component: 인증 화면 컴포넌트          //
export default function Authentication() {
  //          state: 화면 상태          //
  const [view, setView] = useState<"sign-in" | "sign-up">("sign-in");

  //          state: 쿠키 상태          //
  const [cookies, setCookie] = useCookies();

  //          function: 페이지 이동 함수          //
  const navigator = useNavigate();

  //          component: 개인정보 동의 팝업 컴포넌트          //
  const PrivacyPolicyModal = ({
    isOpen,
    onClose,
    onAgree,
  }: {
    isOpen: boolean;
    onClose: () => void;
    onAgree: () => void;
  }) => {
    if (!isOpen) return null;

    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2>개인정보 수집 및 이용 동의</h2>
            <button className="modal-close-button" onClick={onClose}>
              ×
            </button>
          </div>
          <div className="modal-body">
            <div className="privacy-policy-content">
              <h3>1. 개인정보의 수집 및 이용 목적</h3>
              <p>
                회사는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는
                개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용
                목적이 변경되는 경우에는 개인정보보호법 제18조에 따라 별도의
                동의를 받는 등 필요한 조치를 이행할 예정입니다.
              </p>

              <h3>2. 수집하는 개인정보의 항목</h3>
              <ul>
                <li>필수항목: 이메일, 비밀번호, 닉네임</li>
                <li>선택항목: 프로필 이미지</li>
                <li>자동수집항목: 접속 IP, 쿠키, 방문 기록, 기기 정보</li>
              </ul>

              <h3>3. 개인정보의 처리 및 보유기간</h3>
              <p>
                ① 회사는 정보주체로부터 개인정보를 수집할 때 동의받은 개인정보
                보유·이용기간 또는 법령에 따른 개인정보 보유·이용기간 내에서
                개인정보를 처리·보유합니다.
              </p>
              <p>② 각각의 개인정보 처리 및 보유 기간은 다음과 같습니다.</p>
              <ul>
                <li>
                  이용자의 삭제 요청 시까지(단, 관련 법령에 따라 일정 기간 보관
                  가능)
                </li>
              </ul>

              <h3>4. 개인정보의 제3자 제공</h3>
              <p>
                회사는 정보주체의 동의, 법률의 특별한 규정 등 개인정보보호법
                제17조에 해당하는 경우에만 개인정보를 제3자에게 제공합니다.
              </p>

              <h3>5. 정보주체의 권리·의무 및 행사방법</h3>
              <p>
                이용자는 개인정보주체로서 다음과 같은 권리를 행사할 수 있습니다.
              </p>
              <ul>
                <li>개인정보 열람요구권</li>
                <li>개인정보 정정·삭제요구권</li>
                <li>개인정보 처리정지 요구권</li>
              </ul>
              <p>
                위 권리는 이메일을 통해 요청할 수 있으며, 회사는 지체 없이
                처리합니다.
              </p>
            </div>
          </div>
          <div className="modal-footer">
            <button className="modal-disagree-button" onClick={onClose}>
              동의하지 않음
            </button>
            <button className="modal-agree-button" onClick={onAgree}>
              동의함
            </button>
          </div>
        </div>
      </div>
    );
  };

  //          component: sign in card 컴포넌트          //
  const SignInCard = () => {
    //          state: 이메일 요소 참조 상태          //
    const emailRef = useRef<HTMLInputElement | null>(null);
    //          state: 비밀번호 요소 참조 상태          //
    const passwordRef = useRef<HTMLInputElement | null>(null);
    //          state: 이메일 상태          //
    const [email, setEmail] = useState<string>("");
    //          state: 비밀번호 상태          //
    const [password, setPassword] = useState<string>("");
    //          state: 비밀번호 타입 상태          //
    const [passwordType, setPasswordType] = useState<"text" | "password">(
      "password"
    );
    //          state: 비밀번호 버튼 아이콘 상태          //
    const [passwordButtonIcon, setPasswordButtonIcon] = useState<
      "eye-light-off-icon" | "eye-light-on-icon"
    >("eye-light-off-icon");

    //          state: 에러 상태          //
    const [error, setError] = useState<boolean>(false);

    //          function: sign in response 처리 함수          //
    const signInResponse = (
      responseBody: SignInResponseDto | ResponseDto | null
    ) => {
      if (!responseBody) {
        alert("네크워크 이상입니다.");
        return;
      }
      const { code } = responseBody;
      if (code === "DBE") alert("데이터베이스 오류입니다.");
      if (code === "SF" || code === "VF") setError(true);
      if (code !== "SU") return;

      const { token, expirationTime } = responseBody as SignInResponseDto;
      const now = new Date().getTime();
      const expires = new Date(now + expirationTime * 1000);
      setCookie("accessToken", token, { expires, path: MAIN_PATH() });
      navigator(MAIN_PATH());
    };
    //          event handler: 이메일 인풋 변경 이벤트 처리 함수          //
    const onEmailChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
      setError(false);
      setEmail(event.target.value);
    };

    //          event handler: 비밀번호 인풋 변경 이벤트 처리 함수          //
    const onPasswordChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
      setError(false);
      setPassword(event.target.value);
    };

    //          event handler: 로그인 버튼 클릭 이벤트 처리 함수          //
    const onSignInButtonClickHandler = () => {
      const requestBody: SignInRequestDto = { email, password };
      signInRequest(requestBody).then(signInResponse);
    };

    //          event handler: 회원가입 링크 클릭 이벤트 처리          //
    const onSignUpLinkClickHandler = () => {
      setView("sign-up");
    };
    //          event handler: 비밀번호 버튼 클릭 이벤트 처리 함수          //
    const onPasswordButtonClickHandler = () => {
      if (passwordType === "text") {
        setPasswordType("password");
        setPasswordButtonIcon("eye-light-off-icon");
      } else {
        setPasswordType("text");
        setPasswordButtonIcon("eye-light-on-icon");
      }
    };

    //          event handler: 이메일 인풋 키 다운 이벤트 처리 함수         //
    const onEmailKeyDownHandler = (
      event: React.KeyboardEvent<HTMLInputElement>
    ) => {
      if (event.key !== "Enter") return;
      if (!passwordRef.current) return;
      passwordRef.current.focus();
    };
    //          event handler: 비밀번호 인풋 키 다운 이벤트 처리 함수         //
    const onPasswordKeyDownHandler = (
      event: React.KeyboardEvent<HTMLInputElement>
    ) => {
      if (event.key !== "Enter") return;
      onSignInButtonClickHandler();
    };
    //          event handler: 구글 로그인 버튼 클릭 이벤트 처리       //
    const onGoogleSignInButtonClickHandler = () => {
      const apiUrl = process.env.REACT_APP_API_BASE_URL;
      window.location.href = `${apiUrl}/oauth2/authorization/google`;
    };

    //          render: sign in card 컴포넌트 렌더링          //
    return (
      <div className="auth-card">
        <div className="auth-card-box">
          <div className="auth-card-top">
            <div className="auth-card-title-box">
              <div className="auth-card-title">{"로그인"}</div>
            </div>
            <InputBox
              ref={emailRef}
              label="이메일"
              type="text"
              placeholder="이메일을 입력해주세요."
              error={error}
              value={email}
              onChange={onEmailChangeHandler}
              onKeyDown={onEmailKeyDownHandler}
            />
            <InputBox
              ref={passwordRef}
              label="비밀번호"
              type={passwordType}
              placeholder="비밀번호를 입력해주세요."
              error={error}
              value={password}
              onChange={onPasswordChangeHandler}
              icon={passwordButtonIcon}
              onButtonClick={onPasswordButtonClickHandler}
              onKeyDown={onPasswordKeyDownHandler}
            />
          </div>
          <div className="auth-card-bottom">
            {error && (
              <div className="auth-sign-in-error-box">
                <div className="auth-sign-in-error-message">
                  {
                    "이메일 또는 비밀번호가 잘못 되었습니다.\n이메일과 비밀번호를 정확히 입력해 주세요."
                  }
                </div>
              </div>
            )}
            <div
              className="black-large-full-button"
              onClick={onSignInButtonClickHandler}
            >
              {"로그인"}
            </div>
            {/* 구글 로그인*/}
            <div className="auth-divider">
              <span>또는</span>
            </div>
            <div
              className="white-large-full-button google-sign-in-button"
              onClick={onGoogleSignInButtonClickHandler}
            >
              <div className="icon-box">
                <div className="google-icon icon"></div>
              </div>
              <span>Google로 로그인</span>
            </div>
            <div className="auth-description-box">
              <div className="auth-description">
                {"계정이 없으신가요?"}
                <span
                  className="auth-description-link"
                  onClick={onSignUpLinkClickHandler}
                >
                  {"회원가입"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  //          component: sign up card 컴포넌트          //
  const SignUpCard = () => {
    //          state: 이메일 요소 참조 상태       //
    const emailRef = useRef<HTMLInputElement | null>(null);
    //          state: 비밀번호 요소 참조 상태       //
    const passwordRef = useRef<HTMLInputElement | null>(null);
    //          state: 비밀번호 확인 요소 참조 상태   //
    const passwordCheckRef = useRef<HTMLInputElement | null>(null);
    //          state: 닉네임 요소 참조 상태        //
    const nicknameRef = useRef<HTMLInputElement | null>(null);

    //          state: 이메일 상태              //
    const [email, setEmail] = useState<string>("");
    //          state: 비밀번호 상태              //
    const [password, setPassword] = useState<string>("");
    //          state: 비밀번호 확인 상태          //
    const [passwordCheck, setPasswordCheck] = useState<string>("");
    //          state: 닉네임 상태              //
    const [nickname, setNickname] = useState<string>("");
    //          state: 개인 정보 동의 상태          //
    const [agreedPersonal, setAgreedPersonal] = useState<boolean>(false);

    //          state: 비밀번호 타입 상태          //
    const [passwordType, setPasswordType] = useState<"text" | "password">(
      "password"
    );
    //          state: 비밀번호 확인 타입 상태          //
    const [passwordCheckType, setPasswordCheckType] = useState<
      "text" | "password"
    >("password");

    //          state: 이메일 에러 상태           //
    const [emailError, setEmailError] = useState<boolean>(false);
    //          state: 비밀번호 에러 상태         //
    const [passwordError, setPasswordError] = useState<boolean>(false);
    //          state: 비밀번호 확인 에러 상태     //
    const [passwordCheckError, setPasswordCheckError] =
      useState<boolean>(false);
    //          state: 닉네임 에러 상태          //
    const [nicknameError, setNicknameError] = useState<boolean>(false);
    //          state: 개인 정보 동의 에러 상태          //
    const [agreedPersonalError, setAgreedPersonalError] =
      useState<boolean>(false);

    //          state: 이메일 에러 메시지 상태         //
    const [emailErrorMessage, setEmailErrorMessage] = useState<string>("");
    //          state: 비밀번호 에러 메시지 상태       //
    const [passwordErrorMessage, setPasswordErrorMessage] =
      useState<string>("");
    //          state: 비밀번호 확인 에러 메시지 상태 //
    const [passwordCheckErrorMessage, setPasswordCheckErrorMessage] =
      useState<string>("");
    //          state: 닉네임 에러 메시지 상태        //
    const [nicknameErrorMessage, setNicknameErrorMessage] =
      useState<string>("");

    //          state: 패스워드 버튼 아이콘 상태      //
    const [passwordButtonIcon, setPasswordButtonIcon] = useState<
      "eye-light-off-icon" | "eye-light-on-icon"
    >("eye-light-off-icon");
    //          state: 패스워드 확인 버튼 아이콘 상태 //
    const [passwordCheckButtonIcon, setPasswordCheckButtonIcon] = useState<
      "eye-light-off-icon" | "eye-light-on-icon"
    >("eye-light-off-icon");

    //          state: 개인정보 동의 팝업 표시 상태          //
    const [showPrivacyModal, setShowPrivacyModal] = useState<boolean>(false);

    //          function: sign up response 처리 함수          //
    const signUpResponse = (
      responseBody: SignUpResponseDto | ResponseDto | null
    ) => {
      if (!responseBody) {
        alert("네크워크 이상입니다.");
        return;
      }
      const { code } = responseBody;
      if (code === "DE") {
        setEmailError(true);
        setEmailErrorMessage("이미 사용 중인 이메일입니다.");
      }
      if (code === "DN") {
        setNicknameError(true);
        setNicknameErrorMessage("이미 사용 중인 닉네임입니다.");
      }
      if (code === "VF") {
        alert("모든 값을 올바르게 입력해주세요.");
      }
      if (code === "DBE") {
        alert("데이터베이스 오류입니다.");
      }
      if (code !== "SU") return;

      setView("sign-in");
    };

    //          event handler: 이메일 변경 이벤트 처리 함수         //
    const onEmailChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
      setEmail(event.target.value);
      setEmailError(false);
      setEmailErrorMessage("");
    };
    //          event handler: 비밀번호 변경 이벤트 처리 함수         //
    const onPasswordChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
      setPassword(event.target.value);
      setPasswordError(false);
      setPasswordErrorMessage("");
    };
    //          event handler: 비밀번호 확인 변경 이벤트 처리 함수         //
    const onPasswordCheckChangeHandler = (
      event: ChangeEvent<HTMLInputElement>
    ) => {
      setPasswordCheck(event.target.value);
      setPasswordCheckError(false);
      setPasswordCheckErrorMessage("");
    };
    //          event handler: 닉네임 변경 이벤트 처리 함수         //
    const onNicknameChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
      setNickname(event.target.value);
      setNicknameError(false);
      setNicknameErrorMessage("");
    };

    //          event handler: 로그인 링크 클릭 이벤트 처리 함수         //
    const onSignInLinkClickHandler = () => {
      setView("sign-in");
    };

    //          event handler: 개인 정보 동의 클릭 이벤트 처리 함수         //
    const onAgreePersonalClickHandler = () => {
      setAgreedPersonal(!agreedPersonal);
      setAgreedPersonalError(false);
    };

    //          event handler: 개인정보 동의 더보기 클릭 이벤트 처리 함수          //
    const onPrivacyLinkClickHandler = () => {
      setShowPrivacyModal(true);
    };

    //          event handler: 개인정보 팝업 닫기 이벤트 처리 함수          //
    const onPrivacyModalCloseHandler = () => {
      setShowPrivacyModal(false);
    };

    //          event handler: 개인정보 팝업 동의 이벤트 처리 함수          //
    const onPrivacyModalAgreeHandler = () => {
      setAgreedPersonal(true);
      setAgreedPersonalError(false);
      setShowPrivacyModal(false);
    };

    //          event handler: 패스워드 버튼 클릭 이벤트 처리 함수          //
    const onPasswordButtonClickHandler = () => {
      if (passwordButtonIcon === "eye-light-off-icon") {
        setPasswordType("text");
        setPasswordButtonIcon("eye-light-on-icon");
      } else {
        setPasswordType("password");
        setPasswordButtonIcon("eye-light-off-icon");
      }
    };
    //          event handler: 패스워드 확인 버튼 클릭 이벤트 처리 함수          //
    const onPasswordCheckButtonClickHandler = () => {
      if (passwordCheckButtonIcon === "eye-light-off-icon") {
        setPasswordCheckType("text");
        setPasswordCheckButtonIcon("eye-light-on-icon");
      } else {
        setPasswordCheckType("password");
        setPasswordCheckButtonIcon("eye-light-off-icon");
      }
    };

    //          event handler: 회원가입 버튼 클릭 이벤트 처리 함수          //
    const onSignUpButtonClickHandler = () => {
      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      const isEmailPattern = emailPattern.test(email);
      if (!isEmailPattern) {
        setEmailError(true);
        setEmailErrorMessage("이메일 형식이 올바르지 않습니다.");
      }
      const isCheckedPassword = password.trim().length >= 8;
      if (!isCheckedPassword) {
        setPasswordError(true);
        setPasswordErrorMessage("비밀번호는 8자 이상이어야 합니다.");
      }

      const isEqualPassword = passwordCheck === password;
      if (!isEqualPassword) {
        setPasswordCheckError(true);
        setPasswordCheckErrorMessage("비밀번호가 일치하지 않습니다.");
      }

      const isNicknameValid =
        nickname.trim().length >= 2 && nickname.length <= 16;
      if (!isNicknameValid) {
        setNicknameError(true);
        setNicknameErrorMessage("닉네임은 2자 이상 16자 이하이어야 합니다.");
      }
      if (!agreedPersonal) {
        setAgreedPersonalError(true);
      }

      if (
        !isEmailPattern ||
        !isCheckedPassword ||
        !isEqualPassword ||
        !isNicknameValid ||
        !agreedPersonal
      ) {
        return;
      }
      // 회원가입 요청
      const requestBody: SignUpRequestDto = {
        email,
        password,
        nickname,
        agreedPersonal,
      };
      signUpRequest(requestBody).then(signUpResponse);
    };

    //          event handler: 이메일 키 다운 이벤트 처리 함수          //
    const onEmailKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key !== "Enter") return;
      if (!passwordRef.current) return;
      passwordRef.current.focus();
    };

    //          event handler: 비밀번호 키 다운 이벤트 처리 함수          //
    const onPasswordKeyDownHandler = (
      event: KeyboardEvent<HTMLInputElement>
    ) => {
      if (event.key !== "Enter") return;
      if (!passwordCheckRef.current) return;
      passwordCheckRef.current.focus();
    };

    //          event handler: 비밀번호 확인 키 다운 이벤트 처리 함수          //
    const onPasswordCheckKeyDownHandler = (
      event: KeyboardEvent<HTMLInputElement>
    ) => {
      if (event.key !== "Enter") return;
      if (!nicknameRef.current) return;
      nicknameRef.current.focus();
    };

    //          event handler: 닉네임 키 다운 이벤트 처리 함수          //
    const onNicknameKeyDownHandler = (
      event: KeyboardEvent<HTMLInputElement>
    ) => {
      if (event.key !== "Enter") return;
      onSignUpButtonClickHandler();
    };

    //          render: sign up card 컴포넌트 렌더링          //
    return (
      <>
        <div className="auth-card">
          <div className="auth-card-box">
            <div className="auth-card-top">
              <div className="auth-card-title-box">
                <div className="auth-card-title">{"회원가입"}</div>
              </div>
              <InputBox
                ref={emailRef}
                label="이메일*"
                type="text"
                placeholder="이메일을 입력해주세요."
                value={email}
                onChange={onEmailChangeHandler}
                error={emailError}
                errorMessage={emailErrorMessage}
                onKeyDown={onEmailKeyDownHandler}
              />
              <InputBox
                ref={passwordRef}
                label="비밀번호*"
                type={passwordType}
                placeholder="비밀번호를 입력해주세요."
                value={password}
                onChange={onPasswordChangeHandler}
                error={passwordError}
                errorMessage={passwordErrorMessage}
                icon={passwordButtonIcon}
                onButtonClick={onPasswordButtonClickHandler}
                onKeyDown={onPasswordKeyDownHandler}
              />
              <InputBox
                ref={passwordCheckRef}
                label="비밀번호 확인*"
                type={passwordCheckType}
                placeholder="비밀번호를 다시 입력해주세요."
                value={passwordCheck}
                onChange={onPasswordCheckChangeHandler}
                error={passwordCheckError}
                errorMessage={passwordCheckErrorMessage}
                icon={passwordCheckButtonIcon}
                onButtonClick={onPasswordCheckButtonClickHandler}
                onKeyDown={onPasswordCheckKeyDownHandler}
              />
              <InputBox
                ref={nicknameRef}
                label="닉네임*"
                type="text"
                placeholder="닉네임을 입력해주세요."
                value={nickname}
                onChange={onNicknameChangeHandler}
                error={nicknameError}
                errorMessage={nicknameErrorMessage}
                onKeyDown={onNicknameKeyDownHandler}
              />
            </div>
            <div className="auth-card-bottom">
              <div className="auth-consent-box">
                <div
                  className="auth-check-box"
                  onClick={onAgreePersonalClickHandler}
                >
                  <div
                    className={`icon ${
                      agreedPersonal
                        ? "check-round-fill-icon"
                        : "check-ring-light-icon"
                    }`}
                  ></div>
                </div>
                <div
                  className={
                    agreedPersonalError
                      ? "auth-consent-title-error"
                      : "auth-consent-title"
                  }
                >
                  {"개인정보동의"}
                </div>
                <div
                  className="auth-consent-link"
                  onClick={onPrivacyLinkClickHandler}
                >
                  {"더보기 >"}
                </div>
              </div>
              <div
                className="black-large-full-button"
                onClick={onSignUpButtonClickHandler}
              >
                {"회원가입"}
              </div>
              <div className="auth-description-box">
                <div className="auth-description">
                  {"이미 계정이 있으신가요?"}
                  <span
                    className="auth-description-link"
                    onClick={onSignInLinkClickHandler}
                  >
                    {"로그인"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <PrivacyPolicyModal
          isOpen={showPrivacyModal}
          onClose={onPrivacyModalCloseHandler}
          onAgree={onPrivacyModalAgreeHandler}
        />
      </>
    );
  };

  //          render: 인증 화면 컴포넌트 렌더링          //
  return (
    <div id="auth-wrapper">
      <div className="auth-container">
        <div className="auth-jumbotron-box">
          <div className="auth-jumbotron-contents">
            <div className="auth-logo-icon"></div>
            <div className="auth-jumbotron-text-box">
              <div className="auth-jumbotron-text">{"환영합니다."}</div>
              <div className="auth-jumbotron-text">{"Hyu's Tree입니다. "}</div>
            </div>
          </div>
        </div>
        {view === "sign-in" && <SignInCard />}
        {view === "sign-up" && <SignUpCard />}
      </div>
    </div>
  );
}
