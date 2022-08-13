import {NavigationContainer} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import MainScreen from '../../screens/mainScreen';
import SCREENS from '../../constants/screen';
import {View, Text} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import {useDispatch, useSelector} from 'react-redux';
import {
  clearCurrentFileParamsState,
  setConnectionState,
  setModalState,
} from '../../store/settings/action';
import {getConnectionType, getIpAddress} from '../../store/settings/selector';
import NetInfoHelper from '../../helpers/NetInfoHelper';
import withModal from '../../HOC/withModal';
import useEventEmitter from '../../hooks/useEventEmitter';
import {EventsMessages} from './eventsMessages';
import {EventsNames} from './eventsNames';

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

  const statusActions = [
    {
      eventMessageName: EventsMessages.loading,
      eventFunction: data => {
        dispatch(
          setModalState({
            message: 'Загружаю',
            showModal: true,
            showIndicator: true,
          }),
        );
        console.log('thisData', data);
      },
    },
    {
      eventMessageName: EventsMessages.receive,
      eventFunction: data => {
        dispatch(
          setModalState({
            message: 'Файл загружен ',
            showModal: true,
            showIndicator: false,
          }),
        );
        console.log('thisData', data);
      },
    },
    {
      eventMessageName: EventsMessages.failure,
      eventFunction: () =>
        dispatch(
          setModalState({
            message: 'Ошибка сервера',
            showModal: true,
            showIndicator: false,
          }),
        ),
    },
  ];

  const clientActions = [
    {
      eventMessageName: EventsMessages.sending,
      eventFunction: () =>
        dispatch(
          setModalState({
            message: 'Отправляю',
            showModal: true,
            showIndicator: true,
          }),
        ),
    },
    {
      eventMessageName: EventsMessages.sent,
      eventFunction: data => {
        dispatch(
          setModalState({
            message: 'Файл отправлен ',
            showModal: true,
            showIndicator: false,
          }),
        );
        dispatch(clearCurrentFileParamsState());
        console.log('thisData', data);
      },
    },
    {
      eventMessageName: EventsMessages.failure,
      eventFunction: () =>
        dispatch(
          setModalState({
            message: 'Ошибка клиента',
            showModal: true,
            showIndicator: false,
          }),
        ),
    },
  ];

  useEventEmitter(EventsNames.status, statusActions);
  useEventEmitter(EventsNames.client, clientActions);

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
