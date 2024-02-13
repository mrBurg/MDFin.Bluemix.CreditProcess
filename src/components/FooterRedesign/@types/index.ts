import { FOOTER_TYPE } from '../FooterRedesign';

export type TPhone = {
  text: string;
  link: string;
};
export type TLink = {
  label: string;
  url: string;
};

export type TFooter = {
  socialUrl: {
    facebook: string;
    instagram: string;
    youtube: string;
  };
  getApp: {
    title: string;
  };
  contacts: {
    title: string;
    workingHours: string[];
    holidayInfo: {
      expiryDate: string;
      title: string;
      workingHours: string;
    };
    phones: TPhone[];
    address: {
      title: string;
      text: string;
    };
    email: string;
  };
  menu: TLink[];
  seoPages: TLink[];
};

export type TFooterRedesignProps = {
  className?: string;
  footerType?: FOOTER_TYPE;
};
