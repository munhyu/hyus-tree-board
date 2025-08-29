import { User } from "types/interface";
import ResponseDto from "apis/response/response.dto";

export default interface GetSignInUserResponseDto extends ResponseDto, User {}
