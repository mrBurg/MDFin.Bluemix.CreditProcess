import { TGetGeolocation } from './@types';

export function getGeolocation(): TGetGeolocation {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((pos) => {
      if (pos) {
        const {
          coords: { latitude, longitude, accuracy },
        } = pos;

        return {
          latitude,
          longitude,
          accuracy,
        };
      }
    });
  }
}
