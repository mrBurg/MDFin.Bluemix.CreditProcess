import React from 'react';
import { GetStaticProps, GetStaticPropsContext } from 'next';

import { staticApi, TStores } from '@stores';
import { AccountCard } from '@components/client/AccountCard';
import { WithPageContainer } from '@components/hocs/WithPageContainer';

function AccountCardPage(props: TStores) {
  return (
    <WithPageContainer>
      <AccountCard staticData={props.pageStore.pageData} {...props} />
    </WithPageContainer>
  );
}

export default AccountCardPage;

export const getStaticProps: GetStaticProps = async (
  context: GetStaticPropsContext
) => {
  const template = await staticApi.fetchStaticData({
    block: 'account_card-page',
    path: 'template',
  });

  const pageData = await staticApi.fetchStaticData({
    block: 'account_card-page',
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
