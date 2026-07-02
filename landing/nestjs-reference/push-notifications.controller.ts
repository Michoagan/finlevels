import { Controller, Get, Post, Delete, Body, Request } from "@nestjs/common";
import { PushNotificationsService } from "./push-notifications.service";

@Controller()
export class PushNotificationsController {
  constructor(private readonly pushNotificationsService: PushNotificationsService) {}

  /**
   * Endpoint GET /auth/vapid-public-key
   * Public endpoint to retrieve the VAPID public key
   */
  @Get("auth/vapid-public-key")
  getVapidKey() {
    return { publicKey: process.env.VAPID_PUBLIC_KEY };
  }

  /**
   * Endpoint POST /users/me/push-subscription
   * Store device subscription details associated with the user
   */
  @Post("users/me/push-subscription")
  async storeSubscription(@Body() subscriptionDto: any, @Request() req: any) {
    const userId = req.user?.id || "anonymous"; // Extract authenticated user ID
    
    // Save the subscription object in the DB.
    // Dto layout:
    // {
    //   endpoint: "https://fcm.googleapis.com/fcm/send/...",
    //   keys: {
    //     p256dh: "...",
    //     auth: "..."
    //   }
    // }
    console.log(`[NestJS] Save subscription for user ${userId}:`, subscriptionDto);
    
    // TODO: Upsert the subscription record inside your database.
    // Multiple devices/subscriptions per user can be stored; identify them uniquely by the endpoint.
    
    return { success: true };
  }

  /**
   * Endpoint DELETE /users/me/push-subscription
   * Remove device subscription details
   */
  @Delete("users/me/push-subscription")
  async removeSubscription(@Body() body: { endpoint: string }, @Request() req: any) {
    const userId = req.user?.id || "anonymous";
    console.log(`[NestJS] Remove subscription for user ${userId} with endpoint: ${body.endpoint}`);
    
    // TODO: Delete the subscription record matching this endpoint from your database.
    
    return { success: true };
  }
}
