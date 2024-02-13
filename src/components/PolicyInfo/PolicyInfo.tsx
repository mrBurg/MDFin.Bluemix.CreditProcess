import React from 'react';
import classNames from 'classnames';
import map from 'lodash/map';
import reduce from 'lodash/reduce';
import size from 'lodash/size';

import style from './PolicyInfo.module.scss';

import { TPolicyInfoProps } from './@types';
import { CheckboxWidget } from '@components/widgets/CheckboxWidget';
import { WithLink, WithTag } from '@components/hocs';
import { TJSON } from '@interfaces';
import { TCheckboxData } from '@components/widgets/CheckboxWidget/@types';

function PolicyInfo(props: TPolicyInfoProps) {
  return (
    <div className={classNames(style.policyInfo, props.className)}>
      {map(props.checkBoxes, (item, index) => (
        <div
          key={index}
          className={classNames(style.policyInfoItem, {
            [style.policyInfoAccent]: item.accent,
          })}
        >
          <div>
            <CheckboxWidget
              checked={item.checked}
              name={index}
              onChange={(event, data) =>
                props.onChange(data as TCheckboxData, event)
              }
              invalid={item.invalid}
            />
          </div>
          {props.docs ? (
            <WithLink
              links={reduce(
                props.docs,
                (accum, item) => {
                  accum[`docType${item.type_id}`] = {
                    link: item.type,
                  };

                  if (size(item.documents)) {
                    accum[`docType${item.type_id}`] = {
                      link: item.documents[0].url,
                    };
                  }

                  return accum;
                },
                {} as TJSON
              )}
            >
              <p>{item.text}</p>
            </WithLink>
          ) : (
            <WithTag>
              <p>{item.text}</p>
            </WithTag>
          )}
        </div>
      ))}
    </div>
  );
}

export { PolicyInfo };
