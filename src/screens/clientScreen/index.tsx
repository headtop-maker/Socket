import React, {useState} from 'react';
import {View, Text, NativeModules, TextInput, StyleSheet} from 'react-native';
import {useSelector} from 'react-redux';
import CustomButton from '../../components/Buttons/CustomButton';
import {getConnectionConnected} from '../../store/settings/selector';

const {NativeMethods} = NativeModules;

const ClientScreen = () => {
  const isConnect = useSelector(getConnectionConnected);
  const [ipAddress, setIpAddress] = useState('192.168.1.150');
  return (
    <View>
      <Text>ClientScreen</Text>
      <TextInput
        value={ipAddress}
        onChangeText={setIpAddress}
        keyboardType="number-pad"
        style={styles.textInput}
      />
      <CustomButton
        onPress={() => NativeMethods.openFile()}
        title="Отправить файл"
        disabled={!isConnect && !!ipAddress}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  textInput: {
    backgroundColor: 'fff',
    width: '100%',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
  },
});
export default ClientScreen;
