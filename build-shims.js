const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const mockery = require('mockery');
const shimmedModules = require('./src/shims/index.js').SHIMMED_MODULES;

mockery.enable({
	warnOnReplace: false,
	warnOnUnregistered: false
});

mockery.registerSubstitute('react', 'preact/compat');
mockery.registerSubstitute('react-dom', 'preact/compat');
mockery.registerSubstitute('react-dom/server', 'preact/compat');
mockery.registerMock('preact-router/match', { Match: 1 });
mockery.registerMock('apollo-client', {}); //doesn't really matter
mockery.registerMock('redux', {}); //doesn't really matter

/* @zimbra/util is a psuedo-module: it is built from the many library
 * functions contained in `zm-x-web`.
 */
mockery.registerMock('@zimbra-client/util', {
	array: 1,
	getDataTransferJSON: 1,
	setDataTransferJSON: 1,
	breakpoints: 1,
	callWith: 1,
	pruneEmpty: 1
});

mockery.registerMock('@zimbra-client/browser', {
	openExternalBrowser: 1
});

mockery.registerMock('@zimbra-client/util/contacts', {
	getName: 1
});

mockery.registerMock('@zimbra-client/util/redux', {
	paginate: 1,
	createAsyncAction: 1,
	pendingAction: 1,
	fulfilledAction: 1,
	rejectedAction: 1
});

mockery.registerMock('graphql-tag', {
	default: 1
});

mockery.registerMock('preact-pwa-install', {
	default: 1
});

mockery.registerMock('clipboard-polyfill', {
	writeText: 1
});

mockery.registerMock('@zimbra-client/graphql', {
	AppointmentsQuery: 1,
	CalendarsAndAppointmentsQuery: 1,
	GetDocumentShareURLQuery: 1,
	withCreateAppointment: 1,
	withCalendars: 1,
	withSearch: 1,
	withAccountInfo: 1,
	withPreference: 1,
	withIdentities: 1,
	withCreateContact: 1,
	withContactAction: 1,
	CalendarCreateMutation: 1,
	withCreateCalendar: 1,
	withSetCustomMetaData: 1,
	withGetCustomMetaData: 1,
	withActionMutation: 1,
	withTags: 1,
	withTagCreate: 1,
	withTagAction: 1,
	SearchFragment: 1,
	SendShareNotificationMutation: 1
});

mockery.registerMock('@zimbra-client/enhancers', {
	withMediaQuery: 1,
	withTabManager: 1,
	withIntlWrapper: 1,
	clientConfiguration: 1,
	withTracking: 1
});

mockery.registerMock('@zimbra-client/constants', {
	ATTENDEE_ROLE: 1,
	PARTICIPATION_STATUS: 1,
	supportedMimes: 1
});

mockery.registerMock('@zimbra-client/hooks', {
	useClientConfig: 1,
	useTracking: 1
});

mockery.registerMock('@zimbra-client/hooks/graphql', {
	useFoldersQuery: 1,
	useAccountInfo: 1,
	useDocumentAction: 1,
	useBriefcaseFoldersQuery: 1,
	useSaveDocumentMutation: 1
});

mockery.registerMock('@zimbra-client/blocks', {
	Dialog: 1,
	FixedDialog: 1,
	ModalDialog: 1,
	Button: 1,
	Select: 1,
	Option: 1,
	Tabs: 1,
	Tab: 1,
	Icon: 1,
	FontAwesome: 1,
	Spinner: 1,
	ClickOutsideDetector: 1,
	ContainerSize: 1,
	Popover: 1,
	Tooltip: 1,
	Scrim: 1,
	Card: 1,
	AffixBottom: 1,
	KeyCodes: 1,
	Label: 1,
	ChoiceInput: 1
});

mockery.registerMock('@zimbra-client/components', {
	MenuItem: 1,
	Sidebar: 1,
	MailSidebar: 1,
	FolderList: 1,
	SmartList: 1,
	ActionMenuMoveFolder: 1,
	ActionButton: 1,
	CaptureBeforeUnload: 1,
	ConfirmModalDialog: 1,
	ModalDialog: 1,
	ActionMenu: 1,
	DropDownWrapper: 1,
	ActionMenuItem: 1,
	ActionMenuGroup: 1,
	DraggableCard: 1,
	ContextMenu: 1,
	ToolbarButton: 1,
	CollapsedSubmenu: 1,
	InfiniteScroll: 1,
	ContactList: 1,
	ContactEditor: 1,
	HelpButton: 1,
	AppointmentEdit: 1,
	ColorPicker: 1,
	ModalDrawer: 1,
	ModalDrawerToolbar: 1,
	BackArrow: 1,
	Select: 1,
	NakedButton: 1,
	TextInput: 1,
	TinyMceComposer: 1,
	TextArea: 1,
	AddMore: 1,
	FormGroup: 1,
	AlignedLabel: 1,
	AttachmentItem: 1,
	ResponsiveModal: 1,
	NestedActionMenuItem: 1,
	PdfjsViewer: 1,
	FolderListLight: 1,
	GenericMobileUIToolbar: 1,
	GenericMobileUISidebar: 1,
	ZimletSlot: 1,
	AddressField: 1
});

mockery.registerMock('@zimbra-client/errors', {
	errorMessage: 1,
	faultCode: 1
});

function createShim(shimModule) {
	if (Array.isArray(shimModule)) {
		shimModule.map((name, index) => !index ? name : `${shimModule[0]}/${name}`).forEach(createShim);
		return;
	}
	// console.log('require.cache', require.cache);
	//turn snake case into camelCase, e.g. preact-router into preactRouter
	let dirName = path.resolve(`src/shims/${shimModule}`);

	mkdirp(dirName).then(() => {
		fs.writeFileSync(`${dirName}/index.js`,
			`/** This file is an auto-generated shim, aliased in for "${shimModule}" in the webpack config.
*  When components import '${shimModule}', we want to give them back the copy
*  Zimbra passed down when it called the factory provided to zimlet().
*/

/* eslint-disable camelcase, dot-notation */
import { warnOnMissingExport } from '.${shimModule.split('/').map((pathpart, index) => !index ? './' : '../').join('')}';
const wrap = warnOnMissingExport.bind(null, global.shims['${shimModule}'], '${shimModule}');

${Object.keys(require(shimModule)).filter(exportName => exportName !== '__esModule').map(exportName =>
		`export ${exportName === 'default' ? 'default' : `const ${exportName} =`} wrap('${exportName}');`).join('\n')
}
${'default' in require(shimModule) ? '' : `
export default global.shims['${shimModule}'];`}
`
		);
	}).catch(() => {
		console.error(`Unable to mkdir ${dirName}`);
	});
}

shimmedModules.forEach(createShim);

console.log('Successfully Built Shim files');
