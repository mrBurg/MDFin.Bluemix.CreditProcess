import { TJSON } from '@interfaces';
import { TrackingStore } from '@src/stores/TrackingStore';
import { requiredData } from '@src/trackingConstants';
import compact from 'lodash/compact';
import each from 'lodash/each';
import isFunction from 'lodash/isFunction';
import isString from 'lodash/isString';
import noop from 'lodash/noop';
import reduce from 'lodash/reduce';
import moment from 'moment';
import { ReactElement } from 'react';
import { renderToString } from 'react-dom/server';
import { TEvents } from './@types';

function collectData(id: string, element: ReactElement, event?: any) {
  const { props } = element;

  let eventData = {
    target_id: id,
    target: id,
    value: props.value || moment(props.selected).format('DD/MM/YYYY'),
    content: renderToString(props.children) || null,
  } as TJSON;

  switch (true) {
    case isString(element.type):
      eventData = {
        ...eventData,
        type: element.type,
      };

      break;
    case isFunction(element.type):
      eventData = {
        ...eventData,
        type: props.name || (element.type as TJSON).name,
      };

      break;
  }

  each(requiredData, (item) => {
    eventData[item] = props[item] ?? null;
  });

  if (Object.hasOwnProperty.call(props, 'checked')) {
    eventData.value = String(props.checked);
  }

  try {
    eventData.target = renderToString(element);
  } catch (err) {
    noop();
  }

  if (event && event.target && event.target.tagName == 'A') {
    eventData = {
      ...eventData,
      target: event.target.outerHTML,
      content: event.target.innerHTML,
    };
  }

  return eventData;
}

export function bindEvents(
  id: string,
  events: TEvents[],
  element: ReactElement,
  store: TrackingStore
) {
  return reduce(
    events,
    (props, eventType) => {
      let event = void 0;

      //TODO не отсылать если был клик по тексту из ДБ
      props[eventType] = function (arg1: any, arg2: any) {
        const args = compact([arg1, arg2]);

        each(args, (item) => {
          if (item.target) {
            event = item;

            return false;
          }
        });

        store.sendEvent(eventType, collectData(id, element, event));

        if (element.props[eventType]) {
          element.props[eventType](arg1, arg2);
        }
      };

      return props;
    },
    {} as TJSON
  );
}
