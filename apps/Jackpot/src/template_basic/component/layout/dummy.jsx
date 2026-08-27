// src/data/cardContent.js
// One object per screen. Keep all copy/content here — screens stay clean,
// and non-devs can edit this file without touching component code.

import { appName } from '../../../service/environment';

export const bankConnectContent = {
  image: require('../../../../assets/images/bank.png'),
  title: `Welcome to ${appName}`,
  subtitle: 'Connect your bank account to unlock\nyour personalized cash advance',
  items: [
    {
      id: 'no-fees',
      icon: 'check-circle',
      iconColor: '#10B981',
      title: 'No Processing Fees',
      description: 'Zero hidden charges or transaction fees',
    },
    {
      id: 'wage-based',
      icon: 'check-circle',
      iconColor: '#10B981',
      title: 'Wage-Based Advances',
      description: 'Get advances based on your verified income',
    },
    {
      id: 'transparent',
      icon: 'check-circle',
      iconColor: '#10B981',
      title: 'Transparent & Secure',
      description: 'Bank-level encryption with complete transparency',
    },
  ],
  buttonText: 'Connect Bank Account',
  footerText: 'Your data is protected with 256-bit encryption',
  footerIcon: 'lock',
};

export const budgetContent = {
  image: require('../../../../assets/images/bank.png'),
  title: 'Take Control of Your Budget',
  subtitle: 'See where your money goes and stay on track every month',
  items: [
    {
      id: 'auto-categorize',
      icon: 'pie-chart',
      iconColor: '#6366F1',
      title: 'Auto-Categorized Spending',
      description: 'Every transaction sorted automatically',
    },
    {
      id: 'alerts',
      icon: 'bell',
      iconColor: '#F59E0B',
      title: 'Overspend Alerts',
      description: 'Get notified before you go over budget',
    },
    {
      id: 'trends',
      icon: 'trending-up',
      iconColor: '#10B981',
      title: 'Monthly Trends',
      description: 'Compare spending across months at a glance',
    },
  ],
  buttonText: 'Set Up My Budget',
  footerText: 'Your budget data stays private and secure',
  footerIcon: 'shield',
};

export const goalContent = {
  image: require('../../../../assets/images/bank.png'),
  title: 'Reach Your Savings Goal',
  subtitle: 'Set a target and we\u2019ll help you get there faster',
  items: [
    {
      id: 'auto-save',
      icon: 'repeat',
      iconColor: '#6366F1',
      title: 'Automatic Round-Ups',
      description: 'Save spare change from every purchase',
    },
    {
      id: 'milestones',
      icon: 'flag',
      iconColor: '#F59E0B',
      title: 'Milestone Tracking',
      description: 'Celebrate progress along the way',
    },
    {
      id: 'flexible',
      icon: 'sliders',
      iconColor: '#10B981',
      title: 'Flexible Targets',
      description: 'Adjust your goal amount anytime',
    },
  ],
  buttonText: 'Create a Goal',
  footerText: 'You can edit or cancel this goal anytime',
  footerIcon: 'info',
};

export const offersContent = {
  image: require('../../../../assets/images/bank.png'),
  title: 'Exclusive Offers For You',
  subtitle: 'Deals picked based on your spending habits',
  items: [
    {
      id: 'cashback',
      icon: 'gift',
      iconColor: '#EC4899',
      title: 'Up to 10% Cashback',
      description: 'On select partner brands this week',
    },
    {
      id: 'personalized',
      icon: 'user-check',
      iconColor: '#6366F1',
      title: 'Personalized For You',
      description: 'Offers matched to how you already spend',
    },
    {
      id: 'no-signup',
      icon: 'zap',
      iconColor: '#F59E0B',
      title: 'No Extra Sign-Up',
      description: 'Redeem instantly with your linked card',
    },
  ],
  buttonText: 'View All Offers',
  footerText: 'Offers refresh every week',
  footerIcon: 'refresh-cw',
};