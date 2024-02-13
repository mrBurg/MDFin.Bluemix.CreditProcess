import React, { PureComponent, ReactNode } from 'react';
import isArray from 'lodash/isArray';
import map from 'lodash/map';
import size from 'lodash/size';
import { observer } from 'mobx-react';

import style from './Notify.module.scss';

import cfg from '@root/config.json';
import { Preloader } from '@components/Preloader';
import { TNotify, TState } from './@types';
import { handleErrors } from '@utils';
import { TNotifyItem } from '@stores-types/loanStore';

@observer
export class Notify extends PureComponent<TNotify> {
  private timer?: NodeJS.Timeout;

  public readonly state: TState = {
    isRender: false,
    cabinetNotify: [],
  };

  componentDidMount(): void {
    const { loanStore, userStore } = this.props;

    userStore.getClientNextStep();
    loanStore
      .getNotify()
      .then(() => {
        this.setState((state) => ({
          ...state,
          isRender: true,
        }));

        return;
      })
      .then(() => {
        //отправляем запрос, что показали нотификацию.
        loanStore.confirmDisplay();

        this.timer = setInterval(
          async () => userStore.getClientNextStep(),
          cfg.refreshViewTime
        );

        return;
      })
      .catch((err) => handleErrors(err));
  }

  componentWillUnmount() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  public render(): ReactNode | null {
    const { isRender } = this.state;
    const { loanStore } = this.props;
    const cabinetNotify = loanStore.cabinetNotify;

    const isArrayNotify = isArray(cabinetNotify) && !!size(cabinetNotify);

    if (isRender && loanStore && isArrayNotify) {
      return map(cabinetNotify, (item: TNotifyItem, index: number) => {
        return (
          <section key={index} className={style.section}>
            <div key={index} className={style.notification}>
              {item.text}
            </div>
          </section>
        );
      });
    }
    return <Preloader />;
  }
}
