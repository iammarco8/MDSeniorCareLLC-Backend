import express from "express";
import { createWard, getSingleWard, updateWard, deleteWard } from "../controllers/wardController.js";

export const wardRouter = express.Router();

wardRouter
        .route('/')
        .post(createWard)
wardRouter
        .route('/:id')
        .get(getSingleWard)
        .patch(updateWard)
        .delete(deleteWard)
