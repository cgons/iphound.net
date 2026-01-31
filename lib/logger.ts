import winston, { format } from "winston";

const formatter = () => {
  return new Date().toLocaleString("en-CA", {
    timeZoneName: "short",
    hour12: false,
    timeZone: "America/Toronto",
  });
};

const logger = winston.createLogger({
  level: "debug",
  format: winston.format.combine(
    format.timestamp({ format: formatter }),
    format.json(),
  ),
  transports: [new winston.transports.Console()],
});

export default logger;
