import { useSelector } from "react-redux";
import { COMMONSCREENLABELSIDS } from "../../constants/workflowConstents";
import appLog from "../../constants/logger";
import { useMemo } from "react";

const selectByScreen = (state) => state.appscreenlabels.byScreen;

export default function usePaymentMethodLabelsHook() {
    const byScreen = useSelector(selectByScreen);

    return useMemo(() => {
        const record = byScreen?.find((r) => r._id === COMMONSCREENLABELSIDS.PAYMENTMETHOD);

        const labels = record?.labels || [];

        const screenTitle = labels[0]?.message ?? "Payment Methods";
        const selectedCardSectionLabel = labels[1]?.message ?? "SELECTED CARD";
        const defaultBadgeLabel = labels[2]?.message ?? "Default";
        const addNewCardCtaLabel = labels[3]?.message ?? "Add New Card";
        const setDefaultModalHeader = labels[4]?.message ?? "Set as Default?";
        const setDefaultConfirmationMessage = labels[5]?.message ?? "Are you sure you want to set this card as your default payment method?";
        const cardPreviewExpiresLabel = labels[6]?.message ?? "EXPIRES";
        const cardNumberFieldLabel = labels[7]?.message ?? "Card Number";
        const cardholderNameFieldLabel = labels[8]?.message ?? "Cardholder Name";
        const expiryDateFieldLabel = labels[9]?.message ?? "Expiry Date";
        const cvvFieldLabel = labels[10]?.message ?? "CVV";
        const addCardCtaLabel = labels[11]?.message ?? "Add Card";
        const addNewCardModalHeader = labels[12]?.message ?? "Add New Card";
        const cardHoldename = labels[13]?.message ?? "Card Holder ";
        const cardHoldExpiries = labels[14]?.message ?? "Expires";
        const deleteWarningTitle = labels[15]?.message ?? "Are you sure?";
        const deleteWarningPrefix = labels[16]?.message ?? "You are about to delete your";
        const deleteWarningMiddle = labels[17]?.message ?? "card ending in";
        const deleteWarningSuffix = labels[18]?.message ?? "This action cannot be undone.";
        const setdefuldButton = labels[19]?.message ?? 'Set Default'
        const allcardsLabel = labels[20]?.message ?? 'All Cards'
        const useDeletedbuttonlable = labels[21]?.message ?? 'Delete Card'
        const useCancelButton = labels[22]?.message ?? 'Cancel'

        return {
            screenTitle,
            selectedCardSectionLabel,
            defaultBadgeLabel,
            addNewCardCtaLabel,
            setDefaultModalHeader,
            setDefaultConfirmationMessage,
            cardPreviewExpiresLabel,
            cardNumberFieldLabel,
            cardholderNameFieldLabel,
            expiryDateFieldLabel,
            cvvFieldLabel,
            addCardCtaLabel,
            addNewCardModalHeader,
            cardHoldename,
            deleteWarningTitle,
            deleteWarningPrefix,
            deleteWarningMiddle,
            deleteWarningSuffix,
            cardHoldExpiries,
            setdefuldButton,
            allcardsLabel,
            useDeletedbuttonlable,
            useCancelButton


        };
    }, [byScreen]);
}