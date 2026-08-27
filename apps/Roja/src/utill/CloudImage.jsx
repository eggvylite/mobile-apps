import { useSelector } from "react-redux";
import React from "react";
import { Image } from "react-native";
import FastImage from "@d11/react-native-fast-image";
import { banklogo, domain, imgApi, imgOfferApi } from "../service/environment";
import CommonFunction from "./CommonFunction";
import appLog from "../constants/logger";

const CloudImage = ({
    cloudSource,
    FolderPath = '',
    localFileName = 'placeholder.png',
    width = 'auto',
    height = 'auto',
    page = 'common',
    type = '',
    style = {},
}) => {


    const { themedata } = useSelector((state) => state.appcolor);
    const { storedata, storeloading, storeerror } = useSelector((state) => state.auth);




    const getImageSource = () => {

        if (page === 'common' || page === 'login' || page === 'main' || page === 'goal' || page === 'offers') {
            FolderPath = "uploads";
        } else if (page === 'bank') {
            FolderPath = "assets/banklogo";
        } else if (page === 'product') {
            FolderPath = "documents";
        }
        const cdn = storedata?.cdn || themedata?.cdn || 'Amazon';
        const cdnName = storedata?.cdnName || themedata?.cdnName || 'stg-roja.one-cdn';
        const url = storedata?.cdnURL || themedata?.cdnURL || 'https://cdn.roja.one'

        let img = '';

        if (page === 'bank') {
            img = domain === 'stg' ? `https://cdn.roja.one/${FolderPath}/${cloudSource}` : banklogo + cloudSource
        } else if (domain === 'local') {
            if (page === 'product') {
                img = cloudSource
                    ? imgOfferApi + cloudSource
                    : imgApi + localFileName;
            } else {
                img = cloudSource
                    ? imgApi + cloudSource
                    : imgApi + localFileName;
            }

        } else {
            img = cloudSource
                ? CommonFunction.imagecall(url, cdnName, cloudSource, cdn, FolderPath)
                : CommonFunction.imagecall(url, cdnName, localFileName, cdn, FolderPath);
        }


        return img;
    };

    const imageSrc = getImageSource();




    const defaultStyle = {
        width,
        height,
        ...style
    };

    if (type) {

        return (
            <FastImage
                style={defaultStyle}
                source={{ uri: imageSrc }}
                resizeMode={FastImage.resizeMode.contain}
            />
        )
    } else {
        return (
            <Image
                source={{ uri: imageSrc }}
                style={defaultStyle}
                resizeMode="contain"
            />
        );
    }


};

export default CloudImage;