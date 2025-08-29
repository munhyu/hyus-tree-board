import { Board } from "types/interface";
import { ResponseDto } from "apis/response";

export default interface GetBoardResponseDto extends ResponseDto, Board {}
