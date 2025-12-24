import { createAdminClient } from "@/lib/supabase/server";
import { getTwilioClient } from "@/lib/twilio/client";

/**
 * Service de notifications unifié (Email + SMS + Push)
 */
export class NotificationService {
  /**
   * Envoie une notification (choisit automatiquement le canal)
   */
  static async send(params: {
    organizationId: string;
    userId?: string;
    type: "email" | "sms" | "push";
    title: string;
    message: string;
    recipientEmail?: string;
    recipientPhone?: string;
    data?: Record<string, any>;
  }) {
    const supabase = await createAdminClient();

    // Créer la notification en base
    const { data: notification } = await supabase
      .from("notifications")
      .insert({
        organization_id: params.organizationId,
        user_id: params.userId,
        type: params.type,
        title: params.title,
        message: params.message,
        recipient_email: params.recipientEmail,
        recipient_phone: params.recipientPhone,
        status: "pending",
        data: params.data || {},
      })
      .select()
      .single();

    if (!notification) {
      throw new Error("Erreur création notification");
    }

    // Envoyer selon le type
    try {
      if (params.type === "sms" && params.recipientPhone) {
        await this.sendSMS(notification.id, params.recipientPhone, params.message);
      } else if (params.type === "email" && params.recipientEmail) {
        await this.sendEmail(notification.id, params.recipientEmail, params.title, params.message);
      } else if (params.type === "push") {
        await this.sendPush(notification.id, params.userId!, params.title, params.message);
      }

      return { success: true, notification };
    } catch (error) {
      // Marquer comme échouée
      await supabase
        .from("notifications")
        .update({
          status: "failed",
          error: error instanceof Error ? error.message : "Erreur inconnue",
        })
        .eq("id", notification.id);

      throw error;
    }
  }

  /**
   * Envoie un SMS via Twilio
   */
  private static async sendSMS(notificationId: string, to: string, message: string) {
    const twilioClient = getTwilioClient();
    const result = await twilioClient.sendSMS(to, message);

    const supabase = await createAdminClient();
    
    if (result.success) {
      await supabase
        .from("notifications")
        .update({
          status: "sent",
          data: { twilio_message_sid: result.sid },
          sent_at: new Date().toISOString(),
        })
        .eq("id", notificationId);
    } else {
      await supabase
        .from("notifications")
        .update({
          status: "failed",
          error: result.error,
        })
        .eq("id", notificationId);
    }

    return result;
  }

  /**
   * Envoie un email via SMTP
   */
  private static async sendEmail(
    notificationId: string,
    to: string,
    subject: string,
    body: string
  ) {
    // TODO: Implémenter l'envoi d'email via SMTP (nodemailer, Resend, etc.)
    console.log(`Envoi email à ${to}: ${subject}`);
    
    const supabase = await createAdminClient();
    await supabase
      .from("notifications")
      .update({
        status: "sent",
        sent_at: new Date().toISOString(),
      })
      .eq("id", notificationId);
  }

  /**
   * Envoie une notification push
   */
  private static async sendPush(
    notificationId: string,
    userId: string,
    title: string,
    message: string
  ) {
    // Utiliser Supabase Realtime pour les notifications push
    const supabase = await createAdminClient();
    
    await supabase
      .from("notifications")
      .update({
        status: "delivered",
        sent_at: new Date().toISOString(),
        delivered_at: new Date().toISOString(),
      })
      .eq("id", notificationId);

    // Le frontend écoutera les changements sur la table notifications
  }

  /**
   * Envoie une confirmation de RDV par SMS
   */
  static async sendAppointmentConfirmation(params: {
    organizationId: string;
    phone: string;
    appointmentDate: string;
    appointmentTime: string;
    location?: string;
  }) {
    const twilioClient = getTwilioClient();
    
    return await this.send({
      organizationId: params.organizationId,
      type: "sms",
      title: "Confirmation RDV",
      message: `✅ Rendez-vous confirmé le ${params.appointmentDate} à ${params.appointmentTime}${
        params.location ? ` - ${params.location}` : ""
      }`,
      recipientPhone: params.phone,
    });
  }

  /**
   * Envoie un rappel de RDV (J-1)
   */
  static async sendAppointmentReminder(params: {
    organizationId: string;
    phone: string;
    appointmentDate: string;
    appointmentTime: string;
  }) {
    return await this.send({
      organizationId: params.organizationId,
      type: "sms",
      title: "Rappel RDV",
      message: `⏰ Rappel : Rendez-vous demain ${params.appointmentDate} à ${params.appointmentTime}`,
      recipientPhone: params.phone,
    });
  }
}
