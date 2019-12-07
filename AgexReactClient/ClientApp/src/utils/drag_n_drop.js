import * as d3 from "d3";
import uuidv4 from "uuidv4";
import store from "../store";
import alert from "./Alert";
import { editPeriod, addNewPeriod } from "../actions/seasonPlan/periods";

// import { createRange, dateToString } from "../utils";
import { getPeriodDates, decideProductivity } from "../utils/periods";
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
    const [x] = d3.mouse(period);
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

export function movePeriod(d, period) {
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
    
    const { id } = periodData;
    let { machinery } = periodData;
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

export function copyPeriod(d, period, operations) {
  const [initX, initY] = d3.mouse(period);
  const length = d.days.length; // current amount of days in period
  let deltaX = 0;
  let deltaY = 0;

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
      const [x, y] = d3.mouse(period);
      const dx = x - initX;
      const dy = y - initY;
      deltaX = Math.round(dx / 40);
      deltaY = Math.round(dy / 20);
  
      resize.attr("x", () => deltaX * 40);
      resize.attr("y", () => deltaY * 20);
    }

    function mouseup () {
      win.on("mousemove", null).on("mouseup", null);
      d3.select(period)
        .selectAll(".resize")
        .remove();

      if( deltaY === 0) return;
      
      let end = new Date(d.days[d.days.length - 1].day);
      let start = new Date(d.days[0].day);
      start.setDate(start.getDate() + deltaX);
      end.setDate(end.getDate() + deltaX);

      const sourceIndex = +period.parentNode.parentNode.dataset.index;
      // get operation data
      let operationIndex = sourceIndex + deltaY;
      let operationDom = operations.filter(function(x) {
        let operationRow = d3.select(this);
        if (operationIndex === +operationRow.node().dataset.index) return x;
        else return false;
      });
      const op = d3
        .select(operationDom)
        .node()
        .node().__data__;

      const periodData = period.__data__;
      const operationData = op.data.node
        
      var { machinery } = periodData;
      const { agroOperation } = operationData;

      machinery = machinery.map(x => ({
        vehicle: x.vehicleModel,
        workEquipment: x.workEquipmentModel
      }));
      
      const machineryWithProductivity = decideProductivity(
        machinery,
        agroOperation.id
      );

      // check productivity
      const sumProductivity = machineryWithProductivity.reduce((acc, pair) => {
        return acc + pair.productivity
      }, 0)
      // Если суммарная норма выработки не больше 0, 
      // значит для техники в выбранной операции нет нормы выработки,
      // следовательно, данную технику выбрать нельзя => отмена копирования
      if (sumProductivity <= 0) {
        alert.success("Копирование запрещено. Копируемая техника недоступна для выбранной операции");
        return;
      }

      const days = getPeriodDates({
        ...operationData,
        startDate: start,
        endDate: end,
        machinery: machineryWithProductivity
      });

      const newPeriod = {
        ...d,
        id: uuidv4(),
        days
      };

      store.dispatch(addNewPeriod({ newPeriod, operationData }));
    }
}