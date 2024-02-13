import React from 'react';
import classNames from 'classnames';
import map from 'lodash/map';

import style from './Feedback.module.scss';
import { Logo } from '@components/Logo';
import { TJSON } from '@interfaces';
import { CALLBACK_TYPE } from '@src/constants';
import { WidgetRoles } from '@src/roles';
import { TFeedback } from './@types';
import { LinkWidget, TARGET } from '@components/widgets/LinkWidget';

function Feedback(props: TFeedback) {
  const { className, phones, emails, workHour, termsAndConditions } = props;

  return (
    <section className={classNames(style.feedback, className)}>
      <div className={style.container}>
        <div className={style.logo}>
          <Logo />
        </div>
        <div className={style.contacts}>
          {map({ emails, phones }, (item, key) => {
            const { list, main } = item;

            return (
              <p
                key={key}
                className={classNames(style.contactsItem, style[key])}
              >
                <LinkWidget
                  id={`Feedback-${WidgetRoles.link}`}
                  href={`${(CALLBACK_TYPE as TJSON)[key]}:${list[main]}`}
                >
                  {list[main]}
                </LinkWidget>
              </p>
            );
          })}
          <p className={classNames(style.contactsItem, style.workHour)}>
            {workHour}
          </p>
          <p className={style.doc}>
            <LinkWidget
              id={`Feedback-${WidgetRoles.link}`}
              className={style.link}
              href={termsAndConditions.link}
              target={TARGET.BLANK}
            >
              {termsAndConditions.text}
            </LinkWidget>
          </p>
        </div>
      </div>
    </section>
  );
}

export { Feedback };
