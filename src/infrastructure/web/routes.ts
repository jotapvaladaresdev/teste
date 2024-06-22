import { Router } from 'express';
import { ClientController } from '../../interfaces/controllers/ClientController';
import { ClientService } from '../../application/services/ClientService';
import { ClientRepositoryImpl } from '../../interfaces/repositories/ClientRepositoryImpl';
import { AddressRepositoryImpl } from '../../interfaces/repositories/AddressRepositoryImpl';

const clientRepository = new ClientRepositoryImpl();
const addressRepository = new AddressRepositoryImpl();
const clientService = new ClientService(clientRepository, addressRepository);
const clientController = new ClientController(clientService);

const router = Router();

router.post('/api/v1/clients', (req, res) => clientController.register(req, res));
router.get('/api/v1/clients', (req, res) => clientController.list(req, res));
router.get('/api/v1/clients/:id', (req, res) => clientController.getById(req, res));
router.delete('/api/v1/clients/:id', (req, res) => clientController.delete(req, res));
router.get('/api/v1/search', (req, res) => clientController.search(req, res)); // Adicionado

export default router;
