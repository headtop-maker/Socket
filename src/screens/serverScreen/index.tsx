import React from 'react';
import {View, NativeModules, FlatList, StyleSheet, Text} from 'react-native';
import {useSelector} from 'react-redux';
import CustomButton from '../../components/Buttons/CustomButton';

import withModal from '../../HOC/withModal';
import {getFiles} from '../../store/filesStore/selector';
import {getConnectionConnected} from '../../store/settings/selector';

const {NativeMethods} = NativeModules;

const Item = ({title}) => (
  <View style={styles.item}>
    <Text style={styles.title}>{title}</Text>
  </View>
);

const ServerScreen = () => {
  const isConnect = useSelector(getConnectionConnected);
  const isFiles = useSelector(getFiles);

  const renderItem = ({item}) => <Item title={item} />;

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
      <View
        style={{
          // borderWidth: 0.3,
          marginTop: 10,
          alignItems: 'flex-end',
          backgroundColor: '#FFFFFF',
        }}>
        <Text>Всего: {isFiles.length}</Text>
      </View>
      <FlatList
        style={{marginTop: 10}}
        data={isFiles}
        renderItem={renderItem}
        keyExtractor={index => 'key' + index}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    backgroundColor: '#FFFFFF',
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  title: {
    fontSize: 15,
  },
});
export default withModal(ServerScreen);
