import { useSelector } from "react-redux";
import appLog from "../constants/logger";

export const WageStatus = Object.freeze({
    NOT_SUBMITTED: 'NOT_SUBMITTED',
    PROCESSING: 'PROCESSING',
    VERIFIED: 'VERIFIED',
    REJECTED: 'REJECTED',
});


export default function useWageStatus() {

    const { storedata } = useSelector((state) => state.auth);
     const { cusDetails, cusloading } = useSelector((state) => state.customer);

    const wages = cusDetails?.wages;
    const count = Number(cusDetails?.wagescount);


    if (wages === 'Yes') {
        return WageStatus.VERIFIED;
    }

    if (wages === 'No' && storedata?.request_status === 'Yes') {
        switch (count) {
            case 0:
                return WageStatus.NOT_SUBMITTED;
            case 1:
                return WageStatus.PROCESSING;
            case 3:
                return WageStatus.REJECTED;
            default:
                return WageStatus.NOT_SUBMITTED;
        }
    }

    return WageStatus.UNKNOWN;
}