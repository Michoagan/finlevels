declare module "@nestjs/common" {
  export function Controller(path?: string): ClassDecorator;
  export function Get(path?: string): MethodDecorator;
  export function Post(path?: string): MethodDecorator;
  export function Delete(path?: string): MethodDecorator;
  export function Body(): ParameterDecorator;
  export function Request(): ParameterDecorator;
  export function Injectable(): ClassDecorator;
}

declare module "web-push" {
  export interface PushSubscription {
    endpoint: string;
    keys: {
      p256dh: string;
      auth: string;
    };
  }
  export function setVapidDetails(
    subject: string,
    publicKey: string,
    privateKey: string,
  ): void;
  export function sendNotification(
    subscription: PushSubscription,
    payload: string,
    options?: any,
  ): Promise<any>;
  export function generateVAPIDKeys(): {
    publicKey: string;
    privateKey: string;
  };
}
