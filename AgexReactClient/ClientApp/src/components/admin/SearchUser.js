import React, { useState } from "react";

import AsyncSelect from "react-select/async";
import api from "../../apis/adminAPI";

const SearchUser = props => {
  const fetchUsers = inputValue => {
    if (inputValue.length < 3) return;
    return api.get(`/user/search?name=${inputValue}`).then(res => {
      return res.data.map(item => {
        return { ...item, label: item.fullName };
      });
    });
  };

  const onSelectChange = value => {
    props.onUserSelect(value);
  };

  return (
    <AsyncSelect
      isClearable={true}
      cacheOptions
      defaultOptions
      loadOptions={fetchUsers}
      onChange={onSelectChange}
    />
  );
};

export default SearchUser;

// import React, { useState, useEffect, useRef } from "react";
// import axios from "axios";
// import Cookies from "js-cookie";

// import { Autocomplete } from "materialize-css";

// function SearchUser(props) {
//   const inputRef = useRef();
//   const [inputValue, setInputValue] = useState("");

//   const api = axios.create({
//     baseURL: "https://agexdev2.agroterra.ru/api",
//     headers: {
//       Authorization: "bearer " + Cookies.get("token")
//     }
//   });

//   useEffect(() => {
//     // init autocomplete
//     let instance = Autocomplete.init(inputRef.current, {
//       data: {
//         Vasya: null,
//         Petya: null,
//         Vanya: "https://placehold.it/250x250"
//       }
//     });
//     inputRef.current.focus();
//   }, []);

//   useEffect(() => {
//     if (inputValue.length < 3) return;

//     api.get(`/user/search?name=${inputValue}`).then(res => {
//       // console.log(res.data);
//       let instance = Autocomplete.getInstance(inputRef.current);
//       console.log(res.data);
//       instance.updateData({
//         Жданов: { name: "dkfjls", id: 234234 },
//         Жданналвадыао: null,
//         ЖДагываоыдвао: "https://placehold.it/250x250"
//       });

//       // instance.updateData(
//       //   res.data.reduce((acc, val) => {

//       //   }, {})
//       // )
//     });
//   }, [inputValue]);

//   const onInputChange = e => {
//     setInputValue(e.target.value);
//   };

//   return (
//     <div className="input-field col s12">
//       <i className="material-icons prefix">textsms</i>
//       <input
//         type="text"
//         id="autocomplete-input"
//         className="autocomplete"
//         ref={inputRef}
//         value={inputValue}
//         onChange={e => onInputChange(e)}
//       />
//       <label htmlFor="autocomplete-input">Autocomplete</label>
//     </div>
//   );
// }

// export default SearchUser;
