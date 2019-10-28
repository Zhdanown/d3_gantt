import React from "react";

function List(props) {
  const list = props.list.map(item => (
    <li className="list-group-item" key={item.id}>
      {item.title}
    </li>
  ));
  return <ul className="list-group">{list}</ul>;
}

export default List;
