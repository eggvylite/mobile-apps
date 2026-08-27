import { useContext } from "react";
import api from "../service/api"
import CommonFunction from "../utill/CommonFunction";
import { fetchTag } from "../redux/slices/tagSlice";
import { fetchTagdescription } from "../redux/slices/tagdescriptionSlice";

export const tagUpdate = async (payload, id, dispatch) => {
    try {
        const response = await api.post("customer/tagupdate/" +id, payload)
        if (response.status == 200) {
            CommonFunction.message(response.data.message)
            updateTagapi(dispatch)
            return response
        }
    } catch (error) {
        CommonFunction.message(error.response.data.message, 'danger')
        throw error
    }
}

export const tagSystemtoCustom = async (payload, dispatch) => {
    try {
        const response = await api.post("customer/systobecustom/", payload)
        if (response.status == 200) {
            CommonFunction.message(response.data.message)
            updateTagapi(dispatch)
            return response
        }
    } catch (error) {
        CommonFunction.message(error.response.data.message, 'danger')
        throw error
    }
}

export const createTag = async (payload, dispatch) => {
    try {
        const response = await api.post("customer/addtag", payload)
        if (response.status == 200) {
            CommonFunction.message(response.data.message)
            updateTagapi(dispatch)
            return response
        }
    } catch (error) {
        CommonFunction.message(error.response.data.message, 'danger')
        throw error
    }
}

const updateTagapi = (dispatch) => {
    dispatch(fetchTag())
    dispatch(fetchTagdescription())

}