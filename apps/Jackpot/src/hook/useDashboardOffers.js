import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

const useDashboardOffers = () => {
  const { offersdata } = useSelector((state) => state.offers);
  const { openofferdata } = useSelector((state) => state.openoffers);
  const { handpickdata } = useSelector((state) => state.handpicks);

  const [offerssdata, setOfferdata] = useState([]);
  const [offerRec, setOfferRec] = useState([]);
  const [advanceOffer, setAdvanceOffers] = useState([]);

  useEffect(() => {
    if (openofferdata && 0 < openofferdata?.records?.length) {
      const recdata =
        openofferdata?.records?.filter((obj) => {
          const curDate = new Date();
          return curDate <= new Date(obj?.expiry);
        }) || [];
      setOfferRec(recdata);
    }
  }, [openofferdata]);

  useEffect(() => {
    if (0 < handpickdata?.records?.length) {
      setOfferdata(handpickdata?.records);
    }
    if (0 < offersdata?.records?.length) {
      const recdata =
        offersdata?.records?.filter((obj) => {
          const curDate = new Date();
          return curDate <= new Date(obj?.offer_id?.expiry);
        }) || [];
      setAdvanceOffers(recdata);
    }
  }, [handpickdata, offersdata]);

  return {
    offerssdata,
    offerRec,
    advanceOffer,
  };
};

export default useDashboardOffers;
