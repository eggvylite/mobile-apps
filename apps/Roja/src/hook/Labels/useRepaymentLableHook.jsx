import { useSelector } from "react-redux";
import { COMMONSCREENLABELSIDS } from "../../constants/workflowConstents";
import appLog from "../../constants/logger";
import { useMemo } from "react";

const selectByScreen = (state) => state.appscreenlabels.byScreen;

export default function useReyPaymentLabelsHook() {
    const byScreen = useSelector(selectByScreen);

    return useMemo(() => {
        const record = byScreen?.find((r) => r._id === COMMONSCREENLABELSIDS.REPAYMENT);

        appLog.error(record);

        const labels = record?.labels || [];

        // Active Repayment Screen
        const screenTitle = labels[0]?.message ?? "Active Repayment";
        const outstandingBalanceCardTitle = labels[1]?.message ?? "Outstanding Balance";
        const usedProgressLabel = labels[2]?.message ?? "Used";
        const limitProgressLabel = labels[3]?.message ?? "Limit";
        const repaymentDateLabel = labels[4]?.message ?? "REPAYMENT DATE";
        const daysLeftLabel = labels[5]?.message ?? "DAYS LEFT";
        const payNowButtonLabel = labels[6]?.message ?? "Pay Now";
        const getAdvanceButtonLabel = labels[7]?.message ?? "Get Advance";
        const totalTakenStatLabel = labels[8]?.message ?? "Total Taken";
        const pendingStatLabel = labels[9]?.message ?? "Pending";
        const limitLeftStatLabel = labels[10]?.message ?? "Limit Left";
        const repayAllOutstandingCtaLabel = labels[11]?.message ?? "Repay All Outstanding";

        // Repay Outstanding Modal
        const repayOutstandingModalHeader = labels[12]?.message ?? "Repay Outstanding";
        const outstandingBalanceModalLabel = labels[13]?.message ?? "Outstanding Balance";
        const enterAmountFieldLabel = labels[14]?.message ?? "Enter amount to repay";

        // Sections
        const recentRepaymentsSectionHeader = labels[15]?.message ?? "Recent Repayments";
        const viewAllActionLabel = labels[16]?.message ?? "View All";
        const activeRepaymentSectionHeader = labels[17]?.message ?? "Active Repayment";

        // Clear Outstanding State
        const clearOutstandingTitle = labels[18]?.message ?? "All Clear!";
        const clearOutstandingDescription = labels[19]?.message ?? "You've repaid all your advances";

        // Select Payment Method Modal
        const selectPaymentMethodModalHeader = labels[20]?.message ?? "Select Payment Method";
        const choosePaymentMethodDescription = labels[21]?.message ?? "Choose your preferred payment method";
        const repaymentAmountCardLabel = labels[22]?.message ?? "REPAYMENT AMOUNT";
        const bankAccountOptionLabel = labels[23]?.message ?? "Bank Account (ACH)";
        const debitCardOptionLabel = labels[24]?.message ?? "Debit Card";
        const continueCtaLabel = labels[25]?.message ?? "Continue";
        const paymentSecurityNoteLabel = labels[26]?.message ?? "Your payment information is encrypted and secure";

        // Select Payment Screen
        const selectPaymentScreenTitle = labels[27]?.message ?? "Select Payment";
        const payingThroughBannerLabel = labels[28]?.message ?? "Paying through:";
        const selectedPaymentMethodSectionLabel = labels[29]?.message ?? "SELECTED PAYMENT METHOD";
        const cardDefaultBadgeLabel = labels[30]?.message ?? "Default";
        const cardHolderPreviewLabel = labels[31]?.message ?? "CARD HOLDER";
        const cardExpiresPreviewLabel = labels[32]?.message ?? "EXPIRES";
        const providerInfoRowLabel = labels[33]?.message ?? "Provider";
        const amountInfoRowLabel = labels[34]?.message ?? "Amount";
        const otherPaymentMethodsSectionHeader = labels[35]?.message ?? "Other Payment Methods";
        const paymentListItemDefaultBadgeLabel = labels[36]?.message ?? "Default";
        const addNewCardCtaLabel = labels[37]?.message ?? "Add New Card";
        const payNowCtaLabel = labels[38]?.message ?? "Pay Now";

        // Add New Card Modal
        const addNewCardModalHeader = labels[39]?.message ?? "Add New Card";
        const addCardPreviewHolderLabel = labels[40]?.message ?? "CARD HOLDER";
        const addCardPreviewExpiresLabel = labels[41]?.message ?? "EXPIRES";
        const cardNumberFieldLabel = labels[42]?.message ?? "Card Number";
        const cardholderNameFieldLabel = labels[43]?.message ?? "Cardholder Name";
        const expiryDateFieldLabel = labels[44]?.message ?? "Expiry Date";
        const cvvFieldLabel = labels[45]?.message ?? "CVV";
        const addCardCtaLabel = labels[46]?.message ?? "Add Card";

        const Advancestoberepaid = labels[47]?.message ?? 'Advances to be repaid '

        return {
            screenTitle,
            outstandingBalanceCardTitle,
            usedProgressLabel,
            limitProgressLabel,
            repaymentDateLabel,
            daysLeftLabel,
            payNowButtonLabel,
            getAdvanceButtonLabel,
            totalTakenStatLabel,
            pendingStatLabel,
            limitLeftStatLabel,
            repayAllOutstandingCtaLabel,
            repayOutstandingModalHeader,
            outstandingBalanceModalLabel,
            enterAmountFieldLabel,
            recentRepaymentsSectionHeader,
            viewAllActionLabel,
            activeRepaymentSectionHeader,
            clearOutstandingTitle,
            clearOutstandingDescription,
            selectPaymentMethodModalHeader,
            choosePaymentMethodDescription,
            repaymentAmountCardLabel,
            bankAccountOptionLabel,
            debitCardOptionLabel,
            continueCtaLabel,
            paymentSecurityNoteLabel,
            selectPaymentScreenTitle,
            payingThroughBannerLabel,
            selectedPaymentMethodSectionLabel,
            cardDefaultBadgeLabel,
            cardHolderPreviewLabel,
            cardExpiresPreviewLabel,
            providerInfoRowLabel,
            amountInfoRowLabel,
            otherPaymentMethodsSectionHeader,
            paymentListItemDefaultBadgeLabel,
            addNewCardCtaLabel,
            payNowCtaLabel,
            addNewCardModalHeader,
            addCardPreviewHolderLabel,
            addCardPreviewExpiresLabel,
            cardNumberFieldLabel,
            cardholderNameFieldLabel,
            expiryDateFieldLabel,
            cvvFieldLabel,
            addCardCtaLabel,
            Advancestoberepaid
        };
    }, [byScreen]);
}