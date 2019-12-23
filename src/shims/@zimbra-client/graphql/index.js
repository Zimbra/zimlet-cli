/** This file is an auto-generated shim, aliased in for "@zimbra-client/graphql" in the webpack config.
*  When components import '@zimbra-client/graphql', we want to give them back the copy
*  Zimbra passed down when it called the factory provided to zimlet().
*/

/* eslint-disable camelcase, dot-notation */
import { warnOnMissingExport } from '../../';
const wrap = warnOnMissingExport.bind(null, global.shims['@zimbra-client/graphql'], '@zimbra-client/graphql');

export const AppointmentsQuery = wrap('AppointmentsQuery');
export const CalendarsAndAppointmentsQuery = wrap('CalendarsAndAppointmentsQuery');
export const withCreateAppointment = wrap('withCreateAppointment');
export const withCalendars = wrap('withCalendars');
export const withSearch = wrap('withSearch');
export const withAccountInfo = wrap('withAccountInfo');
export const withCreateContact = wrap('withCreateContact');
export const withContactAction = wrap('withContactAction');
export const CalendarCreateMutation = wrap('CalendarCreateMutation');
export const withCreateCalendar = wrap('withCreateCalendar');

export default global.shims['@zimbra-client/graphql'];
