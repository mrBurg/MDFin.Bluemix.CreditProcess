import React, { useCallback, useState } from 'react';
import classNames from 'classnames';
import map from 'lodash/map';
import size from 'lodash/size';

import style from './LoanInfo.module.scss';

import { FieldDataConverter } from '@components/hocs';
import { WidgetRoles } from '@src/roles';
import { TLoanInfoProps } from './@types';
import { gt } from '@utils';
import { TDocumentUnit } from '@stores-types/loanStore';
import { LinkWidget, TARGET } from '@components/widgets/LinkWidget';

export enum DOC_DATA {
  URL = 'url',
  FILENAME = 'filename',
}

export function getDocData<T extends string | boolean = boolean>(
  data?: TDocumentUnit,
  key?: DOC_DATA
): T {
  if (data && size(data.documents)) {
    switch (key) {
      case DOC_DATA.URL:
        return (data.documents[0].url || '#') as T;
      case DOC_DATA.FILENAME:
        return data.documents[0].filename as T;
    }

    return true as T;
  }

  return '' as T;
}

export enum LAYOUT {
  DEFAULT = 'default',
  SHADED = 'shaded',
  CENTERED = 'centered',
}

function LoanInfo(props: TLoanInfoProps) {
  const {
    className,
    title,
    params,
    layout = LAYOUT.DEFAULT,
    afterContent,
    collapsed,
  } = props;

  const [isCollapsed, setIsCollapsed] = useState(Boolean(collapsed && title));

  const clickHandler = useCallback(
    () => setIsCollapsed(!isCollapsed),
    [isCollapsed]
  );

  const renderTitle = useCallback(() => {
    switch (true) {
      case title && collapsed:
        return (
          <div
            className={classNames(style.title, style.titleCollapsed, {
              [style.titleOpen]: !isCollapsed,
            })}
            onClick={() => clickHandler()}
            onKeyPress={() => clickHandler()}
            role={WidgetRoles.button}
            tabIndex={0}
          >
            {title}
          </div>
        );
      case Boolean(title):
        return <div className={style.title}>{title}</div>;
    }
  }, [clickHandler, collapsed, isCollapsed, title]);

  const renderTable = useCallback(
    () => (
      <table>
        <tbody>
          {map(params, (item, key) => {
            if (!item || !item.value) {
              return;
            }

            return (
              <tr key={key}>
                <td>{gt.gettext(item.text)}</td>
                <td>
                  {item.link ? (
                    <LinkWidget
                      id={`LoanInfo-${WidgetRoles.link}`}
                      href={item.link}
                      className={style.link}
                      target={TARGET.BLANK}
                    >
                      {item.value}
                    </LinkWidget>
                  ) : (
                    <FieldDataConverter type={item.type}>
                      {item.value}
                    </FieldDataConverter>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    ),
    [params]
  );

  return (
    <div className={classNames(style[layout], style.info, className)}>
      {renderTitle()}
      <div
        className={classNames(style.datatable, {
          [style.datatableCollapsed]: isCollapsed,
          [style.datatableOpen]: collapsed && !isCollapsed,
        })}
      >
        {renderTable()}
        {afterContent && (
          <div className={style.afterContent}>{afterContent}</div>
        )}
      </div>
    </div>
  );
}

export { LoanInfo };
