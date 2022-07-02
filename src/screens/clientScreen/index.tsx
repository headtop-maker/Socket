import React from 'react';
import {View, Text, NativeModules} from 'react-native';
import CustomButton from '../../components/Buttons/CustomButton';

const {NativeMethods} = NativeModules;

export default function ClientScreen() {
  return (
    <View>
      <Text>ClientScreen</Text>
      <CustomButton
        onPress={() => NativeMethods.openFile()}
        title="Отправить файл"
      />
    </View>
  );
}
