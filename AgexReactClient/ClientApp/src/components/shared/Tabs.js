import React, { useEffect, useRef } from "react";
import { Tabs as M_Tabs } from "materialize-css";

function Tabs(props) {
  const tabsRef = useRef();
  useEffect(() => {
    var instance = M_Tabs.init(tabsRef.current);
    instance.updateTabIndicator();
  }, []);

  return (
    <div className="row">
      <div className="col s12">
        <ul className="tabs tabs-fixed-width z-depth-1" ref={tabsRef}>
          <li className="tab">
            <a href="#test1">Test 1</a>
          </li>
          <li className="tab ">
            <a className="active" href="#test2">
              Test 2
            </a>
          </li>
        </ul>
      </div>
      <div id="test1" className="col s12">
        Test 1
      </div>
      <div id="test2" className="col s12">
        Test 2
      </div>
    </div>
  );
}

export default Tabs;
