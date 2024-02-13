import { TAttachmentsFormStatic, TDocument } from '@stores-types/loanStore';

export type TAttachments = {
  documents: TDocument[];
  type: string;
  locales: TAttachmentsFormStatic;
  type_id: number;
  full?: boolean;
  multiple?: boolean;
  valid?: boolean;
};
