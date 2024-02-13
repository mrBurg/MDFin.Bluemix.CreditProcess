import React, { ReactElement } from 'react';
import map from 'lodash/map';

import { TDataTableGridItem, TDataTableGridProps } from './@types';
import style from './DataTableGridWidget.module.scss';

export function DataTableGridWidget(props: TDataTableGridProps): ReactElement {
  return (
    <div className={style.container_noborder}>
      {map(props.data, (item: TDataTableGridItem, index: number) => (
        <div key={index}>
          <div className={style.title}>{item.title}</div>
          <table className={style.datatable}>
            <tbody>
              {map(item.itemData, (subItem, subIndex: number) => (
                <tr key={subIndex}>
                  <td className={style.dataList_title}>{subItem.label}</td>
                  <td>{subItem.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
