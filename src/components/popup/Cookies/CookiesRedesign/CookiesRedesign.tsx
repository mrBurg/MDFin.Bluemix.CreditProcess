import React, { useCallback } from 'react';
import reduce from 'lodash/reduce';

import { LinkWidget, TARGET } from '@components/widgets/LinkWidget';
import { ButtonWidget } from '@components/widgets/ButtonWidget';
import { GetAttachment } from '@components/GetAttachment';
import { WithTag } from '@components/hocs';
import { setCookie } from '@utils';
import { WidgetRoles } from '@src/roles';
import { COOKIE } from '@src/constants';
import { TJSON } from '@interfaces';

import { TCookiesRedesignProps } from './@types';
import style from './CookiesRedesign.module.scss';

const CookiesRedesignComponent = (props: TCookiesRedesignProps) => {
  const {
    pageStore: { cookiesPrivacy, closeCookiesPrivacy },
  } = props;

  const closePopup = useCallback(() => {
    setCookie(COOKIE.COOKIES_ACCESS, 1, 365);

    closeCookiesPrivacy();
  }, [closeCookiesPrivacy]);

  if (cookiesPrivacy) {
    return (
      <div className={style.cookies}>
        <WithTag
          tags={reduce(
            cookiesPrivacy.tags,
            (accum, item, index) => {
              const { type, label } = item;

              accum[index] =
                item.tagType == 'link' ? (
                  <LinkWidget
                    id={`Cookies-${type}-${WidgetRoles.link}`}
                    href={item.href}
                    className={style.link}
                    target={TARGET.BLANK}
                    key={index}
                  >
                    {label}
                  </LinkWidget>
                ) : (
                  <GetAttachment
                    attachmentType={type}
                    label={label}
                    className={style.link}
                    key={index}
                  />
                );
              return accum;
            },
            {} as TJSON
          )}
        >
          <p>{cookiesPrivacy.text}</p>
        </WithTag>
        <ButtonWidget
          id={`Cookies-${WidgetRoles.button}`}
          className={style.button}
          onClick={closePopup}
          aria-label="Confirm cookies"
        >
          {cookiesPrivacy.button}
        </ButtonWidget>
        <button
          className={style.close}
          onClick={closePopup}
          aria-label="Close cookies popup"
        />
      </div>
    );
  }

  return null;
};

export const CookiesRedesign = CookiesRedesignComponent;
