import { env } from "../config/env.js";

export const twilioClient = {
  messages: {
    create: async (payload) => {
      return { sid: "SMXXXX", payload, stub: true };
    }
  }
};

export const voiceReminderTemplate = ({ patientName, appointmentTime }) => `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="Polly.Amy">Hello ${patientName}, this is Cordia Health reminding you of your appointment on ${appointmentTime}. Press 1 to confirm.</Say>
</Response>`;

export default twilioClient;
