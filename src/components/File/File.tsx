import React, { useCallback, useMemo, useState } from 'react';
import noop from 'lodash/noop';
import { inject } from 'mobx-react';
import classNames from 'classnames';
import path from 'path';

import style from './File.module.scss';
import AddButton from './icons/addButtonRed.svg';

import { GRAPHIC_FILES, PO_PROJECT_HOST } from '@src/constants';
import { AbstractRoles } from '@src/roles';
import { STORE_IDS } from '@stores';
import { TAddFile, TAddFileStore, TUploadedFile } from './@types';
import { FileWidget, INPUT_TYPE } from '@components/widgets/InputWidget';

function AddFileComponent(props: TAddFile) {
  const {
    loanStore,
    type_id,
    //maxFileSize,
    className,
    multiple,
    accept,
    capture,
    label = <AddButton />,
    view,
    onClick = noop,
    callBack = noop,
    disabled,
    notActive,
  } = props as TAddFileStore;

  const styleView = useMemo(() => {
    switch (view) {
      case 'button':
        return style.commandButton;

      default:
        return style.addButton;
    }
  }, [view]);

  const [isDisabled, setDisabled] = useState(notActive);

  const addFileHandler = useCallback(
    (target: EventTarget & HTMLInputElement) => {
      const { files, dataset } = target;

      setDisabled(true);

      if (files && dataset.type && target.value) {
        /** Если нужно ограничить размер файла */
        /* if (maxFileSize && files[0] && files[0].size > maxFileSize) {
          alert('File can be less than ' + maxFileSize / 1024 / 1024 + ' MB');
          return;
        } */
        onClick();
        loanStore.uploadAttachment(files, dataset.type, (data) => {
          callBack(data);
          setDisabled(false);
        });

        return;
      }

      setDisabled(false);
    },
    [loanStore, onClick, callBack]
  );

  return (
    <label
      className={classNames(styleView, className, {
        [style.disabled]: isDisabled,
      })}
    >
      <FileWidget
        id={`File-${AbstractRoles.input}-${INPUT_TYPE.FILE}`}
        data-type={type_id}
        className={style.input}
        onChange={(event) => addFileHandler(event.target)}
        multiple={multiple}
        accept={accept}
        capture={capture}
        disabled={disabled}
      />

      {label}
    </label>
  );
}

export const AddFile = inject(STORE_IDS.LOAN_STORE)(AddFileComponent);

function UploadedFile(props: TUploadedFile) {
  const { icon, filename, className } = props;
  let fileStyle = {};

  if (
    GRAPHIC_FILES.includes(path.extname(filename).toLowerCase()) ||
    path.extname(filename).toLowerCase() == '.pdf'
  ) {
    fileStyle = { backgroundImage: `url('${PO_PROJECT_HOST + icon}')` };
  }

  return (
    <div className={classNames(style.file, className)} title={filename}>
      <div className={style.fileIcon} style={fileStyle} />
    </div>
  );
}

export { UploadedFile };
