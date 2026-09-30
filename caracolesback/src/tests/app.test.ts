import request from 'supertest';
import app from '../app';

// Mock del objeto de la base de datos para no hacer consultas reales
jest.mock('../config/database', () => ({
  __esModule: true,
  pool: {
    query: jest.fn()
  }
}));

import { pool } from '../config/database';

describe('Backend API Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rutas 404 (No encontradas)', () => {
    it('Debe devolver 404 para una ruta que no existe', async () => {
      const response = await request(app).get('/api/ruta-que-no-existe');
      expect(response.status).toBe(404);
    });
  });

  describe('Auth Routes (/api/auth)', () => {
    it('Debe fallar al intentar iniciar sesión sin enviar el password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@example.com' }); // Falta el password

      // Dependiendo de tu lógica, asumo que envías un error 400 por validación de Joi/datos faltantes
      expect(response.status).toBeGreaterThanOrEqual(400);
    });

    it('Debe rechazar credenciales incorrectas', async () => {
      // Configuramos el mock de la BD para devolver "ningún usuario encontrado"
      (pool.query as jest.Mock).mockResolvedValue({ rows: [] });

      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'noexiste@ejemplo.com', password: 'password123' });

      // Cuando el usuario no existe, normalmente devuelve un 401, 400 o 404
      expect(response.status).toBeGreaterThanOrEqual(400);
      expect(pool.query).toHaveBeenCalledTimes(1); // Verifica que sí intentó consultar la BD
    });
  });
});
