import { Router } from "express";
import publicController from "../controllers/public.js";
import authController from "../controllers/auth.js";
import isAuthenticated from "../middleware/isAuthenticated.js";
import roadtax from "../controllers/roadtax.js";

const apiRoutes = Router();

// ### API ROUTE
apiRoutes.get("/api", publicController.get);
apiRoutes.post("/api", publicController.post);

apiRoutes.post("/api-register", authController.register);
apiRoutes.post("/api-login", authController.login);

// ### Public Controller
apiRoutes.get("/public", authController.publicController);

// ### Protected Controller
apiRoutes.get("/protected", isAuthenticated, authController.protectedController);
apiRoutes.get("/roadtax", isAuthenticated, roadtax.get);
apiRoutes.post("/roadtax", isAuthenticated, roadtax.post);
apiRoutes.post("/roadtax-detail", isAuthenticated, roadtax.detail);
apiRoutes.put("/roadtax-put", isAuthenticated, roadtax.put);
apiRoutes.delete("/roadtax-del", isAuthenticated,  roadtax.del);

export default apiRoutes;
