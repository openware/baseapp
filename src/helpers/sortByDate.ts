import * as moment from 'moment';
import { localeDate } from './localeDate';

export const sortByDate = (prop: string, format: string) => {
  return (a, b) => {
      return moment(localeDate(a[prop], 'fullDate'), format) > moment(localeDate(b[prop], 'fullDate'), format) ? -1 : 1;
  };
};
