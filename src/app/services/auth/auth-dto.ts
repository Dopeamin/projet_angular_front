export interface AuthDTO {
  firstName: string;
  lastName: string;
  gender: string;
  email: string;
  password: string;
  encryptedPrivateKey: string;
  publicKey: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}