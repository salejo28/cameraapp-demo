import React, {useEffect} from 'react';
import {TouchableOpacity} from 'react-native';
import Reanimated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {MediaTaken} from '../../types';
import {SCREEN_HEIGHT, SCREEN_WIDTH} from '../CaptureButton/CaptureButton';
import {styles} from './styles';

const TouchableOpacityReanimated =
  Reanimated.createAnimatedComponent(TouchableOpacity);

interface IProps {
  isTaken: boolean;
  lastMediasTaken: MediaTaken[];
  setIsTaken: (isTaken: boolean) => unknown;
}

const DEFAULT_IMAGE =
  'https://media.istockphoto.com/id/931643150/vector/picture-icon.jpg?s=170x170&k=20&c=KUFOtetx2_0ag6fpFRyOqCFwKP3bO0Xa28LovKRrGvc=';

export const MediaCaptured = ({
  isTaken,
  setIsTaken,
  lastMediasTaken,
}: IProps) => {
  const isTakenMedia = useSharedValue(false);

  const style = useAnimatedStyle(() => {
    return {
      width: withTiming(isTakenMedia.value ? SCREEN_WIDTH - 20 : 60, {
        duration: 500,
      }),
      height: withTiming(isTakenMedia.value ? SCREEN_HEIGHT - 70 : 60, {
        duration: 500,
      }),
      borderRadius: withTiming(isTakenMedia.value ? 15 : 50, {
        duration: 500,
      }),
    };
  }, []);

  const styleContainer = useAnimatedStyle(() => {
    return {
      borderWidth: withSpring(isTakenMedia.value ? 5 : 0, {
        stiffness: 100,
        damping: 1000,
      }),
      bottom: withSpring(isTakenMedia.value ? 15 : 58, {
        stiffness: 100,
        damping: 1000,
      }),
      right: withSpring(isTakenMedia.value ? 10 : 25, {
        stiffness: 100,
        damping: 1000,
      }),
    };
  }, [isTakenMedia]);

  useEffect(() => {
    isTakenMedia.value = isTaken;
  }, [isTaken, isTakenMedia]);

  useEffect(() => {
    if (isTaken) {
      setTimeout(() => setIsTaken(!isTaken), 2000);
    }
  }, [isTaken, setIsTaken]);

  return (
    <Reanimated.View style={[styles.container, style, styleContainer]}>
      <TouchableOpacityReanimated activeOpacity={0.8} style={style}>
        <Reanimated.View style={style}>
          <Reanimated.Image
            source={{
              uri:
                lastMediasTaken.length > 0
                  ? lastMediasTaken[0].file
                  : DEFAULT_IMAGE,
            }}
            style={style}
          />
        </Reanimated.View>
      </TouchableOpacityReanimated>
    </Reanimated.View>
  );
};
