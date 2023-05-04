export interface CommentsResponse {
  comments: Comment[];
}

export interface Comment {
  _id: string;
  content: string;
  authorId: string;
  authorNick: string;
  __v: number;
}
