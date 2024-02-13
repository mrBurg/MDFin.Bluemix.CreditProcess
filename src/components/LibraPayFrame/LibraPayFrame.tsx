import React, {
  useState,
  useCallback,
  useRef,
  useEffect,
  useMemo,
} from 'react';
import { observer } from 'mobx-react';
import map from 'lodash/map';
import size from 'lodash/size';
import split from 'lodash/split';

import style from './LibraPayFrame.module.scss';

import { TLibraPayFrame } from './@types';
import { METHOD } from '@src/constants';
import { INPUT_TYPE } from '@components/widgets/InputWidget';

function LibraPayFrameComponent(props: TLibraPayFrame) {
  const { url, body } = props;

  const frameName = 'librapayFrame';
  const formRef = useRef<HTMLFormElement>(null);
  const data = useMemo(() => split(body, '&'), [body]);
  const [isRender, setIsRender] = useState(false);

  const formSubmit = useCallback(() => {
    if (isRender && formRef && formRef.current) {
      formRef.current.submit();
    }
  }, [isRender]);

  useEffect(() => {
    if (size(data) > 1) {
      setIsRender(true);
    }
  }, [data]);

  return (
    <>
      <iframe
        title={'LibrapayFrame'}
        className={style.iframe}
        id={frameName}
        name={frameName}
        frameBorder={0}
        src={''}
      />
      <form action={url} method={METHOD.POST} target={frameName} ref={formRef}>
        {map(data, (item, index) => {
          //** эта конструкция не рабоет, так как в value может содержать знаки "=" */
          //const [name, value] = item.split('=');

          const name = item.substring(0, item.indexOf('='));
          const value = item.substring(item.indexOf('=') + 1);

          return (
            <input
              name={name}
              defaultValue={value}
              key={index}
              type={INPUT_TYPE.HIDDEN}
            />
          );
        })}
      </form>
      {formSubmit()}
    </>
  );
}

export const LibraPayFrame = observer(LibraPayFrameComponent);
