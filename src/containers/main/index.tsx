import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import MainScreen from '../../screens/mainScreen';
import SCREENS from '../../constants/screen';

const Stack = createNativeStackNavigator();

export default function Main() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name={SCREENS.MainScreen}
          component={MainScreen}
          options={{title: 'Главный экран'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
