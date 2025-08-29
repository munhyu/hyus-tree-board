import { FavoriteListItem } from "types/interface";
import ResponseDto from "apis/response/response.dto";

export default interface GetFavoriteListResponseDto extends ResponseDto {
  favoriteList: FavoriteListItem[];
}
