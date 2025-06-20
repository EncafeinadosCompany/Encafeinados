import CryptoJS from 'crypto-js';

const secret = import.meta.env.VITE_SECRET_KEY as string;


export function saveEncryptedItem<T>(key: string, value: T): void {
  const encrypted = CryptoJS.AES.encrypt(JSON.stringify(value), secret).toString();
  localStorage.setItem(key, encrypted);
}


export function getEncryptedItem<T>(key: string): T | null {
  const encrypted = localStorage.getItem(key);
  if (!encrypted) return null;

  try {
    const bytes = CryptoJS.AES.decrypt(encrypted, secret);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decrypted) as T;
  } catch (err) {
    console.error('Error al desencriptar', err);
    return null;
  }
}

export function removeEncryptedItem(key: string): void {
  localStorage.removeItem(key);
}
