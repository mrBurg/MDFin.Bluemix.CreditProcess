import { TJSON } from '@interfaces';
import { UserStore } from '@src/stores/UserStore';
import { TFieldData } from '../../@types';

export type TMainFieldsProps = {
  staticData: TJSON;
  model: {
    invalidFieldsList: string[];
  };
  controller: {
    validateField: (data: TFieldData) => void;
    validatePersonalInfo?: (callback: (data: boolean) => void) => void;
  };
} & Partial<Record<'mutable' | 'readonly', boolean>>;

export type TMainFieldsPropsStore = {
  userStore: UserStore;
} & TMainFieldsProps;
