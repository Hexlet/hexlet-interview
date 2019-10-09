import * as i18n from 'i18n';
import { FormData } from './form-data';

const getValidnessClassName = (hasErrors: boolean, hasThisPropertyErrors: boolean): string => {
  if (!hasErrors) return '';
  if (hasThisPropertyErrors) return 'is-invalid';
  return 'is-valid';
};

const joinErrorMessages = (errors: string[]): string => errors.map(err => i18n.__(`validation.${err}`)).join('. ');

export default {
  getValidnessClassName,
  FormData,
  joinErrorMessages,
};
