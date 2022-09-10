import React, {FC, useEffect, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {
  GestureHandlerRootView,
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  useAnimatedGestureHandler,
  runOnJS,
  useDerivedValue,
} from 'react-native-reanimated';
import {useDispatch} from 'react-redux';
import SvgFile from '../assets/icons/svgFile.svg';
import {FileParamsType} from '../constants/types';
import useDimensions from '../hooks/useDimensions';
import {sendFile} from '../store/filesStore/action';

interface IFileIcon {
  currentFile: FileParamsType;
  ipAddress: string;
}
type ContextType = {
  translateX: number;
  translateY: number;
};

const FileIcon: FC<IFileIcon> = ({currentFile, ipAddress}) => {
  const translateY = useSharedValue(0);
  const dispatch = useDispatch();
  const {fileName, fileType, fileByteSize} = currentFile;
  const [screenHeigth] = useDimensions();
  console.log(screenHeigth);

  const panGestureEvent = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    ContextType
  >({
    onStart: (event, context) => {
      context.translateY = translateY.value;
    },
    onActive: (event, context) => {
      translateY.value = event.translationY + context.translateY;
    },
    onEnd: event => {
      console.log('translationY', event.translationY, event.translationX);
      if (event.translationY < -Math.floor(screenHeigth / 6)) {
        translateY.value = withTiming(-Math.floor(screenHeigth / 1.5));
      } else {
        translateY.value = withTiming(0);
      }
    },
  });

  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: translateY.value,
        },
      ],
    };
  });
  // должна быть определена выше useDerivedValue иначе краш
  const handleSendFile = () => {
    dispatch(sendFile(ipAddress, currentFile));
  };

  useDerivedValue(() => {
    if (translateY.value === -Math.floor(screenHeigth / 1.5)) {
      runOnJS(handleSendFile)();
    }
  }, [translateY]);

  return (
    <GestureHandlerRootView style={{flex: 1, justifyContent: 'flex-end'}}>
      <PanGestureHandler onGestureEvent={panGestureEvent}>
        <Animated.View style={[styles.container, rStyle]}>
          <View style={styles.svgContainer}>
            <SvgFile width={100} height={100} />

            <Text style={{position: 'absolute', fontSize: 20}}>{fileType}</Text>
          </View>
          <Text>{fileName}</Text>
          <Text>{fileByteSize} byte</Text>
        </Animated.View>
      </PanGestureHandler>
    </GestureHandlerRootView>
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
