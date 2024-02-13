import { TJSON } from '@interfaces';

export type TReminderChild = {
  className?: string;
};

export type TState = {
  isRender: boolean;
  reminderData: TJSON;
};
