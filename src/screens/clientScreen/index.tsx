import React, {useState} from 'react';
import {View, Text, NativeModules, TextInput, StyleSheet} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import CustomButton from '../../components/Buttons/CustomButton';
import {
  clearCurrentFileParamsState,
  setCurrentFileParamsState,
} from '../../store/settings/action';
import {
  getConnectionConnected,
  getCurrentFileParams,
} from '../../store/settings/selector';

const {NativeMethods} = NativeModules;

type FileParamsType = {
  fileName: string;
  fileType: string;
  fileByteSize: number;
  fileUri: string;
};

const ClientScreen = () => {
  const isConnect = useSelector(getConnectionConnected);
  const [ipAddress, setIpAddress] = useState('192.168.1.150');
  const currentFile = useSelector(getCurrentFileParams);
  const {fileName, fileType, fileByteSize, fileUri} = currentFile;
  const dispatch = useDispatch();

  const openFile = async () => {
    try {
      const fileParams: FileParamsType = await NativeMethods.openFile();
      dispatch(setCurrentFileParamsState(fileParams));
    } catch (e) {
      console.error(e);
    }
  };

  const sendFile = () => {
    NativeMethods.sendFile(
      ipAddress,
      fileName,
      fileType,
      fileByteSize,
      fileUri,
    );
  };

  console.log('currentFile', currentFile);

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
        onPress={openFile}
        title="Выбрать файл"
        disabled={!isConnect && !!ipAddress}
      />
      <CustomButton
        onPress={sendFile}
        title="Отправить файл"
        disabled={!currentFile}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  textInput: {
    backgroundColor: 'white',
    width: '100%',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
  },
});
export default ClientScreen;
