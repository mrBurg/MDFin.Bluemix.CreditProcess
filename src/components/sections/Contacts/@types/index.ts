export type TListItem = {
  text?: string;
  link?: string;
};

export type TContactsItem = {
  list: string[];
  title: string;
  main: number;
};

type THolidayInfo = {
  title: string;
  expiryDate: string;
  workingHours: string[];
};

export type TContactsProps = {
  pageTitle: string;
  phones: TContactsItem;
  addresses: TContactsItem;
  emails: TContactsItem;
  showTitle?: boolean;
  expiryDate?: string;
  holidayInfo?: THolidayInfo;
};
