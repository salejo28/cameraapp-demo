import {StyleSheet} from 'react-native';
import {
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
} from '../../view/CaptureButton/CaptureButton';

export const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    flex: 1,
  },
  header: {
    width: SCREEN_WIDTH,
    height: 70,
    padding: 10,
    alignItems: 'center',
    marginBottom: 10,
    flexDirection: 'row',
  },
  header_text: {
    color: 'tomato',
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginLeft: 10,
  },
  scroll_view_container: {
    flex: 1,
    flexDirection: 'row',
  },
});
