import React, { useEffect } from 'react';
import classNames from 'classnames';
import map from 'lodash/map';
import { observer } from 'mobx-react';

import style from './Inprocess.module.scss';
import ApplauseIcon from '/public/theme/icons/applause_24x24.svg';

import cfg from '@root/config.json';
import { Attachments } from '@components/Attachments';
import { TInprocessProps } from './@types';
import { TDocumentUnit } from '@stores-types/loanStore';
import { WithTag } from '@components/hocs';

function InprocessComponent(props: TInprocessProps) {
  const {
    userStore,
    className,
    loanStore,
    loanStore: { attachmentsFormStatic, cabinetApplication },
  } = props;

  useEffect(() => {
    const init = async () => {
      await loanStore.getCabinetApplication();
      // await loanStore.initAttachmentsForm();

      userStore.getClientNextStep();
    };

    init();
  }, [loanStore, userStore]);

  useEffect(() => {
    const refreshViewTimer = setInterval(
      () => userStore.getClientNextStep(),
      cfg.refreshViewTime
    );

    return () => clearInterval(refreshViewTimer);
  }, [userStore]);

  return (
    <>
      {cabinetApplication.notification && (
        <WithTag
          tags={{
            'applause-icon': <ApplauseIcon />,
          }}
        >
          <h2 className={style.title}>{cabinetApplication.notification}</h2>
        </WithTag>
      )}

      {attachmentsFormStatic && cabinetApplication.documentUnits && (
        <div className={classNames(style.inprocess, className)}>
          {map(cabinetApplication.documentUnits, (item: TDocumentUnit, key) => (
            <Attachments key={key} locales={attachmentsFormStatic} {...item} />
          ))}
        </div>
      )}
    </>
  );
}

export const Inprocess = observer(InprocessComponent);
