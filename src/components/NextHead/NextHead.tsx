import React, { Fragment } from 'react';
import Head from 'next/head';

import cfg from '@root/config.json';
import { PO_PROJECT_HOST } from '@src/constants';

type TNextHead = {
  title?: string;
  description?: string;
  url?: string;
  imageUrl?: string;
};

export function NextHead(props: TNextHead) {
  const { title, description, url, imageUrl } = props;

  const renderMetaTags = () => {
    return (
      <>
        {title && <meta name="title" content={title} />}
        {description && <meta name="description" content={description} />}
        {title && <meta property="og:title" content={title} />}
        <meta property="og:type" content="website" />
        {url && <meta property="og:url" content={PO_PROJECT_HOST + url} />}
        {description && (
          <meta property="og:description" content={description} />
        )}
        <meta property="og:site_name" content={cfg.siteName} />
        {imageUrl && (
          <meta property="og:image" content={PO_PROJECT_HOST + imageUrl} />
        )}
      </>
    );
  };

  return (
    <Head>
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0, maximum-scale=2.0"
      />
      <title>{title ? title : cfg.siteName}</title>
      {renderMetaTags()}
    </Head>
  );
}
