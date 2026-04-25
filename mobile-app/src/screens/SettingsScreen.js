import React from 'react';
import { View, Text, Switch, TouchableOpacity, StyleSheet } from 'react-native';
import { useSettings } from '../context/SettingsContext';

const SettingsScreen = () => {
  const { language, simpleMode, changeLanguage, toggleSimpleMode } = useSettings();

  const handleLanguageChange = () => {
    const newLang = language === 'English' ? 'Spanish' : 'English';
    changeLanguage(newLang);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Global Settings Example</Text>

      <View style={styles.settingRow}>
        <Text style={styles.settingText}>Simple Safety Mode</Text>
        <Switch
          value={simpleMode}
          onValueChange={toggleSimpleMode}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={simpleMode ? '#f5dd4b' : '#f4f3f4'}
        />
      </View>

      <View style={styles.settingRow}>
        <Text style={styles.settingText}>Language: {language}</Text>
        <TouchableOpacity style={styles.button} onPress={handleLanguageChange}>
          <Text style={styles.buttonText}>Toggle Language</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          {simpleMode 
            ? 'Simple mode is ON. Interface is simplified for safety.' 
            : 'Simple mode is OFF. Full interface is active.'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  settingText: {
    fontSize: 18,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  infoContainer: {
    marginTop: 40,
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  infoText: {
    fontSize: 16,
    color: '#333',
    fontStyle: 'italic',
  },
});

export default SettingsScreen;
