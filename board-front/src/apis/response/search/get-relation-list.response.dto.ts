import ResponseDto from "apis/response/response.dto";
export default interface GetRelationListResponseDto extends ResponseDto {
  relativeWordList: string[];
}
