import React from 'react';
import { GetStaticProps, GetStaticPropsContext } from 'next';

import { staticApi, TStores } from '@stores';
import { WrongAccount } from '@components/WrongAccount';
import { WithPageContainer } from '@components/hocs/WithPageContainer';

function WrongaccountPage(props: TStores) {
  return (
    <WithPageContainer>
      <WrongAccount staticData={props.pageStore.pageData} {...props} />
    </WithPageContainer>
  );
}

export default WrongaccountPage;

export const getStaticProps: GetStaticProps = async (
  context: GetStaticPropsContext
) => {
  const template = await staticApi.fetchStaticData({
    block: 'wrongaccount-page',
    path: 'template',
  });

  const pageData = await staticApi.fetchStaticData({
    block: 'wrongaccount-page',
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
