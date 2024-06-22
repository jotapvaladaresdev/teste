import { Address } from '../entities/Client';

export interface AddressRepository {
  findByCep(cep: string): Promise<Address | null>;
  save(address: Address): Promise<void>;
}
