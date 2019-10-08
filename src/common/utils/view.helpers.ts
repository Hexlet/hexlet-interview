import * as _ from 'lodash';

const prepareFormData = (data): any => data || { values: {}, errors: {} };

const getValidnessClassName = (formdata, property): string => {
  if (_.isEmpty(formdata.errors)) return '';
  if (formdata.errors[property]) return 'is-invalid';
  return 'is-valid';
};

export default {
  prepareFormData,
  getValidnessClassName,
};
