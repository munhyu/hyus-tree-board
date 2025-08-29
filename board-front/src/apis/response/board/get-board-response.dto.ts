import { Board } from "types/interface";
import ResponseDto from "apis/response/response.dto";

export default interface GetBoardResponseDto extends ResponseDto, Board {}
