// screens/Profile/Profile.tsx

import React from "react";
import { View, Text, ScrollView } from "react-native";
import { Button } from "~/components/ui/button";
import { Ionicons } from "@expo/vector-icons";
import styles from "./Profile.styles";

export default function ProfileScreen({ navigation }: any) {
  return (
    <ScrollView
      contentContainerStyle={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text className='text-primary text-2xl font-bold'>Profile Page</Text>
      <Button
        onPress={() => navigation.navigate("Home")}
        variant='outline'
        size='icon'
      >
        <Ionicons name='home-outline' size={24} />
      </Button>
    </ScrollView>
  );
}
