import { TJSON } from '@interfaces';
import { LoanStore } from '@src/stores/LoanStore';

export type TReminder = Partial<
  Record<'reminderTimeout', number> & Record<'reminderTemplate', string>
> &
  Partial<
    Record<'className', string> &
      Record<'showPromo', boolean> &
      Record<'callback', (data: boolean) => void>
  >;

export type TReminderStore = TReminder & Record<'loanStore', LoanStore>;

export type TState = Record<'isRender', boolean> &
  Record<'reminderData', TJSON> &
  Record<'template', string>;
