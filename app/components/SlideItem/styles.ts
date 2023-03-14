import {StyleSheet} from 'react-native';
import {
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
} from '../../view/CaptureButton/CaptureButton';

export const styles = StyleSheet.create({
  content: {
    height: SCREEN_HEIGHT / 2,
    width: SCREEN_WIDTH,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  image: {
    height: SCREEN_HEIGHT / 2,
  },
});
