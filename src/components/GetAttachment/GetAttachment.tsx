import React, { useEffect, useState } from 'react';

import style from './GetAttachment.module.scss';

import {
  TGetAttachment,
  TGetGeneratedAttachment,
  TGetGeneratedAttachmentStore,
} from './@types';
import { URIS } from '@routes';
import { makeStaticUri, makeUri } from '@utils';
import { LINK_RELATION } from '@src/constants';
import classNames from 'classnames';
import { STORE_IDS } from '@stores';
import { inject } from 'mobx-react';
import { LinkWidget, TARGET } from '@components/widgets/LinkWidget';

function GetAttachment(props: TGetAttachment) {
  return (
    <LinkWidget
      className={classNames(props.className, style.link)}
      href={makeStaticUri(
        (URIS.GET_ATTACHMENT_DOC_TYPE + props.attachmentType) as URIS
      )}
      target={TARGET.BLANK}
      rel={[LINK_RELATION.NOOPENER, LINK_RELATION.NOREFERRER].join(' ')}
    >
      {props.label}
    </LinkWidget>
  );
}

export { GetAttachment };

function GetGeneratedAttachmentComponent(props: TGetGeneratedAttachment) {
  const { className, attachmentType, label, requestData, userStore } =
    props as TGetGeneratedAttachmentStore;

  const [docUrl, setDocUrl] = useState('');

  useEffect(() => {
    const getUrl = async () => {
      const response = await userStore.getGeneratedAttachment(
        (URIS.GET_GENERATED_ATTACHMENT_DOC_TYPE + attachmentType) as URIS,
        requestData
      );

      if (response) {
        const { document } = response;
        setDocUrl(makeUri(document.url));
      }
    };

    getUrl();
  }, [attachmentType, requestData, userStore]);

  return (
    <LinkWidget
      href={docUrl}
      className={classNames(className, style.link, style.generatedAttachment)}
      target={TARGET.BLANK}
      rel={[LINK_RELATION.NOOPENER, LINK_RELATION.NOREFERRER].join(' ')}
      aria-hidden
    >
      {label}
    </LinkWidget>
  );
}

export const GetGeneratedAttachment = inject(STORE_IDS.USER_STORE)(
  GetGeneratedAttachmentComponent
);
