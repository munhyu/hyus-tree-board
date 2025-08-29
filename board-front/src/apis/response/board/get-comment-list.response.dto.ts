import { CommentListItem } from "types/interface";
import { ResponseDto } from "apis/response";

export default interface GetCommentListResponseDto extends ResponseDto {
  commentList: CommentListItem[];
}
