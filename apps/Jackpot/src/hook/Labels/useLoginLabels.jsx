import { useMemo } from "react";
import { useSelector } from "react-redux";
import { COMMONSCREENLABELSIDS } from "../../constants/workflowConstents";

const selectByScreen = (state) => state.labels.record;

export default function useLoginLabels() {
    const byScreen = useSelector(selectByScreen);


    return useMemo(() => {
        const record = byScreen?.find((r) => r._id === COMMONSCREENLABELSIDS.LOGIN);
        const labels = record?.labels || [];

        const title = labels[0]?.message ?? "Access Accounts";
        const description = labels[1]?.message ?? "Enter your details to continue";
        const btnName = labels[2]?.message ?? "Sign In";
        const navigateContent = labels[3]?.message ?? "Don't have an account?";
        const navigateLinkName = labels[4]?.message ?? "Sign Up";
        const label = labels[5]?.message ?? "CELL PHONE NUMBER";
        return {
            title, description, btnName, navigateContent, navigateLinkName,label
        };
    }, [byScreen]);
}