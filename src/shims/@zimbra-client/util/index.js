/** This file is an auto-generated shim, aliased in for "@zimbra-client/util" in the webpack config.
*  When components import '@zimbra-client/util', we want to give them back the copy
*  Zimbra passed down when it called the factory provided to zimlet().
*/

/* eslint-disable camelcase, dot-notation */
import { warnOnMissingExport } from '../../';
const wrap = warnOnMissingExport.bind(null, global.shims['@zimbra-client/util'], '@zimbra-client/util');

export const array = wrap('array');
export const getDataTransferJSON = wrap('getDataTransferJSON');
export const setDataTransferJSON = wrap('setDataTransferJSON');
export const breakpoints = wrap('breakpoints');
export const callWith = wrap('callWith');
export const pruneEmpty = wrap('pruneEmpty');
export const PageVisibility = wrap('PageVisibility');
export const zimletEventEmitter = wrap('zimletEventEmitter');
export const smimeHandler = wrap('smimeHandler');
export const isServerSMIMEFeatureAvailable = wrap('isServerSMIMEFeatureAvailable');
export const startAttachmentDownloadProcess = wrap('startAttachmentDownloadProcess');
export const htmlToText = wrap('htmlToText');
export const clipboard = wrap('clipboard');
export const filterNonInsertableCalendars = wrap('filterNonInsertableCalendars');
export const closeEventTabThunk = wrap('closeEventTabThunk');
export const htmlEncode = wrap('htmlEncode');
export const getElectron = wrap('getElectron');

export default global.shims['@zimbra-client/util'];
