import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { observer } from 'mobx-react';

import classNames from 'classnames';

import { BlackOut } from '@components/BlackOut';
import { AddFile } from '@components/File';
import { CLIENT_TABS } from '@src/constants';
import { ClientTabs } from '../ClientTabs';
import { TImgProps, TPhotoUploadProps } from './@types';
import style from './PhotoUpload.module.scss';

import ImageIDComp from '/public/theme/id_image.svg';
import ImageSelfieComp from '/public/theme/selfie_image.svg';
import { Preloader } from '@components/Preloader';

export function ImageID(props: TImgProps) {
  const { className, ...restProps } = props;

  return (
    <ImageIDComp
      {...restProps}
      className={classNames(className, style.image, style.ID)}
    />
  );
}

export function ImageSelfie(props: TImgProps) {
  const { className, ...restProps } = props;

  return (
    <ImageSelfieComp
      {...restProps}
      className={classNames(className, style.image, style.Selfie)}
    />
  );
}

const acceptType = [
  'image/jpg',
  'image/jpeg',
  'image/png',
  'image/tiff',
  'application/pdf',
];

function PhotoUploadComponent(props: TPhotoUploadProps) {
  const { staticData, userStore, params } = props;

  const data = useMemo(() => {
    return { view: params.currentStep };
  }, [params.currentStep]);

  const [isRender, setIsRender] = useState(false);
  const [submitEnabled, setSubmitEnabled] = useState(false);
  const [fileButtonDisabled, setFileButtonDisabled] = useState(false);
  const [formBlured, setFormBlured] = useState(false);
  const [showErrorText, setShowErrorText] = useState(false);
  const isAndroidApp =
    userStore.device?.android() &&
    navigator.userAgent.toLowerCase().search('appname/1.0') != -1;

  /** Если загрузили фото и OCR отработал - Submit доступен; ошибку не показываем.
   *  Иначе - Submit недоступен; показываем ошибку. */
  const addPhotoCallBack = useCallback(
    async (uploadSuccessCallback: any) => {
      if (params.currentStep == CLIENT_TABS.ID_PHOTO) {
        setShowErrorText(!uploadSuccessCallback);
      }

      setFileButtonDisabled(uploadSuccessCallback);

      await userStore.viewCheck(data, (submitEnabledCallback) => {
        setSubmitEnabled(submitEnabledCallback);
      });

      setFormBlured(false);
    },
    [data, params.currentStep, userStore]
  );

  const clickFunction = useCallback(() => setFormBlured(true), []);

  const renderTitle = useCallback(() => {
    if (isAndroidApp) {
      return staticData.appTitle;
    }
    if (userStore.device?.mobile()) {
      return staticData.mobTitle;
    }

    return staticData.title;
  }, [
    isAndroidApp,
    staticData.appTitle,
    staticData.mobTitle,
    staticData.title,
    userStore.device,
  ]);

  /** Кнопка "Сделать фотку" */
  const renderMakeCameraPhoto = useCallback(() => {
    if (userStore.device?.mobile()) {
      return (
        <>
          <AddFile
            {...params.fileProps}
            className={classNames(style.button_or, 'button_big button_blue')}
            label={staticData.photoButton}
            view={'button'}
            onClick={() => clickFunction()}
            callBack={(uploadSuccess) => addPhotoCallBack(uploadSuccess)}
            notActive={fileButtonDisabled}
            accept="image/jpg, image/jpeg, image/png, image/tiff"
            capture={true}
          />

          {!isAndroidApp && <p className={style.orText}>{staticData.orText}</p>}
        </>
      );
    }
  }, [
    addPhotoCallBack,
    clickFunction,
    fileButtonDisabled,
    isAndroidApp,
    params.fileProps,
    staticData.orText,
    staticData.photoButton,
    userStore.device,
  ]);

  /** Кнопка "Загрузить фотку" */
  const renderUploadPhotoButton = useCallback(() => {
    if (!isAndroidApp) {
      return (
        <AddFile
          {...params.fileProps}
          className={classNames(style.button_or, 'button_big button_blue')}
          label={staticData.fileButton}
          view={'button'}
          onClick={() => clickFunction()}
          callBack={(uploadSuccess) => addPhotoCallBack(uploadSuccess)}
          notActive={fileButtonDisabled}
          accept={acceptType.join(', ')}
          capture={false}
        />
      );
    }
  }, [
    addPhotoCallBack,
    clickFunction,
    fileButtonDisabled,
    isAndroidApp,
    params.fileProps,
    staticData.fileButton,
  ]);

  const renderBlackOut = useCallback(() => {
    if (formBlured) {
      return <BlackOut showPreloader />;
    }
  }, [formBlured]);

  useEffect(() => {
    userStore.fetchWithAuth(async () => {
      await userStore.getClientNextStep();
      setIsRender(true);
    });
  }, [userStore]);

  useEffect(() => {
    if (submitEnabled) {
      const submitForm = async () => {
        userStore.postClientNextStep(data, () => setSubmitEnabled(true));
      };

      submitForm();
    }
  }, [data, submitEnabled, userStore]);

  if (isRender) {
    return (
      <div className={style.photoUpload}>
        <ClientTabs current={params.currentStep} />
        <form onSubmit={(event) => event.preventDefault()}>
          <p className={style.title}>{renderTitle()}</p>

          {params.image}

          {renderMakeCameraPhoto()}

          {renderUploadPhotoButton()}

          <div className={style.indentBlock}>
            {showErrorText && (
              <p className={style.errorText}>{staticData.errorText}</p>
            )}
          </div>
        </form>

        {renderBlackOut()}
      </div>
    );
  }

  return <Preloader />;
}

export const PhotoUpload = observer(PhotoUploadComponent);
