import moment from 'moment';

import cfg from '@root/config.json';

export const ENVIRONMENT = process.env.ENVIRONMENT || '';
export const PO_PROJECT_HOST = process.env.PO_PROJECT_HOST || '';
export const PO_API = process.env.PO_API || '';
export const PO_API_HOST = process.env.PO_API_HOST || '';
export const PO_API_PORT = process.env.PO_API_PORT || '';
export const ACCESS_TOKEN_KEY = process.env.ACCESS_TOKEN_KEY || '';
export const REFRESH_TOKEN_KEY = process.env.REFRESH_TOKEN_KEY || '';
export const SESSION_ID_KEY = process.env.SESSION_ID_KEY || '';
export const EXTERNAL_SESSION_KEY = process.env.EXTERNAL_SESSION_KEY || '';
export const FINGER_PRINT_KEY = process.env.FINGER_PRINT_KEY || '';
export const LOCALE_KEY = process.env.LOCALE_KEY || '';
export const RECOGNID = process.env.RECOGNID || '';
export const API_KEY = process.env.API_KEY || '';
export const SECRET_KEY = process.env.SECRET_KEY || '';
export const AB_ENABLED = process.env.AB_ENABLED || '';

export const EVENT_PREFIXES = ['webkit', 'moz', 'MS', 'o', ''];

export enum EVENT {
  CHANGE_COMPLETE = 'routeChangeComplete',
  CHANGE_START = 'routeChangeStart',
  SCROLL = 'scroll',
  RESIZE = 'resize',
  CLICK = 'click',
  CLOSE_IFRAME = 'close-iframe',
}

export enum CONSTRUCTOR {
  ARRAY = 'Array',
  STRING = 'String',
}

export enum URIS_SUFFIX {
  SIGN_UP = '_SIGN_UP',
  SIGN_IN = '_SIGN_IN',
  APPLICATION = 'APPLICATION',
}

export enum METHOD {
  GET = 'get',
  POST = 'post',
}

export enum FIELD_TYPE {
  CURRENCY = 'Currency',
  DAY = 'Day',
  TERM_FRACTION_D = 'TermFractionDay',
  TERM_FRACTION_M = 'TermFractionMonth',
  DATE = 'Date',
  SHORT_DATE = 'ShortDate',
}

export enum ATTACHMENT_TYPE {
  LOAN_TERMS_AND_CONDITIONS = 'loan_terms_and_conditions',
  TERMS_AND_CONDITIONS = 'terms_and_conditions',
  PRIVACY_POLICY = 'privacy_policy',
  REAL_BENEFICIARY = 'real_beneficiary',
  HOT_SUMMER_DRAW_TERMS_AND_CONDITIONS = 'hot_summer_draw_terms_and_conditions',
  PRIZE_RACE_CONTEST_TERMS_AND_CONDITIONS = 'prize_race_contest_terms_and_conditions',
  VESPA_CONTEST_TERMS_AND_CONDITIONS = 'vespa_contest_terms_and_conditions',
  HOLLYDAYS_HAPPY_DRAW_TERMS_AND_CONDITIONS = 'hollydays_happy_draw_terms_and_conditions',
}

export enum ANIMATION {
  START = 'animationstart',
  END = 'animationend',
}

export enum TRANSITION {
  START = 'transitionstart',
  END = 'transitionend',
}

export enum HEADERS {
  AUTHORIZATION = 'Authorization',
  COOKIE = 'Cookie',
  SESSIONID = 'SESSIONID',
  CONTENT_TYPE = 'Content-Type',
  SITE_URL = 'SITE_URL',
  AUTHENTICATION = 'Authentication',
}

export enum RESPONSE_STATUS {
  OK = 'ok',
  SUCCES = '200',
  ERROR = 'error',
}

export enum OTP_ACTION {
  LOGIN = 'LOGIN',
  VERIFY_PHONE = 'VERIFY_PHONE',
  SIGN = 'SIGN',
}

export enum FIELD_NAME {
  OTP_AGREE_CHECKBOX = 'otpAgreeCheckbox',
  MARKETING = 'marketing',

  /* Obligatory */
  REQUEST_BIROULDE_CREDIT = 'requestBirouldeCredit',
  CONFIRM_ANAF = 'confirmANAF',
  CONFIRM_BENEFICIARY = 'confirmBeneficiary',
  PHONE_NUMBER = 'phoneNumber',
  PASSPORT = 'passport',
  NAME = 'name',
  LAST_NAME = 'lastName',
  FIRST_NAME = 'firstName',
  OTP = 'otp',
  BIRTH_DATE = 'birthDate',
  ID = 'cmnd_cccd',
  ISSUE_DATE = 'issueDate',
  EXPIRE_DATE = 'expireDate',
  GENDER_ID = 'gender_id',
  MARITAL_STATUS_ID = 'maritalStatus_id',
  NUMBER_OF_DEPENDENTS = 'numberOfDependents',
  EMAIL = 'email',
  LOAN_PURPOSE = 'loanPurpose',
  LOAN_PURPOSE_ID = 'loanPurpose_id',
  LOAN_PURPOSE_DESCR = 'loanPurposeDescr',
  PHONE_BRAND_ID = 'brand_id',
  PHONE_BRAND_OTHER = 'brandOther',
  PHONE_MODEL_ID = 'model_id',
  PHONE_MODEL_OTHER = 'modelOther',
  OTHER_PHONE_ID = 'otherPhone_id',
  OTHER_PHONE_NUMBER = 'otherPhoneNumber',
  AMOUNT = 'amount',
  PAYMENT_AMOUNT = 'paymentAmount', //поле на странице deal/*  */
  PIN = 'pin',

  /* Address */
  CITY_PROVINCE = 'cityProvince_id',
  DISTRICT = 'district_id',
  WARD_COMMUNE = 'wardCommune_id',
  STREET = 'street',
  BUILDING = 'building',
  APARTMENT = 'apartment',
  YEARS = 'currentPlaceLivingYear',
  MONTHS = 'currentPlaceLivingMonth',
  THIRD_PARTY_PHONE = 'thirdParty_phoneNumber',
  THIRD_PARTY_NAME = 'thirdParty_name',
  THIRD_PARTY_RELATION = 'thirdParty_type_id',
  THIRD_PARTY = 'thirdParty',

  /* Job */
  JOB_ID = 'job_id',
  SOCIAL_STATUS_ID = 'socialStatus_id',
  EDUCATION_ID = 'education_id',
  COMPANY_NAME = 'companyName',
  INDUSTRY_ID = 'industry_id',
  INDUSTRY_DETAILED_ID = 'industryDetailed_id',
  POS_TYPE_ID = 'posType_id',
  POS_NAME = 'posName',
  WORK_YEARS = 'jobLastPeriodYear',
  WORK_MONTHS = 'jobLastPeriodMonth',
  INCOME_ID = 'income_id',
  INCOME = 'income',

  /* Job contact */
  JOB_CONTACT_ID = 'id',
  JOB_CONTACT_PHONE = 'jobContact_phoneNumber',
  JOB_CONTACT_NAME = 'jobContact_name',
  JOB_CONTACT_TYPE_ID = 'type_id',

  ACCOUNT_ID = 'account_id',
  BANK_ID = 'bank_id',
  REASON_ID = 'reason_id',
  ACCOUNT_NUMBER = 'accountNumber',
}

export const GRAPHIC_FILES = ['.gif', '.jpg', '.jpeg', '.png', '.bmp', '.tiff'];

export enum STATUS {
  OK = 200,
  NOT_AUTHORIZED = 401,
  BAD_REQUEST = 400,
}

export enum DOC_TYPE {
  LOAN_PURPOSE_MEDICATION = 1,
  LOAN_PURPOSE_EDUCATION = 2,
  idFront = 4,
  idBack = 5,
  other = 7,
  agreement = 14,
  selfie = 30,
  statementResponsibility = 42,
}

export const staticTagslist = {
  year: moment().format('YYYY'),
  day: moment().format('dddd'),
  newline: '<br />',
};

export enum CALLBACK_TYPE {
  phones = 'tel',
  emails = 'mailto',
  calls = 'callto',
}

export enum LINK_RELATION {
  NOFOLLOW = 'nofollow', // Не передавать по ссылке ТИЦ и PR.
  NOOPENER = 'noopener', // не позволяет новой вкладке воспользоваться функцией window.opener
  NOREFERRER = 'noreferrer', // Не передавать по ссылке HTTP-заголовки.
}

export enum DATA_TYPE {
  STRING = 'string',
  FUNCTION = 'function',
  OBJECT = 'object',
  BOOLEAN = 'boolean',
  NUMBER = 'number',
  SCRIPT = 'script',
}

export enum COOKIE {
  SESSIONID = 'SESSIONID',
  COOKIES_ACCESS = 'Cookies_Access',
  APP_BANNER = 'AppBanner',
  REMINDER_CLOSE = 'ReminderClose',
}

export enum SIZE {
  XXS = 'xxs',
  XS = 'xs',
  SM = 'sm',
  MD = 'md',
  LG = 'lg',
  XL = 'xl',
  XXL = 'xxl',
}

export enum TERM_FRACTION {
  DAY = 'D',
  MONTH = 'M',
}

export enum CLIENT_TABS {
  PHONEVERIFY = 'phoneverify',
  OBLIGATORY = 'obligatory',
  JOB = 'job',
  ADDRESS = 'address',
  ACCOUNT_CARD = 'account_card',
  DOCUMENTS = 'documents',

  ID_PHOTO = 'id_photo',
  SELFIE = 'selfie',
  WRONG_ACCOUNT = 'wrongaccount',
  APPLICATION = 'application',
}

export enum GOALPAGE {
  GOALPAGE = 'goalpage',
  GOALPAGE_ALL = 'goalpage_all',
  GOALPAGE_START = 'goalpage_start',
}

export enum VIEW_ID {
  SENDMONEY = 'sendmoney',
}

export enum SELECT_OPTION_NAME {
  BRAND_ID = 'brand_id',
  MODEL_ID = 'model_id',
  INDUSTRY_ID = 'industry_id',
}

export const securedSiteList = [PO_PROJECT_HOST, ...cfg.securedSiteList];

// Regular Expressions
export const regexp2num = /^\d{1,2}$/g;
export const regexp1_6 = /^\d{1,6}$/g;
export const regexp9or12num = /^\d{9}$|^\d{12}$/g;
export const regexp13 = /^\d{13}$/g;
export const regexppassport = new RegExp(cfg.passportFormat);

export enum SCRIPT_STRATEGY {
  BEFORE_INTERACTIVE = 'beforeInteractive',
  AFTER_INTERACTIVE = 'afterInteractive',
  LAZY_ONLOAD = 'lazyOnload',
  WORKER = 'worker',
}

// Upsell
export enum FLOW {
  UPSELL = 'upsell',
  WIZARD = 'wizard',
}

export enum SLUG {
  CHECK = 'check',
}

export enum PAYMENT_METHOD {
  IFRAME = 'iframe',
  REDIRECT = 'redirect',
}
