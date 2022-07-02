import {combineReducers, createStore} from 'redux';
import {persistReducer, persistStore} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import settingsFormReducer from './settings/reducer';
import {composeWithDevTools} from 'redux-devtools-extension';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
};
const rootReducer = combineReducers({settingFormData: settingsFormReducer});
const reducers = persistReducer(persistConfig, rootReducer);

export default () => {
  let store = createStore(reducers, composeWithDevTools());
  let persistor = persistStore(store);
  return {store, persistor};
};
