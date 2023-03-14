import {useNavigation} from '@react-navigation/native';
import React, {useCallback, useEffect, useState} from 'react';
import {View} from 'react-native';
import {Button} from '../../components';
import {Camera as CameraRNV} from 'react-native-vision-camera';
import {styles} from './styles';
import IonIcon from 'react-native-vector-icons/Ionicons';

export const HomeScreen = () => {
  const navigation = useNavigation();

  const [permission, setPermission] = useState<string | undefined>();

  const getPermissions = useCallback(async () => {
    let cameraPermission = await CameraRNV.getCameraPermissionStatus();
    let microphonePermission = await CameraRNV.getMicrophonePermissionStatus();
    if (cameraPermission !== 'authorized') {
      cameraPermission = await CameraRNV.requestCameraPermission();
    }

    if (microphonePermission !== 'authorized') {
      await CameraRNV.requestMicrophonePermission();
    }
    setPermission(cameraPermission);
  }, []);

  useEffect(() => {
    getPermissions();
  }, [getPermissions]);

  if (permission !== 'authorized') {
    console.log('Pedir permisos');
  }

  return (
    <View style={styles.container}>
      <Button
        text="Camara"
        onPress={() => navigation.navigate('CameraScreen' as never)}
        style={styles.btn}
        icon={<IonIcon name="camera" size={20} color={'#fff'} />}
      />
      <Button
        text="Archivos"
        onPress={() => navigation.navigate('PicturesScreen' as never)}
        style={styles.btn}
        icon={<IonIcon name="images" size={20} color={'#fff'} />}
      />
    </View>
  );
};
