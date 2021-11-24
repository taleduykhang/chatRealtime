import React from 'react';
import {StyleSheet} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import Login from './src/screens/Login';
import Register from './src/screens/Register';
import Chat from './src/screens/Chat';
import LoginPhone from './src/screens/LoginPhone';
import ListRoom from './src/screens/ListRoom';
import NotificationHelper from './src/fcm/NotificationHelper';

const Stack = createStackNavigator();
const App = () => {
  React.useEffect(() => {
    NotificationHelper.getInstance().run();
  }, []);
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="Chat" component={Chat} />
        <Stack.Screen name="LoginPhone" component={LoginPhone} />
        <Stack.Screen name="ListRoom" component={ListRoom} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
const styles = StyleSheet.create({});
export default App;
