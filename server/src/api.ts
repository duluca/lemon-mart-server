import { Router } from "express";
import api_v1 from "./v1";
import api_v2 from "./v2";

const api = Router();

/**
 * @openapi
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   responses:
 *     UnauthorizedError:
 *       description: Unauthorized
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/ServerMessage"
 *   schemas:
 *     ServerMessage:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *  security:
 *    - bearerAuth: []
 */
// Configure all routes here
api.use("/v2", api_v2);
api.use("/v1", api_v1);

export default api;
