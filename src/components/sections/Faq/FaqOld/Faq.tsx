import React from 'react';

import style from './Faq.module.scss';
import { AccordionWidget } from '@components/widgets/AccordionWidget';

function Faq(props: any) {
  return (
    <section className={style.section}>
      <div className={style.content}>
        <div className={style.faqWrap}>
          <AccordionWidget
            data={props}
            exclusive={false}
            classNameTitle={style.title}
            fluid
          />
        </div>
      </div>
    </section>
  );
}

export { Faq };
