import React, { useCallback, useContext } from 'react';
import classNames from 'classnames';
import reduce from 'lodash/reduce';
import size from 'lodash/size';

import style from './Footer.module.scss';

import { WithTag } from '@components/hocs';
import { TFooterProps } from './@types';
import { GetAttachment } from '@components/GetAttachment';
import { TJSON } from '@interfaces';
import { LayoutCtx } from '@components/Layout';
import { LinkWidget, TARGET } from '@components/widgets/LinkWidget';
import { WidgetRoles } from '@src/roles';

function Footer(props: TFooterProps) {
  const { less, copyright, className } = props;

  const { blur } = useContext(LayoutCtx);

  const renderContent = useCallback(() => {
    if (copyright) {
      const contentData = (
        <div className={classNames(style.container, className)}>
          {copyright.text}
        </div>
      );

      if (size(copyright.tags)) {
        return (
          <WithTag
            tags={reduce(
              copyright.tags,
              (accum, item, index) => {
                accum[index] =
                  item.tagType == 'link' ? (
                    <LinkWidget
                      key={index}
                      id={`Footer-${item.type}-${WidgetRoles.link}`}
                      href={item.href}
                      className={style.link}
                      target={TARGET.BLANK}
                    >
                      {item.label}
                    </LinkWidget>
                  ) : (
                    <GetAttachment
                      key={index}
                      attachmentType={item.type}
                      label={item.label}
                      className={style.link}
                    />
                  );

                return accum;
              },
              {} as TJSON
            )}
          >
            {contentData}
          </WithTag>
        );
      }

      return contentData;
    }
  }, [className, copyright]);

  return (
    <footer
      className={classNames(style.footer, {
        [style.less]: less,
        [style.footerBlur]: blur,
      })}
    >
      {renderContent()}
    </footer>
  );
}

export { Footer };
