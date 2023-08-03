import { Router } from "express";
import userRouter from "./routes/userRouter";

const router = Router();

// Configure all v2 routers here
router.use("/user(s)?", userRouter);

export default router;
