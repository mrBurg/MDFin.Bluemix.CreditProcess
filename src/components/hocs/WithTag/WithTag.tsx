import htmlParser from 'html-react-parser';
import isArray from 'lodash/isArray';
import isNumber from 'lodash/isNumber';
import isPlainObject from 'lodash/isPlainObject';
import isString from 'lodash/isString';
import map from 'lodash/map';
import reduce from 'lodash/reduce';
import React, {
  Attributes,
  cloneElement,
  createElement,
  Fragment,
  isValidElement,
  ReactElement,
  useCallback,
  useMemo,
} from 'react';
import classNames from 'classnames';

import style from './WithTag.module.scss';

import standardTags from '@src/standardTags.json';

import { TWithTagProps } from './@types';
import { staticTagslist } from '@src/constants';
import { TJSON } from '@interfaces';

function WithTag(props: TWithTagProps) {
  const { children, tags, wrapper = 'span' } = props;

  const defaultWrapper = useMemo(() => wrapper, [wrapper]);
  const allTags = useMemo(
    () => ({ ...staticTagslist, ...tags }),
    [tags]
  ) as TJSON;

  const renderTag = useCallback(
    (index: string, tag: string, tagData: string, content?: string) => {
      const [tagName, tagType] = tagData.split('#');

      if (standardTags.includes(tagName)) {
        return htmlParser(tag);
      }

      const tagProps = allTags[tagName];

      switch (true) {
        case isValidElement(tagProps):
          return createElement(
            tagType || Fragment,
            { key: index },
            cloneElement(tagProps, {
              className: classNames('tag', (tagProps.props as any).className),
            } as Attributes)
          );
        case isString(tagProps):
        case isNumber(tagProps):
          return createElement(
            tagType || defaultWrapper,
            {
              key: index,
              className: classNames('tag', `tag_${tagName}`, style[tagName]),
            },
            htmlParser(String(tagProps || content))
          );
        case isPlainObject(tagProps):
          return createElement(
            tagType || defaultWrapper,
            {
              key: index,
              className: classNames(
                'tag',
                `tag_${tagName}`,
                style[tagName],
                tagProps.className
              ),
            },
            (() => {
              switch (true) {
                case isValidElement(tagProps.children):
                  return tagProps.children;
                case isString(tagProps.children):
                case isNumber(tagProps.children):
                  return htmlParser(String(tagProps.children));
                default:
                  return content;
              }
            })()
          );
      }

      return createElement(
        tagType || defaultWrapper,
        {
          key: index,
          className: classNames('tag', `tag_${tagName}`, style[tagName]),
        },
        htmlParser(content || '')
      );
    },
    [allTags, defaultWrapper]
  );

  const writeTag = useCallback(
    (child: ReactElement) => {
      const splitSymbol = '¦';
      const tagsRegExp = /<(\S*?)>(.*?)<\/\s*\1>|<(.*?)\/>/g;
      // const tagsRegExp = /<(\S*?)[^>]*>(.*?)<\/\s*\1>|<(.*?)\/>/g;
      /* const tagsRegExp = new RegExp(
        '<(\\S*?)[^>]*>(.*?)<\\/\\s*\\1>|<(.*?)\\/>',
        'gm'
      ); */

      const {
        type,
        props: { children, ...restProps },
      } = child;

      const { className, ...restChildProps } = restProps;

      if (!children) {
        return createElement(
          type,
          {
            ...restChildProps,
            className: classNames(style.tag, className),
          },
          String(children)
        );
      }

      const childrenData = map(
        children
          .replace(
            tagsRegExp,
            (result: string) => splitSymbol + result + splitSymbol
          )
          .split(splitSymbol),
        (item, index) => {
          const regData = tagsRegExp.exec(item);

          if (!regData) {
            return item;
          }

          const [tag, tagName, tagContent, singleTag] = regData;

          switch (true) {
            case !!tagName && !!tagContent:
              return renderTag(index, tag, tagName.trim(), tagContent);
            case !!singleTag:
              return renderTag(index, tag, singleTag.trim());
          }
        }
      );

      return createElement(
        type,
        {
          ...restChildProps,
          className: classNames(style.tag, className),
        },
        reduce(
          childrenData,
          (accum, item, index) => {
            if (item) {
              accum.push(
                <Fragment key={index}>
                  {isString(item) ? htmlParser(item) : item}
                </Fragment>
              );
            }

            return accum;
          },
          [] as (string | ReactElement)[]
        )
      );
    },
    [renderTag]
  );

  if (isArray(children)) {
    return (
      <>
        {map(children, (child, index) => (
          <Fragment key={index}>{writeTag(child)}</Fragment>
        ))}
      </>
    );
  }

  return writeTag(children as ReactElement);
}

export { WithTag };
