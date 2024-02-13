import React from 'react';
import { GetStaticProps, GetStaticPropsContext } from 'next';

import { staticApi, TStores } from '@stores';
import { Deal } from '@components/Deal';
import { WithPageContainer } from '@components/hocs/WithPageContainer';
import { ServiceMessage } from '@components/ServiceMessage';

function DealPage(props: TStores) {
  return (
    <>
      <ServiceMessage isCabinet={true} />
      <WithPageContainer>
        <Deal {...props} />
      </WithPageContainer>
    </>
  );
}

export default DealPage;

export const getStaticProps: GetStaticProps = async (
  context: GetStaticPropsContext
) => {
  const template = await staticApi.fetchStaticData({
    block: 'deal-page',
    path: 'template',
  });

  const pageData = await staticApi.fetchStaticData({
    block: 'deal-form',
    path: 'form',
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
