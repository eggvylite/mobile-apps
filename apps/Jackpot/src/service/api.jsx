import axios from "axios";
import { BASE_URL } from "./environment";
import { getLoginInfo } from "./storage";
import CommonFunction from "../utill/CommonFunction";
import appLog from "../constants/logger";
import { resetToLogin } from "../template_basic/navigation/NavigationService";

const api = axios.create({
    baseURL: BASE_URL,
});

// Request Interceptor
api.interceptors.request.use(
    async (config) => {
        const logInfo = await getLoginInfo();
        const deviceid = await CommonFunction.getDeviceID();

        if (logInfo) {
            config.headers["x-access-token"] = logInfo.accessToken;
            config.headers.user = logInfo.id;
            config.headers["x-device-id"] = deviceid;
            config.headers["Accept"] = "application/json";
        }

        // Save request start time
        config.metadata = {
            startTime: new Date().getTime(),
        };

        if (__DEV__) {
            appLog.info("========================================");
            // appLog.info(`🚀 ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
            // appLog.debug("Headers:", config.headers);
            // appLog.debug("Request:", config.data);
        }

        return config;
    },
    (error) => {
        appLog.error("❌ Request Error:", error);
        return Promise.reject(error);
    }
);

// Response Interceptor
api.interceptors.response.use(
    (response) => {
        const duration =
            new Date().getTime() - response.config.metadata.startTime;

        if (__DEV__) {
            // appLog.info(`✅ ${response.config.url}`);
            // appLog.info(`Status : ${response.status}`);
            // appLog.info(`Time   : ${duration} ms`);
            // appLog.debug("Response:", response.data);
            // appLog.info("========================================");
        }

        return response;
    },
    (error) => {
        const duration =
            error.config?.metadata?.startTime
                ? new Date().getTime() - error.config.metadata.startTime
                : 0;

        if (__DEV__) {
            // appLog.error("========================================");
            // appLog.error(`❌ ${error.config?.method?.toUpperCase()} ${error.config?.url}`);
            // appLog.error(`Status : ${error.response?.status || "No Response"}`);
            // appLog.error(`Time   : ${duration} ms`);

            // if (error.response?.data) {
            //     appLog.error("Response:", error.response.data);
            // } else {
            //     appLog.error("Message:", error.message);
            // }

            // appLog.error("========================================");
        }
         if (error.response?.status === 401) {
                    resetToLogin();
                }

        return Promise.reject(error);
    }
);

export default api;