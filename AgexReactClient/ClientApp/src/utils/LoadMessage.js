import "../styles/css/alert.css";
import { Toast, toast as showToast } from "materialize-css";

const loadMessages = [
  // { url: "auth/logon", method: "post", message: "Авторизация" },
  {
    url: "auth/info",
    method: "get",
    message: "Загрузка профиля пользователя"
  },
  { url: "agrofield/season", method: "get", message: "Загрузка сезонов" },
  // {url: "seasonplan/types", method: "get", message: "Загрузка типов"},
  {
    url: "operation/agrooperations",
    method: "get",
    message: "Загрузка агроопераций"
  },
  {
    url: "seasonplan/farm-vehicle-models",
    method: "get",
    message: "Загрузка моделей самоходной техники"
  },
  {
    url: "seasonplan/farm-work-equipment-models",
    method: "get",
    message: "Загрузка моделей прицепных агрегатов"
  },
  {
    url: "seasonplan/season-plan-list",
    method: "get",
    message: "Загрузка плана"
  },
  {
    url: "seasonplan/create",
    method: "post",
    message: "Создание плана"
  },
  { url: "seasonplan/create", method: "post", message: "Создание плана" },
  { url: "seasonplan/period", method: "post", message: "Создание периода" },
  { url: "seasonplan/period", method: "put", message: "Изменение периода" },
  { url: "seasonplan/period", method: "delete", message: "Удаление периода" },
  { url: "seasonplan/operation", method: "post", message: "Создание операции" },
  {
    url: "seasonplan/operation",
    method: "delete",
    message: "Удаление операции"
  }
];

export function findMessage(request) {
  const entry = loadMessages.find(
    x => x.method === request.method && request.url.includes(x.url)
  );
  return entry;
}

const spinner =
  '<div class="lds-ring"><div></div><div></div><div></div><div></div></div>';

function getEntryId(entry) {
  let str = entry.method + entry.url;
  return str.replace("/", "_");
}

export function showLoadMessage(entry) {
  showToast({
    html: entry.message + spinner,
    classes: "toast success " + getEntryId(entry),
    displayLength: Infinity
  });
}

export function hideLoadMessage(entry) {
  let domElement = document.querySelector("." + getEntryId(entry));
  var toast = Toast.getInstance(domElement);
  toast.dismiss();
}
