import { CommentListItem } from "types/interface";
import ResponseDto from "apis/response/response.dto";

export default interface GetCommentListResponseDto extends ResponseDto {
  commentList: CommentListItem[];
}
