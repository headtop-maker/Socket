import React from 'react';

import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import SCREENS from '../../constants/screen';
import ServerScreen from '../serverScreen/ServerScreen';
import ClientScreen from '../clientScreen';

const Tab = createMaterialTopTabNavigator();

const MainScreen = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name={SCREENS.ServerScreen}
        component={ServerScreen}
        options={{title: 'Получить файл'}}
      />
      <Tab.Screen
        name={SCREENS.ClientScreen}
        component={ClientScreen}
        options={{title: 'Отправить файл'}}
      />
    </Tab.Navigator>
  );
};
export default MainScreen;
