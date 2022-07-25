import React, {FC} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import SvgFile from '../assets/icons/svgFile.svg';

interface IFileIcon {
  fileName: string;
  fileType: string;
  fileByteSize: number;
}

const FileIcon: FC<IFileIcon> = ({fileName, fileType, fileByteSize}) => {
  return (
    <View style={styles.container}>
      <View style={styles.svgContainer}>
        <View style={{position: 'relative'}}>
          <SvgFile width={100} height={100} />
        </View>
        <Text style={{position: 'absolute', fontSize: 20}}>{fileType}</Text>
      </View>
      <Text>{fileName}</Text>
      <Text>{fileByteSize} byte</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {alignItems: 'center'},
  svgContainer: {
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default FileIcon;
