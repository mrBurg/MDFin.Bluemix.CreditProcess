/**
 * @description
 * @param type - window type
 * @param declineHandler - close or decline button
 * @param body - main text
 * @param sender - sender text
 * @param subject - subject text - CHANNEL.EMAIL ONLY
 */

export enum CHANNEL {
  EMAIL = 'email',
  SMS = 'sms',
}

export type TContentData = {
  body: string;
  sender: string;
  subject?: string;
};

export type TMessagePreviewProps = {
  type: CHANNEL;
  contentData: TContentData;
  declineHandler: () => void;
  classname?: string;
};
