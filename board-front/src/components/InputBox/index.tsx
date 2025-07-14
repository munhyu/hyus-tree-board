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
  setValue: Dispatch<SetStateAction<string>>;
  error: boolean;

  icon?: string;
  onButtonClick?: () => void;

  message?: string;

  onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;
}

//                   component: Input Box 컴포넌트                //
const InputBox = forwardRef<HTMLInputElement, Props>((props: Props, ref) => {
  //                  state: props                //
  const { label, type, error, placeholder, value, icon, message } = props;
  const { setValue, onButtonClick, onKeyDown } = props;

  //                 event handler: input 값 변경 이벤트 처리 함수         //
  const onChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setValue(value);
  };

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
          onChange={onChangeHandler}
          onKeyDown={onKeyDown}
        />
        {onButtonClick !== undefined && (
          <div className="icon-button">
            {icon !== undefined && <div className={`icon ${icon}`}></div>}
          </div>
        )}
      </div>
      {message !== undefined && (
        <div className="inputbox-message">{message}</div>
      )}
    </div>
  );
});

export default InputBox;
