import { ResponseDto } from "apis/response";

export default interface GetPopularListResponseDto extends ResponseDto {
  popularWordList: string[];
}
