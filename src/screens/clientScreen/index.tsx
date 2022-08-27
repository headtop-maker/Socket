import React, {useEffect, useState} from 'react';
import {View, NativeModules, TextInput, Text, StyleSheet} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import CustomButton from '../../components/Buttons/CustomButton';
import FileIcon from '../../components/FileIcon';

import useDimensions from '../../hooks/useDimensions';

import {setCurrentFileParamsState} from '../../store/settings/action';
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
  const [isLandScape] = useDimensions();
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

  const sendFile = () => {
    if (currentFile && currentFile.fileName !== undefined) {
      NativeMethods.sendFile(
        ipAddress,
        currentFile.fileName,
        currentFile.fileType,
        currentFile.fileByteSize,
        currentFile.fileUri,
      );
    }
  };

  console.log('currentFile', currentFile);
  console.log('isLandScape', isLandScape);

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
          <FileIcon
            fileByteSize={currentFile.fileByteSize}
            fileName={currentFile.fileName}
            fileType={currentFile.fileType}
          />
        ) : null}

        <CustomButton
          onPress={openFile}
          title="Выбрать файл"
          disabled={!isConnect && !!ipAddress}
        />
        <CustomButton
          onPress={sendFile}
          title="Отправить файл"
          disabled={currentFile === undefined}
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
