import { ZIMLET_NAME } from '../constants';

// A saved Zimlet value is an object with the Zimlet name, the setting name and the text.
export const toProperty = (name, content) => ({ zimlet: ZIMLET_NAME, name, _content: content });

export const readContent = (value, name) => value?.[name]?._content;
