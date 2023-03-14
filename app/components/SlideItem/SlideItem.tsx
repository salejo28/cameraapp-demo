import React from 'react';
import {Animated, Easing, View} from 'react-native';
import {MediaTaken} from '../../types';
import {styles} from './styles';

export const SlideItem = ({picture}: {picture: MediaTaken}) => {
  const translateYImage = new Animated.Value(20);

  Animated.timing(translateYImage, {
    toValue: 0,
    duration: 1000,
    useNativeDriver: true,
    easing: Easing.bounce,
  }).start();

  return (
    <View style={styles.content}>
      <Animated.Image
        source={{uri: picture.file}}
        resizeMode={'contain'}
        style={[
          styles.image,
          {
            transform: [
              {
                translateX: translateYImage,
              },
            ],
          },
        ]}
      />
    </View>
  );
};
