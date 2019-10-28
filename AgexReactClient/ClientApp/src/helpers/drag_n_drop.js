import * as d3 from "d3";
import store from "../store";
import { editPeriod } from "../actions/periods";

// import { createRange, dateToString } from "../helpers";
import { getPeriodDates, decideProductivity } from "../helpers/periods";
// import { CELL_WIDTH } from "../constants";

var win = d3.select(window);

export function stretchPeriod(d) {
  const period = d3.select(this).node().parentNode;
  const periodData = period.__data__;
  const operationData = period.parentNode.__data__.data.node;
  const length = d.days.length; // current amount of days in period
  let delta = 0; // changed value of days (positive | negative)
  const isLeftCtrl = this.classList.contains("left");

  // append div element with dashed border
  var resize = d3
    .select(period)
    .append("rect")
    .attr("class", "resize")
    .attr("height", 20)
    .attr("width", () => length * 40)
    .attr("fill", "none")
    .attr("stroke-width", 2)
    .attr("stroke", "black")
    .attr("stroke-dasharray", "5");

  win.on("mousemove", mousemove).on("mouseup", mouseup);
  d3.event.preventDefault();
  d3.event.stopPropagation();

  function mousemove() {
    // get x coordinate relative to period div
    const [x, y] = d3.mouse(period);
    // get changed value of days and show how period will appear
    if (isLeftCtrl) {
      delta = Math.round(-x / 40);
      if (delta + length <= 0) delta = -length + 1;
      resize
        .attr("width", () => (length + delta) * 40)
        .attr("x", () => -delta * 40 + "px");
    } else {
      delta = Math.round((x - length * 40) / 40);
      if (delta + length <= 0) delta = -length + 1;
      resize.attr("width", () => (length + delta) * 40);
    }
  }

  function mouseup() {
    d3.select(period)
      .selectAll(".resize")
      .remove();
    win.on("mousemove", null).on("mouseup", null);
    if (delta === 0) return;
    // get new dates range
    let end = new Date(d.days[d.days.length - 1].day);
    let start = new Date(d.days[0].day);
    if (isLeftCtrl) start.setDate(start.getDate() - delta);
    else end.setDate(end.getDate() + delta);

    let { machinery, id } = periodData;
    const { agroOperation } = operationData;

    machinery = machinery.map(x => ({
      vehicle: x.vehicleModel,
      workEquipment: x.workEquipmentModel
    }));
    const machineryWithProductivity = decideProductivity(
      machinery,
      agroOperation.id
    );

    const days = getPeriodDates({
      ...operationData,
      periodId: id,
      startDate: start,
      endDate: end,
      machinery: machineryWithProductivity
    });
    if (days.length < 1) return;

    const changedPeriod = {
      ...d,
      days: days
    };
    store.dispatch(editPeriod({ changedPeriod, operationData }));
  }
}

export function movePeriod(d) {
  const period = d3.select(this).node();
  const periodData = period.__data__;
  const operationData = period.parentNode.__data__.data.node;
  const [initX] = d3.mouse(period);
  const length = d.days.length; // current amount of days in period
  let delta = 0;
  // append div element with dashed border
  var resize = d3
    .select(period)
    .append("rect")
    .attr("class", "resize")
    .attr("height", 20)
    .attr("width", () => length * 40)
    .attr("fill", "none")
    .attr("stroke-width", 2)
    .attr("stroke", "black")
    .attr("stroke-dasharray", "5");

  win.on("mousemove", mousemove).on("mouseup", mouseup);
  d3.event.preventDefault();
  function mousemove() {
    const [x] = d3.mouse(period);
    const dx = x - initX;
    delta = Math.round(dx / 40);
    resize.attr("x", () => delta * 40);
  }
  function mouseup() {
    win.on("mousemove", null).on("mouseup", null);
    d3.select(period)
      .selectAll(".resize")
      .remove();
    if (delta === 0) return;
    let end = new Date(d.days[d.days.length - 1].day);
    let start = new Date(d.days[0].day);
    start.setDate(start.getDate() + delta);
    end.setDate(end.getDate() + delta);

    // const dates = getPeriodDates({ ...d, startDate: start, endDate: end });
    let { machinery, id } = periodData;
    const { agroOperation } = operationData;

    machinery = machinery.map(x => ({
      vehicle: x.vehicleModel,
      workEquipment: x.workEquipmentModel
    }));
    const machineryWithProductivity = decideProductivity(
      machinery,
      agroOperation.id
    );

    const days = getPeriodDates({
      ...operationData,
      periodId: id,
      startDate: start,
      endDate: end,
      machinery: machineryWithProductivity
    });

    const changedPeriod = {
      ...d,
      days
    };
    store.dispatch(editPeriod({ changedPeriod, operationData }));
  }
}
