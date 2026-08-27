import CommonFunction from "../../../../../utill/CommonFunction";

;

const fmt = (cur, v) => cur + CommonFunction.formatamount(v);

export const OFFER_CONFIGS = {
    '6973395f8d26d83810b13a91': (v, c) => [
        `Loan amount from ${fmt(c, v.minAmount)} - ${fmt(c, v.maxAmount)}`,
        `Rate of APR from ${v.interestFrom}% - ${v.interestTo}%`,
        `Tenure range from ${v.minTenure} - ${v.maxTenure} months`,
    ],
    '69733ac88d26d83810b13c24': (v, c) => [
        `Cash advance limit ${fmt(c, v.limitFrom)} - ${fmt(c, v.limitTo)}`,
        `Service Fee ${v.feePercent}%`,
        `Repayment with in ${v.repaymentDays} days`,
    ],
    '69733e818d26d83810b13e25': (v, c) => [
        `Maximum Discount Cap ${fmt(c, v.maxCap)}`,
        `Discount ${v.discountPercent}%`,
        `Validity ${v.validity} days`,
    ],
    '697340268d26d83810b13fed': (v, c) => [
        `Annual Price ${fmt(c, v.price)}`,
        `Coverage Area ${v.coverageArea}`,
        `Included Services ${v.services}`,
    ],
    '6973406f8d26d83810b14058': (v, c) => [
        `Membership Price ${fmt(c, v.price)}`,
        `Legal Services ${v.services}`,
        `Validity ${v.validity} days`,
    ],
    '6973410c8d26d83810b141a5': (v, c) => [
        `Coverage Amount ${fmt(c, v.coverageAmount)}`,
        `Premium ${v.premiumFrom} to ${v.premiumTo}`,
        `Policy Tenure ${v.policyTenure} years`,
    ],
    '69733f0a8d26d83810b13ed7': (v, c) => [
        `Package Price ${fmt(c, v.price)}`,
        ` No. of Consultations ${v.consultations}`,
        `Validity ${v.validity} days`,
    ],
    '69736b32114d29597ee23ca3': (v, c) => [
        `Annual Fee ${fmt(c, v.annualFee)}`,
        `Joining Bonus ${fmt(c, v.joiningBonus)}`,
        `Reward Rate ${v.rewardRate}%`,
        `Minimum Credit Score ${CommonFunction.formatamount(v.creditScoreMin)}`,
    ],
};
// insurance ids share one renderer
OFFER_CONFIGS['697341868d26d83810b1420c'] = OFFER_CONFIGS['6973410c8d26d83810b141a5'];
OFFER_CONFIGS['697341c78d26d83810b1425e'] = OFFER_CONFIGS['6973410c8d26d83810b141a5'];

export const SORT_ARR_MAP = {
    '6973395f8d26d83810b13a91': [
        { label: 'APR - Low to High', value: 'low_high' },
        { label: 'APR - High to Low', value: 'high_low' },
        { label: 'Tenure - Low to High', value: 'tenure_low_high' },
        { label: 'Tenure - High to Low', value: 'tenure_high_low' },
    ],
    '69733ac88d26d83810b13c24': [
        { label: 'Fees - Low to High', value: 'fess_low_high' },
        { label: 'Fees - High to Low', value: 'fess_high_low' },
    ],
    '69736b32114d29597ee23ca3': [
        { label: 'Annual Fee  - Low to High', value: 'annual_fee_low_high' },
        { label: 'Annual Fee  - High to Low', value: 'annual_fee_high_low' },
        { label: 'Reward Rate - Low to High', value: 'reward_rate_low_high' },
        { label: 'Reward Rate - High to Low', value: 'reward_rate_high_low' },
    ],
    '69733f0a8d26d83810b13ed7': [
        { label: 'Price - Low to High', value: 'price_low_high' },
        { label: 'Price - High to Low', value: 'price_high_low' },
    ],
    '697340268d26d83810b13fed': [
        { label: 'Annual Fee  - Low to High', value: 'roadannual_fee_low_high' },
        { label: 'Annual Fee  - High to Low', value: 'roadannual_fee_high_low' },
    ],
    '6973406f8d26d83810b14058': [
        { label: 'Price - Low to High', value: 'price_low_high' },
        { label: 'Price - High to Low', value: 'price_high_low' },
    ],
    '69733e818d26d83810b13e25': [
        { label: 'Cap - Low to High', value: 'cap_low_high' },
        { label: 'Cap - High to Low', value: 'cap_high_low' },
        { label: 'Discount - Low to High', value: 'dis_low_high' },
        { label: 'Discunt - High to Low', value: 'dis_high_low' },
    ],
    '6973410c8d26d83810b141a5': [
        { label: 'Coverage Amount - Low to High', value: 'coverage_low_high' },
        { label: 'Coverage Amount - High to Low', value: 'coverage_high_low' },
        { label: 'Policy Tenure - Low to High', value: 'policy_low_high' },
        { label: 'Policy Tenure - High to Low', value: 'policy_high_low' },
    ],
};
SORT_ARR_MAP['697341868d26d83810b1420c'] = SORT_ARR_MAP['6973410c8d26d83810b141a5'];
SORT_ARR_MAP['697341c78d26d83810b1425e'] = SORT_ARR_MAP['6973410c8d26d83810b141a5'];

// sortval -> field name, used for generic low/high comparisons
export const SORT_FIELD_MAP = {
    low_high: 'interestFrom', high_low: 'interestFrom',
    tenure_low_high: 'minTenure', tenure_high_low: 'minTenure',
    fess_low_high: 'feePercent', fess_high_low: 'feePercent',
    annual_fee_low_high: 'annualFee', annual_fee_high_low: 'annualFee',
    reward_rate_low_high: 'rewardRate', reward_rate_high_low: 'rewardRate',
    roadannual_fee_low_high: 'price', roadannual_fee_high_low: 'price',
    price_low_high: 'price', price_high_low: 'price',
    coverage_low_high: 'coverageAmount', coverage_high_low: 'coverageAmount',
    policy_low_high: 'policyTenure', policy_high_low: 'policyTenure',
    cap_low_high: 'maxCap', cap_high_low: 'maxCap',
    dis_low_high: 'discountPercent', dis_high_low: 'discountPercent',
};

export const isHighToLow = (s) => s?.endsWith('high_low') || s === 'fess_high_low';
export const getVal = (obj, field) => parseFloat(obj?.offer_id?.[field] ?? obj?.[field]);
