export type Dua = {
  id: number;
  arabic: string;
  transliteration: string;
  translation: string;
};

export type Chapter = {
  id: string;
  title: string;
  duas: Dua[];
};
