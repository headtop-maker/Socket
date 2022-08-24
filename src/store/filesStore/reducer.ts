import {IFileTypes} from './types';
import {ActionType} from './action';
import {AnyAction} from 'redux';

const initialState: IFileTypes = {
  filesArray: [],
};

const filesReducer = (state = initialState, action: AnyAction) => {
  switch (action.type) {
    case ActionType.setFilesToStore:
      return {
        ...state,
        filesArray: action.payload,
      };

    default:
      return state;
  }
};

export default filesReducer;
