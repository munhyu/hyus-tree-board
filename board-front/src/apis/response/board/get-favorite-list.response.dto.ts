import { FavoriteListItem } from "types/interface";
import { ResponseDto } from "apis/response";

export default interface GetFavoriteListResponseDto extends ResponseDto {
  favoriteList: FavoriteListItem[];
}
