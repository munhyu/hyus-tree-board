import ResponseDto from "apis/response/response.dto";

export default interface SignInResponseDto extends ResponseDto {
  token: string;
  expirationTime: number;
}
