import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import RecipientController from './app/controllers/RecipientController';
import FileController from './app/controllers/FileController';
import DeliverymanController from './app/controllers/DeliverymanController';
import DeliveryController from './app/controllers/DeliveryController';
import StatusController from './app/controllers/StatusController';
import DeliveryProblemsCtrller from './app/controllers/DeliveryProblemController';
import NotificationController from './app/controllers/NotificationController';

import validateDeliveryStore from './app/validators/delivery/DeliveryStore';
import validateDeliveryUpdate from './app/validators/delivery/DeliveryUpdate';
import validateDeliveryDelete from './app/validators/delivery/DeliveryDelete';
import validateDeliverymanStore from './app/validators/deliveryman/DeliverymanStore';
import validateDeliverymanUpdate from './app/validators/deliveryman/DeliverymanUpdate';
import validateDeliverymanDelete from './app/validators/deliveryman/DeliverymanDelete';
import validateRecipientStore from './app/validators/recipient/RecipientStore';
import validateRecipientUpdate from './app/validators/recipient/RecipientUpdate';
import validateRecipientDelete from './app/validators/recipient/RecipientDelete';
import validateProblemStore from './app/validators/problem/ProblemStore';
import validateProblemDelete from './app/validators/problem/ProblemDelete';
import validateStatusUpdate from './app/validators/status/StatusUpdate';
import validateUserStore from './app/validators/user/UserStore';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/users', validateUserStore, UserController.store);
routes.post('/sessions', validateUserStore, SessionController.store);

routes.use(authMiddleware);

routes.get('/deliveryman/:id/deliveries', StatusController.index);
routes.put(
  '/deliveryman/:id/deliveries/:deliveryId',
  validateStatusUpdate,
  StatusController.update
);

routes.post('/files', upload.single('file'), FileController.store);

routes.get('/notifications', NotificationController.index);
routes.put('/notifications/:id', NotificationController.update);

routes.post(
  '/delivery/:id/problems',
  validateProblemStore,
  DeliveryProblemsCtrller.store
);
routes.get('/delivery/problems', DeliveryProblemsCtrller.index);
routes.delete(
  '/problem/:id/cancel-delivery',
  validateProblemDelete,
  DeliveryProblemsCtrller.delete
);

routes.post('/recipients', validateRecipientStore, RecipientController.store);
routes.get('/recipients', RecipientController.index);
routes.get('/recipients/:id', RecipientController.show);
routes.put(
  '/recipients/:id',
  validateRecipientUpdate,
  RecipientController.update
);
routes.delete(
  '/recipients/:id',
  validateRecipientDelete,
  RecipientController.delete
);

routes.post(
  '/deliveryman',
  validateDeliverymanStore,
  DeliverymanController.store
);
routes.get('/deliveryman', DeliverymanController.index);
routes.get('/deliveryman/:id', DeliverymanController.show);
routes.put(
  '/deliveryman/:id',
  validateDeliverymanUpdate,
  DeliverymanController.update
);
routes.delete(
  '/deliveryman/:id',
  validateDeliverymanDelete,
  DeliverymanController.delete
);

routes.post('/delivery', validateDeliveryStore, DeliveryController.store);
routes.get('/delivery', DeliveryController.index);
routes.put('/delivery/:id', validateDeliveryUpdate, DeliveryController.update);
routes.delete(
  '/delivery/:id',
  validateDeliveryDelete,
  DeliveryController.delete
);
routes.get('/delivery/:id', DeliveryController.show);

export default routes;
