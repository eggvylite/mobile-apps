import React, { createContext, useState, useEffect } from "react";
import io from "socket.io-client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CommonFunction from "../utill/CommonFunction";
import { useDispatch, useSelector } from 'react-redux';
import { fetchcolor } from "../redux/slices/appcolorSlice";
import { fetchadvanceActiveSubscription, fetchAdvancesList, fetchOutstanding } from "../redux/slices/advenceSlice";
import { fetchTransaction, resetTransaction } from "../redux/slices/transactionSlice";
import { fetchDashboardmenu } from "../redux/slices/dashboardmenuSlice";
import { fetchcustomNotication } from "../redux/slices/notificationCustomSlice";
import { fetchReminder } from "../redux/slices/reminderSlice";
import { fetchBills } from "../redux/slices/billSlice";
import { fetchgoalAccount, fetchgoallistAccount } from "../redux/slices/goalSlice";
import { fetchAccount } from "../redux/slices/accountSlice";
import { fetchgetAccount, fetchgetllAccount } from "../redux/slices/getmanulaccountSlice";
import { fetchnamegetAccount, resetgetaccount } from "../redux/slices/getnameAccountSlice";
import { resetStatement } from "../redux/slices/statementSlice";
import { fetchBudgetcategory } from "../redux/slices/budgetcategorySlice";
import { fetchCategory } from "../redux/slices/categorySlice";
import { resetAdvTransaction } from "../redux/slices/advanceTransSlice";
import { fetchcurrentsubscription } from "../redux/slices/subscriptionSlice";
import { fetchChoosePlan } from "../redux/slices/choosePlanSlice";
import { fetchLabel, resetlabel } from "../redux/slices/labelSlice";
import { updateAuthdata } from "../redux/slices/authSlice";
import { fetchCustomer } from "../redux/slices/customerSlice";
import { fetchNotication, resetNotification } from "../redux/slices/notificationSlice";
import { fetchOffers } from "../redux/slices/offerSlice";
import { fetchOffertype } from "../redux/slices/offertypeSlice";
import { fetchElgibleoffers } from "../redux/slices/elgibleofferSlice";
import { fetchOpenoffers } from "../redux/slices/openofferSlice";
import { fetchHanpickoffers } from "../redux/slices/offerHandSlice";
import { domain, socketurl } from "../service/environment";
import { getLoginInfo } from "../service/storage";
import { fetchGoalhis } from "../redux/slices/goalhisSlice";
import { fetchWorkflowLabels, fetchWorkflowSettings } from "../redux/slices/workflowlableSilce";
import { fetchMarketplace, fetchMarketplaceCategory, fetchMarketplaceFeatures, fetchMarketplaceHandPickOffer } from "../redux/slices/merketplaceSlice";

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
    const [message, setMessage] = useState(null);
    const [socket, setSocket] = useState(null);
    const dispatch = useDispatch();


    const soobj = {
        transports: ["websocket"],
        reconnection: true,
    }
    useEffect(() => {
        const connectSocket = async () => {
            var newSocket = ''
            var socketobj = {}
            if (domain === 'beta' || domain === 'live' || domain === 'dev' || domain === 'stg' || domain === 'demo') {
                socketobj = {
                    path: domain === 'beta' ? '/server/socket.io' : '/socket.io',
                    ...soobj
                }
            } else {
                socketobj = {
                    ...soobj
                }
            }

            newSocket = io(socketurl, socketobj);


            newSocket.on('connect', () => {
                console.log("Socket connected");
            });

            newSocket.on("message", async (msg) => {
                const storedUser = await getLoginInfo()
                console.log(msg)
                if (storedUser && msg.device_id === await CommonFunction.getDeviceID() && msg.phone === storedUser.phone) {
                    setMessage('logout');
                } else if (msg === 'Theme') {
                    dispatch(fetchcolor())
                } else if (msg?.customerId === storedUser?.id) {
                    dispatch(fetchOutstanding())
                    dispatch(fetchTransaction(50))
                } else if (msg === 'dashboard') {
                    dispatch(fetchDashboardmenu())
                } else if (msg === 'notification_labels') {
                    dispatch(fetchcustomNotication())
                } else if ((msg?.type === 'bill' || msg?.type === 'reminders') && msg?.customer === storedUser?.id) {
                    dispatch(fetchReminder())
                    dispatch(fetchBills())

                } else if (msg?.type === 'goal' && msg?.customer === storedUser?.id) {
                    console.log(msg)
                    setMessage(msg);
                    dispatch(fetchGoalhis())
                    dispatch(fetchgoalAccount())
                    dispatch(fetchgoallistAccount())
                } else if ((msg?.type === 'accounts' || msg?.type === 'transaction') && msg?.customer === storedUser?.id) {
                    setMessage('account')
                    dispatch(resetgetaccount())

                    dispatch(fetchnamegetAccount())

                    dispatch(resetStatement())

                    dispatch(fetchgetAccount())
                    dispatch(fetchgetllAccount())
                    // dispatch(fetchAccount())

                    // dispatch(fetchBudgetcategory())
                    // dispatch(fetchCategory())
                    // setMessage(msg);

                } else if ((msg?.type === 'budget_group_category' || msg?.type === 'budget' || msg?.type === 'expectincome') && msg?.customer === storedUser?.id) {
                    dispatch(fetchBudgetcategory())
                    dispatch(fetchCategory())
                } else if (msg?.type === 'Advance' && msg?.customer === storedUser?.id) {
                    dispatch(resetNotification())
                    dispatch(resetAdvTransaction())
                    dispatch(resetTransaction())
                    dispatch(fetchOutstanding())
                    dispatch(fetchNotication(100))
                } else if (msg?.type === 'subscription' && msg?.customer === storedUser?.id) {
                    dispatch(fetchcurrentsubscription())
                    dispatch(fetchChoosePlan())
                    const infodata = {
                        ...storedUser, plan: 'Yes'
                    }
                    CommonFunction.storeData('@cusLoginInfo', infodata)
                    dispatch(resetNotification())
                    dispatch(updateAuthdata(infodata))
                    dispatch(fetchCustomer())
                    dispatch(fetchadvanceActiveSubscription())
                    dispatch(resetTransaction())
                    dispatch(fetchNotication(100))

                } else if (msg?.type === 'offers_refresh') {
                    // await dispatch(fetchElgibleoffers())
                    dispatch(fetchOffers())
                    //  dispatch(fetchOffertype())
                } else if (msg?.type === "open_offer") {
                    dispatch(fetchOpenoffers())
                } else if (msg?.type === "basic_offer") {
                    dispatch(fetchHanpickoffers())
                } else if (msg?.type === 'Workflow') {

                    dispatch(fetchWorkflowSettings())
                } else if (msg?.type === 'info') {

                    dispatch(fetchWorkflowLabels())
                } else if (msg?.type === 'info') {

                    dispatch(fetchWorkflowLabels())
                } else if (msg?.type === 'marketplace_offers') {
                    dispatch(fetchMarketplace());
                    dispatch(fetchMarketplaceCategory());
                    dispatch(fetchMarketplaceHandPickOffer())

                } else if (msg?.type === 'marketplace_features') {
                    dispatch(fetchMarketplaceFeatures())
                } else if (msg?.type === 'labels') {
                    console.log('yest ')
                    dispatch(resetlabel())
                    dispatch(fetchLabel())
                }
                else {

                    console.log(msg)
                    setMessage(msg);
                }

            });


        };

        connectSocket();

        return () => {
            if (socket || message) {
                socket.disconnect();
                console.log("Socket disconnected");
            }
        };
    }, []);

    const changeSetmsg = (msg) => {
        console.log(msg)
        setMessage(msg);
    };

    const changeMsg = () => {
        console.log('i am clear message')
        setMessage(null)
    }

    return (
        <SocketContext.Provider value={{ message, changeMsg, changeSetmsg }}>
            {children}
        </SocketContext.Provider>
    );
};