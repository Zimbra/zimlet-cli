import { withIntlWrapper } from '@zimbra-client/enhancers';

export const withIntl = () =>
	withIntlWrapper({
		importFn: locale => import(/* webpackMode: "eager" */ `../intl/${locale}.json`),
		showLoader: false
	});
