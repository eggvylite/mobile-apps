import { logger, consoleTransport } from "react-native-logs";

const appLog = logger.createLogger({
    severity: "debug",

    transport: consoleTransport,

    transportOptions: {
        colors: {
            debug: "blue",
            info: "green",
            warn: "yellow",
            error: "red",
        },

        extensionColors: {
            app: "magenta",
        },

        dateFormat: "time",
    },

    enabled: true,
    enabledExtensions: ["app"],
});

export default appLog;