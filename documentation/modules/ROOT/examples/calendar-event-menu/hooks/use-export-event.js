import { useCallback } from 'preact/hooks';
import { startAttachmentDownloadProcess } from '@zimbra-client/util';
import { getExportPath } from '../utils/get-export-path';
import { getFileName } from '../utils/get-file-name';

// Returns a function that downloads one event as an .ics file.
export default function useExportEvent(zimbraBatchClient) {
	return useCallback(
		event => {
			const fileName = getFileName(event);
			const url = zimbraBatchClient.resolve(getExportPath(event.id, fileName));

			startAttachmentDownloadProcess(url, fileName);
		},
		[zimbraBatchClient]
	);
}
