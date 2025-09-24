import { getSettings, updateSettings } from "../services/notificationService.js";

export const showSettings = async (_req, res, next) => {
  try {
    const settings = await getSettings();
    res.json(settings);
  } catch (error) {
    next(error);
  }
};

export const saveSettings = async (req, res, next) => {
  try {
    const settings = await updateSettings(req.body);
    res.json(settings);
  } catch (error) {
    next(error);
  }
};

export default { showSettings, saveSettings };
