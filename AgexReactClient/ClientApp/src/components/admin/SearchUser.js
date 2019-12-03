import React, { useState } from "react";

// import AsyncSelect from "react-select/async";
import MySelect from "../shared/MySelect";
import api from "../../apis/adminAPI";

const SearchUser = props => {
  const [users, setUsers] = useState([]);

  const onInputChange = inputValue => {
    if (inputValue.length < 3) return;
    api.get(`/user/search?name=${inputValue}`).then(res => {
      const fetchedUsers = res.data.map(item => {
        return { ...item, label: item.fullName };
      });
      setUsers(fetchedUsers);
    });
  };

  return (
    <MySelect
      autoFocus={true}
      name="search_user"
      label="none"
      options={users}
      onChange={value => props.onUserSelect(value)}
      onInputChange={onInputChange}
    />
  );
};

export default SearchUser;

// const SearchUser = props => {
//   const fetchUsers = inputValue => {
//     if (inputValue.length < 3) return;
//     return api.get(`/user/search?name=${inputValue}`).then(res => {
//       return res.data.map(item => {
//         return { ...item, label: item.fullName };
//       });
//     });
//   };

//   const onSelectChange = value => {
//     props.onUserSelect(value);
//   };

//   return (
//     <AsyncSelect
//       className="react-select"
//       // classNamePrefix="rs"
//       // isClearable={true}
//       // cacheOptions
//       // defaultOptions
//       loadOptions={fetchUsers}
//       onChange={onSelectChange}
//     />
//   );
// };

// export default SearchUser;
