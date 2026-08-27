import NotificationData from '../screens/main/headerMenu/NotificationData';
import Setting from '../screens/main/headerMenu/setting/Setting';
import Advance from '../screens/main/headerMenu/advance/Advance';
import AdvacnceHistory from '../screens/main/headerMenu/advance/AdvacnceHistory';
import AdvaceTransactiondetails from '../screens/main/headerMenu/advance/AdvaceTransactiondetails';
import Getadvance from '../screens/main/headerMenu/advance/Getadvance';
import Payment from '../screens/main/headerMenu/advance/Payment';
import Profile from '../screens/main/headerMenu/setting/Profile';
import PaymentMethod from '../screens/main/headerMenu/setting/PaymentMethod';
import DepositBalanceAlerts from '../screens/main/headerMenu/setting/DepositBalanceAlerts';
import TransactionHistory from '../screens/main/headerMenu/setting/TransactionHistory';
import Notification from '../screens/main/headerMenu/setting/Notification';
import PaymentFrequency from '../screens/main/headerMenu/setting/PaymentFrequency';
import StaticPage from '../screens/main/headerMenu/setting/StaticPage';
import Faq from '../screens/main/headerMenu/setting/Faq';
import AppSetting from '../screens/main/headerMenu/setting/AppSetting';
import ChangePIN from '../screens/main/headerMenu/setting/ChangePIN';
import DeleteAccount from '../screens/main/headerMenu/setting/DeleteAccount';
import Subscription from '../screens/main/headerMenu/setting/subscription/Subscription';
import Subscriptiondetails from '../screens/main/headerMenu/setting/subscription/Subscriptiondetails';
import DefaultAccount from '../screens/main/connect_bank_account/DefaultAccount';
import Account from '../screens/main/connect_bank_account/Account';
import AddmanualAccount from '../screens/main/connect_bank_account/AddmanualAccount';
import ConnectBank from '../screens/main/connect_bank_account/ConnectBank';
import Bill from '../screens/main/headerMenu/setting/reminders/Bill';
import ViewBill from '../screens/main/headerMenu/setting/reminders/ViewBill';
import BillCreate from '../screens/main/headerMenu/setting/reminders/BillCreate';
import Reminder from '../screens/main/headerMenu/setting/reminders/Reminder';
import BankStatement from '../screens/main/connect_bank_account/BankStatement';
import TagSettings from '../screens/main/connect_bank_account/TagSettings';
import ScoreCheck from '../screens/main/creditscore/ScoreCheck';
import Transactionform from '../screens/main/connect_bank_account/Transactionform';
import TransactionHistoryDetails from '../screens/main/headerMenu/setting/TransactionHistoryDetails';



export const CommonScreens = [
  { name: 'NotificationData', component: NotificationData },
  { name: 'Setting', component: Setting },
  { name: 'Advance', component: Advance },
  { name: 'AdvacnceHistory', component: AdvacnceHistory },
  { name: 'AdvaceTransactiondetails', component: AdvaceTransactiondetails },
  { name: 'Getadvance', component: Getadvance },
  { name: 'Payment', component: Payment },
  { name: 'Profile', component: Profile },
  { name: 'PaymentMethod', component: PaymentMethod },
  { name: 'DepositBalanceAlerts', component: DepositBalanceAlerts },
  { name: 'TransactionHistory', component: TransactionHistory },
  { name: 'Notification', component: Notification },
  { name: 'PaymentFrequency', component: PaymentFrequency },
  { name: 'StaticPage', component: StaticPage },
  { name: 'Faq', component: Faq },
  { name: 'AppSetting', component: AppSetting },
  { name: 'ChangePIN', component: ChangePIN },
  { name: 'DeleteAccount', component: DeleteAccount },
  { name: 'Subscription', component: Subscription },
  { name: 'Subscriptiondetails', component: Subscriptiondetails },
  { name: 'DefaultAccount', component: DefaultAccount },
  { name: 'Account', component: Account },
  { name: 'AddmanualAccount', component: AddmanualAccount },
  { name: 'ConnectBank', component: ConnectBank },
  { name: 'Bill', component: Bill },
  { name: 'ViewBill', component: ViewBill },
  { name: 'BillCreate', component: BillCreate },
  { name: 'Reminder', component: Reminder },
  { name: 'BankStatement', component: BankStatement },
  { name: 'TagSettings', component: TagSettings },
  { name: 'ScoreCheck', component: ScoreCheck },
  { name: 'Transactionform', component: Transactionform },
  { name: 'TransactionHistoryDetails', component: TransactionHistoryDetails },

];