import { Dispatch, SetStateAction } from 'react';

import { TDataList } from '../Section/@types';

export type TRepaymentInfoProps = {
  dataList: TDataList[];
  bankAccounts?: string[];
};

export type TRepaymentInfoContext = {
  error: string;
  setError: Dispatch<SetStateAction<string>>;
};
