import AdvanceDetailsScreen from "../screens/main/advance/AdvanceDetailsScreen";
import AdvanceHistory from "../screens/main/advance/AdvanceHistory";
import GetAdvance from "../screens/main/advance/GetAdvance";
import GetPayment from "../screens/main/advance/GetPayment";
import Repayment from "../screens/main/advance/Repayment";
import SelectPaymentMethod from "../screens/main/advance/SelectPaymentMethod";
import CategoryDetail from "../screens/main/budget/CategoryDetail";
import Account from "../screens/main/connect_bank_account/Account";
import AddmanualAccount from "../screens/main/connect_bank_account/AddmanualAccount";
import BankAccountSummary from "../screens/main/connect_bank_account/BankAccountSummery";
import ConnectBank from "../screens/main/connect_bank_account/ConnectBank";
import Statement from "../screens/main/connect_bank_account/Statement";
import Transactionform from "../screens/main/connect_bank_account/Transactionform";
import AppSettings from "../screens/main/menu/AppSettings";
import ChangePIN from "../screens/main/menu/ChangePIN";
import DeleteAccount from "../screens/main/menu/DeleteAccount";
import Faq from "../screens/main/menu/Faq";
import NotificationSettings from "../screens/main/menu/NotificationSettings";
import PaymentArrangement from "../screens/main/menu/PaymentArrangement";
import Profile from "../screens/main/menu/Profile";
import AddReminder from "../screens/main/menu/reminders/AddReminder";
import AddReminderForm from "../screens/main/menu/reminders/AddReminderForm";
import ReminderDetail from "../screens/main/menu/reminders/ReminderDetail";
import Reminders from "../screens/main/menu/reminders/Reminders";
import TransactionHistory from "../screens/main/menu/TransactionHistory";
import OfferDetailScreen from "../screens/main/Offers/OfferDetailsScreen";
import OfferSummaryScreen from "../screens/main/Offers/OfferSummaryScreen";
import PaymentMethod from "../screens/main/paymentmethod/PaymentMethod";
import SelectSubscriptionPaymentMethod from "../screens/main/subscription/component/SelectSubscriptionPaymentMethod";
import SubscriptionDetailsScreen from "../screens/main/subscription/component/SubscriptionDetailsScreen";
import SubscriptonSuccessScreen from "../screens/main/subscription/component/SubscriptonSuccessScreen";
import Plan from "../screens/main/subscription/Plan";
import Subscription from "../screens/main/subscription/Subscription";
import EWADetailScreen from "../widgets/EWADetailScreen";
import NotificationDestailsScreen from "../widgets/NotificationDestailsScreen";
import BudgetRoute from "./BudgetRoute";
import DashboardRoute from "./DashboardRoute";
import GoalRoute from "./GoalRoute";
import InsightsRoute from "./InsightsRoute";
import OffersRoute from "./OffersRoute";

export const CommonScreens = [
  { name: 'Profile', component: Profile },
  { name: 'TransactionHistory', component: TransactionHistory },
  { name: 'Reminders', component: Reminders },
  { name: 'ReminderDetail', component: ReminderDetail },
  { name: 'AddReminder', component: AddReminder },
  { name: 'AddReminderForm', component: AddReminderForm },
  { name: 'NotificationSettings', component: NotificationSettings },
  { name: 'ChangePIN', component: ChangePIN },
  { name: 'Faq', component: Faq },
  { name: 'DeleteAccount', component: DeleteAccount },
  { name: 'PaymentArrangement', component: PaymentArrangement },
  { name: 'Statement', component: Statement },
  { name: 'BankAccountSummary', component: BankAccountSummary },
  { name: 'Transactionform', component: Transactionform },
  { name: 'AddmanualAccount', component: AddmanualAccount },
  { name: 'Account', component: Account },
  { name: 'ConnectBank', component: ConnectBank },
  { name: 'Subscription', component: Subscription },
  { name: 'Plan', component: Plan },
  { name: 'GetAdvance', component: GetAdvance },
  { name: 'CategoryDetail', component: CategoryDetail },
  { name: 'EWADetailScreen', component: EWADetailScreen },
  { name: 'AppSettings', component: AppSettings },
  { name: "OfferDetailScreen", component: OfferDetailScreen },
  { name: 'OfferSummaryScreen', component: OfferSummaryScreen },
  { name: 'SelectPaymentMethod', component: SelectPaymentMethod },
  { name: 'SelectSubscriptionPaymentMethod', component: SelectSubscriptionPaymentMethod },
  { name: 'SubscriptonSuccessScreen', component: SubscriptonSuccessScreen },
  { name: 'PaymentMethod', component: PaymentMethod },
  { name: 'AdvanceHistory', component: AdvanceHistory },
  { name: 'AdvanceDetailsScreen', component: AdvanceDetailsScreen },
  { name: 'SubscriptionDetailsScreen', component: SubscriptionDetailsScreen },
  { name: 'Repayment', component: Repayment },
  { name: 'GetPayment', component: GetPayment },
  { name: 'DashboardRoute', component: DashboardRoute },
  { name: 'InsightRoute', component: InsightsRoute },
  { name: 'BudgetRoute', component: BudgetRoute },
  { name: 'OffersRoute', component: OffersRoute },
  { name: 'GoalRoute', component: GoalRoute },
];