import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Text } from '~/components/ui/text';
import { useAuth } from '~/context/AuthContext';
import { router } from 'expo-router';
import { Button } from '~/components/ui/button';
import i18n from '~/i18n';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [nationalId, setNationalId] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { tempLogin, loading } = useAuth();

  const handleLogin = async () => {
    if (!email || !nationalId) {
      setError(i18n.t('errors.all_fields_required'));
      return;
    }

    try {
      await tempLogin({ email, nationalId });
      router.replace('/');
    } catch (err) {
      console.error('Login error:', err);
      setError(err instanceof Error ? err.message : i18n.t('errors.login_failed'));
    }
  };

  const navigateToRegister = () => {
    router.push('/register');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1"
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 p-6 justify-center bg-background">
          <View className="mb-8 items-center">
            <Text className="text-3xl font-bold mb-2">Welcome Back</Text>
            <Text className="text-muted-foreground text-center">
              Login to access your account
            </Text>
          </View>

          {error && (
            <View className="mb-4 p-3 bg-destructive/10 rounded-md">
              <Text className="text-destructive text-center">{error}</Text>
            </View>
          )}

          <View className="space-y-4 mb-6">
            <View>
              <Text className="text-sm font-medium mb-1">Email</Text>
              <TextInput
                className="p-3 border border-border bg-input rounded-md"
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <View>
              <Text className="text-sm font-medium mb-1">National ID</Text>
              <TextInput
                className="p-3 border border-border bg-input rounded-md"
                placeholder="Enter your national ID"
                value={nationalId}
                onChangeText={setNationalId}
                secureTextEntry
              />
            </View>
          </View>

          <Button
            onPress={handleLogin}
            disabled={loading}
            className="mb-4"
          >
            {loading ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              'Login'
            )}
          </Button>

          <View className="flex-row justify-center mt-4">
            <Text className="text-muted-foreground">Don't have an account? </Text>
            <TouchableOpacity onPress={navigateToRegister}>
              <Text className="text-primary font-semibold">Register</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
