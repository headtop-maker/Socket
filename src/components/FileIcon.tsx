import React, {FC} from 'react';
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
  withSpring,
  withRepeat,
  useAnimatedGestureHandler,
} from 'react-native-reanimated';
import {useDispatch} from 'react-redux';
import SvgFile from '../assets/icons/svgFile.svg';
import {clearCurrentFileParamsState} from '../store/settings/action';

interface IFileIcon {
  fileName: string;
  fileType: string;
  fileByteSize: number;
}
type ContextType = {
  translateX: number;
  translateY: number;
};

const FileIcon: FC<IFileIcon> = ({fileName, fileType, fileByteSize}) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const dispatch = useDispatch();

  const panGestureEvent = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    ContextType
  >({
    onStart: (event, context) => {
      context.translateX = translateX.value;
      context.translateY = translateY.value;
    },
    onActive: (event, context) => {
      translateX.value = event.translationX + context.translateX;
      translateY.value = event.translationY + context.translateY;
    },
    onEnd: event => {
      console.log('translationY', event.translationY, event.translationX);
      if (event.translationY < -100) {
        translateX.value = withTiming(0);
        translateY.value = withTiming(-238);
      } else {
        translateX.value = withTiming(0);
        translateY.value = withTiming(0);
      }
    },
  });

  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: translateX.value,
        },
        {
          translateY: translateY.value,
        },
      ],
    };
  });

  return (
    <GestureHandlerRootView>
      <PanGestureHandler onGestureEvent={panGestureEvent}>
        <Animated.View style={[styles.container, rStyle]}>
          <View style={styles.svgContainer}>
            <View style={{position: 'relative'}}>
              <SvgFile width={100} height={100} />
            </View>
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
