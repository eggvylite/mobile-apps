import { useMemo } from "react";
import { useSelector } from "react-redux";
import { COMMONSCREENLABELSIDS } from "../../constants/workflowConstents";

const selectByScreen = (state) => state.labels.record;

export default function useLoginLabels() {
    const byScreen = useSelector(selectByScreen);


    return useMemo(() => {
        const record = byScreen?.find((r) => r._id === COMMONSCREENLABELSIDS.LOGIN);
        const labels = record?.labels || [];

        const loginContent = {
            title: labels[0]?.message ?? "Access Accounts",
            description: labels[1]?.message ?? "Enter your details to continue",
            btnName: labels[2]?.message ?? "Sign In",
            navigateContent: labels[3]?.message ?? "Don't have an account?",
            navigateLinkName: labels[4]?.message ?? "Sign Up",
            label: labels[5]?.message ?? "CELL PHONE NUMBER"
        }

        const loginpin = {
            enteryourpin: labels[6]?.message ?? "Enter Your PIN",
            enter6digitpin: labels[7]?.message ?? "Enter your 6-digit PIN to continue",
            enterpin: labels[8]?.message ?? "Enter PIN",
            forgotpin: labels[9]?.message ?? "Forgot PIN?",
            loginanotheraccount: labels[10]?.message ?? "Login to Another Account",
            incorrectpin: labels[11]?.message ?? "Incorrect PIN. Please try again",
            continue: labels[12]?.message ?? "Continue"
        }

        const switchAccount = {
            device : labels[13]?.message ?? "Device",
            platform : labels[14]?.message ?? "Platform",
            cancel : labels[15]?.message ?? "Cancel",
            signout : labels[16]?.message ?? "Sign Out",
        }

        const loadingmsg = labels[17]?.message ?? "Loading..."

          const onboardcontent = {
            skip : labels[18]?.message ?? "Skip",
            next : labels[19]?.message ?? "Next",
            getstarted : labels[20]?.message ?? "Get Started",
        }



        return {
            loginContent,
            loginpin,
            switchAccount,
            loadingmsg,
            onboardcontent
                
        };
    }, [byScreen]);
}

