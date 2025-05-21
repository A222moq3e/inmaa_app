// STUB FOR LOOKS

import * as React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Text } from './text';
import { cn } from '~/lib/utils';

// Placeholder for future event data type
export interface EventData {
  id: number;
  title?: string;
  date?: string;
  location?: string;
  status: string;
  eventId: number;
}

interface EventCardProps {
  event: EventData;
  className?: string;
}

export function EventCard({ event, className }: EventCardProps) {
  const router = useRouter();
  
  // Navigate to event details when card is pressed
  const handlePress = () => {
    router.push(`/EventDetails?id=${event.eventId}`);
  };

  // Basic status badge component
  const StatusBadge = ({ status }: { status: string }) => (
    <View className={cn(
      'px-2 py-1 rounded-full self-start',
      status === 'pending' ? 'bg-amber-100 dark:bg-amber-900' : 
      status === 'approved' ? 'bg-green-100 dark:bg-green-900' : 
      status === 'rejected' ? 'bg-red-100 dark:bg-red-900' : 
      'bg-gray-100 dark:bg-gray-800'
    )}>
      <Text className={cn(
        'text-xs font-medium',
        status === 'pending' ? 'text-amber-800 dark:text-amber-300' : 
        status === 'approved' ? 'text-green-800 dark:text-green-300' : 
        status === 'rejected' ? 'text-red-800 dark:text-red-300' : 
        'text-gray-800 dark:text-gray-300'
      )}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Text>
    </View>
  );

  return (
    <TouchableOpacity activeOpacity={0.7} onPress={handlePress}>
      <Card className={cn('mb-4', className)}>
        <CardHeader className="pb-2">
          <View className="flex-row justify-between items-start">
            <CardTitle className="text-lg">
              {event.title || `Event #${event.eventId}`}
            </CardTitle>
            <StatusBadge status={event.status} />
          </View>
        </CardHeader>
        <CardContent>
          {event.date && (
            <View className="flex-row items-center mb-1">
              <Text className="text-xs text-muted-foreground">
                Date: {event.date}
              </Text>
            </View>
          )}
          {event.location && (
            <View className="flex-row items-center">
              <Text className="text-xs text-muted-foreground">
                Location: {event.location}
              </Text>
            </View>
          )}
        </CardContent>
      </Card>
    </TouchableOpacity>
  );
}
