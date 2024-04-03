import express from 'express';
import request from 'supertest';
import ingredientsRouter from '../../../src/controllers/ingredients';
import {
  Ingredient,
  IngredientsRepository,
} from '../../../src/repo/IngredientsRepository';
import { Entry } from '../../../src/repo/Repository';
import { expectResolved } from '../../utils';

const validPayload = { name: 'apples ' };
const validResponse = { id: 1, ...validPayload };

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
      .mockResolvedValue(validResponse);
    validateSpy = jest
      .spyOn(IngredientsRepository.prototype, 'validate')
      .mockReturnValue(true);
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
    validateSpy.mockReturnValueOnce(false);
    const response = await request(app).post('/').send(validPayload);
    expect(validateSpy).toHaveBeenCalledTimes(1);
    expect(validateSpy).toHaveBeenCalledWith(validPayload);
    expect(validateSpy).toHaveReturnedWith(false);
    expect(createSpy).not.toHaveBeenCalled();
    expect(response.status).toEqual(400);
  });

  it('should create an ingredient when called with valid payload', async () => {
    const response = await request(app).post('/').send(validPayload);
    expect(validateSpy).toHaveBeenCalledTimes(1);
    expect(validateSpy).toHaveBeenCalledWith(validPayload);
    expect(validateSpy).toHaveReturnedWith(true);
    expect(createSpy).toHaveBeenCalledTimes(1);
    expect(createSpy).toHaveBeenCalledWith(validPayload);
    expectResolved(createSpy).toMatchObject(validResponse);
    expect(response.status).toEqual(201);
    expect(response.body).toMatchObject(validResponse);
  });

  it('should return 500 if anything throws', async () => {
    validateSpy.mockImplementationOnce((_) => {
      throw new Error('Intentional validation error');
    });
    createSpy.mockImplementationOnce((_) => {
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
  });
});
