import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useCallback, useEffect, useState} from 'react';
import IonIcon from 'react-native-vector-icons/Ionicons';
import {ScrollView, Text, View} from 'react-native';
import {IconButton} from '../../components';
import {PictureSquare} from '../../components/PictureSquare/PictureSquare';
import {MediaTaken} from '../../types';
import {styles} from './styles';
import {useNavigation} from '@react-navigation/native';

export const PicturesScreen = () => {
  const navigation = useNavigation();

  const [pictures, setPictures] = useState<MediaTaken[]>([]);

  const getPictures = useCallback(async () => {
    const keys = await AsyncStorage.getAllKeys();
    const items = await AsyncStorage.multiGet(keys);
    const pics: MediaTaken[] = items.map(item => {
      return JSON.parse(item[1] as string);
    });
    setPictures(
      pics.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      ),
    );
  }, []);

  useEffect(() => {
    getPictures();
  }, [getPictures]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <IconButton onPress={() => navigation.goBack()}>
          <IonIcon name={'chevron-back-outline'} color={'tomato'} size={35} />
        </IconButton>
        <Text style={styles.header_text}>Archivos</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scroll_view_container}>
        {pictures.map(picture => (
          <PictureSquare
            media={picture}
            key={picture.id}
            onPress={() =>
              navigation.navigate(
                'PictureSliderScreen' as never,
                {
                  pictures,
                  picture,
                } as never,
              )
            }
          />
        ))}
      </ScrollView>
    </View>
  );
};
