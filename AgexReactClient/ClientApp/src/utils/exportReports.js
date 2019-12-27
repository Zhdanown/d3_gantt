import reportsAPI from "../apis/reportsAPI";
import { saveAs } from "file-saver";
import { getPlanId } from "./plans";

export const exportMigrationReport = async () => {
  const planId = await getPlanId();

  await reportsAPI
    .get(`/seasonplan/movement-report-export/${planId}`)
    .then(response => {
      let url = window.URL.createObjectURL(response.data);
      saveAs(url, `migration-report.xlsx`);
    });
  return true;
};

export const exportDeviationReport = async () => {
  const planId = await getPlanId();

  await reportsAPI
    .get(`/seasonplan/tech-map-deviation-report-export/${planId}`)
    .then(response => {
      let url = window.URL.createObjectURL(response.data);
      saveAs(url, `deviation-report.xlsx`);
    });
  return true;
};

export const exportProficitReport = async () => {
  const planId = await getPlanId();

  await reportsAPI
    .get(`/seasonplan/profit-report-export/${planId}`)
    .then(response => {
      let url = window.URL.createObjectURL(response.data);
      saveAs(url, `proficit-report.xlsx`);
    });
  return true;
};

export const exportDeficitReport = async () => {
  const planId = await getPlanId();

  await reportsAPI
    .get(`/seasonplan/difict-report-export/${planId}`)
    .then(response => {
      let url = window.URL.createObjectURL(response.data);
      saveAs(url, `deficit-report.xlsx`);
    });
  return true;
};

export const exportLogsReport = async () => {
  const planId = await getPlanId();

  await reportsAPI
    .get(`/seasonplan/difict-report-export/${planId}`)
    .then(response => {
      let url = window.URL.createObjectURL(response.data);
      saveAs(url, `logs-report.xlsx`);
    });
  return true;
};

export const exportTechmapChangesReport = async () => {
  const planId = await getPlanId();

  await reportsAPI
    .get(`/seasonplan/difict-report-export/${planId}`)
    .then(response => {
      let url = window.URL.createObjectURL(response.data);
      saveAs(url, `techmap-changes-report.xlsx`);
    });
  return true;
};
