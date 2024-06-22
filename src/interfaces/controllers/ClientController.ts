import { Request, Response } from 'express';
import { ClientService } from '../../application/services/ClientService';
import { ErrorCodes } from '../../utils/errorCodes';
import { errorResponse } from '../../utils/errorResponse';

export class ClientController {
  constructor(private clientService: ClientService) {}

  public async register(req: Request, res: Response): Promise<Response> {
    try {
      const client = await this.clientService.registerClient(req.body);
      return res.status(201).json(client); // 201 Created
    } catch (error: any) {
      if (error.message === 'Dados do cliente inválidos') {
        return errorResponse(res, 400, ErrorCodes.VALIDATION_ERROR, error.message); // 400 Bad Request
      }
      if (error.message === 'Cliente com o mesmo email ou telefone já existe') {
        return errorResponse(res, 400, ErrorCodes.DUPLICATE_CLIENT, error.message); // 400 Bad Request
      }
      if (error.message === 'CEP não encontrado') {
        return errorResponse(res, 400, ErrorCodes.ADDRESS_NOT_FOUND, error.message); // 400 Bad Request
      }
      return errorResponse(res, 500, ErrorCodes.INTERNAL_SERVER_ERROR, 'Internal server error'); // 500 Internal Server Error
    }
  }

  public async list(req: Request, res: Response): Promise<Response> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const clients = await this.clientService.listClients(page, limit);
      return res.status(200).json(clients); // 200 OK
    } catch (error: any) {
      return errorResponse(res, 400, ErrorCodes.VALIDATION_ERROR, error.message); // 400 Bad Request
    }
  }

  public async getById(req: Request, res: Response): Promise<Response> {
    try {
      const client = await this.clientService.getClientById(req.params.id);
      if (!client) {
        return errorResponse(res, 404, ErrorCodes.CLIENT_NOT_FOUND, 'Cliente não encontrado'); // 404 Not Found
      }
      return res.status(200).json(client); // 200 OK
    } catch (error: any) {
      return errorResponse(res, 400, ErrorCodes.VALIDATION_ERROR, error.message); // 400 Bad Request
    }
  }

  public async delete(req: Request, res: Response): Promise<Response> {
    try {
      const client = await this.clientService.getClientById(req.params.id);
      if (!client) {
        return errorResponse(res, 404, ErrorCodes.CLIENT_NOT_FOUND, 'Cliente não encontrado'); // 404 Not Found
      }
      await this.clientService.deleteClientById(req.params.id);
      return res.status(200).json({ message: 'Cliente deletado com sucesso' }); // 200 OK
    } catch (error: any) {
      return errorResponse(res, 400, ErrorCodes.VALIDATION_ERROR, error.message); // 400 Bad Request
    }
  }

  public async search(req: Request, res: Response): Promise<Response> {
    try {
      const name = req.query.name as string;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const clients = await this.clientService.searchClientsByName(name, page, limit);
      return res.status(200).json(clients); // 200 OK
    } catch (error: any) {
      return errorResponse(res, 400, ErrorCodes.VALIDATION_ERROR, error.message); // 400 Bad Request
    }
  }
}
