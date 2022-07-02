import React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import rootReducer from './store/rootReducer';
import {View, Text} from 'react-native';
import Main from './containers/main';

const {store, persistor} = rootReducer();
const App = () => {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <SafeAreaProvider>
          <Main />
        </SafeAreaProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;
