import { BoardListItem } from "types/interface";
import { ResponseDto } from "apis/response";

export default interface GetUserBoardListResponseDto extends ResponseDto {
  userBoardList: BoardListItem[];
  totalPages: number;
  totalElements: number;
  hasNext: boolean;
  currentPage: number;
}
