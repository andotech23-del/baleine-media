import { getRcmDashboard, simulateRpa } from "../services/dashboardService.js";

export const overview = async (_req, res, next) => {
  try {
    const data = await getRcmDashboard();
    res.json(data);
  } catch (error) {
    next(error);
  }
};

export const runRpa = async (_req, res, next) => {
  try {
    const result = await simulateRpa();
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export default { overview, runRpa };
