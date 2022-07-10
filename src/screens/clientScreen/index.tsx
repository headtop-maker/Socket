import React from 'react';
import {View, Text, NativeModules} from 'react-native';
import {useSelector} from 'react-redux';
import CustomButton from '../../components/Buttons/CustomButton';
import {getConnectionConnected} from '../../store/settings/selector';

const {NativeMethods} = NativeModules;

export default function ClientScreen() {
  const isConnect = useSelector(getConnectionConnected);
  return (
    <View>
      <Text>ClientScreen</Text>
      <CustomButton
        onPress={() => NativeMethods.openFile()}
        title="Отправить файл"
        disabled={!isConnect}
      />
    </View>
  );
}
