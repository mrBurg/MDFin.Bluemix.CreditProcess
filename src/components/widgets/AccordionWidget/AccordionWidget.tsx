import React, { useCallback } from 'react';
import { Accordion } from 'semantic-ui-react';
import classNames from 'classnames';
import map from 'lodash/map';

import style from './AccordionWidget.module.scss';
import { WithDangerousHTML, WithTracking } from '@components/hocs';
import { WidgetRoles } from '@src/roles';
import { EMouseEvents } from '@src/trackingConstants';
import { TItem, TAccordionListItemsProps, TAccordionItem } from './@types';

export function AccordionWidget(props: TAccordionListItemsProps) {
  const { data, classNameTitle, ...accordionProps } = props;

  const renderPanels = useCallback(
    (items: TItem[]) =>
      map(items, (item: TItem, key: number) => {
        if (!item.itemTitle || !item.itemData) {
          return;
        }
        return {
          key,
          title: (
            <Accordion.Title>
              <WithTracking
                id={`AccordionWidget-${WidgetRoles.tab}`}
                events={[EMouseEvents.CLICK]}
              >
                <div className={style.accordionTitle} role={WidgetRoles.tab}>
                  <span className={style.accordionTitleContent}>
                    {item.itemTitle}
                  </span>
                  <i className={classNames('icon', style.accordionTitleIcon)} />
                </div>
              </WithTracking>
            </Accordion.Title>
          ),
          content: (
            <Accordion.Content
              className={classNames('content', style.accordionPanel)}
            >
              <WithDangerousHTML>
                <div>{item.itemData}</div>
              </WithDangerousHTML>
            </Accordion.Content>
          ),
        };
      }),
    []
  );

  return (
    <div className={style.accordionContainer}>
      {map(data, (item: TAccordionItem, index: number) => (
        <section key={index} className={style.section}>
          {item.title && (
            <h2 className={classNames(style.title, classNameTitle)}>
              {item.title}
            </h2>
          )}

          <Accordion
            className={style.accordion}
            panels={renderPanels(item.items)}
            {...accordionProps}
          />
        </section>
      ))}
    </div>
  );
}
