import React from 'react';
import { GetStaticProps, GetStaticPropsContext } from 'next';

import { staticApi, TStores } from '@stores';
import { WithPageContainer } from '@components/hocs/WithPageContainer';
import { CLIENT_TABS, DOC_TYPE } from '@src/constants';
import cfg from '@root/config.json';

import { PhotoUpload, ImageID } from '@components/client/PhotoUpload';

function IdPhotoPage(props: TStores) {
  return (
    <WithPageContainer>
      <PhotoUpload
        {...props}
        staticData={props.pageStore.pageData}
        params={{
          currentStep: CLIENT_TABS.ID_PHOTO,
          fileProps: {
            type: 'Carte de identitate',
            type_id: DOC_TYPE.idFront,
            maxFileSize: cfg.maxImageFileSize,
          },
          image: <ImageID />,
        }}
      />
    </WithPageContainer>
  );
}

export default IdPhotoPage;

export const getStaticProps: GetStaticProps = async (
  context: GetStaticPropsContext
) => {
  const template = await staticApi.fetchStaticData({
    block: 'id_photo-page',
    path: 'template',
  });

  const pageData = await staticApi.fetchStaticData({
    block: 'id_photo-page',
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
