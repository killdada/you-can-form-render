import parseJson from 'json-parse-better-errors';

export const schema2str = (obj: any) => JSON.stringify(obj, null, 2) || '';

export const schemaStr2Json = (schemaStrVal: string, needThrowError: boolean = false) => {
  let schemaJson = {};
  try {
    schemaJson = parseJson(schemaStrVal);
  } catch (error) {
    if (needThrowError) {
      throw error;
    }
  }
  return schemaJson;
};
