import express from 'express';
import { 
        createCustomer, createShortCust, createFullClient,
        singleCustomer, 
        updateCustomerName, deleteCustomer 
} from '../controllers/customerController.js';

export const customerRouter = express.Router();

customerRouter
        .route('/')
        // .post(createCustomer)
        // .post(createShortCust)
        .post(createFullClient)
customerRouter
        .route('/:id')
        .get(singleCustomer)
        .patch(updateCustomerName)
        .delete(deleteCustomer)