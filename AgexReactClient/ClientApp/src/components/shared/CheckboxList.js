import React, { useState } from "react";
import Checkbox from "./Checkbox";

function CheckboxList({ list, onListChange }) {
  const [allChecked, toggleAll] = useState(() => {
    if (list.find(x => !x.checked)) return false;
    else return true;
  });

  const onInputChange = item => {
    const newList = list.map(x => {
      if (x.id === item.id) {
        x.checked = item.checked;
      }
      return x;
    });
    onListChange(newList);
  };

  const onAllChange = item => {
    toggleAll(item.checked);
    const newList = list.map(x => {
      if (!x.hidden) {
        return {
          ...x,
          checked: item.checked
        };
      } else return x;
    });
    onListChange(newList);
  };

  if (list.length)
    return (
      <React.Fragment>
        <Checkbox
          item={{ name: "Выбрать все", checked: allChecked }}
          onInputChange={onAllChange}
        />
        <div className="divider"></div>
        {list.map(listItem => {
          if (!listItem.hidden)
            return (
              <Checkbox
                key={listItem.id}
                item={listItem}
                onInputChange={onInputChange}
              />
            );
        })}
      </React.Fragment>
    );
  else return null;
}

export default CheckboxList;
