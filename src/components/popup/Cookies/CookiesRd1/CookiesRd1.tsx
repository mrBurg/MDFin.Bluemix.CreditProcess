import React, {
  MutableRefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import reduce from 'lodash/reduce';

import { LinkWidget, TARGET } from '@components/widgets/LinkWidget';
import { ButtonWidget } from '@components/widgets/ButtonWidget';
import { GetAttachment } from '@components/GetAttachment';
import { WithTag } from '@components/hocs';
import { isDevice, setCookie } from '@utils';
import { WidgetRoles } from '@src/roles';
import { COOKIE, SIZE } from '@src/constants';
import { TJSON } from '@interfaces';

import { TCookiesRd1Props } from './@types';
import style from './CookiesRd1.module.scss';

const CookiesRd1Component = (props: TCookiesRd1Props) => {
  const {
    pageStore: { cookiesPrivacy, closeCookiesPrivacy },
  } = props;
  const cookiesRef = useRef() as MutableRefObject<HTMLInputElement>;

  const [isRender, setIsRender] = useState(false);
  const [cookiesHeight, setCookiesHeight] = useState(
    cookiesRef.current?.offsetHeight
  );

  const closePopup = useCallback(() => {
    setCookie(COOKIE.COOKIES_ACCESS, 1, 365);

    closeCookiesPrivacy();
  }, [closeCookiesPrivacy]);

  useEffect(() => {
    if (isRender) {
      setCookiesHeight(cookiesRef.current?.offsetHeight);
    } else {
      setTimeout(() => {
        setIsRender(true);
      }, 5000);
    }
  }, [isRender]);

  if (cookiesPrivacy && isRender) {
    return (
      <div id={'CookiesWrap'} className={style.cookiesWrap} ref={cookiesRef}>
        {isDevice(SIZE.XL) && (
          <style>
            {`.floatPanel.floatPanelGap{
            bottom: ${cookiesHeight}px
          }`}
          </style>
        )}
        <div className={style.cookies}>
          <WithTag
            tags={reduce(
              cookiesPrivacy.tags,
              (accum, item, index) => {
                const { type, label } = item;

                accum[index] =
                  item.tagType == 'link' ? (
                    <LinkWidget
                      id={`CookiesRd1-${type}-${WidgetRoles.link}`}
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
          <div className={style.buttonWrap}>
            <ButtonWidget
              id={`CookiesRd1-${WidgetRoles.button}-accept`}
              className={style.button}
              onClick={closePopup}
              aria-label={cookiesPrivacy.button}
            >
              {cookiesPrivacy.button}
            </ButtonWidget>
            <ButtonWidget
              id={`CookiesRd1-${WidgetRoles.button}-cancel`}
              className={style.buttonCancel}
              onClick={closePopup}
              aria-label={cookiesPrivacy.buttonCancel}
            >
              {cookiesPrivacy.buttonCancel}
            </ButtonWidget>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export const CookiesRd1 = CookiesRd1Component;
