import React, {useState} from 'react';
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  Pressable,
  View,
  ActivityIndicator,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {setModalState} from '../store/settings/action';
import {getModalSate} from '../store/settings/selector';

const ModalScreen = () => {
  const modalState = useSelector(getModalSate);
  const dispatch = useDispatch();

  return (
    <View style={[styles.centeredView]}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalState.showModal}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
        }}>
        <View style={styles.centeredView}>
          <View style={[styles.modalView]}>
            <Text style={styles.modalText}>{modalState.message}</Text>
            {modalState.showIndicator && <ActivityIndicator size="large" />}
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() =>
                dispatch(
                  setModalState({
                    message: '',
                    showModal: false,
                    showIndicator: false,
                  }),
                )
              }>
              <Text style={styles.textStyle}>Закрыть</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 5,
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
    borderRadius: 10,
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
