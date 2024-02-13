import { RESPONSE_STATUS, STATUS } from '@src/constants';

/** Проверить статус ответа AJAX*/
export const checkStatus = (status: string | number): boolean => {
  const statusCode = String(status);

  switch (statusCode.toLowerCase()) {
    case RESPONSE_STATUS.OK:
    case RESPONSE_STATUS.SUCCES:
      return true;
    case RESPONSE_STATUS.ERROR:
    case String(STATUS.BAD_REQUEST):
      return false;
    default:
      return false;
  }
};
