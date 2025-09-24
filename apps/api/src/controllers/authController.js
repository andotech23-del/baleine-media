import { authenticateUser } from "../services/authService.js";
import { authCredentialsSchema } from "@cordia/types";

export const login = async (req, res, next) => {
  try {
    const credentials = authCredentialsSchema.parse(req.body);
    const result = await authenticateUser(credentials);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export default { login };
