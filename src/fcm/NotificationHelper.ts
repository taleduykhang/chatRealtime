import messaging, {
  firebase,
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import {Platform} from 'react-native';

import PushNotification, {
  ReceivedNotification,
  Importance,
} from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';



// import ShortcutBadge from 'react-native-shortcut-badge';
enum notificationType {
  USER_PUSH = -1,
  CHECK_IN = 1,
  CONTACT = 2,
  BOOKING = 3,
  REVIEW = 4,
  ORDER_SALE = 5,
  APPOINTMENT = 6,
  STAFF_RECEIVE_COMMISSION = 7,
  BRANCH_TRANSFER = 11,
  OUT_OF_STOCK = 12,
  EXPIRY_WARNING = 13,
  ANNOUCEMENT_PROMO = 14,
}
class NotificationHelper {
  private static instance: NotificationHelper;
  private message: FirebaseMessagingTypes.Module;

  private constructor() {
    this.message = firebase.messaging();
  }

  static getInstance(): NotificationHelper {
    if (!NotificationHelper.instance) {
      NotificationHelper.instance = new NotificationHelper();
    }
    return NotificationHelper.instance;
  }

  async run(): Promise<void> {
    // PushNotificationIOS.getApplicationIconBadgeNumber((num) => {
    //   console.log(num, 1231);
    // });
    const checkPermission: boolean = await this.requestUserPermission();
    if (checkPermission) {
      if (await this.checkToken()) {
        this.configLocalPush();
        if (Platform.OS === 'ios') {
          this.onMessage();
          this.registerAppWithFCM;
        }
      }
    }
  }

  private async checkToken(): Promise<boolean> {
    let hasToken: boolean = false;
    if (Platform.OS === 'ios') {
      await firebase.messaging().registerDeviceForRemoteMessages();
    }
    await firebase
      .messaging()
      .getToken()
      .then((fcmToken) => {
        console.log('deviceToken: ', fcmToken);
        firebase.messaging().subscribeToTopic('myspa..all');
        hasToken = true;
      })
      .catch((error) => console.log(error));
    return hasToken;
  }
  /**
   * Request permission
   */
  async requestUserPermission() {
    if (Platform.OS === 'android') {
      return true;
    }
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    return enabled;
  }
  /***
   *  Apps can subscribe to a topic, which allows the FCM server to send targeted messages to only those devices subscribed to that topic.
   *  */

  registerAppWithFCM = async () => {
    try {
      if (Platform.OS == 'ios') {
        await messaging().registerDeviceForRemoteMessages();
        await messaging().setAutoInitEnabled(true);
        await this.message
          .subscribeToTopic('myspa-moba..demo.myspa.vn..guest')
          .then(() =>
            console.log('Subscribed to topic myspa-moba..demo.myspa.vn..!'),
          );
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  private configLocalPush() {
    // Must be outside of any component LifeCycle (such as `componentDidMount`).
    PushNotification.configure({
      // (optional) Called when Token is generated (iOS and Android)
      onRegister: function (token: any) {
        console.log('TOKEN:', token);
      },

      // (required) Called when a remote is received or opened, or local notification is opened
      onNotification: this.onNotification,

      // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
      onAction: function (notification: any) {
        console.log('ACTION:', notification.action);
        console.log('NOTIFICATION:', notification);

        // process the action
      },

      // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
      onRegistrationError: function (err: any) {
        console.error(err.message, err);
      },

      // IOS ONLY (optional): default: all - Permissions to register.
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },

      // Should the initial notification be popped automatically
      // default: true
      popInitialNotification: true,
      /**
       * (optional) default: true
       * - Specified if permissions (ios) and token (android and ios) will requested or not,
       * - if not, you must call PushNotificationsHandler.requestPermissions() later
       * - if you are not using remote notification or do not have Firebase installed, use this:
       *     requestPermissions: Platform.OS === 'ios'
       */
      requestPermissions: true,
    });
    this.createDefaultChannels();
  }
  private createDefaultChannels() {
    PushNotification.createChannel(
      {
        channelId: 'default_notification_channel_id', // (required)
        channelName: 'Default channel', // (required)
        channelDescription: 'A default channel', // (optional) default: undefined.
        soundName: 'default', // (optional) See `soundName` parameter of `localNotification` function
        importance: Importance.HIGH, // (optional) default: Importance.HIGH. Int value of the Android notification importance
        vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
      },
      (created: any) =>
        console.log(`createChannel 'default-channel-id' returned '${created}'`), // (optional) callback returns whether the channel was created, false means it already existed.
    );
  }
  private async onNotification(
    notification: Omit<ReceivedNotification, 'userInfo'>,
  ) {
    console.log('Foreground:', notification);
    // if (Platform.OS === 'android') {
    //   const count = await ShortcutBadge.getCount();
    //   ShortcutBadge.setCount(+count + 1);
    // }
    if (notification.userInteraction === false) {
      PushNotification.localNotification({
        /* Android Only Properties */
        channelId: 'default_notification_channel_id', // (required) channelId, if the channel doesn't exist, notification will not trigger.
        largeIcon: 'ic_launcher',
        smallIcon: 'ic_launcher', // (optional) default: "ic_notification" with fallback for "ic_launcher". Use "" for default small icon.
        vibrate: true, // (optional) default: true
        vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
        priority: 'high', // (optional) set notification priority, default: high
        visibility: 'private', // (optional) set notification visibility, default: private
        ignoreInForeground: false, // (optional) if true, the notification will not be visible when the app is in the foreground (useful for parity with how iOS notifications appear). should be used in combine with `com.dieam.reactnativepushnotification.notification_foreground` setting
        onlyAlertOnce: true,
        autoCancel: true,
        /* iOS only properties */
        category: '', // (optional) default: empty string
        /* iOS and Android properties */
        title: notification?.title ?? '', // (optional)
        message: notification.message.toString(), // (required)
        userInfo: notification.data, // (optiRonal) default: {} (using null throws a JSON value '<null>' error)
        soundName: 'default', // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)
      });
    } else if (notification.userInteraction) {
      NotificationHelper.getInstance().onAction(notification);
    }
  }
  public async onAction(notification: Omit<ReceivedNotification, 'userInfo'>) {
    console.log('onACTION:', notification);
    if (Platform.OS === 'ios') {
      
    } else {
      // const count = await ShortcutBadge.getCount();
      // console.log(+count, +count - 1);
      // ShortcutBadge.setCount(+count - 1);
    }
    notification.finish(PushNotificationIOS.FetchResult.NoData);
    let data = notification.data;
    console.log('typeNotification:', data?.type);
    
  }
  /***
   * onMessage message ios Foreground
   */
  private onMessage() {
    this.message.onMessage(async (remoteMessage) => {
      console.log('onMessage message ios Foreground', remoteMessage.data);
      Platform.OS === 'ios'
      const {notification, data} = remoteMessage;
      PushNotification.localNotification({
        category: '', // (optional) default: empty string
        /* iOS and Android properties */
        // id: 0, // (optional) Valid unique 32 bit integer specified as string. default: Autogenerated Unique ID
        title: notification?.title ?? '', // (optional)
        message: notification?.body ?? notification?.message, // (required)
        userInfo: data, // (optional) default: {} (using null throws a JSON value '<null>' error)
        playSound: false, // (optional) default: true
        soundName: 'default', // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)
      });
    });
  }
  /***
   * badge
   */
  
  public localNotificationSchedule = (
    title: string,
    message: string,
    time: any,
  ) => {
    var d = time;
    var date1 = new Date(
      d.substr(0, 4),
      d.substr(5, 2) - 1,
      d.substr(8, 2),
      d.substr(11, 2),
      d.substr(14, 2),
      d.substr(17, 2),
    );
    PushNotification.localNotificationSchedule({
      //... You can use all the options from localNotifications
      message: message,
      title: title,
      date: date1, // (required)
      // date: new Date('2021-03-10 10:44:00'), // in 60 secs
      allowWhileIdle: false, // (optional) set notification to work while on doze, default: false
    });
  };
}
export default NotificationHelper;
