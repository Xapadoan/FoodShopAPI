import express from 'express';
import request from 'supertest';
import ingredientsRouter from '../../../src/controllers/ingredients';
import {
  Ingredient,
  IngredientsRepository,
} from '../../../src/repo/IngredientsRepository';
import { Entry } from '../../../src/repo/Repository';

describe('Ingredients Create Controller', () => {
  const app = express();
  let createSpy: jest.SpyInstance<
    Promise<Entry<Ingredient>>,
    Ingredient[],
    unknown
  >;
  let validateSpy: jest.SpyInstance<boolean, Ingredient[], unknown>;
  beforeAll(() => {
    createSpy = jest
      .spyOn(IngredientsRepository.prototype, 'create')
      .mockImplementation(async (ingredient) => ({ id: 1, ...ingredient }));
    validateSpy = jest.spyOn(IngredientsRepository.prototype, 'validate');
    app.use(express.json({ type: 'application/json' }));
    app.use('/', ingredientsRouter);
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should reject invalid payload with 400', async () => {
    try {
      const responses = await Promise.all([
        request(app).post('/').send('Hello !'),
        request(app).post('/').send({ kilo: 'asd' }),
        request(app).post('/').send({ name: 123 }),
        request(app).post('/').send({ name: {} }),
      ]);
      expect(validateSpy).toHaveBeenCalledTimes(responses.length);
      expect(createSpy).not.toHaveBeenCalled();
      responses.forEach((res) => {
        expect(res.status).toEqual(400);
      });
    } catch {
      expect(false).toBeTruthy();
    }
  });

  it('should create an ingredient when called with valid payload', async () => {
    try {
      const response = await request(app).post('/').send({ name: 'apples' });
      expect(response.status).toEqual(201);
      expect(response.body.id).toEqual(1);
      expect(response.body.name).toEqual('apples');
      expect(validateSpy).toHaveBeenCalledTimes(1);
      expect(createSpy).toHaveBeenCalledTimes(1);
    } catch {
      expect(false).toBeTruthy();
    }
  });

  it('should return 500 if anything throws', async () => {
    try {
      validateSpy.mockImplementationOnce((_: Ingredient) => {
        throw new Error('Intentional validation error');
      });
      createSpy.mockImplementationOnce((_: Ingredient) => {
        throw new Error('Intentional creation error');
      });
      const responses = await Promise.all([
        request(app).post('/').send({ name: 'apples' }),
        request(app).post('/').send({ name: 'apples' }),
      ]);
      expect(validateSpy).toHaveBeenCalledTimes(2);
      expect(createSpy).toHaveBeenCalledTimes(1);
      responses.forEach((res) => {
        expect(res.status).toEqual(500);
      });
    } catch {
      expect(false).toBeTruthy();
    }
  });
});
