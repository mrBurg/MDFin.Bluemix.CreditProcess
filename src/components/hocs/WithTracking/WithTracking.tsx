import { inject } from 'mobx-react';
import { cloneElement } from 'react';
import isFunction from 'lodash/isFunction';
import isString from 'lodash/isString';

import { DATA_TYPE } from '@src/constants';
import { STORE_IDS } from '@stores';
import { TWithTrackingProps, TWithTrackingPropsStore } from './@types';
import { bindEvents } from './controller';

function WithTrackingComponent(props: TWithTrackingProps) {
  const { id, children, events, trackingStore } =
    props as TWithTrackingPropsStore;

  let component = cloneElement(children, {
    ...children.props,
    ...bindEvents(id, events, children, trackingStore),
  });

  switch (true) {
    case isString(children):
      component = cloneElement(children, {
        ...children.props,
        ...bindEvents(id, events, children, trackingStore),
      });

      break;
    case isFunction(children):
      switch (typeof children.props.children) {
        case DATA_TYPE.OBJECT:
          component = cloneElement(
            children,
            children.props,
            cloneElement(children.props.children, {
              ...children.props.children.props,
              ...bindEvents(id, events, children.props.children, trackingStore),
            })
          );

          break;
      }

      break;
  }

  return component;
}

export const WithTracking = inject(STORE_IDS.TRACKING_STORE)(
  WithTrackingComponent
);
