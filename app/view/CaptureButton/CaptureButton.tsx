import React, {useCallback, useMemo, useRef} from 'react';
import {Dimensions, Platform, View, ViewProps} from 'react-native';
import {
  Camera,
  PhotoFile,
  TakePhotoOptions,
  TakeSnapshotOptions,
  VideoFile,
} from 'react-native-vision-camera';
import {
  PanGestureHandler,
  State,
  TapGestureHandler,
  TapGestureHandlerStateChangeEvent,
} from 'react-native-gesture-handler';
import Reanimated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import StaticSafeAreaInsets from 'react-native-static-safe-area-insets';
import {styles} from './styles';

export const SCREEN_WIDTH = Dimensions.get('window').width;
export const SCREEN_HEIGHT = Platform.select<number>({
  android:
    Dimensions.get('screen').height - StaticSafeAreaInsets.safeAreaInsetsBottom,
  ios: Dimensions.get('window').height,
}) as number;

const PAN_GESTURE_HANDLER_FAIL_X = [-SCREEN_WIDTH, SCREEN_WIDTH];
const PAN_GESTURE_HANDLER_ACTIVE_Y = [-2, 2];
const START_RECORDING_DELAY = 200;

interface Props extends ViewProps {
  camera: React.RefObject<Camera>;
  onMediaCaptured: (
    media: PhotoFile | VideoFile,
    type: 'photo' | 'video',
  ) => void;

  flash: 'off' | 'on';
  enabled: boolean;
  setIsPressingButton: (isPressingButton: boolean) => void;
}

const Capture: React.FC<Props> = ({
  camera,
  onMediaCaptured,
  flash,
  enabled,
  setIsPressingButton,
  style,
  ...props
}: Props) => {
  const tapHandler = useRef<TapGestureHandler>();
  const panHandler = useRef<PanGestureHandler>();
  const pressDownDate = useRef<Date | undefined>(undefined);
  const isRecording = useRef(false);
  const recordingProgress = useSharedValue(0);
  const takePhotoOptions = useMemo<TakePhotoOptions & TakeSnapshotOptions>(
    () => ({
      photoCodec: 'jpeg',
      qualityPrioritization: 'speed',
      flash: flash,
      quality: 90,
      skipMetadata: true,
      enableAutoStabilization: true,
    }),
    [flash],
  );
  const isPressingButton = useSharedValue(false);

  /* Take photo function */
  const takePhoto = useCallback(async () => {
    try {
      if (camera.current == null) {
        throw new Error('Camera ref is null!');
      }
      let photo;
      if (Platform.OS === 'ios') {
        photo = await camera.current.takePhoto(takePhotoOptions);
      } else {
        photo = await camera.current.takeSnapshot(takePhotoOptions);
      }
      onMediaCaptured(photo, 'photo');
    } catch (e) {
      console.error('Failed to take photo!', e);
    }
  }, [camera, onMediaCaptured, takePhotoOptions]);

  /* What to do when stop recording */
  const onStoppedRecording = useCallback(() => {
    isRecording.current = false;
    cancelAnimation(recordingProgress);
  }, [recordingProgress]);

  /* Stop recording function */
  const stopRecording = useCallback(async () => {
    try {
      if (camera.current == null) {
        throw new Error('Camera ref is null!');
      }
      await camera.current.stopRecording();
    } catch (e) {
      console.error('failed to stop recording!', e);
    }
  }, [camera]);

  /* Start recording function */
  const startRecording = useCallback(() => {
    try {
      if (camera.current == null) {
        throw new Error('Camera ref is null!');
      }

      camera.current.startRecording({
        flash: flash,
        onRecordingError: error => {
          console.error('Recording failed!', error);
          onStoppedRecording();
        },
        onRecordingFinished: video => {
          onMediaCaptured(video, 'video');
          onStoppedRecording();
        },
      });
      // TODO: wait until startRecording returns to actually find out if the recording has successfully started
      isRecording.current = true;
    } catch (e) {
      console.error('failed to start recording!', e, 'camera');
    }
  }, [camera, flash, onMediaCaptured, onStoppedRecording]);

  const onHandlerStateChanged = useCallback(
    async ({nativeEvent: event}: TapGestureHandlerStateChangeEvent) => {
      switch (event.state) {
        case State.BEGAN: {
          // enter "recording mode"
          recordingProgress.value = 0;
          isPressingButton.value = true;
          const now = new Date();
          pressDownDate.current = now;
          setTimeout(() => {
            if (pressDownDate.current === now) {
              // user is still pressing down after 200ms, so his intention is to create a video
              startRecording();
            }
          }, START_RECORDING_DELAY);
          setIsPressingButton(true);
          return;
        }
        case State.END:
        case State.FAILED:
        case State.CANCELLED: {
          // exit "recording mode"
          try {
            if (pressDownDate.current == null) {
              throw new Error('PressDownDate ref .current was null!');
            }
            const now = new Date();
            const diff = now.getTime() - pressDownDate.current.getTime();
            pressDownDate.current = undefined;
            if (diff < START_RECORDING_DELAY) {
              // user has released the button within 200ms, so his intention is to take a single picture.
              await takePhoto();
            } else {
              // user has held the button for more than 200ms, so he has been recording this entire time.
              await stopRecording();
            }
          } finally {
            setTimeout(() => {
              isPressingButton.value = false;
              setIsPressingButton(false);
            }, 500);
          }
          return;
        }
        default:
          break;
      }
    },
    [
      isPressingButton,
      recordingProgress,
      setIsPressingButton,
      startRecording,
      stopRecording,
      takePhoto,
    ],
  );

  /* Styles */
  const shadowStyle = useAnimatedStyle(
    () => ({
      transform: [
        {
          scale: withSpring(isPressingButton.value ? 1 : 0, {
            mass: 1,
            damping: 35,
            stiffness: 300,
          }),
        },
      ],
    }),
    [isPressingButton],
  );

  const buttonStyle = useAnimatedStyle(() => {
    let scale: number;
    if (enabled) {
      if (isPressingButton.value) {
        scale = withRepeat(
          withSpring(1, {
            stiffness: 100,
            damping: 1000,
          }),
          -1,
          true,
        );
      } else {
        scale = withSpring(0.9, {
          stiffness: 500,
          damping: 300,
        });
      }
    } else {
      scale = withSpring(0.6, {
        stiffness: 500,
        damping: 300,
      });
    }

    return {
      opacity: withTiming(enabled ? 1 : 0.3, {
        duration: 100,
        easing: Easing.linear,
      }),
      transform: [
        {
          scale: scale,
        },
      ],
    };
  }, [enabled, isPressingButton]);

  return (
    <TapGestureHandler
      enabled={enabled}
      shouldCancelWhenOutside={false}
      onHandlerStateChange={onHandlerStateChanged}
      maxDurationMs={99999999}
      ref={tapHandler}
      simultaneousHandlers={panHandler}>
      <Reanimated.View {...props} style={[style, buttonStyle]}>
        <PanGestureHandler
          enabled={enabled}
          ref={panHandler}
          failOffsetX={PAN_GESTURE_HANDLER_FAIL_X}
          activeOffsetY={PAN_GESTURE_HANDLER_ACTIVE_Y}
          simultaneousHandlers={tapHandler}>
          <Reanimated.View style={styles.flex}>
            <Reanimated.View style={[styles.shadow, shadowStyle]} />
            <View style={styles.button} />
          </Reanimated.View>
        </PanGestureHandler>
      </Reanimated.View>
    </TapGestureHandler>
  );
};

export const CaptureButton = React.memo(Capture);
