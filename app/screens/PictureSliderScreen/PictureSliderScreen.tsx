import React, {useRef, useState} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import {
  Animated,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  View,
  ViewToken,
} from 'react-native';
import {MediaTaken} from '../../types';
import {SlideItem} from '../../components';

export const PictureSliderScreen = () => {
  const scrollX = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();
  const route = useRoute();
  const pictures: MediaTaken[] = route.params?.pictures;

  const [index, setIndex] = useState(0);

  const handleOnScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    Animated.event(
      [
        {
          nativeEvent: {
            contentOffset: {
              x: scrollX,
            },
          },
        },
      ],
      {
        useNativeDriver: false,
      },
    )(event);
  };

  const handleOnViewableItemsChanged = useRef(
    ({viewableItems}: {viewableItems: ViewToken[]}) => {
      // console.log('viewableItems', viewableItems);
      setIndex(viewableItems[0].index as number);
    },
  ).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  return (
    <View>
      <FlatList
        data={pictures}
        renderItem={({item}) => (
          <SlideItem picture={item as unknown as MediaTaken} />
        )}
        horizontal
        pagingEnabled
        snapToAlignment="center"
        showsHorizontalScrollIndicator={false}
        onScroll={handleOnScroll}
        onViewableItemsChanged={handleOnViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
      />
    </View>
  );
};
