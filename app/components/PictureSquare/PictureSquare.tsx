import React from 'react';
import {Image, TouchableOpacity} from 'react-native';
import {MediaTaken} from '../../types';
import {styles} from './styles';

interface IProps {
  media: MediaTaken;
  onPress: () => unknown;
}

export const PictureSquare = ({media, onPress}: IProps) => {
  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.8}
      onPress={onPress}>
      <Image source={{uri: media.file}} style={styles.container} />
    </TouchableOpacity>
  );
};
