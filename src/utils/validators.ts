import each from 'lodash/each';
import size from 'lodash/size';
import moment from 'moment';

import cfg from '@root/config.json';
import { TJSON } from '@interfaces';
import {
  FIELD_NAME,
  regexp13,
  regexp1_6,
  regexp2num,
  regexp9or12num,
  regexppassport,
} from '@src/constants';
import { TField, TUserContacts, TUserJob } from '@stores-types/userStore';
import { UserStore } from '@src/stores/UserStore';

const fields = {
  /** Authorization */
  [FIELD_NAME.MARKETING]: 'checkbox',

  /** Obligatory fields */
  [FIELD_NAME.LAST_NAME]: 'lastName',
  [FIELD_NAME.FIRST_NAME]: 'firstName',
  [FIELD_NAME.PHONE_NUMBER]: 'phoneNumber',
  [FIELD_NAME.BIRTH_DATE]: 'birthDate',
  [FIELD_NAME.ID]: 'cmnd_cccd',
  [FIELD_NAME.ISSUE_DATE]: 'issueDate',
  [FIELD_NAME.EXPIRE_DATE]: 'expireDate',
  [FIELD_NAME.GENDER_ID]: 'selectRequired',
  [FIELD_NAME.MARITAL_STATUS_ID]: 'selectRequired',
  [FIELD_NAME.NUMBER_OF_DEPENDENTS]: 'numRequiredLength2',
  [FIELD_NAME.EMAIL]: 'email',
  [FIELD_NAME.PHONE_BRAND_ID]: 'selectRequired',
  [FIELD_NAME.PHONE_BRAND_OTHER]: 'brandOther',
  [FIELD_NAME.PHONE_MODEL_ID]: 'selectRequired',
  [FIELD_NAME.PHONE_MODEL_OTHER]: 'modelOther',
  [FIELD_NAME.OTHER_PHONE_NUMBER]: 'otherPhoneNumber',
  [FIELD_NAME.REQUEST_BIROULDE_CREDIT]: 'checkbox',
  [FIELD_NAME.CONFIRM_BENEFICIARY]: 'checkbox',
  [FIELD_NAME.LOAN_PURPOSE_ID]: 'selectRequired',
  [FIELD_NAME.LOAN_PURPOSE_DESCR]: 'loanPurposeDescr',
  [FIELD_NAME.PIN]: 'pinRequired',
  [FIELD_NAME.PASSPORT]: 'passportRequired',

  /** Address fields */
  [FIELD_NAME.CITY_PROVINCE]: 'selectRequired',
  [FIELD_NAME.DISTRICT]: 'selectRequired',
  [FIELD_NAME.WARD_COMMUNE]: 'selectRequired',
  [FIELD_NAME.STREET]: 'street',
  // [FIELD_NAME.BUILDING]: 'building',
  /* [FIELD_NAME.APARTMENT]: 'apartment', */
  [FIELD_NAME.YEARS]: 'numRequiredLength2',
  [FIELD_NAME.MONTHS]: 'numRequiredLength2',
  [FIELD_NAME.THIRD_PARTY_PHONE]: 'thirdParty',
  [FIELD_NAME.THIRD_PARTY_NAME]: 'thirdParty',
  [FIELD_NAME.THIRD_PARTY_RELATION]: 'thirdParty',

  /** Job fields */
  [FIELD_NAME.SOCIAL_STATUS_ID]: 'selectRequired',
  [FIELD_NAME.EDUCATION_ID]: 'selectRequired',
  [FIELD_NAME.COMPANY_NAME]: 'ifRequiredJobSocial',
  [FIELD_NAME.INDUSTRY_ID]: 'ifRequiredJobSocial',
  [FIELD_NAME.INDUSTRY_DETAILED_ID]: 'ifRequiredJobSocial',
  [FIELD_NAME.POS_TYPE_ID]: 'ifRequiredJobSocial',
  [FIELD_NAME.POS_NAME]: 'ifRequiredJobSocial',
  [FIELD_NAME.WORK_YEARS]: 'ifRequiredJobSocial',
  [FIELD_NAME.WORK_MONTHS]: 'ifRequiredJobSocial',
  [FIELD_NAME.JOB_CONTACT_PHONE]: 'ifRequiredJobSocial',
  [FIELD_NAME.JOB_CONTACT_NAME]: 'ifRequiredJobSocial',
  [FIELD_NAME.JOB_CONTACT_TYPE_ID]: 'ifRequiredJobSocial',
  [FIELD_NAME.INCOME]: 'income',
} as TJSON;

/** Валидация поля
 * @params:
 * validateItems - массив имен полей и их значений
 * userStore
 */
export function validator(validateItems: TField[], userStore: UserStore) {
  let invalidFields = [] as string[];

  each(validateItems, (item: TField) => {
    const validationResult = (() => {
      switch (fields[item.name]) {
        case 'selectRequired':
          return !validateSelectRequired(item.value);
        case 'thirdParty':
          return !validateThirdParty(
            item.value,
            item.name,
            userStore.userDataContacts
          );
        case 'firstName':
        case 'lastName':
          return !validateName(item.value);
        case 'phoneNumber':
          return !validatePhone(item.value);
        case 'checkbox':
          return !validateBoolean(item.value);
        case 'birthDate':
          return !validateBirthDate(item.value);
        case 'cmnd_cccd':
          // return !validateID(item.value);
          return !validateNumRegexp(item.value, regexp9or12num);
        case 'issueDate':
          return !validateIssueDate(item.value);
        /* case 'expireDate':
        return !validateExpireDate(item.value, userStore.userData.cmnd_cccd!) */
        case 'street':
          return !validateTextRequiredMaxLength(item.value, 100);
        /* case 'building':
        return !validateTextRequiredMaxLength(item.value, 4) */
        case 'numRequiredLength2':
          // return !validateNumRequiredLength2(item.value);
          return !validateNumRegexp(item.value, regexp2num);
        case 'email':
          return !validateEmail(item.value);
        /* case 'brandOther':
        return !validateBrandOther(
          item.value,
          userStore.userData.shouldShow_PHONE_BRAND_OTHER!
        ) */
        /* case 'modelOther':
        return !validateModelOther(
          item.value,
          userStore.userData.shouldShow_PHONE_MODEL_OTHER!
        ) */
        case 'otherPhoneNumber':
          return !validateOtherPhoneNumber(item.value);
        case 'ifRequiredJobSocial':
          return !validateIfRequiredJobSocial(
            item.value,
            item.name,
            userStore.userDataJob!
          );
        case 'loanPurposeDescr':
          return !validateLoanPurposeDescr(
            item.value,
            userStore.clientAddInfo.loanPurpose_id
          );
        case 'income':
          return !validateNumRegexp(item.value, regexp1_6);
        case 'pinRequired':
          return !validateNumRegexp(item.value, regexp13);
        case 'passportRequired':
          return !regexppassport.test(item.value);
        default:
          invalidFields = [];
      }
    })();

    if (validationResult) {
      invalidFields.push(item.name);
    }
  });

  return invalidFields;
}

export const validateBoolean = (value: boolean): boolean => value;

/** Валидация - обязательного текстового поля + максимальное кол-во символов */
export const validateTextRequiredMaxLength = (
  value: string,
  length?: number
): boolean => {
  if (length) {
    return !!value && value.length <= length;
  } else {
    return !!value;
  }
};

/** Валидация - выпадающий список (обязательное поле) */
export const validateSelectRequired = (value: number | string): boolean =>
  !!value;

/** Валидация - выпадающий список (обязательное поле - ПРИ условии) */
export const validateLoanPurposeDescr = (
  value: number | string,
  loanPurpose_id: number | undefined
): boolean => {
  if (loanPurpose_id == 0 || loanPurpose_id == 4) {
    return true;
  }

  return !!value;
};

/** Валидация - обязательного числового поля + мин-макс длина 1-2
 * на замену пришел "validateNumRegexp"
 */
/* export const validateNumRequiredLength2 = (value: number) => {
  const re = /^[0-9]{1,2}$/;
  return re.test(String(value));
}; */

/** Валидация - обязательного числового поля + regexp */
export const validateNumRegexp = (
  value: number | string,
  regexp: RegExp
): boolean => new RegExp(regexp).test(String(value));

/** Валидация - обязательного текстового поля + regexp */
export const validateTextRegexp = (
  value: number | string,
  regexp: RegExp
): boolean => regexp.test(String(value));

/** Валидация - контакты третьего лица (визард) */
export const validateThirdParty = (
  value: string,
  fieldName: string,
  userDataContacts: TUserContacts[]
): boolean => {
  //const { phoneNumber, name, type_id } = userDataContacts[0];

  const phoneNumber = size(userDataContacts)
    ? userDataContacts[0].phoneNumber
    : '';
  const name = size(userDataContacts) ? userDataContacts[0].name : '';
  const type_id = size(userDataContacts) ? userDataContacts[0].type_id : '';

  if (!!phoneNumber || !!name || !!type_id) {
    switch (fieldName) {
      case FIELD_NAME.THIRD_PARTY_PHONE:
        return validateRequiredOtherPhone(value);
      case FIELD_NAME.THIRD_PARTY_NAME:
        return validateName(value);
      case FIELD_NAME.THIRD_PARTY_RELATION:
        return validateSelectRequired(value);
      default:
        return false;
    }
  } else {
    return true;
  }
};

/** Валидация - полей со вкладки Работа (визард) */
export const validateIfRequiredJobSocial = (
  value: string | number,
  fieldName: string,
  userDataJob: TUserJob
): boolean => {
  const IDs = [1, 2, 3, 4, 5];
  const regexp0_99 = /^([0-9]|[0-9][0-9])$/;
  const regexp0_12 = /^([0-9]|1[012])$/;
  const regexpText50 = new RegExp('^[\\s' + cfg.alphabet_vns + ']{1,50}$');

  if (~IDs.indexOf(userDataJob.socialStatus_id!)) {
    //клиент - работающий (проверять текущее поле)
    switch (fieldName) {
      case FIELD_NAME.COMPANY_NAME:
        return validateTextRequiredMaxLength(String(value), 100);
      case FIELD_NAME.INDUSTRY_ID:
        return validateSelectRequired(value);
      case FIELD_NAME.INDUSTRY_DETAILED_ID:
        return validateSelectRequired(value);
      case FIELD_NAME.POS_TYPE_ID:
        return validateSelectRequired(value);
      case FIELD_NAME.POS_NAME:
        return validateTextRequiredMaxLength(String(value), 100);
      case FIELD_NAME.WORK_YEARS:
        return validateNumRegexp(value, regexp0_99);
      case FIELD_NAME.WORK_MONTHS:
        return validateNumRegexp(value, regexp0_12);

      case FIELD_NAME.JOB_CONTACT_PHONE:
        //console.log(userDataJob.contact?.name);
        return !!userDataJob.contact?.name || !!value
          ? validateRequiredOtherPhone(String(value))
          : true;
      case FIELD_NAME.JOB_CONTACT_NAME:
        //console.log(userDataJob.contact?.phoneNumber);
        return !!userDataJob.contact?.phoneNumber || !!value
          ? validateTextRegexp(String(value), regexpText50)
          : true;
      case FIELD_NAME.JOB_CONTACT_TYPE_ID:
        //console.log(userDataJob.contact?.name);
        //console.log(userDataJob.contact?.phoneNumber);
        return !!userDataJob.contact?.phoneNumber || !!userDataJob.contact?.name
          ? validateSelectRequired(value)
          : true;
      default:
        return false;
    }
  }
  //клиент - НЕ работает (текущее поле НЕ проверять)
  else {
    return true;
  }
};

/** Валидация - Фамилия/Имя Клиента (регистрация, визард) */
export const validateName = (value: string): boolean => {
  const regexp = new RegExp(
    `^[\\s${cfg.alphabet_uppercase}${cfg.alphabet_lowercase}]+(\\s[${cfg.alphabet_uppercase}${cfg.alphabet_lowercase}]*)?$`
  );

  return !!value && value.length <= 40 && regexp.test(value);
};

/**
 * Валидация - Номер телефона (логин, регистрация, визард??)
 *  ACHTUNG!!! Используется в validateOtherPhoneNumber
 */
export const validatePhone = (value: string): boolean => {
  value = value ? value.replace(/[\s-_]/g, '') : '';

  const phoneRegExp = /(?=\+407[1-9]\d{7}|\+40701\d{6})(?=\+407(?!(\d)\1{7}))/g;
  // const phoneRegExp = new RegExp('\\+407(?=[1-9]d{7})(?=(?!(d)\\1{7}))');

  return (
    !!value && value.length == 12 && validateTextRegexp(value, phoneRegExp)
  );
};

/** Валидация -обязательное- Номер телефона (прочие номера) */
export const validateRequiredOtherPhone = (value: string): boolean => {
  value = value ? value.replace(/[\s-_]/g, '') : '';

  return !!value && value.length >= 12 && value.length <= 13;
};

/** Валидация -необязательное- Другой Номер телефона (визард) */
export const validateOtherPhoneNumber = (value: string): boolean => {
  return value ? validatePhone(value) : true;
};

/** Валидация - Даты рождения (визард) */
export const validateBirthDate = (value: string /* Date */): boolean => {
  const fieldValue = value.replace(/\D/g, '/').replace(/\/+/g, '/');

  const dateFormat = cfg.dateFormat.toUpperCase();
  const years = moment(new Date(), dateFormat).diff(
    moment(fieldValue, dateFormat),
    'years'
  );

  return years <= 100 && years > 9;
};

/** Валидация - Паспорт/ID (визард) */
// export const validateID = (value: string): boolean => {
//   return !!value && (value.length == 9 || value.length == 12);
// };

/** Валидация - Даты выдачи ID (визард) */
export const validateIssueDate = (value: Date): boolean => {
  const dateFormat = cfg.dateFormat.toUpperCase();
  const years = moment(new Date(), dateFormat).diff(
    moment(value, dateFormat).toDate(),
    'years'
  );

  return (
    years <= 100 &&
    moment(new Date(), dateFormat).diff(moment(value, dateFormat).toDate()) > 0
  );
};

/** Валидация - Даты выдачи ID (визард) */
export const validateExpireDate = (value: Date, cmnd_cccd: string): boolean => {
  const dateFormat = cfg.dateFormat.toUpperCase();
  const years = moment(new Date(), dateFormat).diff(
    moment(value, dateFormat).toDate(),
    'years'
  );

  return cmnd_cccd?.length == 12 ? years <= 100 : true;
};

/** Валидация - Email */
export const validateEmail = (email: string): boolean => {
  const emailRegExp = new RegExp(cfg.emailFormat);

  if (email) {
    email = email.trim();
  }

  return emailRegExp.test(email);
};

/** Валидация - Brand Other (визард) */
export const validateBrandOther = (
  value: string,
  shouldShow_PHONE_BRAND_OTHER: string
): boolean =>
  shouldShow_PHONE_BRAND_OTHER == String(true)
    ? !!value && value.length <= 50
    : true;

/** Валидация - Model Other (визард) */
export const validateModelOther = (
  value: string,
  shouldShow_PHONE_MODEL_OTHER: string
): boolean =>
  shouldShow_PHONE_MODEL_OTHER == String(true)
    ? !!value && value.length <= 50
    : true;

/** Валидация - счёта */
export const validateAccountNumber = (accountNumber: string): boolean => {
  // const accountNumberRegExp = new RegExp(accountNumberFormat);
  const accountNumberRegExp = new RegExp('^.{5,30}$');

  return accountNumberRegExp.test(accountNumber);
};
