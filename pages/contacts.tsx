import React from 'react';
import { GetStaticProps, GetStaticPropsContext } from 'next';

import { staticApi, TStores } from '@stores';
import { TContactsProps } from '@components/sections/Contacts/@types';
import { Contacts } from '@components/sections';

function ContactsPage(props: TStores) {
  const {
    pageStore: {
      pageData: { ...contacts },
    },
  } = props;

  return <Contacts showTitle={false} {...(contacts as TContactsProps)} />;
}

export default ContactsPage;

export const getStaticProps: GetStaticProps = async (
  context: GetStaticPropsContext
) => {
  const template = await staticApi.fetchStaticData({
    block: 'contacts-page',
    path: 'template',
  });

  const pageData = await staticApi.fetchStaticData({
    block: 'contacts-page',
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
