import React, { useCallback } from 'react';
import { Accordion } from 'semantic-ui-react';
import classNames from 'classnames';
import isArray from 'lodash/isArray';
import map from 'lodash/map';
import reduce from 'lodash/reduce';

import { WithDangerousHTML, WithTag, WithTracking } from '@components/hocs';
import { GetAttachment } from '@components/GetAttachment';
import { TJSON } from '@interfaces';
import { WidgetRoles } from '@src/roles';
import { EMouseEvents } from '@src/trackingConstants';
import {
  TItem,
  TAccordionRedesignListItemsProps,
  TAccordionRedesignItem,
  TDataBlock,
  STYLETYPE,
} from './@types';
import style from './AccordionWidgetRd2.module.scss';
import { LoanButton } from '@components/LoanButton';
// import { LOCATION } from '@components/LoanButton/LoanButton';

export function AccordionWidgetRd2(props: TAccordionRedesignListItemsProps) {
  const { data, styleType = STYLETYPE.GRAY, ...accordionProps } = props;

  const renderPanelContent = useCallback(
    (itemData: string | TDataBlock[], buttonLabel: string) => {
      if (isArray(itemData)) {
        return map(itemData, (item, index) => (
          <div key={index} className={style.item}>
            {item.title && <p className={style.itemTitle}>{item.title}</p>}
            <WithTag
              tags={reduce(
                item.tags,
                (accum, item, index) => {
                  accum[index] = (
                    <GetAttachment
                      key={index}
                      attachmentType={item.type}
                      label={item.label}
                    />
                  );
                  return accum;
                },
                {} as TJSON
              )}
            >
              <p className={style.itemText}>{item.text}</p>
            </WithTag>
          </div>
        ));
      } else {
        return (
          <>
            <WithDangerousHTML>
              <div>{itemData}</div>
            </WithDangerousHTML>
            <div className={style.loanButtonWrap}>
              <LoanButton
                className={style.loanButton}
                label={buttonLabel}
                idExt="FaqRd2"
                // location={LOCATION.DRAW}
              />
            </div>
          </>
        );
      }
    },
    []
  );

  const renderPanels = useCallback(
    (items: TItem[]) =>
      map(items, (item: TItem, key: number) => {
        if (!item.itemTitle || !item.itemData) {
          return;
        }
        return {
          key,
          title: (
            <Accordion.Title role={WidgetRoles.tab}>
              <WithTracking
                id={`AccordionWidgetRd2-${WidgetRoles.tab}`}
                events={[EMouseEvents.CLICK]}
              >
                <div
                  className={classNames(
                    styleType + 'Title',
                    style[`${styleType}AccordionTitle`]
                  )}
                  // role={WidgetRoles.tab}
                >
                  <span className={style[`${styleType}AccordionTitleContent`]}>
                    {item.itemTitle}
                  </span>
                  <i
                    className={classNames(
                      styleType + 'Icon',
                      style[`${styleType}AccordionTitleIcon`]
                    )}
                  />
                </div>
              </WithTracking>
            </Accordion.Title>
          ),
          content: (
            <Accordion.Content
              className={classNames(
                'content',
                style[`${styleType}AccordionPanel`]
              )}
            >
              {renderPanelContent(item.itemData, item.buttonLabel)}
            </Accordion.Content>
          ),
        };
      }),
    [renderPanelContent, styleType]
  );

  return (
    <div className={style[`${styleType}AccordionContainer`]}>
      {map(data, (item: TAccordionRedesignItem, index: number) => (
        <section key={index} className={style.section}>
          {item.title && <h2 className={style.title}>{item.title}</h2>}

          <Accordion
            className={style[`${styleType}Accordion`]}
            panels={renderPanels(item.items)}
            role={WidgetRoles.tablist}
            {...accordionProps}
          />
        </section>
      ))}
    </div>
  );
}
