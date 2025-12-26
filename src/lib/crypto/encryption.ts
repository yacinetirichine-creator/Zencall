import crypto from 'crypto';

/**
 * Chiffrement AES-256-GCM pour données sensibles (tokens OAuth, API keys, etc.)
 * Conforme RGPD Article 32 - Sécurité du traitement
 */

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;

/**
 * Récupère la clé de chiffrement depuis l'environnement
 * CRITICAL: Cette clé doit être un secret de 32 bytes (64 caractères hex)
 */
function getEncryptionKey(): Buffer {
  const key = process.env.ENCRYPTION_KEY;
  
  if (!key) {
    throw new Error('ENCRYPTION_KEY environment variable is not set');
  }
  
  if (key.length !== 64) {
    throw new Error('ENCRYPTION_KEY must be 64 hex characters (32 bytes)');
  }
  
  return Buffer.from(key, 'hex');
}

/**
 * Chiffre une chaîne de caractères
 * 
 * @param plaintext - Texte en clair à chiffrer
 * @returns Format: iv:authTag:encryptedData (tout en hex)
 * 
 * @example
 * const encrypted = encrypt('my-secret-token');
 * // Returns: "a1b2c3d4....:e5f6g7h8....:9i0j1k2l...."
 */
export function encrypt(plaintext: string): string {
  if (!plaintext) {
    throw new Error('Cannot encrypt empty string');
  }
  
  const key = getEncryptionKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  
  let encrypted = cipher.update(plaintext, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const authTag = cipher.getAuthTag();
  
  // Format: iv:authTag:encryptedData
  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
}

/**
 * Déchiffre une chaîne chiffrée
 * 
 * @param encryptedData - Données chiffrées au format iv:authTag:data
 * @returns Texte en clair original
 * 
 * @example
 * const decrypted = decrypt('a1b2c3d4....:e5f6g7h8....:9i0j1k2l....');
 * // Returns: "my-secret-token"
 */
export function decrypt(encryptedData: string): string {
  if (!encryptedData) {
    throw new Error('Cannot decrypt empty string');
  }
  
  const parts = encryptedData.split(':');
  if (parts.length !== 3) {
    throw new Error('Invalid encrypted data format. Expected format: iv:authTag:data');
  }
  
  const [ivHex, authTagHex, encrypted] = parts;
  
  const key = getEncryptionKey();
  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');
  
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);
  
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}

/**
 * Génère une clé de chiffrement sécurisée (à utiliser une seule fois)
 * 
 * @returns Clé de 32 bytes en hex (64 caractères)
 * 
 * @example
 * const key = generateEncryptionKey();
 * console.log(key); // "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6..."
 */
export function generateEncryptionKey(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Hash sécurisé pour données anonymisées (ex: user-agent dans analytics)
 * 
 * @param data - Données à hasher
 * @returns Hash SHA-256 (16 premiers caractères)
 */
export function hashForAnalytics(data: string): string {
  return crypto.createHash('sha256').update(data).digest('hex').slice(0, 16);
}

/**
 * Génération d'API key sécurisée
 * 
 * @returns Objet avec {key, hash, prefix}
 */
export function generateApiKey() {
  const key = `zc_${crypto.randomBytes(32).toString('base64url')}`;
  const prefix = key.slice(0, 10);
  
  // On ne stocke jamais la clé complète, seulement le hash
  const hash = crypto.createHash('sha256').update(key).digest('hex');
  
  return {
    key,        // À montrer UNE SEULE FOIS à l'utilisateur
    hash,       // À stocker en DB
    prefix,     // Pour l'indexation
  };
}
