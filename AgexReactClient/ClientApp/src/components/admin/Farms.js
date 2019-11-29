import React, { useState, useEffect } from "react";
import CollapsibleCard from "../shared/CollapsibleCard";
import Spinner from "../shared/Spinner";
import SpinnerWrapper from "../shared/SpinnerWrapper";
import CheckboxList from "../shared/CheckboxList";

function Farms({ farms, userFarms, ...props }) {
  // syncronize checkboxes state
  farms = farms.map(farm => ({
    ...farm,
    checked: userFarms.find(x => x.id === farm.id) ? true : false
  }));

  const [farmList, setFarmList] = useState(farms);

  useEffect(() => {
    props.onChange(farmList);
  }, [farmList]);

  return (
    <CollapsibleCard
      header={"Хозяйства (" + farmList.filter(x => x.checked).length + ")"}
    >
      {farms.length ? (
        <CheckboxList
          list={farmList}
          onListChange={newList => setFarmList(newList)}
        />
      ) : (
        <SpinnerWrapper>
          <Spinner />
        </SpinnerWrapper>
      )}
    </CollapsibleCard>
  );
}

export default Farms;
