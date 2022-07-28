import React, {useEffect} from 'react';
import {Dimensions} from 'react-native';
import ModalScreen from '../components/Modal';
const withModal = Component => {
  const params = {
    screenHeigth: Dimensions.get('window').width,
    screenWidth: Dimensions.get('window').height,
  };

  return () => (
    <>
      <ModalScreen />
      <Component value={params} />
    </>
  );
};

export default withModal;
