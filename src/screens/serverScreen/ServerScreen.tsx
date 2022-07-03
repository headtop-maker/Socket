import React from 'react';
import {View, Text, NativeModules} from 'react-native';
import CustomButton from '../../components/Buttons/CustomButton';
import SettingsButton from '../../components/settingsButton';

const {NativeMethods} = NativeModules;

export default function ServerScreen() {
  return (
    <View>
      <Text>ServerScreen</Text>
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
