import appConfig from 'src/config/app.config';
import { v5 as uuid } from 'uuid';

export const generateKey = (cacheName: string, json: any): string => {
  const MY_NAMESPACE =
    appConfig().cache.uuid_namespace ?? '8798bb8a-11b0-4828-aaf7-ffa2c7f5e31a';
  const uuidFromString = uuid(stableStringify(json), MY_NAMESPACE);
  return cacheName + '-' + uuidFromString;
};

const stableStringify = (obj: any): string =>
  JSON.stringify(obj, Object.keys(obj).sort());
