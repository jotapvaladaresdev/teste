import { Address } from '../../domain/entities/Client';
import { AddressRepository } from '../../domain/repositories/AddressRepository';

const addresses: Address[] = [];

export class AddressRepositoryImpl implements AddressRepository {
  public async findByCep(cep: string): Promise<Address | null> {
    return addresses.find(address => address.cep === cep) || null;
  }

  public async save(address: Address): Promise<void> {
    addresses.push(address);
  }
}
