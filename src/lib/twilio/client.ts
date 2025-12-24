import twilio from "twilio";
import { createAdminClient } from "@/lib/supabase/server";

/**
 * Client Twilio multi-tenant
 * Chaque organisation configure ses propres credentials
 */
class TwilioClient {
  private client: twilio.Twilio;
  private phoneNumber: string;

  constructor(accountSid: string, authToken: string, phoneNumber: string) {
    if (!accountSid || !authToken) {
      throw new Error("Twilio credentials not configured");
    }

    this.client = twilio(accountSid, authToken);
    this.phoneNumber = phoneNumber;
  }

  /**
   * Crée un client Twilio pour une organisation spécifique
   */
  static async forOrganization(organizationId: string): Promise<TwilioClient | null> {
    const supabase = await createAdminClient();
    
    const { data: org } = await supabase
      .from("organizations")
      .select("twilio_account_sid, twilio_auth_token_encrypted, twilio_phone_number, twilio_configured")
      .eq("id", organizationId)
      .single();

    if (!org || !org.twilio_configured) {
      return null; // Organisation n'a pas configuré Twilio
    }

    // TODO: Déchiffrer twilio_auth_token_encrypted
    // Pour l'instant, on assume qu'il est stocké en clair (à sécuriser en prod)
    const authToken = org.twilio_auth_token_encrypted;

    return new TwilioClient(
      org.twilio_account_sid,
      authToken,
      org.twilio_phone_number
    );
  }

  /**
   * Envoie un SMS
   */
  async sendSMS(to: string, body: string) {
    try {
      const message = await this.client.messages.create({
        body,
        from: this.phoneNumber,
        to,
      });

      return {
        success: true,
        sid: message.sid,
        status: message.status,
      };
    } catch (error: any) {
      console.error("Erreur envoi SMS:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Envoie un SMS de confirmation de RDV
   */
  async sendAppointmentConfirmation(
    to: string,
    appointmentDetails: {
      date: string;
      time: string;
      location?: string;
      contact?: string;
    }
  ) {
    const message = `✅ Rendez-vous confirmé

📅 ${appointmentDetails.date} à ${appointmentDetails.time}
${appointmentDetails.location ? `📍 ${appointmentDetails.location}` : ""}
${appointmentDetails.contact ? `👤 ${appointmentDetails.contact}` : ""}

Pour modifier ou annuler, contactez-nous.`;

    return this.sendSMS(to, message);
  }

  /**
   * Envoie un rappel de RDV (J-1)
   */
  async sendAppointmentReminder(
    to: string,
    appointmentDetails: {
      date: string;
      time: string;
      location?: string;
    }
  ) {
    const message = `⏰ Rappel : Rendez-vous demain

📅 ${appointmentDetails.date} à ${appointmentDetails.time}
${appointmentDetails.location ? `📍 ${appointmentDetails.location}` : ""}

À bientôt !`;

    return this.sendSMS(to, message);
  }

  /**
   * Envoie une notification d'appel manqué
   */
  async sendMissedCallNotification(to: string, from: string, time: string) {
    const message = `📞 Appel manqué de ${from} à ${time}

Nous vous rappellerons bientôt.`;

    return this.sendSMS(to, message);
  }

  /**
   * Envoie un code de vérification 2FA
   */
  async send2FACode(to: string, code: string) {
    const message = `🔐 Votre code de vérification Zencall :

${code}

Valable 5 minutes. Ne partagez jamais ce code.`;

    return this.sendSMS(to, message);
  }

  /**
   * Récupère le statut d'un message
   */
  async getMessageStatus(messageSid: string) {
    try {
      const message = await this.client.messages(messageSid).fetch();
      return {
        success: true,
        status: message.status,
        errorCode: message.errorCode,
        errorMessage: message.errorMessage,
      };
    } catch (error: any) {
      console.error("Erreur récupération statut:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }
}

// Singleton
let twilioClient: TwilioClient | null = null;

export function getTwilioClient(): TwilioClient {
  if (!twilioClient) {
    twilioClient = new TwilioClient();
  }
  return twilioClient;
}

export { TwilioClient };
