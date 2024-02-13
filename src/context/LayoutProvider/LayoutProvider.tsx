import { NextHead } from '@components/NextHead';
import classNames from 'classnames';
import React, { createContext, useCallback, useMemo, useState } from 'react';

import style from './LayoutProvider.module.scss';

import {
  TLayoutProviderContext,
  TLayoutProviderProps,
  TLayoutProviderPropsStore,
} from './@types';

export const LayoutProviderCtx = createContext({} as TLayoutProviderContext);

/**
 * @description Провайдер макета. Определяет внешний вид макета по свойствам полученным в аргументе "template"
 * @param hasBackground наличие фона на странице
 * @param hasHeader наличие шапки
 * @param headerLess внешний вид шапки (логотип и меню | только логотип)
 * @param footerType внешний вид подвала (текст и копирайт, только копирайт)
 * @param hasBlur размытие страницы
 * @param setBlur метод для изменения размытия страницы
 * @param loading отображение заглушки
 * @param setLoading метод изменения заглушки
 * @param showLoanButton отображение Плавающей кнопки
 * @param showReminder отображение Reminder компонента
 * @param reminderTimeout время задержки Reminder компонента
 * @param reminderTemplate шаблон Reminder компонента
 */
function LayoutProvider(props: TLayoutProviderProps) {
  const { children, template } = props as TLayoutProviderPropsStore;

  const metaContent = useMemo(
    () => template && template.metaContent,
    [template]
  );

  const layoutProps = useMemo(
    () =>
      template && {
        hasBackground: template.background,
        hasHeader: !template.noHeader,
        headerLess: template.headerLess,
        footerType: template.footerType,
        showLoanButton: template.showLoanButton,
        showReminder: template.showReminder,
        reminderTimeout: template.reminderTimeout,
        reminderTemplate: template.reminderTemplate,
        showPromo: template.showPromo,
      },
    [template]
  );

  const [hasBlur, setBlur] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasProductSelector, setProductSelector] = useState(false);

  const renderLoading = useCallback(
    () =>
      loading && (
        <div
          className={classNames({
            [style.loading]: loading,
          })}
        >
          ...loading
        </div>
      ),
    [loading]
  );

  return (
    <LayoutProviderCtx.Provider
      value={{
        ...layoutProps,
        hasBlur,
        setBlur,
        loading,
        setLoading,
        hasProductSelector,
        setProductSelector,
      }}
    >
      <NextHead {...metaContent} />
      {children}
      {renderLoading()}
    </LayoutProviderCtx.Provider>
  );
}

export { LayoutProvider };
