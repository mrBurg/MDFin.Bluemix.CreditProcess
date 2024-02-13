import React from 'react';
import { GetStaticProps, GetStaticPropsContext } from 'next';

import { staticApi, TStores } from '@stores';
import { WithPageContainer } from '@components/hocs/WithPageContainer';
import { CLIENT_TABS, DOC_TYPE } from '@src/constants';
import cfg from '@root/config.json';

import { PhotoUpload, ImageSelfie } from '@components/client/PhotoUpload';

function SelfiePage(props: TStores) {
  return (
    <WithPageContainer>
      <PhotoUpload
        {...props}
        staticData={props.pageStore.pageData}
        params={{
          currentStep: CLIENT_TABS.SELFIE,
          fileProps: {
            type: 'Selfie',
            type_id: DOC_TYPE.selfie,
            maxFileSize: cfg.maxImageFileSize,
          },
          image: <ImageSelfie />,
        }}
      />
    </WithPageContainer>
  );
}

export default SelfiePage;

export const getStaticProps: GetStaticProps = async (
  context: GetStaticPropsContext
) => {
  const template = await staticApi.fetchStaticData({
    block: 'selfie',
    path: 'template',
  });

  const pageData = await staticApi.fetchStaticData({
    block: 'selfie',
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
