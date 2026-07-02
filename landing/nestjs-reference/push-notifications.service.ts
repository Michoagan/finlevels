import { Injectable } from "@nestjs/common";
import * as webpush from "web-push";

@Injectable()
export class PushNotificationsService {
  constructor() {
    // Configure VAPID details on startup (usually done in module initialization)
    if (
      process.env.VAPID_SUBJECT &&
      process.env.VAPID_PUBLIC_KEY &&
      process.env.VAPID_PRIVATE_KEY
    ) {
      webpush.setVapidDetails(
        process.env.VAPID_SUBJECT,
        process.env.VAPID_PUBLIC_KEY,
        process.env.VAPID_PRIVATE_KEY,
      );
    }
  }

  /**
   * Send push notification to a specific subscription (device/browser)
   */
  async sendToUser(subscription: webpush.PushSubscription, payload: {
    title: string;
    body: string;
    icon?: string;
    url?: string;
  }) {
    try {
      await webpush.sendNotification(
        subscription,
        JSON.stringify({
          title: payload.title ?? "Quest Alert",
          body: payload.body ?? "Your daily quest is ready!",
          icon: payload.icon ?? "/logo-purple.svg",
          url: payload.url ?? "/dashboard",
        }),
      );
    } catch (err: any) {
      if (err.statusCode === 410 || err.statusCode === 404) {
        // Subscription expired or invalid — delete from DB
        console.warn(`Push subscription expired. Deleting endpoint: ${subscription.endpoint}`);
        await this.deleteSubscriptionFromDatabase(subscription.endpoint);
      } else {
        console.error("Failed to send push notification:", err);
      }
    }
  }

  /**
   * Send a gamified and personalized daily challenge reminder (US Gen Z targets)
   */
  async sendDailyChallengeReminder(
    subscription: webpush.PushSubscription,
    characterName: string,
    streak: number,
    pathName: string,
    activeToken: string,
  ) {
    const payload = {
      title: "⚡ New Daily Quest Live!",
      body: `Penny: "Yo ${characterName}! Don't fumble your ${streak}-day streak. Make today's choice and secure that ${pathName} bag! 💰"`,
      icon: "/logo-purple.svg",
      url: `/challenges/${activeToken}`,
    };
    await this.sendToUser(subscription, payload);
  }

  /**
   * Broadcast push notification to all users/devices
   */
  async broadcast(payload: {
    title: string;
    body: string;
    icon?: string;
    url?: string;
  }) {
    const subscriptions = await this.getAllSubscriptionsFromDatabase();
    await Promise.allSettled(
      subscriptions.map((sub) => this.sendToUser(sub, payload)),
    );
  }

  // Placeholder methods representing database integrations
  private async deleteSubscriptionFromDatabase(endpoint: string): Promise<void> {
    // TODO: Connect to your DB (Supabase, PostgreSQL, TypeORM, Prisma, etc.) and delete
    // e.g. await this.prisma.pushSubscription.delete({ where: { endpoint } });
    console.log(`Mock DB: Removed expired subscription endpoint: ${endpoint}`);
  }

  private async getAllSubscriptionsFromDatabase(): Promise<webpush.PushSubscription[]> {
    // TODO: Fetch all subscriptions from your DB
    return [];
  }
}
