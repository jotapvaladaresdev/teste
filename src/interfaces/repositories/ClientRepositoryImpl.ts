import { Client } from '../../domain/entities/Client';
import { ClientRepository } from '../../domain/repositories/ClientRepository';
import { Client as ClientModel } from '../../infrastructure/database/models/Client';

export class ClientRepositoryImpl implements ClientRepository {
  public async save(client: Client): Promise<Client> {
    const createdClient = new ClientModel(client);
    const savedClient = await createdClient.save();
    return savedClient.toObject();
  }

  public async findByCep(cep: string): Promise<Client | null> {
    const client = await ClientModel.findOne({ cep });
    return client ? client.toObject() : null;
  }

  public async findAll(page: number, limit: number): Promise<Client[]> {
    const clients = await ClientModel.find()
      .skip((page - 1) * limit)
      .limit(limit);
    return clients.map(client => client.toObject());
  }

  public async findById(id: string): Promise<Client | null> {
    const client = await ClientModel.findById(id);
    return client ? client.toObject() : null;
  }

  public async deleteById(id: string): Promise<void> {
    await ClientModel.findByIdAndDelete(id);
  }

  public async findByName(name: string, page: number, limit: number): Promise<Client[]> {
    const clients = await ClientModel.find({ name: new RegExp(name, 'i') })
      .skip((page - 1) * limit)
      .limit(limit);
    return clients.map(client => client.toObject());
  }

  public async findByEmailOrPhone(email: string, phone: string): Promise<Client | null> {
    const client = await ClientModel.findOne({ $or: [{ email }, { phone }] });
    return client ? client.toObject() : null;
  }
}
