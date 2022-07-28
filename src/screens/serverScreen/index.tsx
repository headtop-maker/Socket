import React, {useEffect, useState} from 'react';
import {View, Text, NativeModules, DeviceEventEmitter} from 'react-native';
import {useSelector} from 'react-redux';
import CustomButton from '../../components/Buttons/CustomButton';

import withModal from '../../HOC/withModal';
import {getConnectionConnected} from '../../store/settings/selector';

const {NativeMethods} = NativeModules;

const ServerScreen = () => {
  const isConnect = useSelector(getConnectionConnected);
  return (
    <View>
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
};
export default withModal(ServerScreen);
