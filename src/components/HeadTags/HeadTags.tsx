import React from 'react';
import Helmet from 'react-helmet';

import cfg from '@root/config.json';
import { PO_PROJECT_HOST } from '@src/constants';

import { THeadTags } from './@types';

/**
 * @deprecated
 * Цей компонент розроблявся для того, щоб доповнювати сторінки мета-тегами в <head>.
 * Але, потім я переробив так, щоб ці теги наповнювались в компоненті <NextHead/>.
 * А "контент" для мета-тегів береться із dir_translates => path="template".
 *
 * Цей компонент, поки залишив, може згодиться.
 */
function HeadTags(props: THeadTags) {
  const { title, description, url } = props;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />

      <meta property="og:title" content={title} />
      <meta property="og:type" content="website" />
      {url && <meta property="og:url" content={PO_PROJECT_HOST + url} />}
      <meta property="og:description" content={description} />
      <meta property="og:site_name" content={cfg.siteName} />
    </Helmet>
  );
}

export { HeadTags };
