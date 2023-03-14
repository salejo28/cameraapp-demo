import React, {useCallback, useMemo, useRef, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {
  Camera as CameraRNV,
  CameraDevice,
  CameraDeviceFormat,
  CameraRuntimeError,
  PhotoFile,
  sortFormats,
  useCameraDevices,
  VideoFile,
} from 'react-native-vision-camera';
import Reanimated, {useSharedValue} from 'react-native-reanimated';
import {styles} from './styles';
import {PinchGestureHandler} from 'react-native-gesture-handler';
import IonIcon from 'react-native-vector-icons/Ionicons';
import {IconButton} from '../Button/IconButton';
import {useNavigation} from '@react-navigation/native';
import {CaptureButton} from '../../view/CaptureButton/CaptureButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {formatDateWithHour} from '../../utils/date';
import {MediaCaptured} from '../../view/MediaCaptured/MediaCaptured';
import {MediaTaken} from '../../types';

const ReanimatedCamera = Reanimated.createAnimatedComponent(CameraRNV);
Reanimated.addWhitelistedNativeProps({
  zoom: true,
});

export const Camera = ({isActive}: {isActive: boolean}) => {
  const devices = useCameraDevices();
  const device = devices.back as CameraDevice;
  const navigation = useNavigation();
  const camera = useRef<CameraRNV>(null);
  const isPressingButton = useSharedValue(false);
  const [isCameraInitialized, setIsCameraInitialized] = useState(false);
  const [isMediaTaken, setIsMediaTaken] = useState(false);
  const [lastMediasTaken, setLastMediasTaken] = useState<MediaTaken[]>([]);

  const setIsPressingButton = useCallback(
    (_isPressingButton: boolean) => {
      isPressingButton.value = _isPressingButton;
    },
    [isPressingButton],
  );
  // Camera callbacks
  const onError = useCallback((error: CameraRuntimeError) => {
    console.error(error);
  }, []);
  const onInitialized = useCallback(() => {
    setIsCameraInitialized(true);
  }, []);
  const onMediaCaptured = useCallback(
    async (media: PhotoFile | VideoFile, type: 'photo' | 'video') => {
      const date = formatDateWithHour(new Date());
      const file = {
        file: `file://${media.path}`,
        createdAt: date,
        type,
        id: Date.now(),
      };
      setLastMediasTaken(prev => [file].concat(prev));
      await AsyncStorage.setItem('' + Date.now(), JSON.stringify(file));
      setIsMediaTaken(true);
      console.log(`Media captured! ${JSON.stringify(media)} ${type}`);
    },
    [],
  );

  const getMaxFps = (format: CameraDeviceFormat): number => {
    return format.frameRateRanges.reduce((prev, curr) => {
      if (curr.minFrameRate < prev) {
        return curr.minFrameRate;
      } else {
        return prev;
      }
    }, 0);
  };

  const formats = useMemo<CameraDeviceFormat[]>(() => {
    if (device?.formats == null) {
      return [];
    }
    return device.formats.sort(sortFormats);
  }, [device?.formats]);

  const format = useMemo(() => {
    return formats.reduce((prev, curr) => {
      if (prev == null) {
        return curr;
      }
      if (getMaxFps(curr) > getMaxFps(prev)) {
        return curr;
      } else {
        return prev;
      }
    }, undefined as unknown as CameraDeviceFormat);
  }, [formats]);

  if (!device) {
    return (
      <View>
        <Text>Loading</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <IconButton style={styles.back_btn} onPress={() => navigation.goBack()}>
        <IonIcon name={'chevron-back-outline'} color={'#fff'} size={35} />
      </IconButton>
      <PinchGestureHandler enabled={isActive}>
        <Reanimated.View style={StyleSheet.absoluteFill}>
          <ReanimatedCamera
            style={[StyleSheet.absoluteFillObject, styles.camera]}
            device={device}
            isActive={isActive}
            photo={true}
            video={true}
            ref={camera}
            onInitialized={onInitialized}
            onError={onError}
            orientation="portrait"
            frameProcessorFps={1}
            format={format}
            fps={30}
            audio={true}
          />
        </Reanimated.View>
      </PinchGestureHandler>

      <CaptureButton
        style={styles.captureButton}
        camera={camera}
        onMediaCaptured={onMediaCaptured}
        flash={'off'}
        enabled={isCameraInitialized && isActive}
        setIsPressingButton={setIsPressingButton}
      />

      <MediaCaptured
        isTaken={isMediaTaken}
        setIsTaken={value => setIsMediaTaken(value)}
        lastMediasTaken={lastMediasTaken}
      />
    </View>
  );
};
