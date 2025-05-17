import React from 'react';
import { View as RNView, Text as RNText, Image as RNImage, ScrollView, SafeAreaView as RNSafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { styled } from 'nativewind';

// Create styled components
const View = styled(RNView);
const Text = styled(RNText);
const Image = styled(RNImage);
const SafeAreaView = styled(RNSafeAreaView);

// Mock data for the club - in a real app, this would come from props or context
const clubData = {
  id: 1,
  name: "Programming Club",
  description: "A club for programming enthusiasts",
  logo: "https://example.com/logo.png",
  type: "specialized",
  status: "active",
  foundingDate: "2024-01-01",
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z"
};

const ClubDetails = () => {
  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Capitalize first letter of a string
  const capitalize = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="auto" />
      <ScrollView>
        <View className="items-center p-5 border-b border-gray-200">
          <Image 
            source={{ uri: clubData.logo }} 
            className="w-24 h-24 rounded-full mb-4"
            defaultSource={require('../assets/imgs/icon.png')}
          />
          <Text className="text-2xl font-bold mb-2">{clubData.name}</Text>
          <View className="flex-row mt-1">
            <View className="bg-gray-300 px-3 py-1.5 rounded-full mx-1">
              <Text className="text-white font-semibold text-xs">{capitalize(clubData.type)}</Text>
            </View>
            <View className="bg-green-500 px-3 py-1.5 rounded-full mx-1">
              <Text className="text-white font-semibold text-xs">{capitalize(clubData.status)}</Text>
            </View>
          </View>
        </View>

        <View className="p-5 border-b border-gray-200">
          <Text className="text-lg font-bold mb-2 text-gray-800">About</Text>
          <Text className="text-base leading-6 text-gray-600">{clubData.description}</Text>
        </View>

        <View className="p-5 border-b border-gray-200">
          <Text className="text-lg font-bold mb-2 text-gray-800">Details</Text>
          <View className="flex-row py-2 border-b border-gray-100">
            <Text className="flex-1 text-base text-gray-500">Founded:</Text>
            <Text className="flex-2 text-base text-gray-800">{formatDate(clubData.foundingDate)}</Text>
          </View>
          <View className="flex-row py-2 border-b border-gray-100">
            <Text className="flex-1 text-base text-gray-500">Type:</Text>
            <Text className="flex-2 text-base text-gray-800">{capitalize(clubData.type)}</Text>
          </View>
          <View className="flex-row py-2 border-b border-gray-100">
            <Text className="flex-1 text-base text-gray-500">Status:</Text>
            <Text className="flex-2 text-base text-gray-800">{capitalize(clubData.status)}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ClubDetails;
