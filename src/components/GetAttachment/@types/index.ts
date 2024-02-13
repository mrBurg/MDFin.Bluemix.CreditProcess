import { TJSON } from '@interfaces';
import { UserStore } from '@src/stores/UserStore';

export type TGetAttachment = Partial<
  Record<'className' | 'attachmentType' | 'label', string>
>;

export type TGetGeneratedAttachment = TGetAttachment & {
  requestData: TJSON;
};

export type TGetGeneratedAttachmentStore = {
  userStore: UserStore;
} & TGetGeneratedAttachment;
