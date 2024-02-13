export type TItem = {
  itemData: string;
  buttonLabel?: string;
};

export type THowItWorksRd2Props = {
  title: string;
  subtitle: string;
  youtubeID: string;
  items: TItem[];
  footnote: string;
};
