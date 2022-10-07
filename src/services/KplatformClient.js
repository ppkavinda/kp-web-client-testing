import {initializeApp} from '@CloudImpl-Inc/http-client-js/lib';

export const initKPlatform = (tenantId, baseUrl) => initializeApp({
  tenantId: tenantId,
  baseUrl: baseUrl,
  getAuthTokenFn: () => {
    return '';
  }
});
