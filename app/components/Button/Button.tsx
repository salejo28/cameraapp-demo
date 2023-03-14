import React from 'react';
import {StyleProp, Text, TouchableOpacity, ViewStyle} from 'react-native';
import {styles} from './styles';

interface IProps {
  text: string;
  style?: StyleProp<ViewStyle>;
  icon?: JSX.Element | null;
  iconOrientation?: 'left' | 'right';
  onPress?: () => unknown;
}

export const Button = ({
  text,
  onPress,
  style,
  icon,
  iconOrientation = 'right',
}: IProps) => {
  const Icon = icon;
  const styleText = {
    marginLeft: Icon && iconOrientation === 'left' ? 7 : 0,
    marginRight: Icon && iconOrientation === 'right' ? 7 : 0,
  };
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={[styles.btn, style]}
      onPress={onPress}>
      {Icon && iconOrientation === 'left' && Icon}
      <Text style={[styles.btn_text, styleText]}>{text}</Text>
      {Icon && iconOrientation === 'right' && Icon}
    </TouchableOpacity>
  );
};
