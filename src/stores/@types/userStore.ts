import { UserStore } from '../UserStore';

export type TAppProps = Pick<
  UserStore,
  'device' | 'fingerprint' | 'visitorId' | 'isCabinet'
>;

export type TField = Record<'name', string> & Record<'value', any>;

/* Obligatory */
export type TUserObligatory = Partial<
  Record<
    | 'birthDate' // Date 2020-08-13T15:37:25.787Z,
    | 'phoneNumber'
    | 'email'
    | 'loanPurposeDescr'
    | 'otherPhoneNumber'
    | 'firstName'
    | 'lastName'
    | 'passport'
    | 'pin'
    | 'monthlyIncome',
    string
  > &
    Record<'income' | 'loanPurpose_id' | 'otherPhone_id', number> &
    Record<
      | 'requestBirouldeCredit'
      | 'marketing'
      | 'requestBirouldeCredit_data'
      | 'confirmANAF',
      boolean
    >
>;

/* Address */
export type TUserAddress = Partial<
  Record<
    | 'id'
    | 'cityProvince_id'
    | 'district_id'
    | 'wardCommune_id'
    | 'currentPlaceLivingYear'
    | 'currentPlaceLivingMonth',
    number
  > &
    Record<
      | 'street'
      | 'building'
      | 'apartment'
      | 'livingPeriod'
      | 'thirdPartyPhone'
      | 'thirdPartyName'
      | 'thirdPartyRelation',
      string
    > &
    Record<'shouldShow_DISTRICT' | 'shouldShow_WARD_COMMUNE', boolean>
>;

export type TUserContacts = Partial<
  Record<'name' | 'phoneNumber' | 'type_id', string> & Record<'id', number>
>;

export type TUserJobContact = Partial<
  Record<'id' | 'type_id', number> & Record<'name' | 'phoneNumber', string>
>;
export type TUserJob = Partial<
  Record<
    | 'job_id'
    | 'socialStatus_id'
    | 'education_id'
    | 'industry_id'
    | 'industryDetailed_id'
    | 'posType_id'
    | 'jobLastPeriodYear'
    | 'jobLastPeriodMonth'
    | 'income_id'
    | 'income',
    number
  > &
    Record<'posName' | 'companyName', string> &
    Record<'contact', TUserJobContact>
>;

export type TUserData = Partial<Record<'otpId', number>> & TUserObligatory;

export type TGetClientStep = Record<'view', string>;

export type TValidateLead = Record<'req' | 'fingerprint', string>;

export type TValidateEmail = Record<'success' | 'failed', string>;

export type TUnsubscribe = Record<'success' | 'failed', string>;

export type TLoanRequest = Record<'amount' | 'term', number> &
  Record<'termFraction', string> &
  Record<'fixedAmount', boolean>;

export type TClientPersonalInfo = Record<
  'lastName' | 'firstName' | 'birthDate' | 'pin' | 'passport',
  string
> &
  Record<'pi_id', number> &
  Record<'confirmed', boolean>;

export type TClientAddInfo = Record<
  'income_id' | 'income' | 'loanPurpose_id' | 'otherPhone_id',
  number
> &
  Record<'loanPurposeDescr' | 'otherPhoneNumber', string> &
  Record<
    'requestBirouldeCredit' | 'confirmANAF' | 'confirmBeneficiary',
    boolean
  >;

export type TGetSignUpData = Record<'phoneNumber' | 'firstName', string>;
