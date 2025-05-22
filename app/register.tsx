import React, { useState } from 'react';
import { View, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Input as TextInput } from '~/components/ui/input'; 
import { Text } from '~/components/ui/text';
import { useAuth } from '~/context/AuthContext';
import { router } from 'expo-router';
import { Button } from '~/components/ui/button';
import { useTranslation } from 'react-i18next';

export default function RegisterScreen() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    displayName: '',
    email: '',
    phoneNumber: '',
  });
  const [error, setError] = useState<string | null>(null);
  const { register, loading } = useAuth();
  const { t } = useTranslation();

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
      // Automatically generate displayName from first and last name if not already set
      ...(field === 'firstName' || field === 'lastName' 
        ? { displayName: `${field === 'firstName' ? value : prev.firstName} ${field === 'lastName' ? value : prev.lastName}`.trim() }
        : {})
    }));
  };

  const handleRegister = async () => {
    // Validate required fields
    const { firstName, lastName, email, phoneNumber } = formData;
    if (!firstName || !lastName || !email || !phoneNumber) {
      setError(t('errors.all_fields_required'));
      return;
    }

    try {
      await register(formData);
      router.replace('/');
    } catch (err) {
      console.error('Registration error:', err);
      setError(err instanceof Error ? err.message : t('errors.registration_failed'));
    }
  };

  const navigateToLogin = () => {
    router.push('/login');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1"
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 p-6 justify-center bg-background">
          <View className="mb-8 items-center">
            <Text className="text-3xl font-bold mb-2">{t('auth.create_account', 'Create Account')}</Text>
            <Text className="text-muted-foreground text-center">
              {t('auth.register_to_get_started', 'Register to get started')}
            </Text>
          </View>

          {error && (
            <View className="mb-4 p-3 bg-destructive/10 rounded-md">
              <Text className="text-destructive text-center">{error}</Text>
            </View>
          )}

          <View className="space-y-4 mb-6">
            <View>
              <Text className="text-sm font-medium mb-1">{t('auth.first_name', 'First Name')}</Text>
              <TextInput
                className="p-3 border border-border bg-input rounded-md"
                placeholder={t('auth.enter_first_name', 'Enter your first name')}
                value={formData.firstName}
                onChangeText={(value) => handleChange('firstName', value)}
              />
            </View>

            <View>
              <Text className="text-sm font-medium mb-1">{t('auth.last_name', 'Last Name')}</Text>
              <TextInput
                className="p-3 border border-border bg-input rounded-md"
                placeholder={t('auth.enter_last_name', 'Enter your last name')}
                value={formData.lastName}
                onChangeText={(value) => handleChange('lastName', value)}
              />
            </View>

            <View>
              <Text className="text-sm font-medium mb-1">{t('auth.display_name', 'Display Name (optional)')}</Text>
              <TextInput
                className="p-3 border border-border bg-input rounded-md"
                placeholder={t('auth.display_name_description', 'How others will see you')}
                value={formData.displayName}
                onChangeText={(value) => handleChange('displayName', value)}
              />
            </View>

            <View>
              <Text className="text-sm font-medium mb-1">{t('auth.email', 'Email')}</Text>
              <TextInput
                className="p-3 border border-border bg-input rounded-md"
                placeholder={t('auth.enter_email', 'Enter your email')}
                keyboardType="email-address"
                autoCapitalize="none"
                value={formData.email}
                onChangeText={(value) => handleChange('email', value)}
              />
            </View>

            <View>
              <Text className="text-sm font-medium mb-1">{t('auth.phone_number', 'Phone Number')}</Text>
              <TextInput
                className="p-3 border border-border bg-input rounded-md"
                placeholder={t('auth.enter_phone_number', 'Enter your phone number')}
                keyboardType="phone-pad"
                value={formData.phoneNumber}
                onChangeText={(value) => handleChange('phoneNumber', value)}
              />
            </View>
          </View>

          <Button
            onPress={handleRegister}
            disabled={loading}
            className="mb-4"
          >
            {loading ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              t('auth.register', 'Register')
            )}
          </Button>

          <View className="flex-row justify-center mt-4">
            <Text className="text-muted-foreground">{t('auth.already_have_account', 'Already have an account?')} </Text>
            <TouchableOpacity onPress={navigateToLogin}>
              <Text className="text-primary font-semibold">{t('auth.login', 'Login')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
