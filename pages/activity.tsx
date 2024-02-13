import React from 'react';
import Head from 'next/head';

import { TStores } from '@src/stores';
import { Router } from '@components/Router';

function Activity(props: TStores) {
  return (
    <Router {...props}>
      <Head>
        <meta name="referrer" content="no-referrer"></meta>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
    </Router>
  );
}

export default Activity;
