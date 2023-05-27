declare module 'authy' {
  export interface AuthyClient {
    phones(): {
      verification_start(options: { phone_number: string; country_code: string; via: 'sms' | 'call'; locale?: string }): Promise<{ success: boolean }>;
      verification_check(options: { phone_number: string; country_code: string; verification_code: string }): Promise<{ success: boolean }>;
    };
  }
}
