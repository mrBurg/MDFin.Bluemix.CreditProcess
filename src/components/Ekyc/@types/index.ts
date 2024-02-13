import {UserStore} from '@src/stores/UserStore';

export type TEkycProps = Partial<Record<'className', string>>;

export type TEkycPropsStore = Record<'userStore', UserStore> & TEkycProps;

export type TEkycParams = Record<
    'request_id' | 'webhook_url' | 'language' | 'apiKey',
    string
> &
    Record<'stages', string[]
    > &
    Record<'dev', boolean>;

export type TResponseData = Record<
  'IDDocVerification',
  Record<'OCRDetails' | 'photoIDBack', string> &
    Record<'isCompletelyDone' | 'success', boolean> &
    Record<
      | 'faceOnDocumentStatusEnumInt'
      | 'textOnDocumentStatusEnumInt'
      | 'clientPhotoIDMatchLevel',
      number
    >
> &
  Record<'requestID' | 'operationID' | 'operationResult', string> &
  Record<'stages', Record<'requested' | 'completed', string[]>> &
  Record<
    'LivenessDetection',
    Record<'success' | 'livenessConfirmed', boolean> &
      Record<'clientPhoto', string> &
      Record<'ageGroup', number>
  >;
