import { useContext } from "react";
import api from "../service/api"
import CommonFunction from "../utill/CommonFunction";
import { fetchCategory } from "../redux/slices/categorySlice";
import { resetStatement } from "../redux/slices/statementSlice";

export const createbudgetgroup = async (payload) => {
    try {
        const response = await api.post(`dashboard/createbudgetgroupcate`, payload)
        if (response.status == 200) {
            CommonFunction.message(response.data.message)
            return response
        }
    } catch (error) {
        CommonFunction.message(error.response.data.message, 'danger')
        throw error
    }
}

export const editBudgetgroup = async (id, payload) => {
    try {
        const response = await api.post(`dashboard/updatebudgetgroupcate/${id}`, payload)
        if (response.status == 200) {
            CommonFunction.message(response.data.message)
            return response
        }
    } catch (error) {
        CommonFunction.message(error.response.data.message, 'danger')
        throw error
    }
}

export const deleteMovebudget = async (id, type, payload,dispatch) => {
    try {
        const response = await api.post(`dashboard/deletemovebudget/${id}/${type}`, payload)
        if (response.status == 200) {
            CommonFunction.message(response.data.message)
            dispatch(resetStatement())
            return response
        }
    } catch (error) {
        CommonFunction.message(error.response.data.message, 'danger')
        throw error
    }
}

export const addCategory = async (payload, dispatch) => {
    try {
        const response = await api.post('dashboard/createbudgetgroupcate', payload)
        if (response.status == 200) {
            CommonFunction.message(response.data.message)
            dispatch(resetStatement())
            return response
        }
    } catch (error) {
        CommonFunction.message(error.response.data.message, 'danger')
        throw error
    }
    
}

export const editCategory = async (payload) => {
    try {
        const response = await api.post(`dashboard/updatebudgetgroupcate/${payload?.id}`, payload)
        if (response.status == 200) {
            CommonFunction.message(response.data.message)
            return response
        }
    } catch (error) {
        CommonFunction.message(error.response.data.message, 'danger')
        throw error
    }
}

export const setBudget = async (catgoryid, payload) => {
    try {
        const response = await api.post(`dashboard/setbudget/${catgoryid}`, payload)
        if (response.status == 200) {
            CommonFunction.message(response.data.message)
            return response
        }
    } catch (error) {
        CommonFunction.message(error.response.data.message, 'danger')
        throw error
    }
}