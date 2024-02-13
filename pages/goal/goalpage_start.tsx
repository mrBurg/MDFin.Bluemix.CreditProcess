import htmlParser from 'html-react-parser';
import React, { Fragment, ReactElement, useEffect, useState } from 'react';
import { GetStaticProps, GetStaticPropsContext } from 'next';
import filter from 'lodash/filter';
import isArray from 'lodash/isArray';

import { Preloader } from '@components/Preloader';
import { TStores } from '@stores';
import { DATA_TYPE } from '@src/constants';
import { URIS } from '@routes';
// import { useGoalpageEffect } from '@components/GoalpageFrame';

function GoalpageStart(props: TStores) {
  const { userStore } = props;

  const [iframeContent, setIframeContent] = useState<ReactElement[]>();

  // useGoalpageEffect(userStore, setIframeContent);

  useEffect(() => {
    const init = async () => {
      const response = await userStore.getPageFrameData(URIS.PIXEL_SCRIPT);

      if (response) {
        const elements = htmlParser(response);
        let elementsArray = [elements];

        if (isArray(elements)) {
          elementsArray = elements;
        }

        setIframeContent(
          filter(elementsArray as ReactElement[], (element, index) => {
            if (element && element.type != DATA_TYPE.SCRIPT) {
              return true;
            }

            let script = document.querySelector<HTMLScriptElement>(
              `#${element.type}${index}`
            );

            if (script) {
              script.textContent = element.props.dangerouslySetInnerHTML.__html;
            } else {
              script = document.createElement('script');

              script.id = element.type + String(index);
              script.textContent = element.props.dangerouslySetInnerHTML.__html;
              script.async = true;

              document.body.appendChild(script);
            }

            return false;
          }).map((element, index) => <Fragment key={index}>{element}</Fragment>)
        );
      }
    };

    init();
  }, [userStore]);

  if (iframeContent) {
    return iframeContent;
  }

  return <Preloader />;
}

export default GoalpageStart;

export const getStaticProps: GetStaticProps = async (
  context: GetStaticPropsContext
) => {
  return {
    props: { context },
  };
};
