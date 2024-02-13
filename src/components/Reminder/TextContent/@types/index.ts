import { TJSON } from '@interfaces';

export type TReminderChild = {
  className?: string;
  reminderData: TJSON;
};

export type TState = {
  isRender: boolean;
};
