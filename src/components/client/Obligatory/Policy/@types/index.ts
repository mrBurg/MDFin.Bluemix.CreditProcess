import { TJSON } from '@interfaces';
import { UserStore } from '@src/stores/UserStore';
import { TFieldData } from '../../@types';

export type TPolicyProps = {
  staticData: TJSON;
  model: {
    invalidFieldsList: string[];
    tags?: TJSON;
  };
  controller: {
    validateField: (data: TFieldData) => boolean;
  };
};

export type TPolicyPropsStore = {
  userStore: UserStore;
} & TPolicyProps;
