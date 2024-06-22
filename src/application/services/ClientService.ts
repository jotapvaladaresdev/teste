import { Client, Address } from '../../domain/entities/Client';
import { ClientRepository } from '../../domain/repositories/ClientRepository';
import { AddressRepository } from '../../domain/repositories/AddressRepository';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import redisClient from '../../infrastructure/cache/redisClient';

export class ClientService {
  constructor(
    private clientRepository: ClientRepository,
    private addressRepository: AddressRepository
  ) {}

  public async registerClient(client: Client): Promise<Client> {
    // Verificação de campos obrigatórios e formato
    if (!client.name || !client.email || !client.cep || !client.phone) {
      throw new Error('Dados do cliente inválidos');
    }

    // Verificar se o cliente já existe
    const existingClient = await this.clientRepository.findByEmailOrPhone(client.email, client.phone);
    if (existingClient) {
      throw new Error('Cliente com o mesmo email ou telefone já existe');
    }

    let address = await this.getCachedAddress(client.cep);
    if (!address) {
      address = await this.fetchAddress(client.cep);
      if (!address) {
        throw new Error('CEP não encontrado');
      }

      await this.cacheAddress(client.cep, address);
      await this.addressRepository.save(address);
    }

    client.id = uuidv4();
    client.address = address;
    return this.clientRepository.save(client);
  }

  private async fetchAddress(cep: string): Promise<Address | null> {
    const services = [
      this.fetchAddressFromViaCEP,
      this.fetchAddressFromApiCEP,
    ];

    for (const service of services) {
      try {
        const address = await service(cep);
        if (address) return address;
      } catch (error) {
        console.error(`Error fetching address from ${service.name}:`, error);
      }
    }

    return null;
  }

  private async fetchAddressFromViaCEP(cep: string): Promise<Address | null> {
    const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
    if (response.data.erro) {
        return null;
    }
    return {
        cep: cep,
        street: response.data.logradouro || '',
        neighborhood: response.data.bairro || '',
        city: response.data.localidade || '',
        state: response.data.uf || '',
    };
  }

  private async fetchAddressFromApiCEP(cep: string): Promise<Address | null> {
    const response = await axios.get(`https://cdn.apicep.com/file/apicep/${cep}.json`);
    if (response.data.status !== 200) {
        return null;
    }
    return {
        cep: cep,
        street: response.data.address || '',
        neighborhood: response.data.district || '',
        city: response.data.city || '',
        state: response.data.state || '',
    };
  }

  private async getCachedAddress(cep: string): Promise<Address | null> {
    const cachedAddress = await redisClient.get(cep);
    return cachedAddress ? JSON.parse(cachedAddress) : null;
  }

  private async cacheAddress(cep: string, address: Address): Promise<void> {
    await redisClient.set(cep, JSON.stringify(address), {
      EX: 60 * 60 * 24, // Cache for 24 hours
    });
  }

  public async listClients(page: number, limit: number): Promise<Client[]> {
    return this.clientRepository.findAll(page, limit);
  }

  public async getClientById(id: string): Promise<Client | null> {
    return this.clientRepository.findById(id);
  }

  public async deleteClientById(id: string): Promise<void> {
    return this.clientRepository.deleteById(id);
  }

  public async searchClientsByName(name: string, page: number, limit: number): Promise<Client[]> {
    return this.clientRepository.findByName(name, page, limit);
  }
}
