import {
  listAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointmentStatus,
  generateICS
} from "../services/appointmentService.js";

export const index = async (_req, res, next) => {
  try {
    const appointments = await listAppointments();
    res.json(appointments);
  } catch (error) {
    next(error);
  }
};

export const create = async (req, res, next) => {
  try {
    const appointment = await createAppointment(req.body);
    res.status(201).json(appointment);
  } catch (error) {
    next(error);
  }
};

export const updateStatus = async (req, res, next) => {
  try {
    const appointment = await updateAppointmentStatus(req.params.id, req.body.status);
    res.json(appointment);
  } catch (error) {
    next(error);
  }
};

export const ics = async (req, res, next) => {
  try {
    const appointment = await getAppointmentById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    const icsContent = generateICS(appointment);
    res.header("Content-Type", "text/calendar");
    res.send(icsContent);
  } catch (error) {
    next(error);
  }
};

export default { index, create, updateStatus, ics };
