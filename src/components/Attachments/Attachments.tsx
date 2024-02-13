import React, { useMemo } from 'react';
import map from 'lodash/map';

import style from './Attachments.module.scss';

import { AddFile, UploadedFile } from '@components/File';
import { TJSON } from '@interfaces';

import cfg from '@root/config.json';
import { DOC_TYPE } from '@src/constants';
import { TAttachments } from './@types';
import { TDocument } from '@stores-types/loanStore';
import { WithTag } from '@components/hocs';

function Attachments(props: TAttachments) {
  const { documents, full, locales, ...fileProps } = props;

  const attachmentTitle = useMemo(
    () => (locales.buttons as TJSON)[DOC_TYPE[props.type_id]],
    [locales.buttons, props.type_id]
  );

  return (
    <div className={style.group}>
      <WithTag>
        <h2 className={style.groupTitle}>{attachmentTitle}</h2>
      </WithTag>

      <div className={style.groupData}>
        <div className={style.documentsWrap}>
          {map(documents, (item: TDocument, key) => (
            <UploadedFile {...item} key={key} className={style.file} />
          ))}
        </div>
        {!full && (
          <AddFile accept={cfg.allowedFileTypes.join(',')} {...fileProps} />
        )}
      </div>
    </div>
  );
}

export { Attachments };
