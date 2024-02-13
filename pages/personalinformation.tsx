import React from 'react';
import { GetStaticProps, GetStaticPropsContext } from 'next';
import { observer } from 'mobx-react';

import { staticApi, TStores } from '@stores';
import { PersonalInformation } from '@components/sections/PersonalInformation/PersonalInformation';
import { WithPageContainer } from '@components/hocs/WithPageContainer';
import { ServiceMessage } from '@components/ServiceMessage';

function PersonalInformationPage(props: TStores) {
  const { pageStore } = props;

  return (
    <>
      <ServiceMessage isCabinet={true} />
      <WithPageContainer className="page-container_padding">
        <PersonalInformation staticData={pageStore.pageData} />
      </WithPageContainer>
    </>
  );
}

export default observer(PersonalInformationPage);

export const getStaticProps: GetStaticProps = async (
  context: GetStaticPropsContext
) => {
  const template = await staticApi.fetchStaticData({
    block: 'personal-information-page',
    path: 'template',
  });

  const pageData = await staticApi.fetchStaticData({
    block: 'personal-information-page',
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
