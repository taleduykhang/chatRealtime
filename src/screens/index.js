import 'firebase/compat/functions';
import admin from 'firebase-admin';     
admin.initializeApp(functions.config().firebase);
export const sendPushNotification = functions.database
  .ref("users/WVBopPRL68Zmvl6N2EpFqT4cpBj1")
  .onCreate(event => {
    const data = event._data;
    payload = {
      notification: {
        title: "Welcome",
        body: "thank for installed our app",
      },
    };
    admin
      .messaging()
      .sendToDevice(data.notification_token, payload)
      .then(function(response) {
        console.log("Notification sent successfully:", response);
      })
      .catch(function(error) {
        console.log("Notification sent failed:", error);
      });
  });