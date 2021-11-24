import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {Input, Button} from 'react-native-elements';
import auth from '@react-native-firebase/auth';

const LoginPhone = ({navigation}: {navigation: any}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState<any>();
  const signIn = async () => {
    try {
      const confirmation: any = await auth().signInWithPhoneNumber(email);
      setConfirm(confirmation);
    } catch (error) {}
  };
  const confirmVerificationCode = async () => {
    try {
      await confirm.confirm(password);
      setConfirm(null);
    } catch (error) {}
  };
  React.useEffect(() => {
    // const unsubscribe = auth().onAuthStateChanged(function (user: any) {
    //   if (user) {
    //     navigation.replace('Chat');
    //   } else {
    //   }
    // });
    // return unsubscribe;
  }, []);
  return (
    <View style={styles.container}>
      <Input
        placeholder="Enter your email"
        label="Phone"
        value={email}
        onChangeText={(text: string) => setEmail(text)}
        autoCompleteType={undefined}
      />
      <Input
        placeholder="Enter your password"
        label="Otp"
        value={password}
        onChangeText={(text: string) => setPassword(text)}
        secureTextEntry
        autoCompleteType={undefined}
      />
      <Button title="sign in" style={styles.button} onPress={signIn} />
      <Button
        title="register"
        style={styles.button}
        onPress={confirmVerificationCode}
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

export default LoginPhone;
