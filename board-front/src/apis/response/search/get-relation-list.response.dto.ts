import { ResponseDto } from "apis/response";

export default interface GetRelationListResponseDto extends ResponseDto {
  relativeWordList: string[];
}
