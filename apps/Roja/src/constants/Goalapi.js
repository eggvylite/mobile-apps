import { useContext } from "react";
import api from "../service/api"
import CommonFunction from "../utill/CommonFunction";


export const contriputeGoal = async (payload) => {
    try {
        const response = await api.post(`dashboard/goalcontribution`, payload)
        if (response.status == 200) {
            CommonFunction.message(response.data.message)
            return response
        }
    } catch (error) {
        CommonFunction.message(error.response.data.message, 'danger')
        throw error
    }
}

export const withDrawgoal = async (payload) => {
    try {
        const response = await api.post('dashboard/goalwithdraw/' + payload?.goal_id, payload)
        if (response.status == 200) {
            CommonFunction.message(response.data.message)
            return response
        }
    } catch (error) {
        CommonFunction.message(error.response.data.message, 'danger')
        throw error
    }
}

export const deleteGoal = async (id) => {
    try {
        const response = await api.get('dashboard/deletegoals/' + id)
        if (response.status == 200) {
            CommonFunction.message(response.data.message)
            return response
        }
    } catch (error) {
        CommonFunction.message(error.response.data.message, 'danger')
        throw error
    }
}

export const goalApi = async (payload, navigation, type) => {
    try {
        var url = ''
        if (type) {
            url = 'dashboard/updategoals/' + payload?._id
        } else {
            url = 'dashboard/creategoals'
        }
        const response = await api.post(url, payload)
        if (response.status == 200) {
            CommonFunction.message(response.data.message)
            navigation.navigate('Goal')
            return response
        }
    } catch (error) {
        CommonFunction.message(error.response.data.message, 'danger')
        throw error
    }
}