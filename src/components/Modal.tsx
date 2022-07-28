import React, {useState} from 'react';
import {Alert, Modal, StyleSheet, Text, Pressable, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import useDimensions from '../hooks/useDimensions';
import {setModalState} from '../store/settings/action';
import {getModalSate} from '../store/settings/selector';

const ModalScreen = () => {
  const modalState = useSelector(getModalSate);
  const dispatch = useDispatch();
  const [screenWidth]: any = useDimensions();

  console.log('modalState', modalState);
  console.log('screenWidth', typeof screenWidth);

  return (
    <View
      style={[
        styles.centeredView,
        {marginTop: screenWidth ? screenWidth / 2 : 1},
      ]}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalState.showModal}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>{modalState.message}</Text>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() =>
                dispatch(setModalState({message: '', showModal: false}))
              }>
              <Text style={styles.textStyle}>Hide Modal</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    // margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default ModalScreen;
