// notificationService.ts - Handles all notifications for STEMM Lab


import * as Notifications from 'expo-notifications'; // notification library

// Configure how notifications appear when app is open
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,  // show notification popup
    shouldPlaySound: true,  // play sound
    shouldSetBadge: false,  // no badge count
  }),
});

// Request permission to send notifications
export const requestNotificationPermission = async () => {
  // Check current permission status
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  // Ask for permission if not already granted
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  // Return true if permission granted, false if denied
  return finalStatus === 'granted';
};

// Send a local notification immediately
export const sendLocalNotification = async (title: string, body: string) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title, // notification title
      body,  // notification message
    },
    trigger: null, // send immediately
  });
};

// Schedule a notification for a specific time
export const scheduleNotification = async (
  title: string,
  body: string,
  seconds: number // how many seconds from now
) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
    },
    trigger: { seconds }, // send after X seconds
  });
};

// Send challenge reminder notification
export const sendChallengeReminder = async (challengeName: string) => {
  await sendLocalNotification(
    '⏰ Challenge Reminder',
    `Don't forget to complete: ${challengeName}`
  );
};

// Send welcome notification when user registers
export const sendWelcomeNotification = async (userName: string) => {
  await sendLocalNotification(
    '🎉 Welcome to STEMM Lab!',
    `Hi ${userName}! Start your first challenge today.`
  );
};