import isArray from 'lodash/isArray';
import map from 'lodash/map';
import React, {
  ReactElement,
  createElement,
  Fragment,
  useCallback,
} from 'react';
import { renderToString } from 'react-dom/server';
import classNames from 'classnames';

import style from './WithLink.module.scss';

import { WithDangerousHTML } from '..';
import { TWithLinkProps } from './@types';
import standardTags from '@src/standardTags.json';
import { TARGET } from '@components/widgets/LinkWidget';
import { LINK_RELATION } from '@src/constants';
import { URLS } from '@routes';

function WithLink(props: TWithLinkProps) {
  const renderTag = useCallback(
    (tag: any, tagName: any, content?: any) => {
      if (standardTags.includes(tagName)) {
        return tag;
      }

      const tagData = props.links[tagName];

      if (tagData) {
        return renderToString(
          <a
            className={classNames(style.link, props.linkClassName)}
            href={tagData.link}
            target={(tagData.target as TARGET) || TARGET.BLANK}
          >
            {tagData.text || content}
          </a>
        );
      }

      return renderToString(
        <a
          href={URLS.HOME}
          className={classNames(style.link, props.linkClassName)}
          target={TARGET.BLANK}
          rel={[LINK_RELATION.NOOPENER, LINK_RELATION.NOREFERRER].join(' ')}
        >
          {content || tagName}
        </a>
      );
    },
    [props.linkClassName, props.links]
  );

  const writeTag = useCallback(
    (child: ReactElement) => {
      const { children, ...restProps } = child.props;

      const { className, ...restChildProps } = restProps;
      const tagsRegExp = /<(\S*?[^>]*)>(.*?)<\/\s*\1>|<(.*?)\/>/gm;
      /* const tagsRegExp = new RegExp(
        '<(\\S*?)[^>]*>(.*?)<\\/\\s*\\1>|<(.*?)\\/>',
        'gm'
      ); */

      let childData = children;

      childData = childData.replace(
        tagsRegExp,
        (
          tag: string,
          tagName: string,
          tagContent: string,
          singleTag: string
        ) => {
          switch (true) {
            case !!tagName && !!tagContent:
              return renderTag(tag, tagName.trim(), tagContent);
            case !!singleTag:
              return renderTag(tag, singleTag.trim());
          }

          return renderToString(
            <a
              className={classNames(style.link, props.linkClassName)}
              href={URLS.HOME}
              target={TARGET.BLANK}
              rel={[LINK_RELATION.NOOPENER, LINK_RELATION.NOREFERRER].join(' ')}
            >
              {tagContent || tagName || singleTag}
            </a>
          );
        }
      );

      return (
        <WithDangerousHTML>
          {createElement(
            child.type,
            {
              ...restChildProps,
              className,
            },
            childData
          )}
        </WithDangerousHTML>
      );
    },
    [props.linkClassName, renderTag]
  );

  switch (true) {
    case isArray(props.children):
      return (
        <>
          {map(props.children, (child, index) => (
            <Fragment key={index}>{writeTag(child)}</Fragment>
          ))}
        </>
      );
    default:
      return writeTag(props.children as ReactElement);
  }
}

export { WithLink };
