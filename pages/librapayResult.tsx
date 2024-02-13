import { observer } from 'mobx-react';
import React, { useEffect } from 'react';
import { GetStaticProps, GetStaticPropsContext } from 'next';
import replace from 'lodash/replace';
import { useRouter } from 'next/router';

import { staticApi, TStores } from '@stores';
import { Preloader } from '@components/Preloader';
import { EVENT } from '@src/constants';
import { isFrame } from '@utils';

function LibraResultPage(props: TStores) {
  const { pageStore, userStore, loanStore } = props;

  const { asPath, pathname } = useRouter();

  useEffect(() => {
    const init = async () => {
      await pageStore.proccessLibrapayResult(replace(asPath, pathname, ''));
      window.parent.postMessage(
        EVENT.CLOSE_IFRAME,
        isFrame
          ? window.parent.location.href //document.referrer
          : document.location.href
      );

      if (!isFrame) {
        userStore.getClientNextStep();
      }
    };

    init();
  }, [asPath, loanStore, pageStore, pathname, userStore]);

  return <Preloader />;
}

export default observer(LibraResultPage);

export const getStaticProps: GetStaticProps = async (
  context: GetStaticPropsContext
) => {
  const template = await staticApi.fetchStaticData({
    block: 'librapayResult-page',
    path: 'template',
  });

  return {
    props: {
      template,
      context,
    },
  };
};
