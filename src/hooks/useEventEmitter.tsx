import React, {useEffect, useState} from 'react';
import {DeviceEventEmitter} from 'react-native';
import {EventsMessages} from '../containers/main/eventsMessages';

const useEventEmitter = (
  eventName: string,
  actions: {eventMessageName: EventsMessages; eventFunction: () => void}[],
) => {
  const [eventData, setEventData] = useState('');

  useEffect(() => {
    DeviceEventEmitter.addListener(eventName, data => {
      setEventData(data);
      if (data.message !== undefined) {
        const currentFunction = actions.find(
          item => item.eventMessageName === data.message,
        );
        if (currentFunction) {
          currentFunction.eventFunction();
        }
      }
    });
  }, []);

  return eventData;
};

export default useEventEmitter;
