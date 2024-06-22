import { ClientService } from '../src/application/services/ClientService';
import { ClientRepository } from '../src/domain/repositories/ClientRepository';
import { AddressRepository } from '../src/domain/repositories/AddressRepository';
import { Client } from '../src/domain/entities/Client';
import axios from 'axios';
import redisClient from '../src/infrastructure/cache/redisClient';

jest.mock('axios');
jest.mock('../src/infrastructure/cache/redisClient', () => ({
  get: jest.fn(),
  set: jest.fn(),
}));

const mockClientRepository: ClientRepository = {
  save: jest.fn(),
  findByCep: jest.fn(),
  findAll: jest.fn(),
  findById: jest.fn(),
  deleteById: jest.fn(),
  findByName: jest.fn(),
  findByEmailOrPhone: jest.fn(),
};

const mockAddressRepository: AddressRepository = {
  save: jest.fn(),
  findByCep: jest.fn(),
};

describe('ClientService', () => {
  let clientService: ClientService;

  beforeEach(() => {
    clientService = new ClientService(mockClientRepository, mockAddressRepository);
    jest.clearAllMocks();
  });

  it('should register a new client', async () => {
    const clientData = {
      name: 'João',
      email: 'joao@example.com',
      phone: '1199887766',
      cep: '01001000',
    };

    const addressData = {
      cep: '01001000',
      street: 'Praça da Sé',
      neighborhood: 'Sé',
      city: 'São Paulo',
      state: 'SP',
    };

    console.log('Mock setup started');
    (axios.get as jest.Mock).mockResolvedValueOnce({
      data: {
        cep: '01001000',
        logradouro: 'Praça da Sé',
        bairro: 'Sé',
        localidade: 'São Paulo',
        uf: 'SP'
      }
    });
    (redisClient.get as jest.Mock).mockResolvedValueOnce(null);
    (redisClient.set as jest.Mock).mockResolvedValueOnce('OK');
    (mockClientRepository.findByEmailOrPhone as jest.Mock).mockResolvedValueOnce(null);
    (mockClientRepository.save as jest.Mock).mockResolvedValueOnce({
      ...clientData,
      id: 'some-unique-id',
      address: addressData,
    });

    console.log('Mocks setup completed');

    const result = await clientService.registerClient(clientData as Client);

    console.log('Result:', result);

    expect(result).toHaveProperty('id', 'some-unique-id');
    expect(result).toHaveProperty('name', 'João');
    expect(result).toHaveProperty('email', 'joao@example.com');
    expect(result).toHaveProperty('phone', '1199887766');
    expect(result).toHaveProperty('address', addressData);

    console.log('Expectations setup started');

    expect(mockClientRepository.findByEmailOrPhone).toHaveBeenCalledWith('joao@example.com', '1199887766');
    expect(redisClient.get).toHaveBeenCalledWith('01001000');
    expect(axios.get).toHaveBeenCalledWith('https://viacep.com.br/ws/01001000/json/');

    const expectedRedisData = JSON.stringify(addressData);
    const actualRedisCall = (redisClient.set as jest.Mock).mock.calls[0];
    console.log('Expected redis set:', '01001000', expectedRedisData, { EX: 60 * 60 * 24 });
    console.log('Actual redis set call:', actualRedisCall);

    expect(actualRedisCall).toEqual(['01001000', expectedRedisData, { EX: 60 * 60 * 24 }]);
    expect(mockClientRepository.save).toHaveBeenCalledWith(expect.objectContaining({
      name: 'João',
      email: 'joao@example.com',
      phone: '1199887766',
      address: addressData,
    }));

    console.log('Expectations setup completed');
  });

  it('should not register a duplicate client', async () => {
    const clientData = {
      name: 'João',
      email: 'joao@example.com',
      phone: '1199887766',
      cep: '01001000',
    };

    (mockClientRepository.findByEmailOrPhone as jest.Mock).mockResolvedValueOnce(clientData);

    await expect(clientService.registerClient(clientData as Client)).rejects.toThrow('Cliente com o mesmo email ou telefone já existe');

    expect(mockClientRepository.findByEmailOrPhone).toHaveBeenCalledWith('joao@example.com', '1199887766');
    expect(mockClientRepository.save).not.toHaveBeenCalled();
  });

  it('should throw an error if client data is invalid', async () => {
    const clientData = {
      name: '',
      email: 'invalid-email',
      phone: 'invalid-phone',
      cep: '01001000',
    };

    await expect(clientService.registerClient(clientData as Client)).rejects.toThrow('Dados do cliente inválidos');

    expect(mockClientRepository.findByEmailOrPhone).not.toHaveBeenCalled();
    expect(mockClientRepository.save).not.toHaveBeenCalled();
  });
});
