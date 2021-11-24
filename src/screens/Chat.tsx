import React, {useEffect, useCallback, useState, useLayoutEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Platform,
  ActivityIndicator,
} from 'react-native';
import {Avatar} from 'react-native-elements';
import {auth, db, storage} from '../firebase/firebaseConfig';
import {GiftedChat, Actions} from 'react-native-gifted-chat';
import ImageView from 'react-native-image-viewing';
import axios from 'axios';
// import Video from 'react-native-video';
import {launchImageLibrary} from 'react-native-image-picker';
const headers = {
  'Content-Type': 'application/json',
  Authorization: `key=AAAAOv-6VWU:APA91bHtAj1fXJ6yhWpBNbhxo4Aw2jRHvZ4Ub_x7V5pi2euHKLPqvvXeBT36cgWXCqnsfdtQTmq7U9hcPnAVLRBEtb98rvAGW3GW00YLwL9LA84RPge881gNTTl4Zc6p54Nm5SjsY0wR`,
};
const Chat = ({navigation, route}: {navigation?: any; route: any}) => {
  const name = route.params.item;
  // const name = 'Duy Khang';

  const [messages, setMessages] = useState<Array<any>>([]);
  const [image1, setImage] = useState<any>('');
  const [url, setUrl] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [visible, setIsVisible] = useState<boolean>(false);
  const [images, setImages] = useState<Array<any>>([]);
  const [content, setContent] = useState<any>('');
  // const signOut = () => {
  //   auth
  //     .signOut()
  //     .then(() => {
  //       // Sign-out successful.
  //       navigation.replace('Login');
  //     })
  //     .catch(error => {
  //       // An error happened.
  //     });
  // };
  const onSelectImagePress = () => {
    let options: any = {
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    launchImageLibrary(options, async (response: any) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        console.log('response', response);
        setImage(response.assets[0].uri);
      }
    });
  };
  useEffect(() => {
    const upload = async () => {
      setLoading(true);
      const filename = image1.substring(image1.lastIndexOf('/') + 1);
      const blob: any = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
          resolve(xhr.response);
        };
        xhr.onerror = function () {
          reject(new TypeError('Network request failed'));
        };
        xhr.responseType = 'blob';
        xhr.open('GET', image1, true);
        xhr.send(null);
      });
      const imageRef = storage.ref(filename);
      await imageRef.put(blob, {contentType: 'image/jpeg'}).catch(error => {
        throw error;
      });
      try {
        const response = await imageRef.getDownloadURL();
        await setUrl(response.toString());
        setLoading(false);
      } catch (error) {
        console.error('error', error);
      }
    };
    if (image1 != '') {
      upload();
    }
  }, [image1]);
  const returnA = () => {
    if (auth?.currentUser?.displayName == null) {
      navigation.navigate('ListRoom', {item: 'admin'});
    } else {
      navigation.navigate('ListRoom', {item: 'user'});
    }
  };
  useLayoutEffect(() => {
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
          onPress={returnA}>
          <Text>Quay lại</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  useLayoutEffect(() => {
    const unsubscribe = db
      .collection('MySpa')
      .doc(name)
      .collection(name)
      .orderBy('createdAt', 'desc')
      .onSnapshot(snapshot =>
        setMessages(
          snapshot.docs.map(doc => ({
            _id: doc.data()._id,
            createdAt: doc.data().createdAt.toDate(),
            text: doc.data().text,
            user: doc.data().user,
            image: doc.data().url,
          })),
        ),
      );
    return unsubscribe;
  }, []);
  const data = {
    to: 'cdrHFaCYQIuKD-yuwRFlsF:APA91bGExHkMAenPghF2DxH4IbQkX2koVYOd2G29Q_5l90tZHejP8JzrISB4vzQczDHAUMVquhfiJkp3U59bx5wYZPBQbE7nMAuPmc8U55GiHC60oc2HwUA52Ym2_eL-87NUW20o71tr',
    notification: {
      body: content,
      title: auth?.currentUser?.displayName,
      smallIcon: auth?.currentUser?.photoURL,
    },
    data: {
      name: auth?.currentUser?.displayName,
    },
  };
  const method: any = {
    method: 'POST',
    headers: headers,
    data: data,
    url: `https://fcm.googleapis.com/fcm/send?`,
  };
  const onSend = async (messages: any) => {
    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, messages),
    );
    const {_id, createdAt, text, user} = messages[0];
    db.collection('MySpa').doc(name).collection(name).add({
      _id,
      createdAt,
      text,
      user,
      url,
    });
    db.collection('MySpa').doc(name).update({text: text});
    setImage(''), setUrl('');
    // await setContent(text);
    // axios(method);
    axios(`https://fcm.googleapis.com/fcm/send?`, {
      headers: headers,
      method: 'POST',
      data: {
        registration_ids: [
          'cdrHFaCYQIuKD-yuwRFlsF:APA91bGExHkMAenPghF2DxH4IbQkX2koVYOd2G29Q_5l90tZHejP8JzrISB4vzQczDHAUMVquhfiJkp3U59bx5wYZPBQbE7nMAuPmc8U55GiHC60oc2HwUA52Ym2_eL-87NUW20o71tr',
        ],
        notification: {
          body: text,
          title: auth?.currentUser?.displayName,
          smallIcon: auth?.currentUser?.photoURL,
          bigPictureUrl: url,
        },
        data: {
          name: auth?.currentUser?.displayName,
        },
      },
    });
  };
  const viewImage = async (item: Object) => {
    await setImages([item]);

    setIsVisible(true);
  };
  const renderMessageImage = (currentMessage: any) => {
    const item = {uri: currentMessage.currentMessage.image};

    return (
      <View style={{padding: 20}}>
        <TouchableOpacity onPress={() => viewImage(item)}>
          <Image
            resizeMode="cover"
            source={{uri: currentMessage.currentMessage.image}}
            style={{height: 60, width: 60}}
          />
        </TouchableOpacity>
      </View>
    );
  };
  const renderActions = (props: any) => {
    return (
      <Actions
        {...props}
        containerStyle={{
          width: 44,
          height: 44,
          alignItems: 'center',
          justifyContent: 'center',
          marginLeft: 4,
          marginRight: 4,
          marginBottom: 0,
        }}
        icon={() =>
          image1 ? (
            loading == true ? (
              <ActivityIndicator size="small" color="#0000ff" />
            ) : (
              <Image
                source={{uri: image1}}
                resizeMode={'cover'}
                style={{width: 50, height: 50}}
              />
            )
          ) : (
            <Image
              source={{
                uri: 'https://cdn-icons-png.flaticon.com/512/3342/3342176.png',
              }}
              resizeMode={'cover'}
              style={{width: 30, height: 30}}
            />
          )
        }
        options={{
          'Choose From Library': () => {
            onSelectImagePress();
          },
          Cancel: () => {
            console.log('Cancel');
          },
        }}
        optionTintColor="#222B45"
      />
    );
  };
  const RenderModalImage = () => {
    return (
      <ImageView
        images={images}
        imageIndex={0}
        visible={visible}
        onRequestClose={() => setIsVisible(false)}
      />
    );
  };
  return (
    <SafeAreaView style={{flex: 1}}>
      <GiftedChat
        messages={messages}
        onSend={messages => onSend(messages)}
        // renderMessageVideo={renderMessageVideo}
        renderMessageImage={renderMessageImage}
        user={{
          _id: auth?.currentUser?.email,
          name: auth?.currentUser?.displayName,
          avatar: auth?.currentUser?.photoURL,
        }}
        renderActions={renderActions}
        // renderUsernameOnMessage
        // renderAvatarOnTop
        // alwaysShowSend
      />
      <RenderModalImage />
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({});
export default Chat;
