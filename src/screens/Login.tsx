import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {Input, Button} from 'react-native-elements';
import {auth, db} from '../firebase/firebaseConfig';
import messaging, {firebase} from '@react-native-firebase/messaging';
const Login = ({navigation}: {navigation: any}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('123456');
  // const [deviceToken, setDeviceToken] = useState('');
  // const [listDeviceListToken, setListDeviceToken] = useState<Array<any>>([]);
  // const device = '123456';
  // const checkDevice = (device1: any) => {
  //   return device1 == device;
  // };
  const signIn = async () => {
    auth
      .signInWithEmailAndPassword(email, password)
      .then(async () => {
        let listDeviceListToken: any = [];
        let deviceToken: any = '';
        let role: string = '';
        firebase
          .messaging()
          .getToken()
          .then(fcmToken => {
            deviceToken = fcmToken;
          })
          .catch(error => console.log(error));
        if (auth?.currentUser?.displayName != null) {
          await db
            .collection('MySpa')
            .doc(auth?.currentUser?.displayName)
            .get()
            .then(value => {
              listDeviceListToken = value?.data()?.deviceTokenUser;
              role = value?.data()?.user.role;
            });
        }
        const param: any = {
          role: role,
          deviceToken: deviceToken,
          listDeviceListToken: listDeviceListToken,
        };
        if (auth?.currentUser?.displayName == null) {
          navigation.navigate('ListRoom', {item: 'admin'});
        } else {
          navigation.navigate('ListRoom', {item: param});
        }
      })
      .catch((err: any) => {
        console.log(err);
      });
  };

  // React.useLayoutEffect(() => {
  //   const unsubscribe = auth.onAuthStateChanged(async function (user: any) {
  //     if (user) {
  //     }
  //   });
  //   unsubscribe;
  // }, []);
  return (
    <View style={styles.container}>
      <Input
        placeholder="Enter your email"
        label="Email"
        value={email}
        onChangeText={(text: string) => setEmail(text)}
        autoCompleteType={undefined}
      />
      <Input
        placeholder="Enter your password"
        label="Password"
        value={password}
        onChangeText={(text: string) => setPassword(text)}
        secureTextEntry
        autoCompleteType={undefined}
      />
      <Button title="Login" style={styles.button} onPress={signIn} />
      <Button
        title="register"
        style={styles.button}
        onPress={() => navigation.navigate('Register')}
      />
      <Button
        title="Login phone"
        style={styles.button}
        onPress={() => navigation.navigate('LoginPhone')}
      />
      <Button
        title="Noti"
        style={styles.button}
        onPress={() => console.log('test')}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
    marginTop: 100,
  },
  button: {
    width: 370,
    marginTop: 10,
  },
});

export default Login;
