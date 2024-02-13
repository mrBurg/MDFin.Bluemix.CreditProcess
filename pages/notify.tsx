import React from 'react';
import { GetStaticProps, GetStaticPropsContext } from 'next';

import { staticApi, TStores } from '@stores';
import { Notify } from '@components/Notify';
import { WithPageContainer } from '@components/hocs/WithPageContainer';

function NotifyPage(props: TStores) {
  return (
    <WithPageContainer>
      <Notify className={'page-notification'} {...props} />
    </WithPageContainer>
  );
}

export default NotifyPage;

export const getStaticProps: GetStaticProps = async (
  context: GetStaticPropsContext
) => {
  const template = await staticApi.fetchStaticData({
    block: 'notify-page',
    path: 'template',
  });

  const pageData = await staticApi.fetchStaticData({
    block: 'notify-page',
    path: 'static',
  });

  const copyright = await staticApi.fetchStaticData({
    block: 'copyright',
    path: 'static',
  });

  return {
    props: {
      pageData: { copyright, ...pageData },
      template,
      context,
    },
  };
};
