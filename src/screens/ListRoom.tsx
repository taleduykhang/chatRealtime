import React, {useState} from 'react';
import {View, StyleSheet, FlatList, TouchableOpacity, Text} from 'react-native';
// import {Input, Button} from 'react-native-elements';
import {auth, db} from '../firebase/firebaseConfig';
import {Avatar} from 'react-native-elements';

const ListRoom = ({navigation, route}: {navigation: any; route: any}) => {
  const [data, setData] = useState([]);
  const param = route.params.item;
  console.log('param', param);
  // const [deviceToken, setDeviceToken] = useState<Array<any>>([]);
  // const device = '12345';

  const checkDevice = (device1: any) => {
    return device1 == param.deviceToken;
  };
  const signOut = () => {
    auth
      .signOut()
      .then(() => {
        // Sign-out successful.
        navigation.replace('Login');
      })
      .catch(error => {
        // An error happened.
      });
  };
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <View style={{marginLeft: 20}}>
          <Avatar
            rounded
            source={{
              uri: auth?.currentUser?.photoURL,
            }}
          />
        </View>
      ),
      headerRight: () => (
        <TouchableOpacity
          style={{
            marginRight: 10,
          }}
          onPress={signOut}>
          <Text>logout</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);
  React.useLayoutEffect(() => {
    const docRef = db
      .collection('MySpa')
      .orderBy('time', 'desc')
      .where('chat', '==', true)
      .onSnapshot(querySnapshot => {
        const documents: any = querySnapshot.docs.map(doc => doc.data());
        // do something with documents
        console.log(documents);
        setData(documents);
      });
    docRef;
  }, []);
  // console.log('data', data);
  // const getDataDeviceToken = async () => {
  //   const test = db
  //     .collection('MySpa')
  //     .doc(auth?.currentUser?.displayName)
  //     .get()
  //     .then(value => {
  //       setDeviceToken(value?.data()?.deviceTokenUser);
  //     });
  //   return test;
  // };
  // React.useEffect(() => {
  //   // getDataDeviceToken();
  //   // console.log('deviceToken123', deviceToken);
  //   // const result: any = deviceToken.filter(checkDevice);
  //   // console.log('result', result);
  //   // if (result.length == 0) {
  //   //   const add = deviceToken.concat(device);
  //   //   console.log('deviceToken456', deviceToken);
  //   //   console.log('add', add);
  //   //   db.collection('MySpa')
  //   //     .doc(auth?.currentUser?.displayName)
  //   //     .update({deviceTokenUser: add});
  //   // }
  // }, []);
  // React.useEffect(() => {
  //   if (deviceToken) {
  //     console.log('deviceToken123', deviceToken);
  //     const result: any = deviceToken.filter(checkDevice);
  //     console.log('result', result);
  //     if (result.length == 0) {
  //       const add = deviceToken.concat(device);
  //       console.log('deviceToken456', deviceToken);
  //       console.log('add', add);
  //       db.collection('MySpa')
  //         .doc(auth?.currentUser?.displayName)
  //         .update({deviceTokenUser: add});
  //     }
  //   }
  // }, [deviceToken]);
  const onPressRoom = (item: any) => {
    db.collection('MySpa').doc(item?.user.name).update({
      read: true,
    });
    navigation.navigate('Chat', {item: item?.user.name});
  };

  const renderItem = ({item}: {item: {[key: string]: any}}) => (
    <TouchableOpacity
      onPress={() => onPressRoom(item)}
      style={{
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: item?.read == true ? 'white' : '#cceeff',
      }}>
      <Avatar
        rounded
        source={{
          uri: item?.user.avatar,
        }}
      />
      <View style={{marginLeft: 10}}>
        <Text style={{fontWeight: 'bold', fontSize: 15}}>
          {item?.user.name}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: 250,
          }}>
          <Text>{item?.text}</Text>
          <Text>
            {new Date(item?.time?.seconds).toLocaleTimeString('en-US', {
              timeZone: 'Asia/Ho_Chi_Minh',
            })}
          </Text>

          {/* <Text>{item?.time.getTime().toString()}</Text> */}
        </View>
      </View>
    </TouchableOpacity>
  );
  const update = () => {
    db.collection('MySpa').doc(auth?.currentUser?.displayName).update({
      chat: true,
    });
    navigation.navigate('Chat', {item: auth?.currentUser?.displayName});
  };
  return (
    <View style={styles.container}>
      {param.role == 'admin' ? (
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
      ) : (
        <TouchableOpacity
          onPress={update}
          style={{
            flexDirection: 'row',
            marginHorizontal: 20,
            paddingVertical: 15,
          }}>
          <Text>Chat với admin</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: 'center',
    // padding: 10,
    // marginTop: 100,
    backgroundColor: 'white',
  },
  button: {
    width: 370,
    marginTop: 10,
  },
});

export default ListRoom;
