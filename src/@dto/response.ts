export interface Music {
  id: string;
  title: string;
  moods: string[];
  genre: string;
  public_date: string;
}

export interface ResultMusicList {
  totla: number;
  items: Music[];
}
export interface ResultMusicURL {
  url: string;
}