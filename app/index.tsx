// Home Page / Root Page

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, I18nManager } from 'react-native';
import { useTranslation } from 'react-i18next';
import ClubDetails from './ClubDetails';
import '../i18n'; // Import i18n configuration
import { getAllClubs } from '../api/ClubDetails';
import "@/global.css" // Import Tailwind styles

// Enable RTL layout
I18nManager.allowRTL(true);
I18nManager.forceRTL(true);

const App = () => {
  const { t } = useTranslation();
  const [clubUuid, setClubUuid] = useState<string | null>("6ef8f3bb-dc54-45a2-b35a-eb4c0673a61b");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch the first club to display as an example
    const fetchFirstClub = async () => {
      try {
        const clubs = await getAllClubs();
        if (clubs && clubs.length > 0) {
          setClubUuid(clubs[0].uuid);
        } else {
          setError(t('errors.no_clubs'));
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : t('errors.generic'));
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if we don't already have a clubUuid
    if (!clubUuid) {
      fetchFirstClub();
    } else {
      setLoading(false);
    }
  }, [clubUuid, t]);

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <Text style={styles.message}>{t('loading')}</Text>
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : clubUuid ? (
        <ClubDetails clubUuid={clubUuid} />
      ) : (
        <Text style={styles.message}>{t('errors.no_clubs')}</Text>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  message: {
    textAlign: 'center',
    padding: 20,
    fontFamily: 'Arial',
    fontSize: 16,
  },
  error: {
    color: 'red',
    textAlign: 'center',
    padding: 20,
    fontFamily: 'Arial',
    fontSize: 16,
  }
});

export default App;
