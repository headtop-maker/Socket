import {NavigationContainer} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import MainScreen from '../../screens/mainScreen';
import SCREENS from '../../constants/screen';
import {View, Text, DeviceEventEmitter} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import {useDispatch, useSelector} from 'react-redux';
import {
  clearCurrentFileParamsState,
  setConnectionState,
  setModalState,
} from '../../store/settings/action';
import {getConnectionType, getIpAddress} from '../../store/settings/selector';
import NetInfoHelper from '../../helpers/NetInfoHelper';

const Stack = createNativeStackNavigator();

const Main = () => {
  const dispatch = useDispatch();
  const connectionType = useSelector(getConnectionType);
  const ipAddress = useSelector(getIpAddress);

  useEffect(() => {
    dispatch(clearCurrentFileParamsState());
  }, []);

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

  useEffect(() => {
    DeviceEventEmitter.addListener('status', data => {
      if (data.message === 'loading') {
        dispatch(setModalState({message: 'Загружаю', showModal: true}));
      }
      if (data.message === 'receive') {
        dispatch(setModalState({message: '', showModal: false}));
        dispatch(clearCurrentFileParamsState());
      }
      if (data.message === 'failure') {
        dispatch(setModalState({message: 'Ошибка', showModal: true}));
      }
    });
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
export default Main;
