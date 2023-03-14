import React from 'react';
import {StyleProp, TouchableOpacity, ViewStyle} from 'react-native';

interface IProps {
  children?: JSX.Element;
  style?: StyleProp<ViewStyle>;
  onPress?: () => unknown;
}

export const IconButton = ({children, style, onPress}: IProps) => {
  return (
    <TouchableOpacity style={style} activeOpacity={0.7} onPress={onPress}>
      {children}
    </TouchableOpacity>
  );
};
