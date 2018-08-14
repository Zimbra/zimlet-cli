/** This file is an auto-generated shim, aliased in for "@zimbra/graphql" in the webpack config.
*  When components import '@zimbra/graphql', we want to give them back the copy
*  Zimbra passed down when it called the factory provided to zimlet().
*/

/* eslint-disable camelcase, dot-notation */
import { warnOnMissingExport } from '../../';
const wrap = warnOnMissingExport.bind(null, global.shims['@zimbra/graphql'], '@zimbra/graphql');

export const CalendarsAndAppointmentsQuery = wrap('CalendarsAndAppointmentsQuery');
export const withCreateAppointment = wrap('withCreateAppointment');
export const withCalendars = wrap('withCalendars');
export default global.shims['@zimbra/graphql'];
