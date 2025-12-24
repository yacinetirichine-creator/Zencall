import { NextRequest, NextResponse } from "next/server";
import { getVapiClient } from "@/lib/vapi/client";

/**
 * Crée un assistant dans VAPI
 * Route interne appelée depuis le frontend lors de la création d'assistant
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, type, language, system_prompt, first_message } = body;

    // Validation basique
    if (!name || !type || !language) {
      return NextResponse.json(
        { error: "Paramètres manquants" },
        { status: 400 }
      );
    }

    const vapiClient = getVapiClient();

    // Configuration du modèle selon le type
    const modelConfig = {
      provider: "openai",
      model: "gpt-4",
      systemPrompt: system_prompt || getDefaultPrompt(type),
      temperature: 0.7,
    };

    // Configuration de la voix selon la langue
    const voiceConfig = getVoiceConfig(language);

    // Créer l'assistant dans VAPI
    const assistant = await vapiClient.createAssistant({
      name,
      model: modelConfig,
      voice: voiceConfig,
      firstMessage: first_message || "Bonjour, comment puis-je vous aider ?",
      transcriber: {
        provider: "deepgram",
        language: getDeepgramLanguage(language),
      },
      serverUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/vapi/webhook`,
    });

    return NextResponse.json({
      success: true,
      vapi_assistant_id: assistant.id,
    });
  } catch (error: any) {
    console.error("Erreur création assistant VAPI:", error);
    return NextResponse.json(
      { error: error.message || "Erreur interne" },
      { status: 500 }
    );
  }
}

/**
 * Met à jour un assistant dans VAPI
 */
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { vapi_assistant_id, ...updates } = body;

    if (!vapi_assistant_id) {
      return NextResponse.json(
        { error: "vapi_assistant_id requis" },
        { status: 400 }
      );
    }

    const vapiClient = getVapiClient();

    // Préparer les mises à jour VAPI
    const vapiUpdates: any = {};
    
    if (updates.system_prompt) {
      vapiUpdates.model = {
        messages: [{ role: "system", content: updates.system_prompt }],
      };
    }
    
    if (updates.first_message) {
      vapiUpdates.firstMessage = updates.first_message;
    }

    if (updates.language) {
      vapiUpdates.voice = getVoiceConfig(updates.language);
      vapiUpdates.transcriber = {
        provider: "deepgram",
        language: getDeepgramLanguage(updates.language),
      };
    }

    await vapiClient.updateAssistant(vapi_assistant_id, vapiUpdates);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Erreur mise à jour assistant VAPI:", error);
    return NextResponse.json(
      { error: error.message || "Erreur interne" },
      { status: 500 }
    );
  }
}

/**
 * Supprime un assistant dans VAPI
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const vapi_assistant_id = searchParams.get("id");

    if (!vapi_assistant_id) {
      return NextResponse.json(
        { error: "vapi_assistant_id requis" },
        { status: 400 }
      );
    }

    const vapiClient = getVapiClient();
    await vapiClient.deleteAssistant(vapi_assistant_id);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Erreur suppression assistant VAPI:", error);
    return NextResponse.json(
      { error: error.message || "Erreur interne" },
      { status: 500 }
    );
  }
}

// =============================================
// HELPERS
// =============================================

function getDefaultPrompt(type: string): string {
  const prompts: Record<string, string> = {
    astreinte: `Tu es un assistant d'astreinte téléphonique. Tu dois :
1. Identifier l'urgence de l'appel
2. Collecter les informations nécessaires (nom, numéro, nature du problème)
3. Transférer les appels urgents au numéro d'astreinte
4. Prendre un message pour les demandes non urgentes`,
    
    rdv: `Tu es un assistant de prise de rendez-vous. Tu dois :
1. Demander le motif du rendez-vous
2. Proposer les créneaux disponibles
3. Confirmer le rendez-vous avec les détails (date, heure, lieu)
4. Envoyer un rappel par SMS`,
    
    info: `Tu es un assistant d'information client. Tu dois :
1. Répondre aux questions fréquentes
2. Orienter vers le bon service si nécessaire
3. Prendre un message si tu ne peux pas répondre`,
    
    outbound: `Tu es un assistant pour des appels sortants. Tu dois :
1. Te présenter clairement
2. Expliquer l'objet de l'appel
3. Collecter les informations demandées
4. Remercier et conclure poliment`,
  };

  return prompts[type] || prompts.info;
}

function getVoiceConfig(language: string) {
  const voices: Record<string, { provider: string; voiceId: string }> = {
    fr: { provider: "11labs", voiceId: "21m00Tcm4TlvDq8ikWAM" }, // Rachel (voix féminine claire)
    en: { provider: "11labs", voiceId: "pNInz6obpgDQGcFmaJgB" }, // Adam
    es: { provider: "11labs", voiceId: "VR6AewLTigWG4xSOukaG" }, // Arnold (espagnol)
    nl: { provider: "11labs", voiceId: "nPczCjzI2devNBz1zQrb" }, // Brian
    ar: { provider: "11labs", voiceId: "onwK4e9ZLuTAKqWW03F9" }, // Daniel
  };

  return voices[language] || voices.fr;
}

function getDeepgramLanguage(language: string): string {
  const languageMap: Record<string, string> = {
    fr: "fr",
    en: "en-US",
    es: "es",
    nl: "nl",
    ar: "ar",
  };

  return languageMap[language] || "fr";
}
