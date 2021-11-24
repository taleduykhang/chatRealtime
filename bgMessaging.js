import firebase from '@react-native-firebase/messaging';

export default async (message) => {
  try {
    const text = message.data.message;
    console.log('message', message);
    const payload = JSON.parse(message.data.sendbird);
    const localNotification = new firebase.notifications.Notification({
      show_in_foreground: true,
    }).android
      .setChannelId('com.reactnativewithsendbird.default_channel_id')
      // .android.setLargeIcon(BitmapFactory.decodeResource(context.getResources(),R.mipmap.ic_launcher))
      // .android.setSmallIcon('@drawable/ic_notification')
      .android.setPriority(firebase.notifications.Android.Priority.High)

      .setNotificationId(message.messageId)
      .setTitle('New message')
      .setSubtitle(`Unread message: ${payload.unread_message_count}`)
      .setBody(text)
      .setData(payload);
    return firebase.notifications().displayNotification(localNotification);
  } catch (e) {
    return Promise.resolve();
  }
};
