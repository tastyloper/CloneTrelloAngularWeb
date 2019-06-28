export interface List {
  listSort: number;
  id: number;
  title: string;
  cards: Array<Card>;
}

export interface Card {
  cardSort: number;
  cardId: number;
  cardTitle: string;
  cardContent: string;
  comments: Array<Comment>;
}

export interface Comment {
  commentId: number;
  commentContent: string;
}
