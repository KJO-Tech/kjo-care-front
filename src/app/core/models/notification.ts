export interface Notification extends NotificationResponse {
  recipientUserId: string;
  actorUserId: string;
  sourceEventId: string;
  metadata: string;
}

export interface NotificationResponse {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  link: string;
  read: boolean;
  createdAt: string;
}

export enum NotificationType {
  // Social & Blog
  LIKE = 'LIKE',
  COMMENT = 'COMMENT',
  FOLLOW = 'FOLLOW',
  NEW_BLOG = 'NEW_BLOG',
  BLOG_REJECTED = 'BLOG_REJECTED',

  // Health & System
  APPOINTMENT = 'APPOINTMENT',
  MEDICATION = 'MEDICATION',
  REMINDER = 'REMINDER',
  SYSTEM = 'SYSTEM',
  MOOD_ALERT = 'MOOD_ALERT',
}

export const NOTIFICATION_TYPE_ICON: Record<NotificationType, string> = {
  // Social & Blog Icons
  [NotificationType.LIKE]: 'favorite',
  [NotificationType.COMMENT]: 'comment',
  [NotificationType.FOLLOW]: 'person_add',
  [NotificationType.NEW_BLOG]: 'article',
  [NotificationType.BLOG_REJECTED]: 'unpublished',

  // Health & System Icons
  [NotificationType.APPOINTMENT]: 'calendar_month',
  [NotificationType.MEDICATION]: 'pill',
  [NotificationType.REMINDER]: 'notifications_active',
  [NotificationType.SYSTEM]: 'info',
  [NotificationType.MOOD_ALERT]: 'sentiment_very_dissatisfied',
};
