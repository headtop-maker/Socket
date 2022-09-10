import React, {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import NetInfo from '@react-native-community/netinfo';
import {setConnectionState} from '../store/settings/action';

const NetInfoHelper = Component => {
  const dispatch = useDispatch();
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      dispatch(
        setConnectionState({
          ipAddress: state.details.ipAddress,
          isConnected: state.isConnected,
          isInternetReachable: state.isInternetReachable,
          isWifiEnabled: state.isWifiEnabled,
          type: state.type,
        }),
      );
    });
    return () => {
      unsubscribe;
    };
  }, []);

  return <Component />;
};
export default NetInfoHelper;
