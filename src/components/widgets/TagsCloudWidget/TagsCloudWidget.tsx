import React from 'react';
import map from 'lodash/map';
import classNames from 'classnames';

import { TTagsCloudWidget, TTagItem } from './@types';
import styles from './TagsCloudWidget.module.scss';
import { LinkWidget } from '../LinkWidget';

export function TagsCloudWidget(props: TTagsCloudWidget) {
  const { tagsList, className } = props;

  if (!tagsList.length) return null;

  return (
    <div className={classNames(styles.tagsCloud, className)}>
      {map(tagsList, (tagItem: TTagItem, index: number) => {
        if (!tagItem) return null;

        return (
          <LinkWidget key={index} href={tagItem.url} className={styles.tag}>
            {tagItem.label}
          </LinkWidget>
        );
      })}
    </div>
  );
}
