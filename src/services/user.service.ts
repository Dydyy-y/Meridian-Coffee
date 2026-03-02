import { BaseService } from './base.service';
import { getHeaders } from './api';
import type { AuthUser, UserUpdate } from '../types/auth.types';

class UserService extends BaseService<AuthUser> {
  constructor() {
    // endpoint '/users' → URLs : {baseUrl}/users/{id}
    super('/users');
  }

  async getById(id: number): Promise<AuthUser> {
    try {
      const response = await fetch(this.buildUrl(`/${id}`), {
        method: 'GET',
        headers: getHeaders({
          includeAuth: true,    // JWT obligatoire
          contentType: 'none',
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        let message = errorText;
        try {
          const errorJson = JSON.parse(errorText);
          message = errorJson.message || errorJson.error || message;
        } catch {
          //...
        }
        throw new Error(message || `Erreur ${response.status}`);
      }

      return await this.handleResponse<AuthUser>(response);
    } catch (error) {
      console.error(`Error fetching user ${id}:`, error);
      throw error;
    }
  }

  async update(id: number, data: UserUpdate): Promise<AuthUser> {
    try {
      const response = await fetch(this.buildUrl(`/${id}`), {
        method: 'PUT',
        headers: getHeaders({
          includeAuth: true,    // JWT obligatoire
          contentType: 'json',
        }),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorText = await response.text();
        let message = errorText;
        try {
          const errorJson = JSON.parse(errorText);
          message = errorJson.message || errorJson.error || message;
        } catch {
          // text/plain — garder tel quel
        }
        throw new Error(message || `Erreur ${response.status}`);
      }

      return await this.handleResponse<AuthUser>(response);
    } catch (error) {
      console.error(`Error updating user ${id}:`, error);
      throw error;
    }
  }
}

// Singleton exporté
export const userService = new UserService();
