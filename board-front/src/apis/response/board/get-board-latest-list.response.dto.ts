import { BoardListItem } from "../../../types/interface";
import ResponseDto from "../response.dto";

export default interface GetBoardLatestListResponseDto extends ResponseDto {
  boardList: BoardListItem[];
  totalPages: number; // 총 페이지 수
  totalElements: number; // 총 게시물 수
  hasNext: boolean; // 다음 페이지가 있는지 여부
  currentPage: number; // 현재 페이지 번호
}
