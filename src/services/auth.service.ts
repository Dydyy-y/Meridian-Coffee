import { BaseService } from './base.service';
import { getHeaders } from './api';
import type { AuthUser, SignUpRequest, SignInRequest, SignInResponse } from '../types/auth.types';

class AuthService extends BaseService<AuthUser> {
  constructor() {
    super('/users');
  }

  /**
   * @param data données du formulaire d'inscription
   * @returns l'utilisateur créé
   */
  async signup(data: SignUpRequest): Promise<AuthUser> {
    try {
      console.log('Signing up user:', data.emailAddress);

      const response = await fetch(this.buildUrl('/signup'), {
        method: 'POST',
        headers: getHeaders({
          includeAuth: false,   // pas de token au signup, on n'est pas encore connecté
          contentType: 'json',
        }),
        body: JSON.stringify(data),
      });

      // Gestion erreur
      if (!response.ok) {
        const errorText = await response.text();
        let message = `Erreur lors de l'inscription (${response.status})`;
        try {
          // Essayer de parser comme JSON
          const errorJson = JSON.parse(errorText);
          if (errorJson.name === 'SequelizeValidationError' && Array.isArray(errorJson.errors) && errorJson.errors.length > 0) {
            // Traduire les erreurs de validation Sequelize
            const first = errorJson.errors[0];
            if (first.path === 'emailAddress' && first.validatorName === 'isEmail') {
              message = 'Adresse email invalide. Utilisez le format : example@email.com';
            } else if (first.path === 'emailAddress' && first.type === 'unique violation') {
              message = 'Cette adresse email est déjà utilisée.';
            } else {
              message = first.message ?? message;
            }
          } else if (response.status === 409 || errorJson.error === 'Email déjà utilisé') {
            message = 'Cette adresse email est déjà utilisée. Essayez de vous connecter.';
          } else {
            message = errorJson.message || errorJson.error || message;
          }
        } catch {
          //message générique
        }
        throw new Error(message);
      }

      return await this.handleResponse<AuthUser>(response);
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    }
  }

  /**
   * @param data email + mot de passe
   * @returns token JWT + infos utilisateur
   */
  async signin(data: SignInRequest): Promise<SignInResponse> {
    try {
      console.log('Signing in user:', data.emailAddress);

      const response = await fetch(this.buildUrl('/signin'), {
        method: 'POST',
        headers: getHeaders({
          includeAuth: false,   // pas de token au signin
          contentType: 'json',
        }),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorText = await response.text(); // On utilise .text() pour éviter une erreur de parsing JSON
        let message = errorText;
        try {
          const errorJson = JSON.parse(errorText);
          message = errorJson.message || errorJson.error || message;
        } catch {
          //garder le texte brut
        }
        throw new Error(message);
      }

      return await this.handleResponse<SignInResponse>(response);
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  }
}

export const authService = new AuthService();