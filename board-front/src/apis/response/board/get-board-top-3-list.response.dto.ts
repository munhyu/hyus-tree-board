import { BoardListItem } from "types/interface";
import { ResponseDto } from "apis/response";

export default interface GetBoardTop3ListResponseDto extends ResponseDto {
  top3List: BoardListItem[];
}
