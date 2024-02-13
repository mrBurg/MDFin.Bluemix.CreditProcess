import htmlParser from 'html-react-parser';
import isArray from 'lodash/isArray';
import isString from 'lodash/isString';
import map from 'lodash/map';
import React, { createElement, Fragment, ReactElement } from 'react';

import { TWithDangerousHTMLProps } from './@types';

function WithDangerousHTML(props: TWithDangerousHTMLProps) {
  const { children } = props;

  const writeTag = (child: ReactElement) => {
    const {
      type,
      props: { children, ...restProps },
    } = child;

    return createElement(
      type,
      restProps,
      (() => {
        switch (true) {
          case isArray(children):
            return children;
          case isString(children):
            return htmlParser(children);
        }
      })()
    );
  };

  switch (true) {
    case isArray(children):
      return (
        <>
          {map(children, (child, index) => (
            <Fragment key={index}>{writeTag(child)}</Fragment>
          ))}
        </>
      );
    default:
      return writeTag(children as ReactElement);
  }
}

export { WithDangerousHTML };
