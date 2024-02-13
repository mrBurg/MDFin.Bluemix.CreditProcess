import React, { ReactElement } from 'react';
import classNames from 'classnames';

import style from './NotDifficult.module.scss';
import { WithDangerousHTML } from '@components/hocs';
import { LoanButton } from '@components/LoanButton';
import { TNotDifficultProps } from './@types';
import { gt } from '@utils';

export const NotDifficult = ({
  title,
  description,
}: TNotDifficultProps): ReactElement => {
  return (
    <section className={style.section}>
      <div className={classNames(style.item, style.image)} />
      <div className={classNames(style.item, style.content)}>
        <h2 className={style.title}>{title}</h2>
        <WithDangerousHTML>
          <div className={style.description}>{description}</div>
        </WithDangerousHTML>
        <LoanButton
          className={style.loanButton}
          label={gt.gettext('Register Loan')}
        />
      </div>
    </section>
  );
};
