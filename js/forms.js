/**
 * forms.js
 * Работа с формами, валидация, кастомные селекты
 */

const Forms = {
  onSuccess: null,

  // Инициализация всех форм
  init(onSuccessCallback) {
    this.onSuccess = onSuccessCallback;
    this.initValidation();
    this.initFileUpload();
    this.initCustomSelects();
    this.initDatepicker();
    this.initTimepicker();
  },

  // Валидация ВСЕХ форм с классом .contact__form
  initValidation() {
    $$(".contact__form").forEach((form) => {
      form.addEventListener("submit", (e) => {
        e.preventDefault();

        const formBoxes = $$(".form-box", form);
        let isValid = true;

        formBoxes.forEach((box) => {
          const input = box.querySelector('input:not([type="file"]), textarea');
          const selectTrigger = box.querySelector(".custom-select__trigger");
          const selectValue = box.querySelector(".custom-select__value");
          const fileInput = box.querySelector('input[type="file"]');

          let filled = false;

          if (input) {
            filled = input.value.trim() !== "";
          } else if (selectValue) {
            const placeholders = ["Select a Service", "Select date", "Select time", "Select Date", "Select Time"];
            const text = selectValue.textContent.trim();
            filled = !placeholders.some(p => text.includes(p) || text === p);
          } else if (fileInput) {
            filled = true;
          } else {
            filled = true;
          }

          box.classList.toggle("form-box--error", !filled);
          if (!filled) isValid = false;
        });

        if (isValid) {
          if (typeof this.onSuccess === "function") {
            this.onSuccess(form);
          }
          console.log("Form submitted", form);
        } else {
          console.log("Form has errors", form);
        }
      });

      // Снятие ошибки при вводе для этой формы
      $$(".form-box", form).forEach((box) => {
        const inputs = box.querySelectorAll('input:not([type="file"]), textarea');
        inputs.forEach((input) => {
          input.addEventListener("input", () => {
            if (input.value.trim() !== "") {
              box.classList.remove("form-box--error");
            }
          });
        });

        // Для селектов — снимаем ошибку при выборе
        const selectTrigger = box.querySelector(".custom-select__trigger");
        if (selectTrigger) {
          selectTrigger.addEventListener("click", () => {
            // Проверим позже, после выбора
            setTimeout(() => {
              const selectValue = box.querySelector(".custom-select__value");
              if (selectValue) {
                const placeholders = ["Select a Service", "Select date", "Select time"];
                const text = selectValue.textContent.trim();
                if (!placeholders.some(p => text.includes(p))) {
                  box.classList.remove("form-box--error");
                }
              }
            }, 100);
          });
        }
      });
    });
  },

  // Загрузка файлов для ВСЕХ форм
  initFileUpload() {
    $$('input[type="file"]').forEach((input) => {
      input.addEventListener("change", (e) => {
        const files = e.target.files;
        const wrapper = input.closest(".upload");
        if (!wrapper) return;

        const label = $(".upload__label", wrapper);
        if (label && files.length > 0) {
          label.textContent = `${files.length} file(s) selected`;
        }
      });
    });
  },

  // Кастомные селекты services для ВСЕХ форм
  initCustomSelects() {
    $$(".custom-select--services").forEach((select) => {
      const trigger = $(".custom-select__trigger", select);
      const dropdown = $(".custom-select__dropdown", select);
      const valueEl = $(".custom-select__value", select);

      if (!trigger || !dropdown || !valueEl) return;

      trigger.addEventListener("click", (e) => {
        e.stopPropagation();
        const isOpen = select.classList.contains("custom-select--open");
        closeAll();
        if (!isOpen) select.classList.add("custom-select--open");
      });

      $$(".custom-select__option", dropdown).forEach((opt) => {
        opt.addEventListener("click", () => {
          $$(".custom-select__option", dropdown).forEach((o) =>
            o.classList.remove("selected")
          );
          opt.classList.add("selected");
          valueEl.textContent = opt.textContent;
          trigger.classList.add("has-value");
          select.classList.remove("custom-select--open");
          
          // Снимаем ошибку с родительского form-box
          const formBox = select.closest(".form-box");
          if (formBox) {
            formBox.classList.remove("form-box--error");
          }
        });
      });
    });
  },

  // Datepicker для ВСЕХ форм
  initDatepicker() {
    $$(".custom-select--datepicker").forEach((wrap) => {
      const trigger = $(".custom-select__trigger", wrap);
      const valueEl = $(".custom-select__value", wrap);
      const monthLabel = $(".datepicker__month", wrap);
      const grid = $(".datepicker__grid", wrap);
      const prevBtn = $(".datepicker__nav--prev", wrap);
      const nextBtn = $(".datepicker__nav--next", wrap);
      const dropdown = $(".datepicker__dropdown", wrap);

      if (!trigger || !valueEl || !monthLabel || !grid || !prevBtn || !nextBtn || !dropdown) {
        return;
      }

      const today = new Date();
      let current = new Date(today.getFullYear(), today.getMonth(), 1);
      let selectedDate = null;

      const renderCalendar = () => {
        monthLabel.textContent = `${CONFIG.months[current.getMonth()]} ${current.getFullYear()}`;
        grid.innerHTML = "";

        // Заголовки дней
        CONFIG.days.forEach((d) => {
          const el = document.createElement("div");
          el.className = "datepicker__day-name";
          el.textContent = d;
          grid.appendChild(el);
        });

        const firstDay = new Date(current.getFullYear(), current.getMonth(), 1).getDay();
        const daysInMonth = new Date(current.getFullYear(), current.getMonth() + 1, 0).getDate();
        const daysInPrev = new Date(current.getFullYear(), current.getMonth(), 0).getDate();

        // Предыдущий месяц
        for (let i = firstDay - 1; i >= 0; i--) {
          const el = document.createElement("div");
          el.className = "datepicker__day other-month";
          el.textContent = daysInPrev - i;
          grid.appendChild(el);
        }

        // Текущий месяц
        for (let d = 1; d <= daysInMonth; d++) {
          const el = document.createElement("div");
          el.className = "datepicker__day";
          el.textContent = d;

          const thisDate = new Date(current.getFullYear(), current.getMonth(), d);
          if (thisDate.toDateString() === today.toDateString()) {
            el.classList.add("today");
          }
          if (selectedDate && thisDate.toDateString() === selectedDate.toDateString()) {
            el.classList.add("selected");
          }

          el.addEventListener("click", () => {
            selectedDate = thisDate;
            valueEl.textContent = `${CONFIG.months[thisDate.getMonth()].slice(0, 3)} ${thisDate.getDate()}, ${thisDate.getFullYear()}`;
            trigger.classList.add("has-value");
            renderCalendar();
            wrap.classList.remove("custom-select--open");
            
            const formBox = wrap.closest(".form-box");
            if (formBox) {
              formBox.classList.remove("form-box--error");
            }
          });

          grid.appendChild(el);
        }

        // Следующий месяц
        const total = firstDay + daysInMonth;
        const remainder = total % 7 === 0 ? 0 : 7 - (total % 7);
        for (let d = 1; d <= remainder; d++) {
          const el = document.createElement("div");
          el.className = "datepicker__day other-month";
          el.textContent = d;
          grid.appendChild(el);
        }
      };

      trigger.addEventListener("click", (e) => {
        e.stopPropagation();
        const isOpen = wrap.classList.contains("custom-select--open");
        closeAll();
        if (!isOpen) {
          wrap.classList.add("custom-select--open");
          renderCalendar();
        }
      });

      prevBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        current.setMonth(current.getMonth() - 1);
        renderCalendar();
      });

      nextBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        current.setMonth(current.getMonth() + 1);
        renderCalendar();
      });

      dropdown.addEventListener("click", (e) => e.stopPropagation());
    });
  },

  // Timepicker для ВСЕХ форм
  initTimepicker() {
    $$(".custom-select--timepicker").forEach((wrap) => {
      const trigger = $(".custom-select__trigger", wrap);
      const valueEl = $(".custom-select__value", wrap);
      const hoursEl = $(".timepicker__field--hours", wrap);
      const minutesEl = $(".timepicker__field--minutes", wrap);
      const amBtn = $(".timepicker__ampm-btn--am", wrap);
      const pmBtn = $(".timepicker__ampm-btn--pm", wrap);
      const dropdown = $(".timepicker__dropdown", wrap);

      if (!trigger || !valueEl || !hoursEl || !minutesEl || !amBtn || !pmBtn || !dropdown) {
        return;
      }

      let ampm = "PM";

      const updateValue = () => {
        valueEl.textContent = `${hoursEl.value.padStart(2, "0")}:${minutesEl.value.padStart(2, "0")} ${ampm}`;
        trigger.classList.add("has-value");
      };

      const sanitizeTime = (el, max) => {
        el.addEventListener("input", () => {
          el.value = el.value.replace(/\D/g, "");
          if (parseInt(el.value) > max) el.value = String(max);
          updateValue();
        });
        el.addEventListener("blur", () => {
          el.value = el.value.padStart(2, "0");
          updateValue();
        });
      };

      sanitizeTime(hoursEl, 12);
      sanitizeTime(minutesEl, 59);

      amBtn.addEventListener("click", () => {
        ampm = "AM";
        amBtn.classList.add("active");
        pmBtn.classList.remove("active");
        updateValue();
      });

      pmBtn.addEventListener("click", () => {
        ampm = "PM";
        pmBtn.classList.add("active");
        amBtn.classList.remove("active");
        updateValue();
      });

      trigger.addEventListener("click", (e) => {
        e.stopPropagation();
        const isOpen = wrap.classList.contains("custom-select--open");
        closeAll();
        if (!isOpen) wrap.classList.add("custom-select--open");
      });

      dropdown.addEventListener("click", (e) => e.stopPropagation());
      
      // Снимаем ошибку при изменении времени
      [hoursEl, minutesEl].forEach(el => {
        el.addEventListener("change", () => {
          const formBox = wrap.closest(".form-box");
          if (formBox) {
            formBox.classList.remove("form-box--error");
          }
        });
      });
    });
  },
};

// Закрытие селектов по клику вне — глобально
document.addEventListener("click", () => closeAll());