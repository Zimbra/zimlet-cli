// The selection can hold folders and files. Only a folder has an absFolderPath.
export default function getFiles(selectedList = []) {
	return selectedList.filter(item => !item.absFolderPath);
}
