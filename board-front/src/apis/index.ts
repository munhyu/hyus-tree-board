import axios, { AxiosResponse } from "axios";
import { SignInRequestDto, SignUpRequestDto } from "./request/auth";
import { SignInResponseDto, SignUpResponseDto } from "./response/auth";
import { ResponseDto } from "./response";
import {
  GetSignInUserResponseDto,
  GetUserResponseDto,
  PatchNicknameResponseDto,
  PatchProfileImageResponseDto,
} from "./response/user";
import {
  PatchBoardRequestDto,
  PostBoardRequestDto,
  PostCommentRequestDto,
} from "./request/board";
import {
  DeleteBoardResponseDto,
  DeleteCommentResponseDto,
  GetBoardLatestListResponseDto,
  GetBoardResponseDto,
  GetBoardSearchListResponseDto,
  GetBoardTop3ListResponseDto,
  GetCommentListResponseDto,
  GetFavoriteListResponseDto,
  GetUserBoardListResponseDto,
  IncreaseViewCountResponseDto,
  PatchBoardResponseDto,
  PostBoardResponseDto,
  PostCommentResponseDto,
  PutFavoriteResponseDto,
} from "./response/board";
import {
  GetPopularListResponseDto,
  GetRelationListResponseDto,
} from "./response/search";
import {
  PatchNicknameRequestDto,
  PatchProfileImageRequestDto,
} from "./request/user";

const DOMAIN = "http://localhost:4000";

const API_DOMAIN = `${DOMAIN}/api/v1`;
export const FILE_DOMAIN = `${DOMAIN}/file`;

//          function: authorization 헤더 생성 함수          //
const authorizationHeader = (accessToken: string) => {
  return {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };
};

//          function: axios 요청 함수          //
const api = async <T extends ResponseDto>(
  request: Promise<AxiosResponse<T>>
): Promise<T | null> => {
  try {
    const response = await request;

    const responseBody: T = response.data;

    return responseBody;
  } catch (error: any) {
    if (error.response?.data) {
      const responseBody: ResponseDto = error.response.data;

      return responseBody as T;
    }

    return null;
  }
};

//          description: auth 관련 요청          //
const SIGN_IN_URL = () => `${API_DOMAIN}/auth/sign-in`;
const SIGN_UP_URL = () => `${API_DOMAIN}/auth/sign-up`;

export const signInRequest = (requestBody: SignInRequestDto) =>
  api(axios.post<SignInResponseDto>(SIGN_IN_URL(), requestBody));

export const signUpRequest = (requestBody: SignUpRequestDto) =>
  api(axios.post<SignUpResponseDto>(SIGN_UP_URL(), requestBody));

//          description: search 관련 요청          //
const GET_POPULAR_LIST_URL = () => `${API_DOMAIN}/search/popular-list`;
const GET_RELATION_LIST_URL = (searchWord: string) =>
  `${API_DOMAIN}/search/${searchWord}/relation-list`;

export const getPopularListRequest = () =>
  api(axios.get<GetPopularListResponseDto>(GET_POPULAR_LIST_URL()));

export const getRelationListRequest = (searchWord: string) =>
  api(axios.get<GetRelationListResponseDto>(GET_RELATION_LIST_URL(searchWord)));

//          description: user 관련 요청          //
const GET_SIGN_IN_USER_URL = () => `${API_DOMAIN}/user`;
const GET_USER_URL = (email: string) => `${API_DOMAIN}/user/${email}`;
const PATCH_NICKNAME_URL = () => `${API_DOMAIN}/user/nickname`;
const PATCH_PROFILE_IMAGE_URL = () => `${API_DOMAIN}/user/profile-image`;

export const getSignInUserRequest = (accessToken: string) =>
  api(
    axios.get<GetSignInUserResponseDto>(
      GET_SIGN_IN_USER_URL(),
      authorizationHeader(accessToken)
    )
  );

export const getUserRequest = (email: string) =>
  api(axios.get<GetUserResponseDto>(GET_USER_URL(email)));

export const patchNicknameRequest = (
  requestBody: PatchNicknameRequestDto,
  accessToken: string
) =>
  api(
    axios.patch<PatchNicknameResponseDto>(
      PATCH_NICKNAME_URL(),
      requestBody,
      authorizationHeader(accessToken)
    )
  );

export const patchProfileImageRequest = (
  requestBody: PatchProfileImageRequestDto,
  accessToken: string
) =>
  api(
    axios.patch<PatchProfileImageResponseDto>(
      PATCH_PROFILE_IMAGE_URL(),
      requestBody,
      authorizationHeader(accessToken)
    )
  );

//          description: board 관련 요청          //
const GET_BOARD_URL = (boardNumber: number | string) =>
  `${API_DOMAIN}/board/${boardNumber}`;
const GET_FAVORITE_LIST_URL = (boardNumber: number | string) =>
  `${API_DOMAIN}/board/${boardNumber}/favorite-list`;
const GET_COMMENT_LIST_URL = (boardNumber: number | string) =>
  `${API_DOMAIN}/board/${boardNumber}/comment-list`;
const GET_BOARD_LATEST_LIST_URL = (page: number) =>
  `${API_DOMAIN}/board/latest-list?page=${page}`;
const GET_BOARD_TOP_3_LIST_URL = () => `${API_DOMAIN}/board/top-3`;
const GET_BOARD_SEARCH_LIST_URL = (
  searchWord: string,
  page: number,
  preSearchWord: string | undefined
) =>
  `${API_DOMAIN}/board/search-list/${searchWord}${
    preSearchWord ? `/${preSearchWord}` : ""
  }?page=${page}`;
const GET_USER_BOARD_LIST_URL = (email: string, page: number) =>
  `${API_DOMAIN}/board/user-board-list/${email}?page=${page}`;
const POST_BOARD_URL = () => `${API_DOMAIN}/board`;
const POST_COMMENT_URL = (boardNumber: number | string) =>
  `${API_DOMAIN}/board/${boardNumber}/comment`;
const DELETE_COMMENT_URL = (commentNumber: number) =>
  `${API_DOMAIN}/board/comment/${commentNumber}`;
const DELETE_BOARD_URL = (boardNumber: number | string) =>
  `${API_DOMAIN}/board/${boardNumber}`;
const PATCH_BOARD_URL = (boardNumber: number | string) =>
  `${API_DOMAIN}/board/${boardNumber}`;
const PUT_FAVORITE_URL = (boardNumber: number | string) =>
  `${API_DOMAIN}/board/${boardNumber}/favorite`;
const INCREASE_VIEW_COUNT_URL = (boardNumber: number | string) =>
  `${API_DOMAIN}/board/${boardNumber}/increase-view-count`;

export const getBoardRequest = (boardNumber: number | string) =>
  api(axios.get<GetBoardResponseDto>(GET_BOARD_URL(boardNumber)));

export const getBoardLatestListRequest = (page: number) =>
  api(
    axios.get<GetBoardLatestListResponseDto>(GET_BOARD_LATEST_LIST_URL(page))
  );

export const getBoardTop3ListRequest = () =>
  api(axios.get<GetBoardTop3ListResponseDto>(GET_BOARD_TOP_3_LIST_URL()));

export const getBoardSearchListRequest = (
  searchWord: string,
  page: number,
  preSearchWord: string | undefined
) =>
  api(
    axios.get<GetBoardSearchListResponseDto>(
      GET_BOARD_SEARCH_LIST_URL(searchWord, page, preSearchWord)
    )
  );

export const getUserBoardListRequest = (email: string, page: number) =>
  api(
    axios.get<GetUserBoardListResponseDto>(GET_USER_BOARD_LIST_URL(email, page))
  );

export const getFavoriteListRequest = (boardNumber: number | string) =>
  api(
    axios.get<GetFavoriteListResponseDto>(GET_FAVORITE_LIST_URL(boardNumber))
  );

export const getCommentListRequest = (boardNumber: number | string) =>
  api(axios.get<GetCommentListResponseDto>(GET_COMMENT_LIST_URL(boardNumber)));

export const postBoardRequest = (
  requestBody: PostBoardRequestDto,
  accessToken: string
) =>
  api(
    axios.post<PostBoardResponseDto>(
      POST_BOARD_URL(),
      requestBody,
      authorizationHeader(accessToken)
    )
  );

export const postCommentRequest = (
  boardNumber: number | string,
  requestBody: PostCommentRequestDto,
  accessToken: string
) =>
  api(
    axios.post<PostCommentResponseDto>(
      POST_COMMENT_URL(boardNumber),
      requestBody,
      authorizationHeader(accessToken)
    )
  );

export const patchBoardRequest = (
  boardNumber: number | string,
  requestBody: PatchBoardRequestDto,
  accessToken: string
) =>
  api(
    axios.patch<PatchBoardResponseDto>(
      PATCH_BOARD_URL(boardNumber),
      requestBody,
      authorizationHeader(accessToken)
    )
  );

export const putFavoriteRequest = (
  boardNumber: number | string,
  accessToken: string
) =>
  api(
    axios.put<PutFavoriteResponseDto>(
      PUT_FAVORITE_URL(boardNumber),
      {},
      authorizationHeader(accessToken)
    )
  );

export const deleteCommentRequest = (
  commentNumber: number,
  accessToken: string
) =>
  api(
    axios.delete<DeleteCommentResponseDto>(
      DELETE_COMMENT_URL(commentNumber),
      authorizationHeader(accessToken)
    )
  );

export const deleteBoardRequest = (
  boardNumber: number | string,
  accessToken: string
) =>
  api(
    axios.delete<DeleteBoardResponseDto>(
      DELETE_BOARD_URL(boardNumber),
      authorizationHeader(accessToken)
    )
  );

export const increaseViewCountRequest = (boardNumber: number | string) =>
  api(
    axios.get<IncreaseViewCountResponseDto>(
      INCREASE_VIEW_COUNT_URL(boardNumber)
    )
  );
//          description: file 관련 요청          //
const FILE_UPLOAD_URL = () => `${FILE_DOMAIN}/upload`;
const multipartHeaders = {
  headers: {
    "Content-Type": "multipart/form-data",
  },
};

export const fileUploadRequest = async (data: FormData) => {
  const result = await axios
    .post(FILE_UPLOAD_URL(), data, multipartHeaders)
    .then((response) => {
      const responseBody = response.data;
      return responseBody;
    })
    .catch((error) => {
      return null;
    });
  return result;
};
