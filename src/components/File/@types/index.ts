import { LoanStore } from '@src/stores/LoanStore';

type TFile = Partial<Record<'className', string>>;

export type TUploadedFile = Record<'id' | 'index', number> &
  Record<'filename' | 'url' | 'icon', string> &
  TFile;

export type TAddFile = Record<'type', string> &
  Record<'type_id', number> &
  Partial<
    Record<'maxFileSize', number> &
      Record<'accept' | 'label' | 'view', string> &
      Record<'notActive' | 'multiple' | 'capture' | 'disabled', boolean> &
      Record<'onClick' | 'callBack', (data?: boolean) => void>
  > &
  TFile;

export type TAddFileStore = Record<'loanStore', LoanStore> & TAddFile;
