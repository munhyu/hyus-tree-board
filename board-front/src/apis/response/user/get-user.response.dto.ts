import { User } from "types/interface";
import { ResponseDto } from "apis/response";

export default interface GetUserResponseDto extends ResponseDto, User {}
