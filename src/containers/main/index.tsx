import {NavigationContainer} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import MainScreen from '../../screens/mainScreen';
import SCREENS from '../../constants/screen';
import {View, Text} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import {useDispatch, useSelector} from 'react-redux';
import {setConnectionState} from '../../store/settings/action';
import {getConnectionType, getIpAddress} from '../../store/settings/selector';

const Stack = createNativeStackNavigator();

export default function Main() {
  const dispatch = useDispatch();
  const connectionType = useSelector(getConnectionType);
  const ipAddress = useSelector(getIpAddress);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      dispatch(
        setConnectionState({
          ipAddress: state.details.ipAddress,
          isConnected: state.isConnected,
          isInternetReachable: state.isInternetReachable,
          isWifiEnabled: state.isWifiEnabled,
          type: state.type,
        }),
      );
    });
    return () => {
      unsubscribe;
    };
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
}
