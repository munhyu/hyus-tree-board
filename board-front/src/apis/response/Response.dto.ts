import { ResponseCode } from "types/enum";

export interface ResponseDto {
  code: ResponseCode;
  message: string;
}
