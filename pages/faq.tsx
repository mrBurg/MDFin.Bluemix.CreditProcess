import React, { useEffect, useState } from 'react';
import { GetStaticProps, GetStaticPropsContext } from 'next';

import { staticApi } from '@stores';
import { AccordionWidget } from '@components/widgets/AccordionWidget';
import { WithPageContainer } from '@components/hocs/WithPageContainer';
import { TJSON } from '@interfaces';

function FaqPage() {
  const [pageData, setPageData] = useState({} as TJSON);

  useEffect(() => {
    const init = async () => {
      const pageData = await staticApi.fetchStaticData({
        block: 'faq-page',
        path: 'static',
      });

      setPageData(pageData);
    };

    init();
  }, []);

  return (
    <WithPageContainer>
      <AccordionWidget data={pageData.faqList} exclusive={false} fluid />
    </WithPageContainer>
  );
}

export default FaqPage;

export const getStaticProps: GetStaticProps = async (
  context: GetStaticPropsContext
) => {
  const template = await staticApi.fetchStaticData({
    block: 'faq-page',
    path: 'template',
  });

  /* const pageData = await staticApi.fetchStaticData({
    block: 'faq-page',
    path: 'static',
  }); */

  const copyright = await staticApi.fetchStaticData({
    block: 'copyright',
    path: 'static',
  });

  return {
    props: {
      pageData: { copyright /* ...pageData */ },
      template,
      context,
    },
  };
};
