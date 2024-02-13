import React, { useEffect, useState } from 'react';
import map from 'lodash/map';
import htmlParser from 'html-react-parser';

import style from './VendorStores.module.scss';

import { TVendorStores } from './@types';
import { TARGET } from '@components/widgets/LinkWidget';

function VendorStores(props: TVendorStores) {
  const { title, googlePlay, appStore } = props;
  const [notApp, setNotApp] = useState(false);

  useEffect(() => {
    setNotApp(
      !~navigator.userAgent
        .toLowerCase()
        .search(new RegExp('appname/1.0|iosappname/1.0', 'g'))
    );
  }, []);

  if (notApp) {
    return (
      <section className={style.vendors}>
        <h2 className={style.title}>{htmlParser(title)}</h2>
        <div className={style.content}>
          {map({ googlePlay, appStore }, (item, key) => (
            <a href={item.href} target={TARGET.BLANK} key={key}>
              <img className={style.img} src={item.img} alt={item.img} />
            </a>
          ))}
        </div>
      </section>
    );
  }
  return null;
}

export { VendorStores };
