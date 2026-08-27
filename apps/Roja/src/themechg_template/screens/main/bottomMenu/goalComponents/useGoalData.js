import { useMemo, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';



import { fetchgoallistAccount, fetchgoalwithdrawAccount, deleteGoalItem } from '../../../../../redux/slices/goalSlice';
import api from '../../../../../service/api';
import { fetchgetAccount } from '../../../../../redux/slices/getmanulaccountSlice';
import CommonFunction from '../../../../../utill/CommonFunction';

export function useGoalData() {
  const dispatch = useDispatch();
  const { goalList, goalaccount, goalloading } = useSelector((state) => state.goal);
  const { storedata } = useSelector((state) => state.auth);

  const [btnName, setBtnName] = useState('All'); // 'All' | 'Active' | 'Completed'
  const [refreshing, setRefreshing] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const filteredGoals = useMemo(() => {
    if (!goalList?.length) return [];
    return goalList.filter((item) => {
      if (btnName === 'Active') return item.status === 'Active';
      if (btnName === 'Completed') return item.status === 'Completed';
      return true;
    });
  }, [goalList, btnName]);

  const refresh = useCallback(() => {
    dispatch(fetchgoalwithdrawAccount());
    dispatch(fetchgoallistAccount());
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  }, [dispatch]);

  const deleteGoal = useCallback(
    async (goal) => {
      setDeleting(true);
      dispatch(deleteGoalItem(goal?._id));
      try {
        const res = await api.get(`dashboard/deletegoals/${goal?._id}`);
        CommonFunction.message(res.data.message);
        dispatch(fetchgoallistAccount());
        dispatch(fetchgetAccount());
      } catch (err) {
        console.log(err);
      } finally {
        setDeleting(false);
      }
    },
    [dispatch],
  );

  return {
    goalList,
    goalaccount,
    goalloading,
    storedata,
    filteredGoals,
    btnName,
    setBtnName,
    refreshing,
    refresh,
    deleting,
    deleteGoal,
  };
}
