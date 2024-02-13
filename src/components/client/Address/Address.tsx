import React, { ReactElement, PureComponent, FormEvent } from 'react';
import { observer } from 'mobx-react';

import difference from 'lodash/difference';
import each from 'lodash/each';
import isEmpty from 'lodash/isEmpty';
import size from 'lodash/size';
import union from 'lodash/union';
import classNames from 'classnames';

import style from './Address.module.scss';

import cfg from '@root/config.json';
import { TAddress, TFieldData, TState } from './@types';
import { gt, handleErrors, validator } from '@utils';
import { DIRECTORIES, URIS } from '@routes';
import { CLIENT_TABS, FIELD_NAME } from '@src/constants';
import {
  TSelectBlurData,
  TSelectChangeData,
} from '@components/widgets/ReactSelectWidget/@types';
import { ClientTabs } from '../ClientTabs';
import { ReactSelectWidget } from '@components/widgets/ReactSelectWidget';
import { AbstractRoles, WidgetRoles } from '@src/roles';
import { ReactInputMaskWidget } from '@components/widgets/ReactInputMaskWidget';
import { Preloader } from '@components/Preloader';
import { TField, TUserAddress, TUserContacts } from '@stores-types/userStore';
import { InputWidget, INPUT_TYPE } from '@components/widgets/InputWidget';
import { ButtonWidget, BUTTON_TYPE } from '@components/widgets/ButtonWidget';

@observer
export class Address extends PureComponent<TAddress> {
  public readonly state: TState = {
    isRender: false,
    invalidFields: [],
  };

  async componentDidMount(): Promise<void> {
    const { pageStore, userStore } = this.props;

    userStore.fetchWithAuth(async () => {
      await userStore.getClientNextStep();
      await userStore.getWizardData_Address();

      pageStore.getDirectory(DIRECTORIES.dirThirdPartyRelation);
      pageStore.getDirectory(DIRECTORIES.dirCityProvince);

      if (userStore.userDataAddress.cityProvince_id) {
        await pageStore.getDirectory(
          DIRECTORIES.dirDistrict,
          String(userStore.userDataAddress.cityProvince_id)
        );
      }

      if (userStore.userDataAddress.district_id) {
        await pageStore.getDirectory(
          DIRECTORIES.dirWardCommune,
          String(userStore.userDataAddress.district_id)
        );
      }

      this.setState({
        isRender: true,
      });
    });
  }

  private onSubmitHandler = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    this.submitForm();
  };

  private async submitForm() {
    const {
      userStore,
      userStore: { userDataAddress, userDataContacts },
    } = this.props;

    const validateItems = await this.validateItems();
    const res = await this.validateForm(validateItems);

    if (!res) {
      return;
    }

    const newData: {
      address: TUserAddress;
      contacts?: TUserContacts[];
    } = {
      address: { ...userDataAddress },
    };

    /** нужно проверять не только размер, но и отсутствие "пустого" обьекта */
    if (size(userDataContacts) > 0 && !isEmpty(userDataContacts[0])) {
      newData.contacts = userDataContacts;
    }

    await userStore.saveWizardStep(URIS.address, newData);
    userStore.getClientNextStep();
  }

  /** Список полей для валидации */
  private async validateItems(): Promise<TField[]> {
    const {
      userStore: { userDataAddress, userDataContacts },
    } = this.props;

    const validateItems: TField[] = [
      {
        name: FIELD_NAME.CITY_PROVINCE,
        value: userDataAddress.cityProvince_id!,
      },
      { name: FIELD_NAME.DISTRICT, value: userDataAddress.district_id! },
      { name: FIELD_NAME.WARD_COMMUNE, value: userDataAddress.wardCommune_id! },
      { name: FIELD_NAME.STREET, value: userDataAddress.street! },
      // { name: FIELD_NAME.BUILDING, value: userDataAddress.building! },
      {
        name: FIELD_NAME.YEARS,
        value: userDataAddress.currentPlaceLivingYear!,
      },
      {
        name: FIELD_NAME.MONTHS,
        value: userDataAddress.currentPlaceLivingMonth!,
      },
      {
        name: FIELD_NAME.THIRD_PARTY_PHONE,
        value: size(userDataContacts) ? userDataContacts[0].phoneNumber : '',
      },
      {
        name: FIELD_NAME.THIRD_PARTY_NAME,
        value: size(userDataContacts) ? userDataContacts[0].name : '',
      },
      {
        name: FIELD_NAME.THIRD_PARTY_RELATION,
        value: size(userDataContacts) ? userDataContacts[0].type_id : '',
      },
    ];
    return validateItems;
  }

  private validateField = async (data: TFieldData) => {
    this.validateForm([{ name: data.name, value: data.value }]);
  };

  /** Валидация полей "третьего лица"
   *  Тут же, убирается признак невалидности всех полей, если все три поля - валидны
   */
  private validateField_thirdParty = async (data: TFieldData) => {
    const {
      userStore,
      userStore: { userDataContacts },
    } = this.props;

    const invalidFieldsList: string[] = validator(
      [{ name: data.name, value: data.value }],
      userStore
    );
    this.setInvalidFields(invalidFieldsList, [data.name]);

    const filedsList: TField[] = [
      {
        name: FIELD_NAME.THIRD_PARTY_PHONE,
        value: size(userDataContacts) ? userDataContacts[0].phoneNumber : '',
      },
      {
        name: FIELD_NAME.THIRD_PARTY_NAME,
        value: size(userDataContacts) ? userDataContacts[0].name : '',
      },
      {
        name: FIELD_NAME.THIRD_PARTY_RELATION,
        value: size(userDataContacts) ? userDataContacts[0].type_id : '',
      },
    ];

    const validateItemsNames: string[] = [
      FIELD_NAME.THIRD_PARTY_PHONE,
      FIELD_NAME.THIRD_PARTY_NAME,
      FIELD_NAME.THIRD_PARTY_RELATION,
    ];

    if (!size(invalidFieldsList)) {
      const invalidAllFieldsList: string[] = validator(filedsList, userStore);
      if (!size(invalidAllFieldsList)) {
        this.setInvalidFields(invalidAllFieldsList, validateItemsNames);
      }
    }
  };

  private validateFieldSelect = (data: TSelectBlurData) => {
    this.validateForm([data]);
  };

  /* private validateSelectField = (data: TSelectChangeData) => {
    this.validateForm([data]);
  }; */

  private async validateForm(validateItems: TField[]): Promise<boolean> {
    const { userStore } = this.props;

    const validateItemsNames: string[] = [];
    each(validateItems, (itemName: TField) => {
      validateItemsNames.push(itemName.name);
    });
    /*let invalidFields: string[] = this.state.invalidFields;*/
    const validateResult: string[] = validator(validateItems, userStore);

    await this.setInvalidFields(validateResult, validateItemsNames);

    return !size(this.state.invalidFields);
  }

  /** добавить невалидные/убрать валидные поля из State
   * @param validateResult - список невалидных полей
   * @param validateItemsNames - список имен полей для валидации
   */
  private setInvalidFields = async (
    validateResult: string[],
    validateItemsNames: string[]
  ) => {
    const invalidFields: string[] = this.state.invalidFields;

    if (size(validateResult)) {
      this.setState((state: TState): TState => {
        return {
          ...state,
          invalidFields: union(validateResult, invalidFields),
        };
      });
    } else {
      this.setState((state: TState): TState => {
        return {
          ...state,
          invalidFields: difference(invalidFields, validateItemsNames),
        };
      });
    }
  };

  private onChangeHandler_Address = (data: TFieldData) => {
    const { userStore } = this.props;

    userStore.updateStore_userDataAddress({
      [data.name]: data.value.replace(/\s-\s/g, ''),
    });
  };

  private handleChangeSelect_Address = (data: TSelectChangeData) => {
    const { userStore } = this.props;
    if (data.value) {
      new Promise((resolve) => {
        resolve(
          userStore.updateStore_userDataAddress({ [data.name]: data.value })
        );
      })
        .then(() => {
          const { pageStore } = this.props;

          switch (data.name) {
            case FIELD_NAME.CITY_PROVINCE:
              return (
                pageStore.getDirectory(DIRECTORIES.dirDistrict, data.value),
                pageStore.getDirectory(DIRECTORIES.dirWardCommune, ''),
                userStore.updateStore_userDataAddress({
                  shouldShow_DISTRICT: true,
                  shouldShow_WARD_COMMUNE: false,
                })
              );
            case FIELD_NAME.DISTRICT:
              return (
                pageStore.getDirectory(DIRECTORIES.dirWardCommune, data.value),
                userStore.updateStore_userDataAddress({
                  shouldShow_WARD_COMMUNE: true,
                })
              );
          }

          return;
        })
        .catch((err) => {
          handleErrors(err);
        });
    }
  };

  private onChangeHandler_Contacts = (data: TFieldData) => {
    const { userStore } = this.props;

    // поскольку, у нас одинаковые ключи "name" для
    // для всех обьектов "имени" - изголяемся вот такой фигней.
    const name = data.name.replace('thirdParty_', '');

    if (data.value) {
      const value = data.value.replace(/\s-\s/g, '');

      userStore.updateStore_userDataContacts({ [name]: value });
    } else {
      userStore.removeStore_userDataContacts(name);
    }
  };

  private handleChangeSelect_Contacts = (data: TSelectChangeData) => {
    const { userStore } = this.props;
    // поскольку, у нас одинаковые ключи "name" для
    // для всех обьектов "имени" - изголяемся вот такой фигней.
    data.name = data.name.replace('thirdParty_', '');

    userStore.updateStore_userDataContacts({ [data.name]: data.value });
  };

  public render(): ReactElement | null {
    const {
      staticData,
      pageStore,
      userStore: { userDataAddress, userDataContacts },
    } = this.props;
    const { invalidFields } = this.state;

    if (this.state.isRender && pageStore) {
      return (
        <div className={style.address}>
          <h2 className={style.title}>{staticData.title}</h2>
          <ClientTabs current={CLIENT_TABS.ADDRESS} />
          <form onSubmit={this.onSubmitHandler}>
            <h2 className={style.title}>{staticData.title}</h2>

            <div className={style.fields}>
              <ReactSelectWidget
                name={FIELD_NAME.CITY_PROVINCE}
                value={userDataAddress.cityProvince_id as number}
                className={style.reactSelectWidget}
                invalid={invalidFields.includes(FIELD_NAME.CITY_PROVINCE)}
                placeholder={staticData.cityProvince}
                options={pageStore.dirCityProvince}
                onChange={this.handleChangeSelect_Address}
                onBlur={this.validateFieldSelect}
                isSearchable
              />
              {(userDataAddress.shouldShow_DISTRICT ||
                !!userDataAddress.district_id) && (
                <ReactSelectWidget
                  name={FIELD_NAME.DISTRICT}
                  value={userDataAddress.district_id as number}
                  className={style.reactSelectWidget}
                  invalid={invalidFields.includes(FIELD_NAME.DISTRICT)}
                  placeholder={staticData.district}
                  options={pageStore.dirDistrict}
                  onChange={this.handleChangeSelect_Address}
                  onBlur={this.validateFieldSelect}
                  isSearchable
                />
              )}
              {(userDataAddress.shouldShow_WARD_COMMUNE ||
                !!userDataAddress.wardCommune_id) && (
                <ReactSelectWidget
                  name={FIELD_NAME.WARD_COMMUNE}
                  value={userDataAddress.wardCommune_id as number}
                  className={style.reactSelectWidget}
                  invalid={invalidFields.includes(FIELD_NAME.WARD_COMMUNE)}
                  placeholder={staticData.wardCommune}
                  options={pageStore.dirWardCommune}
                  onChange={this.handleChangeSelect_Address}
                  onBlur={this.validateFieldSelect}
                  isSearchable
                />
              )}
              <InputWidget
                id={`Address-${AbstractRoles.input}-${INPUT_TYPE.TEXT}-${FIELD_NAME.STREET}`}
                name={FIELD_NAME.STREET}
                value={userDataAddress.street || ''}
                className={classNames(style.input, {
                  [style.error]: invalidFields.includes(FIELD_NAME.STREET),
                })}
                type={INPUT_TYPE.TEXT}
                placeholder={staticData.street}
                onChange={(event) =>
                  this.onChangeHandler_Address({
                    name: event.currentTarget.name,
                    value: event.currentTarget.value,
                  })
                }
                maxLength={100}
                onBlur={(event) =>
                  this.validateField({
                    name: event.currentTarget.name,
                    value: event.currentTarget.value,
                  })
                }
              />
              <InputWidget
                id={`Address-${AbstractRoles.input}-${INPUT_TYPE.TEXT}-${FIELD_NAME.BUILDING}`}
                name={FIELD_NAME.BUILDING}
                value={userDataAddress.building || ''}
                className={classNames(style.input, {
                  [style.error]: invalidFields.includes(FIELD_NAME.BUILDING),
                })}
                type={INPUT_TYPE.TEXT}
                placeholder={staticData.building}
                onChange={(event) =>
                  this.onChangeHandler_Address({
                    name: event.currentTarget.name,
                    value: event.currentTarget.value,
                  })
                }
                maxLength={4}
                onBlur={(event) =>
                  this.validateField({
                    name: event.currentTarget.name,
                    value: event.currentTarget.value,
                  })
                }
              />
              <InputWidget
                id={`Address-${AbstractRoles.input}-${INPUT_TYPE.TEXT}-${FIELD_NAME.APARTMENT}`}
                name={FIELD_NAME.APARTMENT}
                value={userDataAddress.apartment || ''}
                className={style.input}
                type={INPUT_TYPE.TEXT}
                placeholder={staticData.apartment}
                onChange={(event) =>
                  this.onChangeHandler_Address({
                    name: event.currentTarget.name,
                    value: event.currentTarget.value,
                  })
                }
                maxLength={4}
              />
              <div className={style.livingPeriod}>
                <p className={style.livingPeriodTitle}>
                  {staticData.livingPeriod}
                </p>
                <InputWidget
                  id={`Address-${AbstractRoles.input}-${INPUT_TYPE.TEL}-${FIELD_NAME.YEARS}`}
                  name={FIELD_NAME.YEARS}
                  value={
                    userDataAddress.currentPlaceLivingYear != null
                      ? userDataAddress.currentPlaceLivingYear
                      : ''
                  }
                  className={classNames(style.input, {
                    [style.error]: invalidFields.includes(FIELD_NAME.YEARS),
                  })}
                  type={INPUT_TYPE.TEL}
                  placeholder={staticData.years}
                  onChange={(event) =>
                    this.onChangeHandler_Address({
                      name: event.currentTarget.name,
                      value: event.currentTarget.value,
                    })
                  }
                  maxLength={2}
                  onBlur={(event) =>
                    this.validateField({
                      name: event.currentTarget.name,
                      value: event.currentTarget.value,
                    })
                  }
                />
                <InputWidget
                  id={`Address-${AbstractRoles.input}-${INPUT_TYPE.TEL}-${FIELD_NAME.MONTHS}`}
                  name={FIELD_NAME.MONTHS}
                  value={
                    userDataAddress.currentPlaceLivingMonth != null
                      ? userDataAddress.currentPlaceLivingMonth
                      : ''
                  }
                  className={classNames(style.input, {
                    [style.error]: invalidFields.includes(FIELD_NAME.MONTHS),
                  })}
                  type={INPUT_TYPE.TEL}
                  placeholder={staticData.months}
                  onChange={(event) =>
                    this.onChangeHandler_Address({
                      name: event.currentTarget.name,
                      value: event.currentTarget.value,
                    })
                  }
                  maxLength={2}
                  onBlur={(event) =>
                    this.validateField({
                      name: event.currentTarget.name,
                      value: event.currentTarget.value,
                    })
                  }
                />
              </div>
              <ReactInputMaskWidget
                id={`Address-${AbstractRoles.input}-${INPUT_TYPE.TEL}-${FIELD_NAME.THIRD_PARTY_PHONE}`}
                name={FIELD_NAME.THIRD_PARTY_PHONE}
                value={
                  size(userDataContacts)
                    ? userDataContacts[0]?.phoneNumber || ''
                    : ''
                }
                className={style.inputMask}
                invalid={invalidFields.includes(FIELD_NAME.THIRD_PARTY_PHONE)}
                type={INPUT_TYPE.TEL}
                mask={cfg.otherPhoneMask}
                placeholder={
                  staticData.thirdPartyPhone || cfg.phoneMask.replace(/9/g, '*')
                }
                onChange={(event) =>
                  this.onChangeHandler_Contacts({
                    name: event.currentTarget.name,
                    value: event.currentTarget.value,
                  })
                }
                onBlur={(event) =>
                  this.validateField_thirdParty({
                    name: event.currentTarget.name,
                    value: event.currentTarget.value,
                  })
                }
              />
              <InputWidget
                id={`Address-${AbstractRoles.input}-${INPUT_TYPE.TEXT}-${FIELD_NAME.THIRD_PARTY_NAME}`}
                name={FIELD_NAME.THIRD_PARTY_NAME}
                value={
                  size(userDataContacts) ? userDataContacts[0].name || '' : ''
                }
                className={classNames({
                  [style.error]: invalidFields.includes(
                    FIELD_NAME.THIRD_PARTY_NAME
                  ),
                })}
                type={INPUT_TYPE.TEXT}
                placeholder={staticData.thirdPartyName}
                maxLength={50}
                onChange={(event) =>
                  this.onChangeHandler_Contacts({
                    name: event.currentTarget.name,
                    value: event.currentTarget.value,
                  })
                }
                onBlur={(event) =>
                  this.validateField_thirdParty({
                    name: event.currentTarget.name,
                    value: event.currentTarget.value,
                  })
                }
              />
              <ReactSelectWidget
                name={FIELD_NAME.THIRD_PARTY_RELATION}
                value={
                  size(userDataContacts)
                    ? userDataContacts[0].type_id || ''
                    : ''
                }
                className={style.reactSelectWidget}
                invalid={invalidFields.includes(
                  FIELD_NAME.THIRD_PARTY_RELATION
                )}
                placeholder={staticData.thirdPartyRelation}
                options={pageStore.dirThirdPartyRelation}
                onChange={this.handleChangeSelect_Contacts}
                onBlur={this.validateFieldSelect}
              />
            </div>
            <ButtonWidget
              id={`Obligatory-${WidgetRoles.button}-${BUTTON_TYPE.SUBMIT}`}
              className={style.nextStep}
              type={BUTTON_TYPE.SUBMIT}
            >
              {gt.gettext('More')}
            </ButtonWidget>
          </form>
        </div>
      );
    }

    return <Preloader />;
  }
}
