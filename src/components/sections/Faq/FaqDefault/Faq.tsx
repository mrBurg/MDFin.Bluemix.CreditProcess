import React from 'react';

import style from './Faq.module.scss';
import { AccordionWidgetRedesign } from '@components/widgets/AccordionWidgetRedesign';

function Faq(props: any) {
  return (
    <>
      <section className={style.section}>
        <div className={style.content}>
          <div className={style.faqWrap}>
            <AccordionWidgetRedesign data={props} exclusive={false} fluid />
          </div>
        </div>
      </section>
    </>
  );
}

export { Faq };
