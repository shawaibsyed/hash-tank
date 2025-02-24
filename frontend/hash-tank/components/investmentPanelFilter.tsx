import React, { useEffect, useState } from 'react';
import { Card, CardContent, TextField, Button, FormControl, InputLabel, Select, MenuItem, Typography } from '@mui/material';
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { fetchProfile } from "@/slice/ProfileSlice";
import { fetchtags } from "@/slice/TagsSlice";

const InvestmentPanelFilter:React.FC<InvestmentPanelFilterProps> = (props: InvestmentPanelFilterProps) => {


  const [searchValue, setSearchValue] = useState('');
  const [statusValue, setStatusValue] = useState<string>('');

  const { profile } = useSelector((state: RootState) => state.profile);
  const dispatch = useDispatch<AppDispatch>();


  useEffect(() => {
    if (profile.length === 0){
      dispatch(fetchProfile());
      dispatch(fetchtags());
    }
  }, [dispatch, profile]);


  const handleApply = () => {
    props.setFilter({searchValue, statusValue});
    console.log('Apply button clicked');
  };

  const handleSearchChange = (event:any) => {
    setSearchValue(event.target.value);
  };

  const handleStatusChange = (event:any) => {
    setStatusValue(event.target.value as string);
  };

  return (
    <div >
      <div>
    <Card sx={{ width:"90rem", marginTop:"2rem", boxShadow: "rgba(0, 0, 0, 0.25) 0px 25px 50px -12px", marginLeft:"2rem" }}>
      <CardContent> 
        <form>
          <TextField label="Search" variant="outlined" fullWidth style={{ marginBottom: '1rem', width:"30%", marginRight:"2rem", marginLeft:"2rem"}} value={searchValue}
        onChange={handleSearchChange} />
          <FormControl variant="outlined" fullWidth style={{ marginBottom: '1rem', width:"30%" }} >
            <InputLabel>Status</InputLabel>
            <Select label="Status"  value={statusValue}
          onChange={handleStatusChange}>
              <MenuItem value="1">In Progress</MenuItem>
              <MenuItem value="2">Approved</MenuItem>
              <MenuItem value="3">Rejected</MenuItem>

            </Select>
          </FormControl>
          <Button variant="contained" color="primary" onClick={handleApply} style={{marginLeft:"20rem", marginTop: "0.5rem"}}>
            Apply
          </Button>
        </form>
      </CardContent>
    </Card>
    </div>
    <div>
       
        <Card sx={{ marginTop:"2rem", border: 'none',  fontSize:"20px", width:"90rem", marginLeft:"2rem",
                display: 'flex', alignItems: 'center', background: 'linear-gradient(180deg, #2191B8 0%, #0E4A5F 100%)', 
                color:"white", boxShadow: "rgba(0, 0, 0, 0.25) 0px 25px 50px -12px", fontFamily: "'Abril Fatface', cursive"}}>
        <Typography variant="h6" style={{ margin: '1rem', marginLeft: "3rem"  }}> Product Name</Typography>
        <Typography variant="h6" style={{ marginLeft: "19rem"  }}>{profile.role=='titan'?'PITCHER':'TITAN'}</Typography>
        <Typography variant="h6" style={{ marginLeft: "11rem"  }}>Status</Typography>
        <Typography variant="h6" style={{ marginLeft: "14rem"  }}>Remarks</Typography>
        </Card>
    </div>
    </div>
  );
};

export default InvestmentPanelFilter;

type InvestmentPanelFilterProps = {
  setFilter: any;
}
