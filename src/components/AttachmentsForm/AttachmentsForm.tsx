import React, { PureComponent, ReactElement } from 'react';
import map from 'lodash/map';
import { observer, inject } from 'mobx-react';

import style from './AttachmentsForm.module.scss';
import { Attachments } from '@components/Attachments';
import { STORE_IDS } from '@stores';
import { TAttachmentsFormProps, TAttachmentsFormPropsStore } from './@types';
import { TDocumentUnit } from '@stores-types/loanStore';

@inject(STORE_IDS.LOAN_STORE)
@observer
export class AttachmentsForm extends PureComponent<TAttachmentsFormProps> {
  public componentDidMount(): void {
    const { loanStore } = this.props as TAttachmentsFormPropsStore;

    loanStore.initAttachmentsForm();
  }

  public render(): ReactElement | null {
    const { loanStore } = this.props as TAttachmentsFormPropsStore;

    const { attachmentsFormStatic, cabinetApplication } = loanStore;

    if (attachmentsFormStatic && cabinetApplication.documentUnits) {
      return (
        <form className={style.attachments}>
          <h2 className={style.title}>{attachmentsFormStatic.title}</h2>
          <div className={style.buttons}>
            {map(
              cabinetApplication.documentUnits,
              (item: TDocumentUnit, key) => (
                <Attachments
                  key={key}
                  locales={attachmentsFormStatic}
                  {...item}
                />
              )
            )}
          </div>
        </form>
      );
    }

    return null;
  }
}
