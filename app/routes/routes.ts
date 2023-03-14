import {CameraScreen} from '../screens/CameraScreen/CameraScreen';
import {HomeScreen} from '../screens/HomeScreen/HomeScreen';
import {PictureSliderScreen} from '../screens/PictureSliderScreen/PictureSliderScreen';
import {PicturesScreen} from '../screens/PicturesScreen/PictureScreen';

export const screens = [
  {
    name: 'HomeScreen',
    component: HomeScreen,
  },
  {
    name: 'CameraScreen',
    component: CameraScreen,
  },
  {
    name: 'PicturesScreen',
    component: PicturesScreen,
  },
  {
    name: 'PictureSliderScreen',
    component: PictureSliderScreen,
  },
];
