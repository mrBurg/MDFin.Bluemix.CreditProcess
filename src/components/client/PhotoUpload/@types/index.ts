import { ReactElement } from 'react';

import { TJSON } from '@interfaces';
import { CLIENT_TABS } from '@src/constants';
import { LoanStore } from '@src/stores/LoanStore';
import { UserStore } from '@src/stores/UserStore';

type TFileProps = {
  type: string;
  type_id: number;
  maxFileSize?: number;
};

export type TPhotoUploadProps = {
  staticData: TJSON;
  userStore: UserStore;
  loanStore: LoanStore;
  params: {
    currentStep: CLIENT_TABS;
    fileProps: TFileProps;
    image: ReactElement;
  };
};

export type TImgProps = Partial<Record<'className', string>>;
