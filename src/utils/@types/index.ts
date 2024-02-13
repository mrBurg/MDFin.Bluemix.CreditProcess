export type THandleErrors = Promise<{ view: string } | boolean | void>;

export type TGetGeolocation = {
  readonly accuracy: number;
  readonly altitude: number | null;
  readonly altitudeAccuracy: number | null;
  readonly heading: number | null;
  readonly latitude: number;
  readonly longitude: number;
  readonly speed: number | null;
} | void;

export type TGetBrowserData = {
  name: string;
  version: string | number | null;
  fullname: string;
};
