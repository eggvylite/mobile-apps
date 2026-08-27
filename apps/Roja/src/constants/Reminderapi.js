import { useContext } from "react";
import api from "../service/api"
import CommonFunction from "../utill/CommonFunction";
import { fetchReminder } from "../redux/slices/reminderSlice";
import { fetchBills } from "../redux/slices/billSlice";
import { resetStatement } from "../redux/slices/statementSlice";


export const markasPaid = async (payload, dispatch) => {
    try {
        const response = await api.get(`dashboard/remindermarkaspaid/` + payload?._id)
        if (response.status == 200) {
            CommonFunction.message(response.data.message)
            dispatch(fetchReminder())
            return response
        }
    } catch (error) {
        CommonFunction.message(error.response.data.message, 'danger')
        throw error
    }
}

export const cancelBill = async (payload, dispatch) => {
    try {
        const response = await api.get('dashboard/cancelbill/' + payload?._id)
        if (response.status == 200) {
            CommonFunction.message(response.data.message)
            dispatch(fetchBills())
            dispatch(fetchReminder())
            return response
        }
    } catch (error) {
        CommonFunction.message(error.response.data.message, 'danger')
        throw error
    }
}

export const deleteBill = async (payload, dispatch) => {
    try {
        const response = await api.get('dashboard/deletebills/' + payload?._id)
        if (response.status == 200) {
            CommonFunction.message(response.data.message)
            dispatch(fetchBills())
            dispatch(fetchReminder())
            dispatch(resetStatement())
            return response
        }
    } catch (error) {
        CommonFunction.message(error.response.data.message, 'danger')
        throw error
    }
}

export const createBill = async (payload, dispatch) => {
    try {
        const response = await api.post('dashboard/createbills', payload)
        if (response.status == 200) {
            CommonFunction.message(response.data.message)
            dispatch(fetchBills())
            dispatch(fetchReminder())
            dispatch(resetStatement())
            return response
        }
    } catch (error) {
        CommonFunction.message(error.response.data.message, 'danger')
        throw error
    }
}

export const updateBill = async (id, payload, dispatch) => {
    try {
        const response = await api.post('dashboard/updatebills/' + id, payload)
        if (response.status == 200) {
            CommonFunction.message(response.data.message)
            dispatch(fetchBills())
            dispatch(fetchReminder())
            return response
        }
    } catch (error) {
        CommonFunction.message(error.response.data.message, 'danger')
        throw error
    }
}

export const unLinkTransaction = async (payload, dispatch) => {
    var url = payload?.reminder_id ? `dashboard/unlinktransaction/${payload?._id}/${payload?.reminder_id}` :
        `/dashboard/unlinkbill/${transaction?._id}`
    try {
        const response = await api.get(url)
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

export const linkTransaction = async (payload, dispatch) => {
    var url = `dashboard/linktransaction`
    try {
        const response = await api.post(url, payload)
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


