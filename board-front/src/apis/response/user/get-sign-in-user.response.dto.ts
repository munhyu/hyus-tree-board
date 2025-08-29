import { User } from "types/interface";
import { ResponseDto } from "apis/response";

export default interface GetSignInUserResponseDto extends ResponseDto, User {}
