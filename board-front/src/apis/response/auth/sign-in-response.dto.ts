import { ResponseDto } from "apis/response";

export default interface SignInResponseDto extends ResponseDto {
  token: string;
  expirationTime: number;
}
