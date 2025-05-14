// screens/Home/HomeScreen.tsx
import React from "react";
import { View, Text, ScrollView } from "react-native";
import { Button } from "~/components/ui/button";

export default function HomeScreen({ navigation }: any) {
  return (
    <ScrollView
      contentContainerStyle={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text className='text-primary text-2xl font-bold'>Home Screen</Text>
      <Button
        onPress={() => navigation.navigate("Profile")}
        variant='outline'
        size='default'
      >
        <Text>Go to Profile</Text>
      </Button>
    </ScrollView>
  );
}
