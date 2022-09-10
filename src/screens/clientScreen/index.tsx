import React, {useEffect, useState} from 'react';
import {
  View,
  NativeModules,
  TextInput,
  Text,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import CustomButton from '../../components/Buttons/CustomButton';
import FileIcon from '../../components/FileIcon';
import {FileParamsType} from '../../constants/types';
import useDimensions from '../../hooks/useDimensions';
import {setCurrentFileParamsState} from '../../store/settings/action';
import {
  getConnectionConnected,
  getCurrentFileParams,
  getIpAddress,
} from '../../store/settings/selector';

const {NativeMethods} = NativeModules;

const ClientScreen = () => {
  const isConnect = useSelector(getConnectionConnected);
  const ipAddressNetInfo = useSelector(getIpAddress);
  const [ipAddress, setIpAddress] = useState(ipAddressNetInfo);
  const currentFile = useSelector(getCurrentFileParams);
  const dispatch = useDispatch();

  const openFile = async () => {
    try {
      const fileParams: FileParamsType = await NativeMethods.openFile();
      dispatch(setCurrentFileParamsState(fileParams));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        zIndex: 1,
        flexDirection: 'column',
        justifyContent: 'space-around',
      }}>
      <View>
        <TextInput
          value={ipAddress}
          onChangeText={setIpAddress}
          keyboardType="number-pad"
          style={styles.textInput}
        />
      </View>
      <View
        style={{
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'flex-end',
        }}>
        {currentFile !== undefined ? (
          <FileIcon currentFile={currentFile} ipAddress={ipAddress} />
        ) : null}

        <CustomButton
          onPress={openFile}
          title="Выбрать файл"
          disabled={!isConnect && !!ipAddress}
        />
      </View>
      <View style={styles.textDrop}>
        <Text>Для отправки перемести файл вврех</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  textInput: {
    backgroundColor: 'white',
    width: '100%',
    borderRadius: 10,
    padding: 10,
  },
  textDrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default ClientScreen;
