import React, {useEffect, useState} from 'react';
import {View, Text, NativeModules, DeviceEventEmitter} from 'react-native';
import {useSelector} from 'react-redux';
import CustomButton from '../../components/Buttons/CustomButton';
import SettingsButton from '../../components/settingsButton';
import {getConnectionConnected} from '../../store/settings/selector';

const {NativeMethods} = NativeModules;

export default function ServerScreen() {
  const [count, setCount] = useState();

  const isConnect = useSelector(getConnectionConnected);

  useEffect(() => {
    DeviceEventEmitter.addListener('count', data => {
      setCount(data.message);
    });
  }, []);

  return (
    <View>
      <Text>
        ServerScreen {`${count}`} {`${isConnect}`}
      </Text>
      <CustomButton
        onPress={() => NativeMethods.startFileTypeServers()}
        title="Включить сервер"
        disabled={!isConnect}
      />
      <CustomButton
        onPress={() => NativeMethods.startMinWebServer()}
        title="Включить веб сервер"
        disabled={!isConnect}
      />
    </View>
  );
}
