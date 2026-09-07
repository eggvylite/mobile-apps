import { useMemo } from "react";
import { useSelector } from "react-redux";
import { COMMONSCREENLABELSIDS } from "../../constants/workflowConstents";

const selectByScreen = (state) => state.labels.record;

export default function useRegisterLabels() {
    const byScreen = useSelector(selectByScreen);


    return useMemo(() => {
        const record = byScreen?.find((r) => r._id === COMMONSCREENLABELSIDS.REGISTER);
        const labels = record?.labels || [];

        const registerContent = {
            title: labels[0]?.message ?? "Create Account",
            description: labels[1]?.message ?? "Join us and start your journey",
            firstname: labels[2]?.message ?? "First Name",
            lastname: labels[3]?.message ?? "Last Name",
            cellphonenumber: labels[4]?.message ?? "Cell Phone Number",
            email: labels[5]?.message ?? "Emaill",
            address: labels[6]?.message ?? "Address",
            state: labels[7]?.message ?? "State",
            city: labels[8]?.message ?? "City",
            zipcode: labels[9]?.message ?? "Zip Code",
            marketingmesg: labels[10]?.message ?? "By checking this box, you agree to receive text messages.",
            dob: labels[11]?.message ?? "Date of Birth",
            privacyPolicy: labels[12]?.message ?? "By submitting, you agree to receive messages from Roja. Msg & Data rates may apply. Messages will be used for MFA authentication and account notices, frequency will vary with use. Reply STOP to opt-out or HELP for help",
            terms: labels[13]?.message ?? "Terms and Conditions",
            privacy: labels[14]?.message ?? "Privacy Policy",
            alreadyhaveaccount: labels[15]?.message ?? "Already have an account?",
            signin: labels[16]?.message ?? "Sign In",
            locationbtn: labels[17]?.message ?? "Auto-detect City & State",
            signupbtn: labels[18]?.message ?? "Sign Up",
            verifyemail: labels[19]?.message ?? "Verify Your Email",
            verifynumber: labels[20]?.message ?? "Verify Your Number",
            verificontinue: labels[21]?.message ?? "Verify & Continue",
            otpwillexpire: labels[22]?.message ?? "OTP will expire in",
            resendcode: labels[23]?.message ?? "Resend Code",
            enterotp: labels[24]?.message ?? "Enter OTP Code",
            createyourpin: labels[25]?.message ?? "Create Your PIN",
            confirmyourpin: labels[26]?.message ?? "Confirm Your PIN",
            setpinquickaccess: labels[27]?.message ?? "Set a 6-digit PIN for quick access",
            enter_same_pin_to_confirm: labels[28]?.message ?? "Enter the same PIN again to confirm",
            createpin: labels[29]?.message ?? "Create PIN",
            confirmpin: labels[30]?.message ?? "Confirm PIN",
            pinmismatch: labels[31]?.message ?? "PIN Mismatch",
            pindoesnotmatch: labels[32]?.message ?? "The PIN and Confirm PIN do not match.",
            setcontinue: labels[33]?.message ?? "Set PIN & Continue",
        }

        return {
            registerContent
        };
    }, [byScreen]);
}