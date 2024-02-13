import React from 'react';
import map from 'lodash/map';
import reduce from 'lodash/reduce';

import style from './Explanations.module.scss';

import { TExplanationsProps } from './@types';
import { WithTag } from '@components/hocs';
import { GetAttachment } from '@components/GetAttachment';
import { TJSON } from '@interfaces';

function Explanations(props: TExplanationsProps[]) {
  return (
    <section className={style.section}>
      <div className={style.content}>
        {map(props, (item, index) => (
          <div key={index} className={style.item}>
            {item.title && <p className={style.itemTitle}>{item.title}</p>}
            <WithTag
              tags={reduce(
                item.tags,
                (accum, item, index) => {
                  accum[index] = (
                    <GetAttachment
                      key={index}
                      attachmentType={item.type}
                      label={item.label}
                    />
                  );

                  return accum;
                },
                {} as TJSON
              )}
            >
              <p className={style.itemText}>{item.text}</p>
            </WithTag>
          </div>
        ))}
      </div>
    </section>
  );
}

export { Explanations };
