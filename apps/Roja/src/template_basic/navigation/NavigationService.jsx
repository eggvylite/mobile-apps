import { CommonActions } from "@react-navigation/native";
import { navigationRef } from "../../RootNavigation";

export function navigate(name, params) {
    if (navigationRef.isReady()) {
        navigationRef.navigate(name, params);
    }
}

export function resetToLogin() {
    if (navigationRef.isReady()) {
        navigationRef.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [{ name: "Login" }],
            })
        );
    } else {
        // Fallback for edge cases where the ref might not be ready yet
        console.log("Navigation ref not ready, retrying...");
        setTimeout(() => {
            if (navigationRef.isReady()) {
                navigationRef.dispatch(
                    CommonActions.reset({
                        index: 0,
                        routes: [{ name: "Login" }],
                    })
                );
            }
        }, 500);
    }
}