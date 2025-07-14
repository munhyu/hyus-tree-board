export default interface BoardListItem {
  boardNumber: number;
  title: string;
  content: string;
  boardTitleImage: String | null;
  favoriteCount: number;
  commentCount: number;
  viewCount: number;
  writeDatetime: string;
  writerNickname: string;
  writerProfileImage: string | null;
}
