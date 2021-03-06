import React, {useState} from 'react';
import {View, StyleSheet, Alert} from 'react-native';
import {Input, Button} from 'react-native-elements';
import {auth, db} from '../firebase/firebaseConfig';
const Register = () => {
  const [name, setName] = useState('Duy Khang');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('123456');
  const [avatar, setAvatar] = useState(
    'https://static.wikia.nocookie.net/kpop/images/3/37/EXID_LE_B.L.E.S.S.E.D_promotional_photo.png/revision/latest?cb=20200824220259',
  );
  const id = new Date().valueOf();
  const date = new Date();
  const register = () => {
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((userCredential: any) => {
        // Signed in
        var user = userCredential.user;
        // ...
        user
          .updateProfile({
            displayName: name,
            photoURL: avatar
              ? avatar
              : 'https://m.media-amazon.com/images/I/51nAHcMPbbL._AC_.jpg',
          })
          .then(function () {
            // Update successful.
            db.collection('MySpa')
              .doc(name)
              .set({
                id: id,
                deviceTokenUser: [],
                deviceTokenAdmin: [],
                chat: false,
                text: '',
                time: '',
                read: false,
                user: {
                  name: name,
                  avatar: avatar
                    ? avatar
                    : 'https://m.media-amazon.com/images/I/51nAHcMPbbL._AC_.jpg',
                  role: 'user',
                },
              });
          })
          .catch(function (error: any) {
            // An error happened.
          });
      })
      .catch((error: any) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        // ..
        // alert(errorMessage);
        console.log(errorMessage);
      });
  };
  return (
    <View style={styles.container}>
      <Input
        placeholder="Enter your name"
        label="Name"
        value={name}
        onChangeText={(text: string) => setName(text)}
        autoCompleteType={undefined}
      />
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
      <Input
        placeholder="Enter your image url"
        label="Profile Picture"
        value={avatar}
        onChangeText={(text: string) => setAvatar(text)}
        autoCompleteType={undefined}
      />
      <Button title="register" style={styles.button} onPress={register} />
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
export default Register;
