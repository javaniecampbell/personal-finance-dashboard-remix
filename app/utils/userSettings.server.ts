import { db } from "./db.server";

export async function getUserSettings(userId: string) {
  return db.userSettings.findUnique({
    where: { userId },
  });
}

export async function updateUserSettings(userId: string, settings: {
  theme?: 'light' | 'dark';
  language?: string;
  notificationPreferences?: {
    email?: boolean;
    push?: boolean;
    sms?: boolean;
  };
  currency?: string;
}) {
  return db.userSettings.upsert({
    where: { userId },
    update: settings,
    create: { ...settings, userId },
  });
}

export async function getConnectedAccounts(userId: string) {
  return db.connectedAccount.findMany({
    where: { userId },
  });
}

export async function addConnectedAccount(userId: string, accountData: {
  provider: string;
  accountId: string;
  accountName: string;
  accountType: string;
}) {
  return db.connectedAccount.create({
    data: {
      ...accountData,
      userId,
    },
  });
}

export async function removeConnectedAccount(userId: string, accountId: string) {
  return db.connectedAccount.delete({
    where: {
      id: accountId,
      userId,
    },
  });
}

export async function updateUserProfile(userId: string, profileData: {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  dateOfBirth?: Date;
}) {
  return db.user.update({
    where: { id: userId },
    data: profileData,
  });
}

export async function changePassword(userId: string, currentPassword: string, newPassword: string) {
  // Implement password change logic here
  // Remember to verify the current password and hash the new password
}
