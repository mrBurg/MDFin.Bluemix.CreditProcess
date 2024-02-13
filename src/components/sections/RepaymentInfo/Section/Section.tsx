import React, { useCallback, useEffect, useState } from 'react';
import classNames from 'classnames';
import isArray from 'lodash/isArray';
import map from 'lodash/map';

import style from './Section.module.scss';

import { TSectionProps } from './@types';
import { WithDangerousHTML, WithTag } from '@components/hocs';
import { EVENT, SIZE } from '@src/constants';
import { isDevice } from '@utils';
import { RepaymentForm } from '@components/RepaymentForm';
import { useMemo } from 'react';
import { BUTTON_TYPE } from '@components/widgets/ButtonWidget';

function Section(props: TSectionProps) {
  const {
    content: { title, text },
    bankAccounts,
    index,
  } = props;
  const isMob = useMemo(() => isDevice(SIZE.XS), []);
  const [collapse, setCollapse] = useState(isMob);

  useEffect(() => {
    const updateSection = () => setCollapse(isDevice(SIZE.XS));

    window.addEventListener(EVENT.RESIZE, updateSection);

    return () => window.removeEventListener(EVENT.RESIZE, updateSection);
  }, []);

  const renderContent = useCallback(
    () => (
      <div
        className={classNames(style.content, {
          [style.collapsed]: collapse,
        })}
      >
        {isArray(text) ? (
          <ul className={style.list}>
            {map(text, (item, key) => (
              <WithTag
                key={key}
                tags={{
                  bankAccounts: (
                    <ul className={style.list}>
                      {map(bankAccounts, (account, key) => (
                        <li key={key}>{account}</li>
                      ))}
                    </ul>
                  ),
                }}
              >
                <li>{item}</li>
              </WithTag>
            ))}
          </ul>
        ) : (
          <WithDangerousHTML>
            <div className={style.text}>{text}</div>
          </WithDangerousHTML>
        )}
      </div>
    ),
    [bankAccounts, text, collapse]
  );

  return (
    <section className={style.section}>
      {isMob ? (
        <button
          type={BUTTON_TYPE.BUTTON}
          className={classNames(
            style.icon,
            style.button,
            style[`icon${index}`]
          )}
          onClick={() => {
            setCollapse(!collapse);
          }}
        />
      ) : (
        <div className={classNames(style.icon, style[`icon${index}`])} />
      )}
      <div className={style.container}>
        {title && index ? (
          <h3 className={style.title}>{title}</h3>
        ) : (
          <RepaymentForm
            renderTitle={(className) => (
              <h3 className={classNames(style.title, className)}>{title}</h3>
            )}
          />
        )}
        {renderContent()}
      </div>
    </section>
  );
}

export { Section };
