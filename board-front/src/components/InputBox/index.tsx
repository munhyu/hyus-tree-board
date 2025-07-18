import {
  Dispatch,
  KeyboardEvent,
  SetStateAction,
  ChangeEvent,
  forwardRef,
} from "react";
import "./style.css";

interface Props {
  label: string;
  type: "text" | "password";
  placeholder: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  error: boolean;

  icon?: "eye-light-off-icon" | "eye-light-on-icon" | "expand-right-light-icon";
  onButtonClick?: () => void;

  errorMessage?: string;

  onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;
}

//                   component: Input Box 컴포넌트                //
const InputBox = forwardRef<HTMLInputElement, Props>((props: Props, ref) => {
  //                  state: props                //
  const { label, type, error, placeholder, value, icon, errorMessage } = props;
  const { onChange, onButtonClick, onKeyDown } = props;

  //                 event handler: input 키보드 이벤트 처리 함수         //
  const onKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
    if (!onKeyDown) return;
    onKeyDown(event);
  };

  //                  render: input Box 컴포넌트               //
  return (
    <div className="inputbox">
      <div className="inputbox-label">{label}</div>
      <div
        className={error ? "inputbox-container" : "inputbox-container error"}
      >
        <input
          ref={ref}
          className="input"
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDownHandler}
        />
        {onButtonClick !== undefined && (
          <div className="icon-button" onClick={onButtonClick}>
            {icon !== undefined && <div className={`icon ${icon}`}></div>}
          </div>
        )}
      </div>
      {errorMessage !== undefined && (
        <div className="inputbox-message">{errorMessage}</div>
      )}
    </div>
  );
});

export default InputBox;
