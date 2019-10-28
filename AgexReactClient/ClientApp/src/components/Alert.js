import "../styles/css/alert.css";

const alert = {
  success: text => {
    window.M.toast({ html: text, classes: "toast success" });
  },
  error: text => {
    window.M.toast({ html: text, classes: "toast error" });
  },
  warning: text => {
    window.M.toast({ html: text, classes: "toast warning" });
  }
};

export default alert;
