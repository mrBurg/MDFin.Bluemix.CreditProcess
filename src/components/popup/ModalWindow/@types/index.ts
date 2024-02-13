import { MODAL_TYPE } from '../ModalWindow';

/**
 * @description MODAL_TYPE.TRANSPARENT & MODAL_TYPE.MODAL
 * @param type - window type
 * @param textData - main text
 * @param declineHandler - close or decline button
 * @description MODAL_TYPE.PROMPT
 * @param type - window type
 * @param textData - main text
 * @param staticData - text on buttons accept and decline
 * @param acceptHandler - accept button
 * @param declineHandler - close or decline button
 */
export type TModalWindowProps = Record<'textData', string | string[]> &
  Record<'declineHandler', () => void> &
  Partial<
    Record<'type', MODAL_TYPE> &
      Record<'acceptHandler' | 'confirmDisplay', () => void> &
      Record<
        'staticData',
        Record<'acceptButtonText' | 'declineButtonText', string>
      > &
      Record<'classname', string>
  >;
