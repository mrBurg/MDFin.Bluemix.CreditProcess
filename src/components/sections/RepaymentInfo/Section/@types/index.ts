export type TDataList = {
  title: string;
  text: string;
};

export type TSectionProps = {
  index: number;
  content: TDataList;
  bankAccounts?: string[];
};
