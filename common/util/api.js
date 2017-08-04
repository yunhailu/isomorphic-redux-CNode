import config from '../../config';
const baseUrl = `http://${config.serverip}:${config.serverport}/api/`;

export const propertyList = baseUrl + 'propertyList';

export const getBundles = baseUrl + 'getBundles';

export const user = baseUrl + 'user'; 
