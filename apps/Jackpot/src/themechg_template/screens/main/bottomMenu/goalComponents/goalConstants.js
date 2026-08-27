// constants/goalConstants.js
// ~40 lines — pure static data, zero logic, safe to import anywhere without re-render cost.

export const COLORS = [
  '#ff7f50',
  '#ffd700',
  '#32cd32',
  '#1e90ff',
  '#ff1493',
  '#8a2be2',
  '#ffa500',
  '#5b1484',
];

export const AVAILABLE_COLORS = [
  '#a3d2fdff',
  '#ff7f50',
  '#ffd700',
  '#32cd32',
  '#1e90ff',
  '#ff1493',
  '#8a2be2',
  '#ffa500',
  '#5b1484',
];

export const getGoalTypes = (assets) => [
  {
    name: 'Spend a Custom Amount',
    des: 'Spend from your available balance. The total amount saved will not be affected.',
    image: assets.spend,
    color: '#DFFBFF',
    iconname: 'account-balance-wallet',
    iconfamily: 'MaterialIcons',
    type: 'spend',
  },
  {
    name: 'Withdraw for Another Purpose',
    des: 'Your overall goal progress and amount saved will be reduced.',
    image: assets.withdraw,
    color: '#DFFBFF',
    iconname: 'arrow-redo-sharp',
    iconfamily: 'Ionicons',
    type: 'withdraw',
  },
];
