import {Dimensions, StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    height: '100%',
    backgroundColor: '#000',
    minHeight: Dimensions.get('window').height,
    maxHeight: Dimensions.get('screen').height,
    position: 'absolute',
    width: Dimensions.get('screen').width,
    flex: 1,
    bottom: 0,
    top: 0,
  },
  camera: {
    position: 'absolute',
    minHeight: Dimensions.get('window').height,
    maxHeight: Dimensions.get('screen').height,
    bottom: 0,
  },
  back_btn: {
    position: 'absolute',
    top: 10,
    left: 5,
    zIndex: 1,
  },
  captureButton: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: 50,
  },
});
