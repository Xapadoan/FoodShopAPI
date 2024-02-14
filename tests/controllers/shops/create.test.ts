import express from 'express';
import request from 'supertest';
import shopsRouter from '../../../src/controllers/shops';
import {
  Shop,
  Staff,
  ShopsRepository,
} from '../../../src/repo/ShopsRepository';
import { Entry } from '../../../src/repo/Repository';
import { expectResolvedValueMatch } from '../../utils';

const validShop = {
  name: 'I Got Ham !',
  address: '12 opera crossing 93320 Gotham',
};

const validStaff = {
  name: 'Justin',
  apiKey: '123-321',
};

const validResponse = {
  shop: {
    id: 1,
    ...validShop,
  },
  staff: {
    id: 1,
    ...validStaff,
  },
};

describe('Shops Create Controller', () => {
  const app = express();
  let createSpy: jest.SpyInstance<
    Promise<{ shop: Entry<Shop>; staff: Entry<Staff> }>,
    { shop: Shop; staff: Staff }[],
    unknown
  >;
  let validateSpy: jest.SpyInstance<boolean, Shop[], unknown>;
  let validateStaffSpy: jest.SpyInstance<boolean, Staff[], unknown>;
  beforeAll(() => {
    createSpy = jest
      .spyOn(ShopsRepository.prototype, 'createWithStaff')
      .mockResolvedValue(validResponse);
    validateSpy = jest
      .spyOn(ShopsRepository.prototype, 'validate')
      .mockReturnValue(true);
    validateStaffSpy = jest
      .spyOn(ShopsRepository.prototype, 'validateStaff')
      .mockReturnValue(true);
    app.use(express.json({ type: 'application/json' }));
    app.use('/', shopsRouter);
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should reject with 400 when shop is valid and staff is invalid', async () => {
    validateSpy.mockReturnValueOnce(true);
    validateStaffSpy.mockReturnValueOnce(false);
    const response = await request(app).post('/');
    expect(
      validateSpy.mock.calls.length + validateStaffSpy.mock.calls.length
    ).toBeGreaterThanOrEqual(1);
    expect(validateSpy).not.toHaveReturnedWith(false);
    expect(validateStaffSpy).not.toHaveReturnedWith(true);
    expect(createSpy).not.toHaveBeenCalled();
    expect(response.status).toEqual(400);
  });

  it('should reject with 400 when shop is invalid and staff is valid', async () => {
    validateSpy.mockReturnValueOnce(false);
    validateStaffSpy.mockReturnValueOnce(true);
    const response = await request(app).post('/');
    expect(
      validateSpy.mock.calls.length + validateStaffSpy.mock.calls.length
    ).toBeGreaterThanOrEqual(1);
    expect(validateSpy).not.toHaveReturnedWith(true);
    expect(validateStaffSpy).not.toHaveReturnedWith(false);
    expect(createSpy).not.toHaveBeenCalled();
    expect(response.status).toEqual(400);
  });

  it('should create a shop and first staff when called with valid payload', async () => {
    const response = await request(app)
      .post('/')
      .send({ shop: validShop, staff: validStaff });
    expect(validateSpy).toHaveBeenCalledTimes(1);
    expect(validateSpy).toHaveBeenCalledWith(validShop);
    expect(validateSpy).toHaveReturnedWith(true);
    expect(validateStaffSpy).toHaveBeenCalledTimes(1);
    expect(validateStaffSpy).toHaveBeenCalledWith(validStaff);
    expect(validateStaffSpy).toHaveReturnedWith(true);
    expect(createSpy).toHaveBeenCalledTimes(1);
    expect(createSpy).toHaveBeenCalledWith({
      shop: validShop,
      staff: validStaff,
    });
    await expectResolvedValueMatch(createSpy, validResponse);
    expect(response.status).toEqual(201);
    expect(response.body).toMatchObject(validResponse);
  });

  it('should return 500 if anything throws', async () => {
    validateSpy.mockImplementationOnce((_) => {
      throw new Error('Intentional validation error');
    });
    validateStaffSpy.mockImplementationOnce((_) => {
      throw new Error('Intentional validation error');
    });
    createSpy.mockImplementationOnce((_) => {
      throw new Error('Intentional creation error');
    });
    const responses = await Promise.all([
      request(app).post('/').send({ shop: validShop, staff: validStaff }),
      request(app).post('/').send({ shop: validShop, staff: validStaff }),
      request(app).post('/').send({ shop: validShop, staff: validStaff }),
    ]);
    responses.forEach((res) => {
      expect(res.status).toEqual(500);
    });
  });
});
