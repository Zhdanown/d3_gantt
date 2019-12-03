import reportsAPI from "../apis/reportsAPI";
import { saveAs } from "file-saver";
import { getSeasonId } from "./plans";

export const exportMigrationReport = async () => {
  const seasonId = await getSeasonId();

  await reportsAPI
    .get(`/seasonplan/movement-report-export/${seasonId}`)
    .then(response => {
      let url = window.URL.createObjectURL(response.data);
      saveAs(url, `migration-report.xlsx`);
    });
  return true;
};

export const exportDeviationReport = async () => {
  const seasonId = await getSeasonId();

  await reportsAPI
    .get(`/seasonplan/tech-map-deviation-report-export/${seasonId}`)
    .then(response => {
      let url = window.URL.createObjectURL(response.data);
      saveAs(url, `deviation-report.xlsx`);
    });
  return true;
};

export const exportProficitReport = async () => {
  const seasonId = await getSeasonId();

  await reportsAPI
    .get(`/seasonplan/profit-report-export/${seasonId}`)
    .then(response => {
      let url = window.URL.createObjectURL(response.data);
      saveAs(url, `proficit-report.xlsx`);
    });
  return true;
};

export const exportDeficitReport = async () => {
  const seasonId = await getSeasonId();

  await reportsAPI
    .get(`/seasonplan/difict-report-export/${seasonId}`)
    .then(response => {
      let url = window.URL.createObjectURL(response.data);
      saveAs(url, `deficit-report.xlsx`);
    });
  return true;
};
