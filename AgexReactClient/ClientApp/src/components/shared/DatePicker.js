import React, { Component } from "react";
import $ from "jquery";

class DatePicker extends Component {
  state = {
    instance: null,
    id: this.props.name + "_" + Math.round(Math.random() * 100000)
  };

  componentDidMount() {
    // initialize datepicker
    var elem = document.querySelector(`.datepicker#${this.state.id}`);
    var instance = window.M.Datepicker.init(elem, {
      onSelect: this.props.onSelect,
      onOpen: this.attachClearHandler,
      container: "body",
      format: this.props.format,
      autoClose: true,
      showClearBtn: true,
      defaultDate: this.props.date,
      setDefaultDate: true,
      i18n: this.props.localization
    });
    this.setState(() => ({ instance }));
  }

  attachClearHandler = () => {
    $(document).on("click", ".datepicker-clear", () =>
      this.props.onSelect(null)
    );
  };

  componentDidUpdate(prevProps) {
    if (
      prevProps.date &&
      this.props.date &&
      prevProps.date.getTime() !== this.props.date.getTime()
    ) {
      this.updateValue();
    } else if (
      (!prevProps.date || !this.props.date) &&
      prevProps.date !== this.props.date
    ) {
      this.updateValue();
    }
  }

  updateValue() {
    this.state.instance.setDate(this.props.date);
    this.state.instance.setInputValue(this.props.date);
  }

  render() {
    return (
      <React.Fragment>
        <input
          type="text"
          className="datepicker"
          name={this.props.name}
          id={this.state.id}
          disabled={this.props.disabled}
        />
        <label htmlFor={this.state.id}>{this.props.label}</label>
      </React.Fragment>
    );
  }
}

export default DatePicker;

DatePicker.defaultProps = {
  // date: null,
  format: "dd.mm.yy",
  disabled: false,
  onSelect: () => {},
  localization: {
    cancel: "Отмена",
    clear: "Очистить",
    months: [
      "Январь",
      "Февраль",
      "Март",
      "Апрель",
      "Май",
      "Июнь",
      "Июль",
      "Август",
      "Сентябрь",
      "Октябрь",
      "Ноябрь",
      "Декабрь"
    ],
    monthsShort: [
      "Янв",
      "Фев",
      "Мар",
      "Апр",
      "Май",
      "Июн",
      "Июл",
      "Авг",
      "Сен",
      "Окт",
      "Ноя",
      "Дек"
    ],
    weekdays: [
      "Понедельник",
      "Вторник",
      "Среда",
      "Четверг",
      "Пятница",
      "Суббота",
      "Воскресенье"
    ],
    weekdaysShort: ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вc"]
  }
};
