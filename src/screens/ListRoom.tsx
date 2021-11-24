import React, {useState} from 'react';
import {View, StyleSheet, FlatList, TouchableOpacity, Text} from 'react-native';
import {Input, Button} from 'react-native-elements';
import {auth, db} from '../firebase/firebaseConfig';
import {Avatar} from 'react-native-elements';

const ListRoom = ({navigation, route}: {navigation: any; route: any}) => {
  const [data, setData] = useState([]);
  const role = route.params.item;
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
      .where('type', '==', true)
      .onSnapshot(querySnapshot => {
        const documents: any = querySnapshot.docs.map(doc => doc.data());
        // do something with documents
        console.log(documents);
        setData(documents);
      });
    docRef;
  }, []);
  console.log('data', data);
  const onPressRoom = (item: any) => {
    navigation.navigate('Chat', {item: item.name});
  };
  const renderItem = ({item}: {item: {[key: string]: any}}) => (
    <TouchableOpacity
      onPress={() => onPressRoom(item)}
      style={{
        flexDirection: 'row',
        marginHorizontal: 20,
        paddingVertical: 15,
      }}>
      <Avatar
        rounded
        source={{
          uri: item?.avatar,
        }}
      />
      <View style={{marginLeft: 10}}>
        <Text style={{fontWeight: 'bold', fontSize: 15}}>{item?.name}</Text>
        <Text>{item?.text}</Text>
      </View>
    </TouchableOpacity>
  );
  const update = () => {
    db.collection('MySpa').doc(auth?.currentUser?.displayName).update({
      type: true,
    });
    navigation.navigate('Chat', {item: auth?.currentUser?.displayName});
  };
  return (
    <View style={styles.container}>
      {role == 'admin' ? (
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
    marginTop: 100,
  },
  button: {
    width: 370,
    marginTop: 10,
  },
});

export default ListRoom;
