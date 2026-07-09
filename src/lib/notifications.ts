import { LocalNotifications } from '@capacitor/local-notifications';

export const requestNotificationPermissions = async () => {
  try {
    const { display } = await LocalNotifications.requestPermissions();
    return display === 'granted';
  } catch (e) {
    console.warn('LocalNotifications permission request failed', e);
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  }
};

export const scheduleAzkarReminder = async (type: 'morning' | 'evening', hour: number, minute: number) => {
  try {
    const id = type === 'morning' ? 1 : 2;
    const title = type === 'morning' ? 'أذكار الصباح' : 'أذكار المساء';
    const body = type === 'morning' ? 'حان الآن موعد قراءة أذكار الصباح' : 'حان الآن موعد قراءة أذكار المساء';

    await LocalNotifications.schedule({
      notifications: [
        {
          title,
          body,
          id,
          schedule: {
            on: { hour, minute },
            repeats: true,
          },
        },
      ],
    });
    return true;
  } catch (e) {
    console.warn('Failed to schedule notification', e);
    return false;
  }
};

export const schedulePrayerReminder = async (id: number, title: string, body: string, date: Date) => {
  try {
    await LocalNotifications.schedule({
      notifications: [
        {
          title,
          body,
          id,
          schedule: { at: date },
        },
      ],
    });
  } catch (e) {
    console.warn('Failed to schedule prayer notification', e);
  }
};
