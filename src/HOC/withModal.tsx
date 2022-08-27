import React, {useEffect, FC} from 'react';
import {useDispatch} from 'react-redux';
import ModalScreen from '../components/Modal';
import NetInfo from '@react-native-community/netinfo';
import {setConnectionState} from '../store/settings/action';
import useEventEmitter from '../hooks/useEventEmitter';
import {EventsNames} from '../containers/main/eventsNames';
import useEventActions from '../hooks/useEventActions';

const withModal = (WrappedComponent: any) => {
  const HOC: FC = props => {
    const dispatch = useDispatch();
    const {statusActions, clientActions} = useEventActions();

    useEventEmitter(EventsNames.status, statusActions);
    useEventEmitter(EventsNames.client, clientActions);

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

    return (
      <>
        <WrappedComponent {...props} />
        <ModalScreen />
      </>
    );
  };

  return HOC;
};

export default withModal;
