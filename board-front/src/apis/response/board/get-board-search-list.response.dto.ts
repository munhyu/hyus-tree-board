import { BoardListItem } from "../../../types/interface";
import ResponseDto from "../response.dto";

export default interface GetBoardSearchListResponseDto extends ResponseDto {
  searchList: BoardListItem[];
  totalPages: number;
  totalElements: number;
  hasNext: boolean;
  currentPage: number;
}
