import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {Input, Button} from 'react-native-elements';
import {auth, db} from '../firebase/firebaseConfig';

const Login = ({navigation}: {navigation: any}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('123456');
  const [deviceToken, setDeviceToken] = useState<Array<any>>([]);
  const signIn = async () => {
    auth.signInWithEmailAndPassword(email, password).catch((err: any) => {
      console.log(err);
    });
  };

  React.useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(function (user: any) {
      if (user) {
        const test = db
          .collection('MySpa')
          .doc(auth?.currentUser?.displayName)
          .get()
          .then(value => {
            console.log('loginTesst', value.data());
            if (auth?.currentUser?.displayName == null) {
              setDeviceToken(value?.data()?.deviceTokenAdmin);
            } else {
              setDeviceToken(value?.data()?.deviceTokenUser);
            }
          });
        test;
        const abc: any = 'abc';
        const result: any = deviceToken.filter(abc);
        if (auth?.currentUser?.displayName == null) {
          navigation.navigate('ListRoom', {item: 'admin'});
        } else {
          navigation.navigate('ListRoom', {item: 'user'});
        }
      } else {
      }
    });
    return unsubscribe;
  }, []);
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
