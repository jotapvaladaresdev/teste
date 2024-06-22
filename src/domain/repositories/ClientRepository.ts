import { Client } from '../entities/Client';

export interface ClientRepository {
  save(client: Client): Promise<Client>;
  findByCep(cep: string): Promise<Client | null>;
  findAll(page: number, limit: number): Promise<Client[]>;
  findById(id: string): Promise<Client | null>;
  deleteById(id: string): Promise<void>;
  findByName(name: string, page: number, limit: number): Promise<Client[]>;
  findByEmailOrPhone(email: string, phone: string): Promise<Client | null>; // Adicionado
}
