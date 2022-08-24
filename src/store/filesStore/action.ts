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
  return async (dispatch, getState) => {
    await NativeMethods.getFilesFromPath((data: string[]) => {
      dispatch(setFiles(data));
    });
  };
};
