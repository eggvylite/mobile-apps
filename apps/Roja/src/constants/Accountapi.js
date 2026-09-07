import { useContext } from "react";
import api from "../service/api"
import CommonFunction from "../utill/CommonFunction";
import { fetchgetAccount, fetchgetllAccount, resetgetAccount } from "../redux/slices/getmanulaccountSlice";
import { resetStatement } from "../redux/slices/statementSlice";
import { fetchnamegetAccount } from "../redux/slices/getnameAccountSlice";
import { fetchgoalAccount, fetchgoallistAccount } from "../redux/slices/goalSlice";
import { fetchBudgetcategory } from "../redux/slices/budgetcategorySlice";
import { fetchBills, resetBill } from "../redux/slices/billSlice";
import { fetchCategory } from "../redux/slices/categorySlice";
import { fetchGoalhis } from "../redux/slices/goalhisSlice";

export const createAccount = async (payload, dispatch) => {
    try {
        const response = await api.post('customer/createaccount', payload)
        if (response.status == 200) {
            dispatch(resetgetAccount())
            dispatch(resetStatement())
            dispatch(fetchnamegetAccount())
            dispatch(fetchgoalAccount())
            dispatch(fetchgetllAccount())
            dispatch(fetchgetAccount())
            CommonFunction.message(response.data.message)
            return response
        }
    } catch (error) {
        CommonFunction.message(error.response.data.message, 'danger')
        throw error
    }
}

export const createTransaction = async (payload, type, dispatch) => {
    var url = ''
    if (type === 'edit') {
        url = `customer/updateTransaction/${payload._id}`
    } else {
        url = `customer/createtransaction`
    }
    try {
        const response = await api.post(url, payload)
        if (response.status == 200) {
            dispatch(resetStatement())
            CommonFunction.message(response.data.message)
            return response
        }
    } catch (error) {
        CommonFunction.message(error.response.data.message, 'danger')
        throw error
    }
}

export const deleteTransaction = async (id, dispatch) => {
    try {
        const response = await api.get(`customer/deletetrans/${id}`)
        if (response.status == 200) {
             CommonFunction.message(response.data.message)
            return response
        }
    } catch (error) {
        CommonFunction.message(error.response.data.message, 'danger')
        throw error
    }
}

export const deleteAccount = async (id, dispatch) => {

    try {
        const response = await api.get(`customer/deleteaccount/${id}`)
        if (response.status == 200) {
            dispatch(resetgetAccount())
            dispatch(fetchgetAccount())
            dispatch(fetchgetllAccount())
                        dispatch(resetStatement())
            dispatch(fetchBudgetcategory())
            dispatch(resetBill())
            dispatch(fetchBills())
            dispatch(fetchCategory())
            dispatch(fetchgoallistAccount())
            dispatch(fetchGoalhis())
            CommonFunction.message(response?.data?.message)
            return response
        }
    } catch (error) {
        CommonFunction.message(error.response.data.message, 'danger')
        throw error
    }

}

