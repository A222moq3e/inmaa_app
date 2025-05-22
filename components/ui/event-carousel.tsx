import * as React from 'react';
import { View, Dimensions, Pressable } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { EventCard, EventCardProps } from './event-card';
import { Event as ApiEvent } from '~/api/EventDetails';
import { router } from 'expo-router';

const { width: screenWidth } = Dimensions.get('window');

interface EventCarouselProps {
  events: ApiEvent[];
  cardVariant?: EventCardProps['variant'];
}

export function EventCarousel({ events, cardVariant = 'elegant' }: EventCarouselProps) {
  const itemWidth = screenWidth * 0.85;
  const itemHeight = 280;

  const renderItem = React.useCallback(({ item }: { item: ApiEvent }) => {
    const handlePress = () => {
      if (item.id !== undefined) {
        router.push({
          pathname: "/EventDetails",
          params: { uuid: item.uuid },
        });
      }
    };

    return (
      <Pressable onPress={handlePress} className="flex-1 justify-center items-center">
        <EventCard
          event={item}
          variant={cardVariant}
        />
      </Pressable>
    );
  }, [cardVariant]);

  if (!events || events.length === 0) {
    return null;
  }

  return (
    <View className="items-center py-4">
      <Carousel
        loop
        width={itemWidth}
        height={itemHeight}
        autoPlay={false}
        data={events}
        scrollAnimationDuration={1000}
        renderItem={renderItem}
        mode="parallax"
        modeConfig={{
          parallaxScrollingScale: 0.9,
          parallaxAdjacentItemScale: 0.75,
          parallaxScrollingOffset: 40,
        }}
      />
    </View>
  );
}
