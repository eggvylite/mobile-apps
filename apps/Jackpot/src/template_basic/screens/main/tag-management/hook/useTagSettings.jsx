import { useCallback, useMemo, useState } from 'react';
import { Alert } from 'react-native';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useDashboardUtils } from '../../../../../hook/useDashboardUtils';
import { addTag, fetchTag, updateTagname } from '../../../../../redux/slices/tagSlice';
import CommonFunction from '../../../../../utill/CommonFunction';
import appLog from '../../../../../constants/logger';
import api from '../../../../../service/api';

export default function useTagSettings() {
    const dispatch = useDispatch();
    const { storedata } = useSelector((state) => state.auth);
    const { tagdata, tagloading, tagerror } = useSelector((state) => state.taglist);
    const { formatDate, formatTime } = useDashboardUtils();
    const [tagUpdateLoading, setTagUpdateLoading] = useState(false)

    const [searchTerm, setSearchTerm] = useState('');

    const {
        control,
        handleSubmit,
        setValue,
        getValues,
        reset,
        watch,
        formState: { errors },
    } = useForm({
        defaultValues: {
            tag: '',
        },
    });

    const tags = useMemo(() => {
        return tagdata?.records || [];
    }, [tagdata]);

    const filteredTags = useMemo(() => {
        if (!searchTerm) return tags;
        return tags.filter(tag =>
            tag.tagname?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [tags, searchTerm]);

    const handleFetchTags = useCallback(() => {
        dispatch(fetchTag());
    }, [dispatch]);

    const handleAddTag = useCallback(async (data) => {

    }, [dispatch, storedata, reset]);

    const handleUpdateTag = useCallback(async (id, data) => {
        try {
            const tagValue = tags.find(t => t._id === id);
            if (!tagValue) return;
setTagUpdateLoading(true)
            const send = {
                tagname: data.tagName.trim(),
                tag_status: tagValue.tag_status || 'Active',
                tag_type: (tagValue.tag_type || 'DEBIT').toUpperCase(),
                customer_id: storedata?.id,
                device_name: CommonFunction.getdevicename(),
                platform: CommonFunction.getOS(),
                ipaddress: await CommonFunction.getipaddress(),
            };

            const isNameTaken = tags.find(
                (item) => item?.tagname?.toLowerCase() === send?.tagname?.toLowerCase()
            );

            if (isNameTaken && isNameTaken._id !== id) {
                CommonFunction?.message('Tag name already exists', 'danger')
                return;
            }

            const updatedData = tags.map((item) =>
                item._id === id ? { ...item, tagname: send.tagname } : item
            );

            const response = await api.post(`customer/cusupadtetaglist/${id}`, send);
              dispatch(updateTagname({ records: updatedData }));
            CommonFunction.message(response.data.message || 'Tag updated successfully');
setTagUpdateLoading(false)
        } catch (error) {
            appLog.error('handleUpdateTag error:', error);
            setTagUpdateLoading(false)
            CommonFunction.message(error?.response?.data?.message ?? 'Failed to update tag', 'danger')
            throw error;
        }
    }, [dispatch, storedata, tags]);

    const handleDeleteTag = useCallback(async (id) => {
        try {
            setTagUpdateLoading(true)
            const platform = CommonFunction.getOS();
            const deviceName = CommonFunction.getdevicename();
            const ipAddress = await CommonFunction.getipaddress();

            const updatedData = tags.filter((item) => item._id !== id);
            dispatch(updateTagname({ records: updatedData }));

            const response = await api.get(`customer/deletealltag/${id}?platform=${platform}&device_name=${deviceName}&ipaddress=${ipAddress}`)
            CommonFunction.message(response?.data?.message ?? 'Tag deleted successfully')
            setTagUpdateLoading(false)
        } catch (error) {
            appLog.error('handleDeleteTag error:', error);
            CommonFunction.message(error?.response?.data?.message ?? 'Failed to delete tag', 'danger')
            setTagUpdateLoading(false)
            throw error;
        }
    }, [dispatch, tags]);

    return {
        storedata,
        tagdata,
        tagloading,
        tagerror,
        formatDate,
        formatTime,
        tagUpdateLoading,
        tags,
        filteredTags,
        searchTerm,
        setSearchTerm,

        control,
        handleSubmit,
        setValue,
        getValues,
        reset,
        watch,
        errors,

        handleFetchTags,
        handleAddTag,
        handleUpdateTag,
        handleDeleteTag,
    };
}
