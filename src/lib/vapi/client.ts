const VAPI_API_URL = "https://api.vapi.ai";

class VapiClient {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${VAPI_API_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
        ...options.headers,
      },
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `Vapi error: ${response.status}`);
    }
    return response.json();
  }

  async createAssistant(params: {
    name: string;
    model: { provider: string; model: string; systemPrompt: string; temperature?: number };
    voice: { provider: string; voiceId: string };
    firstMessage: string;
    transcriber?: { provider: string; language: string };
    serverUrl?: string;
  }) {
    return this.request<{ id: string }>("/assistant", {
      method: "POST",
      body: JSON.stringify({
        name: params.name,
        model: {
          provider: params.model.provider,
          model: params.model.model,
          messages: [{ role: "system", content: params.model.systemPrompt }],
          temperature: params.model.temperature ?? 0.7,
        },
        voice: params.voice,
        firstMessage: params.firstMessage,
        transcriber: params.transcriber ?? { provider: "deepgram", language: "fr" },
        serverUrl: params.serverUrl,
        endCallFunctionEnabled: true,
      }),
    });
  }

  async getAssistant(id: string) {
    return this.request<{ id: string; name: string }>(`/assistant/${id}`);
  }

  async updateAssistant(id: string, params: Record<string, unknown>) {
    return this.request<{ id: string }>(`/assistant/${id}`, {
      method: "PATCH",
      body: JSON.stringify(params),
    });
  }

  async deleteAssistant(id: string) {
    return this.request(`/assistant/${id}`, { method: "DELETE" });
  }

  async createCall(params: { assistantId: string; customer: { number: string; name?: string } }) {
    return this.request<{ id: string; status: string }>("/call/phone", {
      method: "POST",
      body: JSON.stringify(params),
    });
  }

  async getCall(id: string) {
    return this.request<{
      id: string;
      status: string;
      duration?: number;
      transcript?: string;
      recordingUrl?: string;
    }>(`/call/${id}`);
  }
}

let client: VapiClient | null = null;

export function getVapiClient(): VapiClient {
  if (!client) {
    const apiKey = process.env.VAPI_API_KEY;
    if (!apiKey) throw new Error("VAPI_API_KEY not configured");
    client = new VapiClient(apiKey);
  }
  return client;
}

export { VapiClient };
