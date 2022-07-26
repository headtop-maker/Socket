import React, {useEffect, useState} from 'react';
import {Dimensions} from 'react-native';

interface useDimensionsProps {}

const useDimensions = () => {
  const [screenWidth, setScreenWidth] = useState(0);
  const [screenHeigth, setScreenHeigth] = useState(0);
  const [isLandScape, setIsLandScape] = useState(false);

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({window}) => {
      setScreenWidth(window.width);
      setScreenHeigth(window.height);
      setIsLandScape(window.width > window.height ? true : false);
    });
    return () => subscription?.remove();
  });

  return [screenWidth, screenHeigth, isLandScape];
};

export default useDimensions;
////     ({window, screen}) => {
