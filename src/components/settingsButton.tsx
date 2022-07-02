import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';

export default function SettingsButton() {
  return (
    <View>
      <TouchableOpacity style={styles.fab}>
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  fab: {
    // position: 'relative',
    // width: 56,
    // height: 56,
    // alignItems: 'center',
    // justifyContent: 'center',
    // right: 20,
    // bottom: 20,
    // backgroundColor: '#03A9F4',
    // borderRadius: 30,
    // elevation: 8,
  },
  fabIcon: {
    // fontSize: 40,
    // color: 'white',
  },
});
