import { User } from "types/interface";
import ResponseDto from "apis/response/response.dto";

export default interface GetUserResponseDto extends ResponseDto, User {}
