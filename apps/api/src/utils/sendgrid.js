import { env } from "../config/env.js";

export const sendgridClient = {
  send: async (payload) => ({ id: "SGXXXX", payload, stub: true })
};

export const reminderEmailTemplate = ({ patientName, appointmentTime }) => `Hi ${patientName},\n\nThis is your reminder for ${appointmentTime}.\n\nCordia Health`;

export default sendgridClient;
