import React from "react";
import alert from "../../../utils/Alert";

const Updates = ({data, ...props}) => {
    if (!data) return null;

    data.forEach(entry => {
        alert.success(entry.comment)
    })
    return 

}

const mapStateToProps = state => {
    return {
        data: state.spUpdate.data
    }
}

export default connect(mapStateToProps)(Updates)