import React from 'react';
import map from 'lodash/map';

import style from './PrivacyPolicy.module.scss';

import { WithDangerousHTML } from '@components/hocs';
import { WithPageContainer } from '@components/hocs/WithPageContainer';
import { Footer } from '@components/Footer';
import { TPageContentItem, TPrivacyPolicy } from './@types';

function PrivacyPolicy(props: TPrivacyPolicy) {
  const { pageTitle, pageContent, footer } = props;

  return (
    <>
      <WithPageContainer className={style.pageContainer}>
        <div className={style.content}>
          <WithDangerousHTML>
            <h1 className={style.pageTitle}>{pageTitle}</h1>
          </WithDangerousHTML>
          {map(
            pageContent,
            (pageContentItem: TPageContentItem, index: number) => (
              <section key={index} className={style.section}>
                {pageContentItem.title && (
                  <WithDangerousHTML>
                    <h2>{pageContentItem.title}</h2>
                  </WithDangerousHTML>
                )}
                <div className={style.textBlock}>
                  {map(pageContentItem.content, (item, index) => (
                    <WithDangerousHTML key={index}>
                      <div>{item}</div>
                    </WithDangerousHTML>
                  ))}
                </div>
              </section>
            )
          )}
        </div>
      </WithPageContainer>

      <div className={style.footerWrap}>
        <Footer
          copyright={{ text: footer, links: {} }}
          className={style.footer}
        />
      </div>
    </>
  );
}

export { PrivacyPolicy };
