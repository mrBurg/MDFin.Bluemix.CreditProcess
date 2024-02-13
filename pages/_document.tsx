import React, { ReactElement } from 'react';
import Document, {DocumentContext, DocumentInitialProps, Head, Html, Main, NextScript,} from 'next/document';

import cfg from '@root/config.json';
import { env } from '@utils';
import { TJSON } from '@interfaces';

export default class CustomDocument extends Document {
  static async getInitialProps(
    ctx: DocumentContext
  ): Promise<DocumentInitialProps> {
    return await Document.getInitialProps(ctx);
  }

  renderWebPush() {
    if (env) {
      return (
        <script
          async
          src="//web.webpushs.com/js/push/4b564d3ac922e89acff17b9ff3bf163b_1.js"
        />
      );
    }
  }

  /** <!-- Google Tag Manager --> */
  renderGTMScript() {
    if (env) {
      const gtmId = (cfg.gtm as TJSON)[env];

      if (gtmId) {
        return (
          <>
            <script
              dangerouslySetInnerHTML={{
                __html: `
                (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','${gtmId}');
                `.trim(),
              }}
            />
          </>
        );
      }
    }
  }

  /** <!-- Google Tag Manager (noscript) --> */
  renderGTMBodyScript() {
    if (env) {
      const gtmId = (cfg.gtm as TJSON)[env];

      if (gtmId) {
        return (
          <>
            <noscript
              dangerouslySetInnerHTML={{
                __html: `
              <iframe src=""https://www.googletagmanager.com/ns.html?id=${gtmId}""
              height=""0"" width=""0"" style=""display:none;visibility:hidden""></iframe>
              `.trim(),
              }}
            />
          </>
        );
      }
    }
  }

  renderAdserviceMasterTag() {
    return (
      <>
        {/*  <!-- Adservice Master Tag --> */}
        <script async src={'https://www.aservice.cloud/trc/mastertag'} />
        <script
          dangerouslySetInnerHTML={{
            __html: `
                  window.asData = window.asData || [];
                  function atag(){asData.push(arguments);}
                  atag('init');
                  atag('track', 'pageview');
              `.trim(),
          }}
        />
      </>
    );
  }

  public render(): ReactElement {
    return (
      <Html lang={cfg.defaultLocale}>
        <Head>
          <meta name="format-detection" content="telephone=no" />
          <meta httpEquiv="cache-control" content="max-age=0" />
          <meta httpEquiv="cache-control" content="no-cache" />
          <meta httpEquiv="expires" content="0" />
          <meta httpEquiv="expires" content="Tue, 01 Jan 1980 1:00:00 GMT" />
          <meta httpEquiv="pragma" content="no-cache" />
          <meta
            name="facebook-domain-verification"
            content="06rcvy6ggcwef9n0emuvgl5uonpvzq"
          />
          <link rel="icon" href="/favicon.ico" />
          <link rel="manifest" href="/manifest.json" />

          {this.renderGTMScript()}
          {this.renderAdserviceMasterTag()}
          {this.renderWebPush()}
        </Head>
        <body>
          <Main />
          <NextScript />
          {this.renderGTMBodyScript()}
        </body>
      </Html>
    );
  }
}
