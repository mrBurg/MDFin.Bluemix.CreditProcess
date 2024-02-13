import React, { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { gt } from '@utils';

import { CALLBACK_TYPE, EVENT } from '@src/constants';
import { WidgetRoles } from '@src/roles';
import { LinkWidget, TARGET } from '@components/widgets/LinkWidget';
import { ButtonWidget, BUTTON_TYPE } from '@components/widgets/ButtonWidget';

import style from './ContactInfo.module.scss';

export function ContactInfo() {
  const [contactInfoMenu, setContactInfoMenu] = useState(false);

  const buttonRef = useRef<HTMLButtonElement>(null);

  const closeMenu = useCallback((event: any) => {
    event.stopPropagation();
    setContactInfoMenu(false);
  }, []);

  const renderContactInfoMenu = useCallback(() => {
    return (
      <div className={style.contactInfoMenu} onClick={closeMenu} aria-hidden>
        <div className={style.topBlock}>
          <div className={style.title}>{gt.gettext('Contacts')}</div>
          <LinkWidget
            id={`ContactInfo-${WidgetRoles.link}`}
            href={`${CALLBACK_TYPE.phones}:${gt.gettext('hotlinePhone')}`}
            className={style.phone}
          >
            {gt.gettext('hotlinePhone')}
          </LinkWidget>
        </div>
        <hr />
        <div className={style.bottomBlock}>
          <LinkWidget href={gt.gettext('facebookUrl')} target={TARGET.BLANK}>
            <Image
              src={'/theme/icons/facebook-yellow-icon.svg'}
              width={24}
              height={24}
              alt={'facebook-yellow-icon'}
            />
          </LinkWidget>

          <LinkWidget href={gt.gettext('instagramUrl')} target={TARGET.BLANK}>
            <Image
              src={'/theme/icons/instagram-yellow-icon.svg'}
              width={24}
              height={24}
              alt={'instagram-yellow-icon'}
            />
          </LinkWidget>

          <LinkWidget href={gt.gettext('youtubeUrl')} target={TARGET.BLANK}>
            <Image
              src={'/theme/icons/youtube-yellow-icon.svg'}
              width={24}
              height={24}
              alt={'youtube-yellow-icon'}
            />
          </LinkWidget>
        </div>
      </div>
    );
  }, [closeMenu]);

  useEffect(() => {
    const buttonClick = (event: MouseEvent) => {
      setContactInfoMenu(event.target == buttonRef.current);
    };
    document.addEventListener(EVENT.CLICK, buttonClick);
    return () => document.removeEventListener(EVENT.CLICK, buttonClick);
  }, []);

  return (
    <div className={style.contactInfo}>
      <ButtonWidget
        className={style.contactInfoButton}
        type={BUTTON_TYPE.BUTTON}
        ref={buttonRef}
        aria-label="Contact info menu"
      >
        <Image
          src={'/images/header/contact-info-icon.svg'}
          width={24}
          height={24}
          alt="contact-info-icon"
        />
      </ButtonWidget>
      {contactInfoMenu && (
        <div className={style.contactInfoMenuHolder}>
          {renderContactInfoMenu()}
        </div>
      )}
    </div>
  );
}
