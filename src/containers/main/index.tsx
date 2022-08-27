import {NavigationContainer} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import MainScreen from '../../screens/mainScreen';
import SCREENS from '../../constants/screen';
import {View, Text} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {clearCurrentFileParamsState} from '../../store/settings/action';
import {getConnectionType, getIpAddress} from '../../store/settings/selector';
import withModal from '../../HOC/withModal';

import {getFileDirectory} from '../../store/filesStore/action';

const Stack = createNativeStackNavigator();

const Main = () => {
  const dispatch = useDispatch();
  const connectionType = useSelector(getConnectionType);
  const ipAddress = useSelector(getIpAddress);

  useEffect(() => {
    dispatch(clearCurrentFileParamsState());
    dispatch(getFileDirectory());
  }, []);

  const HRight = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
        }}>
        <Text> {ipAddress}</Text>
        <Text>{connectionType}</Text>
      </View>
    );
  };

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name={SCREENS.MainScreen}
          component={MainScreen}
          options={{
            title: 'Главный экран',
            headerRight: () => {
              return <HRight />;
            },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
export default withModal(Main);
