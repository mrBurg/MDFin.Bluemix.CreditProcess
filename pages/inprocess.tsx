import React from 'react';
import { GetStaticProps, GetStaticPropsContext } from 'next';

import { staticApi, TStores } from '@stores';
import { Inprocess } from '@components/Inprocess';
import { WithPageContainer } from '@components/hocs/WithPageContainer';

function InprocessPage(props: TStores) {
  return (
    <WithPageContainer>
      <Inprocess {...props} />
    </WithPageContainer>
  );
}

export default InprocessPage;

export const getStaticProps: GetStaticProps = async (
  context: GetStaticPropsContext
) => {
  const template = await staticApi.fetchStaticData({
    block: 'inprocess-page',
    path: 'template',
  });

  const pageData = await staticApi.fetchStaticData({
    block: 'inprocess-page',
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
