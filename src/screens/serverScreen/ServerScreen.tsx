import React, {useEffect, useState} from 'react';
import {View, Text, NativeModules, DeviceEventEmitter} from 'react-native';
import CustomButton from '../../components/Buttons/CustomButton';
import SettingsButton from '../../components/settingsButton';

const {NativeMethods} = NativeModules;

export default function ServerScreen() {
  const [count, setCount] = useState();

  useEffect(() => {
    DeviceEventEmitter.addListener('count', data => {
      setCount(data.message);
    });
  }, []);

  return (
    <View>
      <Text>ServerScreen {`${count}`}</Text>
      <CustomButton
        onPress={() => NativeMethods.startFileTypeServers()}
        title="Включить сервер"
      />
      <CustomButton
        onPress={() => NativeMethods.startMinWebServer()}
        title="Включить веб сервер"
      />
    </View>
  );
}
