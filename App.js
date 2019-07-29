import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import ImportScreen from './src/index';

export default function App() {
  return (
    <View>
      <ImportScreen/ >
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',    
    alignItems: 'center',
    justifyContent: 'center',
  },
});
