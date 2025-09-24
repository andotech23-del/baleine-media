import {
  listPatients,
  getPatient,
  createPatient,
  updatePatient
} from "../services/patientService.js";

export const index = async (_req, res, next) => {
  try {
    const patients = await listPatients();
    res.json(patients);
  } catch (error) {
    next(error);
  }
};

export const show = async (req, res, next) => {
  try {
    const patient = await getPatient(req.params.id);
    res.json(patient);
  } catch (error) {
    next(error);
  }
};

export const create = async (req, res, next) => {
  try {
    const patient = await createPatient(req.body);
    res.status(201).json(patient);
  } catch (error) {
    next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    const patient = await updatePatient(req.params.id, req.body);
    res.json(patient);
  } catch (error) {
    next(error);
  }
};

export default { index, show, create, update };
