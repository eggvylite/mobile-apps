import { useMemo } from 'react';
import { COLORS, AVAILABLE_COLORS } from './goalConstants';
import { content } from '../../../../../constants/content';
import CommonFunction from '../../../../../utill/CommonFunction';


export function useGoalAccountChartData(goals = [], goalaccount = []) {
  return useMemo(() => {
    const bankMap = {};

    goals.forEach((goal) => {
      if (!goal.bank_contributions?.length) return;

      goal.bank_contributions.forEach((bank, index) => {
        const bankaccountbalance = goalaccount.find((item) => item?._id === bank?.bankaccount_id);
        const bankName = bank.bank_name;
        const availableBal = bankaccountbalance?.balance ?? 0;
        const number = bankaccountbalance?.account_number
          ? ` - XX${CommonFunction.slicenum(bankaccountbalance.account_number)}`
          : ` - ${content.manual}`;

        if (!bankMap[bankName]) {
          bankMap[bankName] = {
            bankbalance: Number(availableBal),
            account: `${bankName}${number}`,
            spend: 0,
            available: 0,
            savings: 0,
            data: [],
          };
        }

        bankMap[bankName].savings += Number(bank.total_amount || 0);
        bankMap[bankName].spend += Number(goal.spent || 0);
        bankMap[bankName].data.push({
          value: Number(bank.total_amount || 0),
          color: COLORS[index % COLORS.length],
          label: goal.name,
        });
      });
    });

    Object.values(bankMap).forEach((bank) => {
      bank.available = bank.bankbalance;
      if (bank.available > 0) {
        bank.data.push({ value: bank.available, color: AVAILABLE_COLORS[0], label: 'Available' });
      }
    });

    return Object.values(bankMap);
  }, [goals, goalaccount]);
}
