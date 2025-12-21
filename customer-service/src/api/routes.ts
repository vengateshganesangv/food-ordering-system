import { Router } from 'express';
import { CustomerController } from './CustomerController';

export function createRoutes(customerController: CustomerController): Router {
  const router = Router();

  router.post('/customers', (req, res, next) => customerController.createCustomer(req, res, next));

  return router;
}
