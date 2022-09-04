import {ThunkAction} from 'redux-thunk';
import {NativeModules} from 'react-native';

const {NativeMethods} = NativeModules;

export enum ActionType {
  setFilesToStore = 'SET_FILES_TO_STORE',
}

export const setFiles = (files: string[]) => {
  return {
    type: ActionType.setFilesToStore,
    payload: files,
  };
};

export const getFileDirectory = () => {
  return async dispatch => {
    await NativeMethods.getFilesFromPath((data: string[]) => {
      dispatch(setFiles(data));
    });
  };
};

export const sendFile = (
  ipAddress: string,
  currentFile: {
    fileName: string;
    fileType: string;
    fileByteSize: number;
    fileUri: string;
  },
) => {
  return async () => {
    if (currentFile && currentFile.fileName !== undefined) {
      await NativeMethods.sendFile(
        ipAddress,
        currentFile.fileName,
        currentFile.fileType,
        currentFile.fileByteSize,
        currentFile.fileUri,
      );
    }
  };
};
