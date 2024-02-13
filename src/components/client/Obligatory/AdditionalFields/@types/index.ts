import { TJSON } from '@interfaces';
import { FIELD_NAME } from '@src/constants';
import { PageStore } from '@src/stores/PageStore';
import { UserStore } from '@src/stores/UserStore';
import { TDirectoryItem } from '@stores-types/pageStore';
import { TFieldData } from '../../@types';

export type TAdditionalFieldsProps = {
  staticData: TJSON;
  model: Record<'dirLoanPurpose' | 'dirLoanPurposeDescr', TDirectoryItem[]> & {
    invalidFieldsList: string[];
    hiddenFields: FIELD_NAME[];
  };
  controller: {
    validateField: (data: TFieldData) => void;
  };
};

export type TAdditionalFieldsPropsStore = {
  userStore: UserStore;
  pageStore: PageStore;
} & TAdditionalFieldsProps;
