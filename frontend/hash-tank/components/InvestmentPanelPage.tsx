import InvestmentCard from "@/components/InvestmentCard";
import InvestmentPanelFilter from "@/components/investmentPanelFilter";
import { API } from "@/constants/api.constants";
import { fetchProfile } from "@/slice/ProfileSlice";
import { fetchData } from "@/slice/SearchSlice";
import { AppDispatch, RootState } from "@/store";
import Fuse from "fuse.js";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const VerificationStatus = ['INTERESTED', 'REQUESTED', 'ACCEPTED','REJECTED'];


function InvestmentPanelPage() {
  const [dataIP, setDataIP] = useState<any[]>([]);
  const [filter, setFilter] = useState<any>();
  const [panelData, setPanelData] = useState<any[]>([]);
  const dispatch = useDispatch<AppDispatch>();

  const { profile } = useSelector((state: RootState) => state.profile);
  const { searchbase } = useSelector((state: RootState) => state.searchbase);

  const handleDeleteClick = (
    titanId: string,
    pitcherId: string,
    prodName: string
  ) => {
    const deleteIPdata = async () => {
      try {
        if(dataIP){
          const ipToKeep = dataIP.filter((data) => data.titanId != titanId 
            || data.pitcherId != pitcherId 
            || data.prodName != prodName);
          setDataIP(ipToKeep);
        }

        const response = await fetch(API.BASE_URL + API.DELETE_IP_DATA.route, {
          method: API.DELETE_IP_DATA.method,
          headers: {
            "Content-Type": "application/json",
            authorization: localStorage.getItem("idToken") || "",
          },
          body: JSON.stringify({
            userId: profile.role == 'pitcher' ? titanId : pitcherId,
            prodName: prodName,
          }),
        });
      } catch (error) {
        console.log(error);
      }
    };
    deleteIPdata();
  };

  useEffect(() => {

    if(profile.length ==0){
      dispatch(fetchProfile());
    }

    if(searchbase.length ==0){
      dispatch(fetchData());
    }

    const getIPdata = async () => {
      try {
        const response = await fetch(API.BASE_URL + API.GET_IP_DATA.route, {
          method: API.GET_IP_DATA.method,
          headers: {
            authorization: localStorage.getItem("idToken") || "",
          },
        });
        const responseData = await response.json();
        console.log(responseData);

        setDataIP(responseData);
      } catch (error) {
        console.log(error);
      }
    };
    getIPdata();
  }, []);

  useEffect(() => {
    console.log(filter);

    if (filter && dataIP) {
      let filteredData = dataIP;

      if (filter.searchValue) {
        const fuse = new Fuse(filteredData, {
          keys: ["username", "name", "prodName"],
        });

        const searchResult = fuse
          .search(filter.searchValue)
          .map((result) => result.item);
        filteredData = searchResult;
      }

      if (filter.statusValue) {
        filteredData = filteredData.filter(
          (data: any) => {
            if((data.status == 0 || data.status == 1) && filter.statusValue == 1)
              return true;
            return data.status == filter.statusValue;
          });
      }
      // data.status == filter.statusValue

      setPanelData(filteredData);
    } else {
      setPanelData(dataIP);
    }
  }, [filter, dataIP]);

  return (
    <div>
      <InvestmentPanelFilter setFilter={setFilter} />
      {panelData && typeof panelData == 'object' && panelData != undefined &&
        panelData.map((item: any, index: number) => (
          <InvestmentCard
            key={index}
            data={item}
            onDelete={handleDeleteClick}
          />
        ))}
    </div>
  );
}

export default InvestmentPanelPage;
