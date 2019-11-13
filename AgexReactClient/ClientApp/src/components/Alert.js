import "../styles/css/alert.css";
import { toast } from "materialize-css";

const alert = {
  success: text => {
    toast({ html: text, classes: "toast success" });
  },
  error: text => {
    toast({ html: text, classes: "toast error" });
  },
  warning: text => {
    toast({ html: text, classes: "toast warning" });
  }
};

export default alert;
