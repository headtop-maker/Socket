import React, {useEffect} from 'react';
import {Dimensions, View} from 'react-native';
import ModalScreen from '../components/Modal';
const withModal = Component => {
  const params = {
    screenHeigth: Dimensions.get('window').width,
    screenWidth: Dimensions.get('window').height,
  };

  return () => (
    <>
      <Component value={params} />
      <ModalScreen />
    </>
  );
};

export default withModal;
