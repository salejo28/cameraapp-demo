import {useIsFocused} from '@react-navigation/native';
import React from 'react';
import {Camera} from '../../components/';
import {useIsForeground} from '../../hooks/useIsForeground';

export const CameraScreen = () => {
  const isFocussed = useIsFocused();
  const isForeground = useIsForeground();
  const isActive = isFocussed && isForeground;

  return <Camera isActive={isActive} />;
};
