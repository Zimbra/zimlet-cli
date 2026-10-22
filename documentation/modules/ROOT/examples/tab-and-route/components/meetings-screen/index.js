import { createElement } from 'preact';
import { Text } from '@zimbra/preact-i18n';
import { GenericMobileUIToolbar, GenericMobileUISidebar } from '@zimbra-client/components';
import { withIntl } from '../../enhancers';
import { ROOMS } from '../../constants';
import style from './style.less';

// The screen with the list of meeting rooms. Each room opens in a new browser tab.
const MeetingsScreen = () => (
	<div class={style.wrapper}>
		{/* The toolbar and the sidebar that the Modern UI shows for a Zimlet screen on a small window. */}
		<GenericMobileUIToolbar />
		<GenericMobileUISidebar />
		<div class={style.content}>
			<h1 class={style.title}>
				<Text id="my-zimlet.title" />
			</h1>
			<p>
				<Text id="my-zimlet.intro" />
			</p>
			<ul class={style.rooms}>
				{ROOMS.map(room => (
					<li key={room.id} class={style.room}>
						<span class={style.roomName}>{room.name}</span>
						<a class={style.join} href={room.url} target="_blank" rel="noopener noreferrer">
							<Text id="my-zimlet.join" />
						</a>
					</li>
				))}
			</ul>
		</div>
	</div>
);

export default withIntl()(MeetingsScreen);
