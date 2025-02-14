import express from 'express';
import { 
        createCustomer, createShortCust,
        singleCustomer, 
        updateCustomerName, deleteCustomer 
} from '../controllers/customerController.js';

export const customerRouter = express.Router();

customerRouter
        .route('/')
        // .post(createCustomer)
        .post(createShortCust)
customerRouter
        .route('/:id')
        .get(singleCustomer)
        .patch(updateCustomerName)
        .delete(deleteCustomer)