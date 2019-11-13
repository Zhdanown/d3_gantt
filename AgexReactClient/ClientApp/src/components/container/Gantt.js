import React, { useEffect } from "react";
import * as d3 from "d3";
import { connect } from "react-redux";
import "../../styles/css/diagramm.css";
import { Tooltip } from "materialize-css";

/** import helpers */
import {
  getDateRange,
  dateToString,
  getLeftOffset,
  getMonday,
  getSunday,
  createRange
} from "../../helpers/dateHelper";
import {
  getHierarchy as getTree,
  getOperationDates,
  evalMachineryQuantity,
  getSquareRemainder,
  sortOperations
} from "../../helpers/plans";
import { isTermsMet } from "../../helpers/periods";
import { stretchPeriod, movePeriod } from "../../helpers/drag_n_drop";
import { rebaseToggledState, appendIdsToNodes } from "../../helpers/tree";

// import { CELL_HEIGHT } from "../../constants";

const applyTimeFrame = (dates, tf) => {
  if (tf.type === "day") return dates;
  else {
    let firstMonday = getMonday(dates[0]);
    let lastSunday = getSunday(dates[dates.length - 1]);
    // create new Range
    let newRange = createRange(firstMonday, lastSunday);
    let weeks = splitArray(newRange);

    function splitArray(arr) {
      let newArr = [];
      while (arr.length) newArr.push(arr.splice(0, 7));
      return newArr;
    }
    return weeks;
  }
};

var showEmptySet = () => {
  d3.select(".diagramm .legend")
    .selectAll("*")
    .remove();
  d3.select(".diagramm .chart .dates .wrapper")
    .selectAll("*")
    .remove();
  d3.select(".diagramm .grid")
    .selectAll(".grid-row")
    .remove();
  d3.select(".diagramm .grid foreignObject")
    .attr("width", 0)
    .attr("height", 0);
};

var updateGannt = null;

function Gantt({ timeframe, ...props }) {
  useEffect(() => {
    let { operations } = props;
    if (!operations.length) {
      showEmptySet();
      return;
    }
    operations = sortOperations(operations);

    // /** sort operations */
    // operations.sort((a, b) => {
    //   const aTime = new Date(a.startDate).getTime();
    //   const bTime = new Date(b.startDate).getTime();
    //   // sort by startDate
    //   if (aTime === bTime) {
    //     // then sort by holdingName
    //     if (a.holding.name > b.holding.name) return 1;
    //     if (a.holding.name < b.holding.name) return -1;
    //     else {
    //       // then sort by farm name
    //       if (a.farm.name > b.farm.name) return 1;
    //       if (a.farm.name < b.farm.name) return -1;
    //       else {
    //         // then sort by culture name
    //         if (a.crop.name > b.crop.name) return 1;
    //         if (a.crop.name < b.crop.name) return -1;
    //         return 0;
    //       }
    //     }
    //   } else return aTime - bTime;
    // });

    /** append dates to each operation */
    operations = operations.map(operation => {
      let dates = getOperationDates(operation);
      return {
        ...operation,
        dates
      };
    });

    const tree = getTree(operations);

    // append id's to hierarchy nodes
    let hierarchy = d3.hierarchy(tree);
    hierarchy = appendIdsToNodes(hierarchy);

    if (updateGannt) updateGannt(hierarchy, timeframe);
    else updateGannt = init(hierarchy, timeframe);

    // init gannt when component mounted
  }, [props.operations, timeframe]);

  let clickRoot = null;
  let clickTimeframe = null;

  const init = (tree, timeframe) => {
    let root = tree;
    const width = 960;
    const height = 700;

    let legend = d3.select(".diagramm .legend");
    let chart = d3.select(".diagramm .chart");
    let datesBar = chart
      .append("div")
      .attr("class", "dates")
      .append("div")
      .attr("class", "wrapper");
    let grid = chart
      .append("div")
      .attr("class", "grid")
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    chart.select(".grid").style("margin-top", "-20px");

    // add tiled background
    grid
      .append("svg:foreignObject")
      .attr("width", width)
      .attr("height", height)
      .append("xhtml:body")
      .style("height", "100%")
      .attr("xmlns", "http://www.w3.org/1999/xhtml")
      .append("div")
      .attr("class", "background")
      .style("width", "100%")
      .style("height", "100%");

    let t = 400;

    update(root, timeframe);

    function update(root, timeframe, preserveOpenedNodes = true) {
      if (preserveOpenedNodes && clickRoot) {
        root = rebaseToggledState(root, clickRoot);
      }
      clickRoot = root;
      clickTimeframe = timeframe;
      let nodes = root.descendants();

      const operations = nodes
        .filter(x => x.height === 0)
        .reduce((acc, cur) => {
          if (cur.data.node) acc = [...acc, cur.data.node];
          return acc;
        }, []);
      let dates = applyTimeFrame(getDateRange(operations), timeframe);
      nodes = nodes.map(item => {
        item.data.dateRange = [...dates];
        return item;
      });

      // update svg (grid) size
      grid
        .attr("width", dates.length * 40)
        .attr("height", () => nodes.length * 20);

      // update diagramm width
      d3.select(".diagramm").attr("width", dates.length * 40);

      // grid.attr("transform", "translate(0, 20)");
      legend.attr("transform", "translate(0, 20)");

      // update tiled background
      grid
        .select("foreignObject")
        .attr("width", dates.length * 40)
        .attr("height", () => nodes.length * 20);

      grid.select(".background").on("click", function(e) {
        d3.event.stopPropagation();

        console.log(window.devicePixelRatio);
        let { offsetX, offsetY } = d3.event;

        // take into account broswer zoom level
        offsetX = offsetX * window.devicePixelRatio;
        offsetY = offsetY * window.devicePixelRatio;

        // get date
        let date = dates[Math.floor(offsetX / 40)];

        // get operation data
        let operationIndex = Math.floor(offsetY / 20);
        let operationDom = operation.filter(function(x) {
          let operationRow = d3.select(this);
          if (operationIndex === +operationRow.node().dataset.index) return x;
          else return false;
        });
        let op = d3
          .select(operationDom)
          .node()
          .node().__data__;

        if (op.height !== 0) return;

        let operationData = op.data.node;

        props.addNewPeriod({ ...operationData, selectedDay: date });
      });

      /*
       ********** LEGENDNODES ********
       */
      let legendNode = legend.selectAll(".legendNode").data(nodes, d => d.id);

      legendNode
        .exit()
        .transition()
        .style("opacity", 0)
        .duration(t)
        .remove();

      let legendNodeEnter = legendNode
        .enter()
        .append("div")
        .attr("class", "legendNode");

      legendNodeEnter.style("top", d => top(d) * 20 + "px");

      legendNodeEnter
        .append("div")
        .attr("class", "text")
        .style("margin-left", d => {
          return (d.depth - 1) * 10 + 20 + "px";
        });

      // append "drop_down"
      legendNodeEnter
        .filter(d => d.height !== 0)
        .select(".text")
        .append("i")
        .attr("class", "material-icons drop-down")
        .html("arrow_drop_down");

      // append "drop_up"
      legendNodeEnter
        .filter(d => d.height !== 0)
        .select(".text")
        .append("i")
        .attr("class", "material-icons drop-up")
        .html("arrow_drop_up");

      // append node name
      legendNodeEnter
        .select(".text")
        .append("span")
        .html(d => d.data.name);

      // append crop square
      legendNodeEnter
        .filter(d => d.height === 1)
        .select(".text")
        .append("span")
        .html(d => " (" + d.data.node.totalCropSquare + " га)");

      // append operation square
      legendNodeEnter
        .filter(d => d.height === 0)
        .select(".text")
        .on("click", panToAgroterms)
        .append("span")
        .html(
          d =>
            d.data.node &&
            " (" +
              (d.data.node.cropSquare - getSquareRemainder(d.data.node)) +
              "/" +
              d.data.node.cropSquare +
              " га)"
        );

      // add tooltips
      legendNodeEnter
        .filter(d => d.height === 0)
        .select(".text")
        .each(addTooltip);

      function panToAgroterms(d) {
        // get startDate of agroterms
        const { date: startDate } = d.data.node.dates[0];
        // get index of startDate
        console.log(dates.length);
        const index = dates.findIndex(x => x.getTime() === startDate.getTime());
        let diagramm = document.querySelector(".diagramm");
        // diagramm.scrollLeft = (index - 3) * 40;
        diagramm.scroll({
          top: diagramm.scrollTop,
          left: (index - 3) * 40,
          behavior: "smooth"
        });
      }

      function addTooltip(d) {
        let elem = d3.select(this);
        // let dom = elem.node();
        elem
          .classed("tooltiped", true)
          // .attr("data-position", "top")
          .attr(
            "data-tooltip",
            d.data.name +
              " (" +
              (d.data.node.cropSquare - getSquareRemainder(d.data.node)) +
              "/" +
              d.data.node.cropSquare +
              " га)  " +
              dateToString(new Date(d.data.node.startDate), "dd.mm.yy") +
              " - " +
              dateToString(new Date(d.data.node.endDate), "dd.mm.yy")
          );
      }

      // append "+"
      legendNodeEnter
        .filter(d => d.height === 1)
        .append("i")
        .attr("class", "material-icons add")
        .html("add")
        .on("click", function(d) {
          d3.event.stopPropagation();
          props.addNewOperation(d.data.node);
        });

      // append "trash_can"
      legendNodeEnter
        .filter(d => d.height === 0 && d.data.node.isManual)
        .append("i")
        .attr("class", "material-icons delete")
        .html("delete_outline")
        .on("click", function(d) {
          d3.event.stopPropagation();
          props.deleteOperation(d.data.node);
        });

      legendNode = legendNodeEnter.merge(legendNode);
      legendNode
        .transition()
        .style("top", d => top(d) * 20 + "px")
        .duration(t);

      legendNode.attr("class", d => {
        let className = "legendNode";
        if (!d.children && d._children) {
          className += " collapsed";
        }
        if (d.height === 0) {
          className += " operation";
          if (d.data.node.isManual) className += " manual";
          if (isOperationTouched(d)) className += " touched";
          if (isOperationClosed(d)) className += " completed";
        }
        return className;
      });

      function isOperationTouched(d) {
        return d.data.node.periods.length;
      }

      function isOperationClosed(d) {
        let squareRemainder = getSquareRemainder(d.data.node);
        if (squareRemainder <= 0) return true;
        else return false;
      }

      legendNode.on("click", click);

      function click(d) {
        if (d3.event.ctrlKey) {
          console.log(d);
          return;
        }

        if (d.children) {
          d._children = d.children;
          d.children = null;
        } else {
          d.children = d._children;
          d._children = null;
        }
        update(clickRoot, clickTimeframe, false);
      }

      /*
       ********** DATES ********
       */

      let date = datesBar.selectAll(".date").data(dates, d => d);

      // exit cells
      date
        .exit()
        .transition()
        .style("opacity", 0)
        .duration(t)
        .remove();

      date.style("opacity", 1).style("left", (d, i) => i * 40 + "px");

      // enter cells
      let dateEnter = date
        .enter()
        .append("div")
        .attr("class", "date")
        .style("left", (d, i) => i * 40 + "px");

      dateEnter
        .transition()
        .style("opacity", 1)
        .duration(t);

      dateEnter.html(d => dateToString(d));

      /*
       ********** OPERATIONS ********
       */
      let operation = grid.selectAll(".grid-row").data(nodes, d => d.id);

      operation
        .exit()
        .attr("opacity", 1)
        .transition()
        .attr("opacity", 0)
        .duration(t)
        .remove();

      let operationEnter = operation
        .enter()
        .append("g")
        .attr("class", "grid-row")
        .attr("transform", d => `translate(0, ${top(d) * 20})`)
        .attr("data-index", d => top(d));

      operationEnter
        .transition()
        .attr("opacity", 1)
        .duration(t);

      // append group of cells (days)
      operationEnter.append("g").attr("class", "cellGroup");

      // apend agroterms of operation
      operationEnter
        .filter(d => d.height === 0)
        .append("g")
        .attr("class", "agroterms");

      // apend group of periods
      operationEnter
        .filter(d => d.height === 0)
        .append("g")
        .attr("class", "periodGroup");

      // merge operations
      operation = operationEnter.merge(operation);
      operation
        .transition()
        .attr("transform", d => `translate(0, ${top(d) * 20})`)
        .duration(t);

      // update indexes
      operation.attr("data-index", d => top(d));

      /*
       ********** CELLGROUP ********
       */

      // // select cellGroup in each operation
      // let cellGroup = operation.select(".cellGroup");

      // // do an enter/exit/update cycle with cells datum
      // let cell = cellGroup
      //   .selectAll(".cell")
      //   .data(d => d.data.dateRange, d => d);

      // // enter cells
      // let cellEnter = cell
      //   .enter()
      //   .append("rect")
      //   .attr("class", "cell")
      //   .attr("x", (d, i) => i * 40)
      //   // .attr("height", 0)
      //   .attr("fill-opacity", 0)
      //   .attr("height", 20)
      //   .attr("width", 40);

      // cellEnter
      //   .transition()
      //   .attr("fill", "transparent")
      //   .attr("fill-opacity", 0.5)
      //   .attr("stroke-width", 1)
      //   .attr("stroke", "lightgray")
      //   .duration(t);

      // cell = cellEnter.merge(cell);

      // // clickable cells
      // cellGroup
      //   .filter(x => x.height === 0)
      //   .selectAll(".cell")
      //   .on("click", function(d) {
      //     d3.event.stopPropagation();
      //     // let date = d.date;
      //     const operation = { ...d3.select(this).node().parentNode.__data__ };
      //     let operationData = operation.data.node;
      //     props.addNewPeriod({ ...operationData, selectedDay: d });
      //   });

      /*
       ********** AGROTERMS ********
       */

      // select agroterm in each operation
      let agroterms = operation.select(".agroterms");
      agroterms.attr("transform", d => `translate(${left(d) * 40}, 0)`);

      // do an enter/exit/update cycle with cells datum
      let agrotermDay = agroterms
        .selectAll(".day")
        // .data(d => d.data.node.dates, d => d.date);
        .data(
          d => d.data.node.dates,
          d => d.date
        );

      let agrotermDayEnter = agrotermDay
        .enter()
        .append("rect")
        .attr("class", "day")
        .attr("x", (d, i) => i * 40)
        .attr("width", 40)
        .attr("height", 20)
        .attr("fill", "#aaa")
        .attr("fill-opacity", 0.5)
        .attr("stroke", "lightgray")
        .attr("stroke-width", 1);

      agrotermDay = agrotermDayEnter.merge(agrotermDay);
      agrotermDay.on("click", function(d) {
        d3.event.stopPropagation();
        // let date = d.date;
        const operation = { ...d3.select(this).node().parentNode.__data__ };
        let operationData = operation.data.node;
        props.addNewPeriod({ ...operationData, selectedDay: d.date });
      });

      /*
       ********** PERIODS ********
       */

      // select periodGroup in each operation
      let periodGroup = operation
        .filter(d => d.height === 0)
        .select(".periodGroup");

      // select each period in periodGroup
      let period = periodGroup.selectAll(".period").data(
        d => d.data.node.periods,
        d => d.id
      );

      period
        .transition()
        .attr("transform", d => {
          return `translate(${left(d) * 40}, 0)`;
        })
        .duration(t);

      // exit old periods in periodGroup
      period
        .exit()
        .transition()
        .attr("opacity", 0)
        .duration(t)
        .remove();

      // enter new periods in periodGroup
      let periodEnter = period
        .enter()
        .append("g")
        .attr("class", "period");

      periodEnter
        .transition()
        .attr("transform", d => {
          return `translate(${left(d) * 40}, 0)`;
        })
        .duration(t);

      // merge periods
      period = periodEnter.merge(period);
      // period.attr("transform", d => `translate(${left(d) * 40}, 0)`);

      // debugger;

      // PERIODDAY
      // select all days in period
      let periodDay = period.selectAll(".day").data(
        d => d.days,
        d => d.day + d.productivity
      );

      periodDay
        .exit()
        .select("rect")
        .transition()
        .attr("width", 0)
        .duration(t);

      periodDay
        .exit()
        .transition()
        .attr("fill-opacity", 0)
        .duration(t)
        .remove();

      periodDay
        .transition()
        .attr("transform", (d, i) => `translate(${i * 40}, 0)`)
        .duration(t);

      // enter new days in period
      let periodDayEnter = periodDay
        .enter()
        .append("g")
        .attr("class", "day")
        .attr("transform", (d, i) => `translate(${i * 40}, 0)`);
      periodDayEnter
        .append("rect")
        .attr("width", 40)
        .attr("height", 20)
        .attr("fill", "green")
        .attr("fill-opacity", checkTerms)
        .attr("stroke", "lightgray")
        .attr("stroke-width", 1);

      function checkTerms(d) {
        const operationData = d3.select(this).node().parentNode.parentNode
          .parentNode.__data__;
        if (isTermsMet(d, operationData)) return 0.5;
        else return 0.2;
      }

      periodDayEnter
        .append("text")
        .text(d => Math.round(d.productivity))
        .attr("class", "productivity")
        .attr("y", "15");
      // .attr("x", d => (prod.toString().length / 2) * 5 );
      periodDayEnter.select("rect");

      periodDay = periodDayEnter.merge(periodDay);
      periodDay.each(function(d) {
        let period = d3.select(this).node().parentNode.__data__;
        let operation = d3.select(this).node().parentNode.parentNode.__data__;
        const farmId = operation.data.node.farm.id;
        const machinery = [...period.machinery];
        let { vehicles, workEquipment } = evalMachineryQuantity(
          d.day,
          farmId,
          machinery
        );
        let deficit = [];
        if (vehicles.length) deficit = [...deficit, ...vehicles];
        if (workEquipment.length) deficit = [...deficit, ...workEquipment];
        if (deficit.length) d.deficit = deficit;
        else d.deficit = null;
      });

      periodDay
        .select("rect")
        .transition()
        .attr("fill", d => (d.deficit ? "red" : "green"))
        .duration(t);

      periodDay
        .on("click", function(d) {
          d3.event.stopPropagation();
          const period = {
            ...d3.select(this).node().parentNode.__data__
          };
          const operation = d3.select(this).node().parentNode.parentNode
            .__data__;
          props.editPeriod({
            period,
            operation: operation.data.node /*, selectedDate: d*/
          });
        })
        .on("mouseover", d => props.showDeficit(d.deficit))
        .on("mouseout", () => props.showDeficit(null));

      /*
       ********** APPEND PERIOD CONTROLS ********
       */
      // remove old controls
      period.selectAll(".ctrl").remove();

      // append new controls
      period
        .append("rect")
        .attr("class", "ctrl left")
        .attr("width", 5)
        .attr("height", 20)
        .attr("fill", "transparent");
      period
        .append("rect")
        .attr("class", "ctrl right")
        .attr("width", 5)
        .attr("height", 20)
        .attr("fill", "transparent")
        .attr("x", d => d.days.length * 40 - 5);

      // attach event listeners on controls
      period.selectAll(".ctrl").on("mousedown", stretchPeriod);
      period.on("mousedown", movePeriod);

      function top(d) {
        return count(d);
        function count(d) {
          let count = 0;
          let done = false;
          root.eachBefore(node => {
            if (done) return;
            if (node.id === d.id) done = true;
            count++;
          });
          return count - 1;
        }
      }
      function left(d) {
        let startDate;
        if (timeframe.type === "day") {
          if (d instanceof Date) startDate = d;
          else if (d.data) startDate = d.data.node.dates[0].date;
          else if (d.days) {
            if (!d.days.length) return 0;
            startDate = new Date(d.days[0].day);
          }
        } else if (timeframe.type === "week") {
          // debugger;
          if (Array.isArray(d)) startDate = d[0];
          else startDate = d.data.node.dates[0].date;
        }
        // get period offset from start of date range
        const offset = getLeftOffset(startDate, dates, timeframe);
        return offset;
      }
    }

    // init tooltips
    initToolttips();
    function initToolttips() {
      let tooltips = document.querySelectorAll(".tooltiped");
      Tooltip.init(tooltips, {
        enterDelay: 300,
        // margin: 5,
        // inDuration: 50,
        position: "top"
      });
    }

    return update;
  };

  return (
    <div className="diagramm">
      <section className="legend"></section>
      <section className="chart"></section>
    </div>
  );
}

const mapStateToProps = state => {
  let { plans, filter } = state.plan;

  if (plans.length) {
    var operations = plans.reduce((acc, cur) => {
      let plan = { id: cur.id, name: cur.name };

      let operations = cur.operations.map(operation => {
        return {
          ...operation,
          plan
        };
      });
      acc = [...acc, ...operations];
      return acc;
    }, []);

    /*
     ********** APPLY FILTER ********
     */

    const { crops, farms, agroOperations } = filter;
    if (crops.length) {
      operations = operations.filter(
        operation => !crops.find(x => x.id === operation.crop.id)
      );
    }
    if (farms.length) {
      operations = operations.filter(
        operation => !farms.find(x => x.id === operation.farm.id)
      );
    }
    if (agroOperations.length) {
      operations = operations.filter(
        operation =>
          !agroOperations.find(x => x.id === operation.agroOperation.id)
      );
    }

    return {
      operations: operations,
      // periods: Object.values(state.periods)
      plans: state.plans
    };
  } else {
    return {
      operations: [],
      plans: []
    };
  }
};

export default connect(mapStateToProps)(Gantt);
