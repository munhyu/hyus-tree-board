import ResponseDto from "apis/response/response.dto";

export default interface GetPopularListResponseDto extends ResponseDto {
  popularWordList: string[];
}
