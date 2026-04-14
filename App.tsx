import React from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';

const App = () => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Text style={styles.logo}>EDYONE</Text>
      <Text style={styles.text}>India's #1 School Management Platform</Text>
      <Text style={styles.text}>We are building something amazing.</Text>
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0F1C',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    fontSize: 36,
    color: '#4DA6FF',
    fontWeight: 'bold',
  },
  text: {
    color: '#ccc',
    marginTop: 8,
    textAlign: 'center',
  },
  comingSoon: {
    color: '#fff',
    fontSize: 22,
    marginTop: 20,
  },
});
