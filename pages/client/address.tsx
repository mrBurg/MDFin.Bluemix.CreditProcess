import React from 'react';
import { GetStaticProps, GetStaticPropsContext } from 'next';

import { staticApi, TStores } from '@stores';
import { Address } from '@components/client';
import { WithPageContainer } from '@components/hocs/WithPageContainer';

function AddressPage(props: TStores) {
  return (
    <WithPageContainer>
      <Address staticData={props.pageStore.pageData} {...props} />
    </WithPageContainer>
  );
}

export default AddressPage;

export const getStaticProps: GetStaticProps = async (
  context: GetStaticPropsContext
) => {
  const template = await staticApi.fetchStaticData({
    block: 'address-page',
    path: 'template',
  });

  const pageData = await staticApi.fetchStaticData({
    block: 'address-page',
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
