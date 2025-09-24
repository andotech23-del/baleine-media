import prisma from "../repositories/prismaClient.js";

export const auditLogger = async (req, res, next) => {
  res.on("finish", async () => {
    try {
      await prisma.auditLog.create({
        data: {
          actorId: req.user?.id || null,
          actorRole: req.user?.role || null,
          event: `${req.method} ${req.path}`,
          entity: req.path.split("/")[1] || "unknown",
          entityId: req.params.id || null,
          meta: {
            statusCode: res.statusCode,
            method: req.method
          },
          redacted: Boolean(req.headers["x-redact-pii"] === "true")
        }
      });
    } catch (error) {
      // ignore logging errors in middleware
    }
  });
  next();
};

export default auditLogger;
