import {IFileTypes} from './filesStore/types';
import {ISettings} from './settings/types';

type TState = {
  settingFormData: ISettings;
  filesData: IFileTypes;
};

export default TState;
