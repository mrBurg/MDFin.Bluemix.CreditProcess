import React, { useCallback } from 'react';

import { WithTag } from '@components/hocs';
import { ButtonWidget } from '@components/widgets/ButtonWidget';
import { TCookiesProps } from './@types';
import { COOKIE } from '@src/constants';
import { setCookie } from '@utils';

import style from './Cookies.module.scss';
import reduce from 'lodash/reduce';
import { GetAttachment } from '@components/GetAttachment';
import { TJSON } from '@interfaces';
import { WidgetRoles } from '@src/roles';
import { LinkWidget, TARGET } from '@components/widgets/LinkWidget';

const CookiesComponent = (props: TCookiesProps) => {
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
      </div>
    );
  }

  return null;
};

export const Cookies = CookiesComponent;
