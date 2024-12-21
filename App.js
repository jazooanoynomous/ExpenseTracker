import 'react-native-gesture-handler';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Routes from './src/navigation/Routes';

const App = () => {
  return (
    <SafeAreaProvider>
      <Routes />
      {/* <Toast /> Adding Toast to the App */}
    </SafeAreaProvider>
  );
};

export default App;
