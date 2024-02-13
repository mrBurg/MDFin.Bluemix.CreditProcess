import React from 'react';
import { GetStaticProps, GetStaticPropsContext } from 'next';

import { staticApi, TStores } from '@stores';
import { WithPageContainer } from '@components/hocs/WithPageContainer';
import { CreditLine } from '@components/CreditLine';

export default CreditLinePage;

function CreditLinePage(props: TStores) {
  return (
    <WithPageContainer>
      <CreditLine {...props} />
    </WithPageContainer>
  );
}

export const getStaticProps: GetStaticProps = async (
  context: GetStaticPropsContext
) => {
  const template = await staticApi.fetchStaticData({
    block: 'credit-line-page',
    path: 'template',
  });

  const pageData = await staticApi.fetchStaticData({
    block: 'credit-line-page',
    path: 'static',
  });

  const copyright = await staticApi.fetchStaticData({
    block: 'copyright',
    path: 'static',
  });

  return {
    props: {
      pageData: { copyright, ...pageData },
      context,
      template,
    },
  };
};
