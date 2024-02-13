import fromPairs from 'lodash/fromPairs';
import map from 'lodash/map';
import reduce from 'lodash/reduce';
import { TRouter } from './@types';

const pageNames = {
  // Статические страницы
  home: 'HOME',
  contacts: 'CONTACTS',
  faq: 'FAQ',
  blog: 'BLOG',
  repayment: 'REPAYMENT',
  signIn: 'SIGN_IN',
  notFound: 'NOT_FOUND',
  aboutLoan: 'ABOUT_LOAN',
  activity: 'ACTIVITY',
  personalInformation: 'PERSONAL_INFORMATION',
  generatedAttachment: 'GENERATED_ATTACHMENT',
  leadIframe: 'LEAD_IFRAME',
  goalpage: 'GOALPAGE',
  goalpageAll: 'GOALPAGE_ALL',
  goalpageStart: 'GOALPAGE_START',
  start: 'START',
  // Динамические страницы
  index: 'index',
  phoneverify: 'phoneverify',
  deal: 'deal',
  notify: 'notify',
  wrongaccount: 'wrongaccount',
  inprocess: 'inprocess',
  sendmoney: 'sendmoney',
  application: 'application',
  attachmentAccount: 'attachment_account',
  renew: 'renew',
  idPhoto: 'id_photo',
  selfie: 'selfie',
  obligatory: 'obligatory',
  obligatoryCheck: 'obligatory_check',
  address: 'address',
  job: 'job',
  accountCard: 'account_card',
  redesign: 'redesign',
  ekyc: 'ekyc',
  // Тестовые страницы
  dev: 'DEV',
};

//ссылки на страницы сайта
const routeMap = new Map([
  [pageNames.home, '/'],
  [pageNames.contacts, '/contacts'],
  [pageNames.faq, '/faq'],
  [pageNames.blog, '/blog'],
  [pageNames.repayment, '/repayment'],
  [pageNames.signIn, '/sign-in'],
  [pageNames.notFound, '/404'],
  [pageNames.aboutLoan, '/about-loan'],
  [pageNames.activity, '/activity'],
  [pageNames.start, '/start'],

  // Participants in the process
  [pageNames.index, '/'],
  [pageNames.phoneverify, '/sign-up'],
]);

// Клиентские страницы
export const clientPage = new Map([
  [pageNames.deal, '/deal'],
  [pageNames.notify, '/notify'],
  [pageNames.wrongaccount, '/wrongaccount'],
  [pageNames.inprocess, '/inprocess'],
  [pageNames.sendmoney, '/sendmoney'],
  [pageNames.application, '/application'],
  [pageNames.attachmentAccount, '/client/documents'],
  [pageNames.renew, '/credit-line'],
  [pageNames.personalInformation, '/personalinformation'],
  [pageNames.generatedAttachment, '/client/generated-attachment'],
  [pageNames.ekyc, '/ekyc'],
]);

export const wizardPage = new Map([
  [pageNames.idPhoto, '/client/id_photo'],
  [pageNames.selfie, '/client/selfie'],
  [pageNames.obligatory, '/client/obligatory'],
  [pageNames.obligatoryCheck, '/client/obligatory/[check]'],
  [pageNames.address, '/client/address'],
  [pageNames.job, '/client/job'],
  [pageNames.accountCard, '/client/account_card'],
]);

const leadPage = new Map([[pageNames.leadIframe, '/lead/iframe']]);

const goalPage = new Map([
  [pageNames.goalpage, '/goal/goalpage'],
  [pageNames.goalpageAll, '/goal/goalpage_all'],
  [pageNames.goalpageStart, '/goal/goalpage_start'],
]);

const testPage = new Map([
  [pageNames.dev, '/dev'],
  [pageNames.redesign, '/redesign'],
]);

export const URLS = fromPairs([
  ...routeMap,
  ...clientPage,
  ...wizardPage,
  ...leadPage,
  ...goalPage,
  ...testPage,
]);

export const applicationPages = reduce(
  [...clientPage, ...wizardPage],
  (accum, item) => {
    accum.push(item[1]);

    return accum;
  },
  [] as string[]
);

export const allowedPages = [clientPage.get(pageNames.personalInformation)];

//ссылки для вызова сервисов
export enum URIS {
  // l10n
  CLEAR_CACHE = '/l10n/clear-cache',
  L10N_VALUE = '/l10n/value',
  L10N_LIST = '/l10n/list',

  //config
  CONFIG_VALUE = '/config/value',
  CONFIG_LIST = '/config/list',
  CLEAR_CONFIG_CACHE = '/config/clear-cache',
  EKYC = '/ekyc/info',

  // signin & signup
  SEND_OTP_SIGN_IN = '/signin/sendOtp',
  VALIDATE_OTP_SIGN_IN = '/signin/validateOtp',
  REFRESH_TOKEN = '/signin/refreshToken',
  SEND_OTP_SIGN_UP = '/signup/sendOtp',
  VALIDATE_OTP_SIGN_UP = '/signup/validateOtp',
  OBLIGATORY_SIGN_UP = '/signup/obligatory',
  LOGOUT = '/signin/logout',

  // test
  GET_OTP = '/test/getOtp',

  // calculator
  GET_PRODUCTS = '/calculator/getProducts',
  GET_CALCULATOR_PARAMS = '/calculator/getCalculatorParams',
  CALCULATE = '/calculator/calculate',
  REMINDER = '/calculator/reminder',

  // Client
  ALL_CLIENT_INFO = '/client/info',
  PERSONAL_INFO = '/client/pi',
  ADDITIONAL_INFO = '/client/add_info',
  ADDITIONAL_INFO_CHECK = '/client/add_info_check',
  REACTIVATION = '/cabinet/reactivation',
  DECLINE_DEAL = '/cabinet/decline_deal',

  // wizard
  GET_CLIENT_STEP = '/wizard/view',
  POST_CLIENT_STEP = '/wizard/view',
  WIZARD_START = '/wizard/start',
  OBLIGATORY = '/wizard/obligatory',
  OBLIGATORY_CHECK = '/wizard/obligatoryCheck',
  address = '/wizard/address',
  job = '/wizard/job',
  //account = '/wizard/account', //не используется в horacredit
  ACCOUNT_CARD = '/wizard/account_card',

  VIEW_CHECK = '/wizard/view_check',

  //directory
  DIRECTORY = '/directory',

  // cabinet & application
  application = '/cabinet/application',
  CABINET_SIGN = '/cabinet/sign',
  CABINET_CONFIRM_CHECK = '/cabinet/confirmCheck',
  CABINET_CONFIRM = '/cabinet/confirm',
  CABINET_DECLINE = '/cabinet/decline',
  deals = '/cabinet/deals', //Запрос данных для отображения сделки в ЛК
  deal = '/cabinet/deal', //Запрос данных для отображения сделки на сайте
  CABINET_PAY = '/cabinet/pay', //погашение из сайта И ЛК
  CLIENT_INFO = '/cabinet/clientInfo', //ЛК информация о клиенте
  CLIENT_ARCHIVE = '/cabinet/archivedAttachments', //ЛК информация о клиенте
  CLIENT_EXPIRED_DOCUMENT = '/cabinet/expired_document', //ЛК информация о клиенте
  CABINET_CHANGE_ACCOUNT = '/payment/selectPaymentToken', //смена счета в ЛК и последний шаг визарда
  CABINET_ADD_ACCOUNT = '/payment/addAccount', //добавление нового счета в ЛК и последний шаг визарда
  CABINET_ADD_CARD = '/payment/addCard', //добавление новой КАРТЫ в ЛК и последний шаг визарда
  CABINET_CARD_ENABLED = '/payment/card_enabled', //Проверка возможности добавления карты
  CABINET_LIBRA_RESULT = '/payment/librapayAddCardResult', //ответ Librapay при добавление новой КАРТЫ
  UPSELL_START = '/cabinet/upsell_start', // Upsell повышение кредита
  BACK_STEP = '/cabinet/back', // Сервис вернутся назад

  // notification
  notify = '/notification',
  notify_Confirm_Display = '/notification/confirmDisplay',

  // attachment
  UPLOAD_ATTACHMENT = '/attachment/upload',
  GET_ATTACHMENT_DOC_TYPE = '/attachment/get/', //возвращает pdf-документ. Параметр - {documentType}
  GET_GENERATED_ATTACHMENT_DOC_TYPE = '/attachment/load/', //возвращает pdf-документ. Параметр - {documentType}
  GET_TERMS_AND_CONDITIONS_DOC_TYPE = '/attachment/getTermsAndConditionsDocType', //возвращает тип документа "terms_and_conditions"

  //tracking
  EXTERNAL_TRACKING = '/external_tracking',
  EXTERNAL_TRACKING_API = '/trackingapi',
  EXTERNAL_TRACKING_LOGGER = '/trackingapi_logger',

  // Local Services API
  LOCAL_API = '/po/api',
  CREATE_SQL = '/createsql',

  // campaign
  VALIDATE_EMAIL = '/campaign/validateEmail',
  UNSUBSCRIBE = '/campaign/unsubscribe',

  // Lead
  LEAD_LOGIN = '/signin/validateLead',

  //Goalpage
  GOALPAGE = '/goal/goalpage', //'/wizard/goalpage',
  GOALPAGE_SCRIPT = '/goal/goalpage_script', //'/wizard/goalpage_script',
  PIXEL = '/goal/pixel',
  PIXEL_SCRIPT = '/goal/pixel_script',
  NINJA_SCRIPT = '/goal/nj',

  //Loyalty
  LOYALTY = '/loyalty',
  LOYALTY_INFO = '/loyalty/info ',
  LOYALTY_ADDCODE = '/loyalty/addCode',
}

/* путь к сервису справочника */
export enum DIRECTORIES {
  // Obligatory
  dirGender = '/gender',
  dirMaritalStatus = '/marital_status',
  dirLoanPurpose = '/loan_purpose',
  dirMobilePhoneBrand = '/mobile_phone_brand',
  dirMobilePhoneModel = '/mobile_phone_brand',

  // Address
  dirCityProvince = '/city_province',
  dirDistrict = '/district',
  dirWardCommune = '/ward_commune',
  dirThirdPartyRelation = '/third_party_relation',

  // Job
  dirSocialStatus = '/social_status',
  dirEducation = '/education',
  dirIndustry = '/industry',
  dirIndustryDetailed = '/industry',
  dirJobPosType = '/job_pos_type',
  dirJobRelationType = '/job_relation_type',

  // Accounts
  dirBank = '/bank',

  // Application
  dirDeclinedByClientReason = '/declined_by_client_reason',
}

export const mainMenu: TRouter[] = [
  {
    href: URLS.ABOUT_LOAN,
    title: 'About Loan',
    index: 1,
  },
  {
    href: URLS.REPAYMENT,
    title: 'Repayment',
    index: 0,
  },
  {
    href: URLS.FAQ,
    title: 'FAQ',
  },
  {
    href: URLS.BLOG,
    title: 'Blog',
  },
  {
    href: URLS.CONTACTS,
    title: 'Contacts',
  },
  {
    href: URLS.SIGN_IN,
    title: 'Sign In',
    button: true,
  },
];

export const cabinetMenu: TRouter[] = [
  {
    href: URLS.PERSONAL_INFORMATION,
    title: 'Personal information',
    iconName: 'portrait-icon.svg',
  },
  {
    href: URLS.ACTIVITY,
    title: 'Activity',
    iconName: 'document-icon.svg',
  },
];

export const allRoutes: TRouter[] = map(URLS, (val, key) => ({
  href: val,
  title: key,
}));
