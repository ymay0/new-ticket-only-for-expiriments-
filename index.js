// Генератор рандомной серии (8 цифр)
  function getRandomSeries() {
    return Math.floor(10000000 + Math.random() * 90000000).toString();
  }

  // Вспомогательное форматирование даты в YYYY-MM-DD
  function formatDateToISO(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Получение последнего дня месяца в формате YYYY-MM-DD
  function getLastDayOfMonthISO(year, month) {
    const lastDay = new Date(year, month + 1, 0);
    return formatDateToISO(lastDay);
  }

  // Генератор случайных дат (активный в текущем месяце, просроченный 2022-2025)
  function getRandomDates(forceActive = true) {
    const now = new Date();
    
    if (forceActive) {
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth();
      const currentDay = now.getDate();

      const randomStartDay = Math.floor(Math.random() * currentDay) + 1;
      const startDate = new Date(currentYear, currentMonth, randomStartDay);

      return {
        start: formatDateToISO(startDate),
        end: getLastDayOfMonthISO(currentYear, currentMonth)
      };
    } else {
      const minYear = 2022;
      const maxYear = 2025;
      const pastYear = Math.floor(Math.random() * (maxYear - minYear + 1)) + minYear;
      const pastMonth = Math.floor(Math.random() * 12);

      const lastDayOfPastMonth = new Date(pastYear, pastMonth + 1, 0).getDate();
      const randomStartDay = Math.floor(Math.random() * lastDayOfPastMonth) + 1;

      const startDate = new Date(pastYear, pastMonth, randomStartDay);

      return {
        start: formatDateToISO(startDate),
        end: getLastDayOfMonthISO(pastYear, pastMonth)
      };
    }
  }

  // Генерация исходного рандомного массива карточек
  function generateInitialCards() {
    const dates1 = getRandomDates(true);  
    const dates2 = getRandomDates(false); 
    const dates3 = getRandomDates(false); 

    return [
      {
        id: "card_1",
        city: "Одеса",
        company: "Одесміськелектротранс",
        start: dates1.start,
        end: dates1.end,
        logo: "./Odesa.svg",
        icon: "metr-td.png",
        series: getRandomSeries(),
        gifOption: 1,
        simulatedCurrentDate: ""
      },
      {
        id: "card_2",
        city: "Одеса",
        company: "Одесміськелектротранс",
        start: dates2.start,
        end: dates2.end,
        logo: "./Odesa.svg",
        icon: "metr-td.png",
        series: getRandomSeries(),
        gifOption: 2,
        simulatedCurrentDate: ""
      },
      {
        id: "card_3",
        city: "Дніпро",
        company: "КП Дніпровський електротранспорт ДМР",
        start: dates3.start,
        end: dates3.end,
        logo: "./Dnipro.svg",
        icon: "metr-td.png",
        series: getRandomSeries(),
        gifOption: 1,
        simulatedCurrentDate: ""
      }
    ];
  }

  let cardsData = generateInitialCards();
  let currentGifOption = 1;
  let activePopupTicketId = null;

  function showToast(message = "Зміни успішно застосовано") {
    const toast = document.getElementById('toast');
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add('show');

    setTimeout(() => {
      toast.classList.remove('show');
    }, 2500);
  }

  function initDeveloperSelect() {
    const select = document.getElementById('ticket-select');
    if (!select) return;

    select.innerHTML = '';
    cardsData.forEach(card => {
      const opt = document.createElement('option');
      opt.value = card.id;
      opt.textContent = `${card.city} (${card.company.split(' ')[0]}) - №${card.series}`;
      select.appendChild(opt);
    });
  }

  function loadTicketData() {
    const select = document.getElementById('ticket-select');
    if (!select) return;

    const cardId = select.value;
    const card = cardsData.find(c => c.id === cardId);

    if (card) {
      document.getElementById('purchase-date').value = card.start || '';
      document.getElementById('current-date').value = card.simulatedCurrentDate || '';
      document.getElementById('ticket-series').value = card.series || '';
      setGifOption(card.gifOption || 1);
    }
  }

  function generateRandomSeries() {
    document.getElementById('ticket-series').value = getRandomSeries();
  }

  function setGifOption(option) {
    currentGifOption = option;
    const btn1 = document.getElementById('gif-btn-1');
    const btn2 = document.getElementById('gif-btn-2');

    if (btn1 && btn2) {
      btn1.classList.toggle('active', option === 1);
      btn2.classList.toggle('active', option === 2);
    }
  }

  function saveTicketData() {
    const select = document.getElementById('ticket-select');
    if (!select) return;

    const cardId = select.value;
    const card = cardsData.find(c => c.id === cardId);

    if (card) {
      const seriesInput = document.getElementById('ticket-series').value.trim();
      const purchaseDateInput = document.getElementById('purchase-date').value;
      const currentDateInput = document.getElementById('current-date').value;

      if (seriesInput) card.series = seriesInput;
      if (purchaseDateInput) card.start = purchaseDateInput;

      card.simulatedCurrentDate = currentDateInput;
      card.gifOption = currentGifOption;

      renderCards(cardsData);
      initDeveloperSelect();
      select.value = cardId;

      showToast("Зміни прийнято!");
    }
  }

  let selectedDate = new Date();
  let previousScreenId = 'screen-train';

  function openTrainScreen() {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active-screen'));
    document.getElementById('screen-train').classList.add('active-screen');
  }

  function openArchive() {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active-screen'));
    document.getElementById('screen-archive').classList.add('active-screen');
  }

  function openMainScreen() {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active-screen'));
    document.getElementById('screen-transport').classList.add('active-screen');
  }

  function openDeveloperScreen() {
    const activePage = document.querySelector('.page.active-screen');
    if (activePage) previousScreenId = activePage.id;
    
    closeCalendar();

    document.querySelectorAll('.page').forEach(p => p.classList.remove('active-screen'));
    document.getElementById('screen-developer').classList.add('active-screen');
    
    initDeveloperSelect();
    loadTicketData();
  }

  function goBackFromDeveloper() {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active-screen'));
    const targetScreen = document.getElementById(previousScreenId) || document.getElementById('screen-train');
    targetScreen.classList.add('active-screen');
  }

  function swapStations() {
    const from = document.getElementById('from-station');
    const to = document.getElementById('to-station');
    const temp = from.value;
    from.value = to.value;
    to.value = temp;
  }

  function searchTrains() {
    const from = document.getElementById('from-station').value;
    const to = document.getElementById('to-station').value;
    if (!from || !to) {
      showToast('Будь ласка, вкажіть пункти відправлення та прибуття');
      return;
    }
    showToast(`Пошук поїздів: ${from} — ${to}`);
  }

  function openCalendar() {
    const modal = document.getElementById('calendar-modal');
    modal.style.display = 'block';

    document.getElementById('month-select').value = selectedDate.getMonth();
    document.getElementById('year-select').value = selectedDate.getFullYear();

    renderCalendar();

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        modal.classList.add('active');
      });
    });
  }

  function closeCalendar(e) {
    if (!e || e.target.id === 'calendar-modal' || e.target.classList.contains('calendar-close-btn')) {
      const modal = document.getElementById('calendar-modal');
      modal.classList.remove('active');
      setTimeout(() => {
        modal.style.display = 'none';
      }, 350);
    }
  }

  function changeCalendarMonthYear() {
    const m = parseInt(document.getElementById('month-select').value);
    const y = parseInt(document.getElementById('year-select').value);

    selectedDate = new Date(y, m, Math.min(selectedDate.getDate(), new Date(y, m + 1, 0).getDate()));
    renderCalendar();
  }

  function renderCalendar() {
    const grid = document.getElementById('calendar-days-grid');
    grid.innerHTML = '';

    const month = selectedDate.getMonth();
    const year = selectedDate.getFullYear();

    const firstDayIndex = (new Date(year, month, 1).getDay() + 6) % 7; 
    const totalDays = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < firstDayIndex; i++) {
      const emptyCell = document.createElement('div');
      emptyCell.className = 'day-cell empty';
      grid.appendChild(emptyCell);
    }

    for (let day = 1; day <= totalDays; day++) {
      const cell = document.createElement('div');
      cell.className = 'day-cell';
      cell.textContent = day;

      if (day === selectedDate.getDate()) cell.classList.add('selected');

      cell.onclick = () => {
        selectedDate = new Date(year, month, day);
        renderCalendar();
      };

      grid.appendChild(cell);
    }

    const dayStr = String(selectedDate.getDate()).padStart(2, '0');
    const monthStr = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const yearStr = selectedDate.getFullYear();
    document.getElementById('calendar-preview-date').textContent = `${dayStr}.${monthStr}.${yearStr}`;
  }

  function applyCalendarDate() {
    const dayStr = String(selectedDate.getDate()).padStart(2, '0');
    const monthStr = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const yearStr = selectedDate.getFullYear();

    document.getElementById('train-date').textContent = `${dayStr}.${monthStr}.${yearStr}`;
    closeCalendar();
  }

  function getCurrentAppDate(ticket) {
      if (ticket && ticket.simulatedCurrentDate) {
          const simulated = new Date(ticket.simulatedCurrentDate);
          const realNow = new Date();
          simulated.setHours(realNow.getHours(), realNow.getMinutes(), realNow.getSeconds());
          return simulated;
      }
      return new Date();
  }

  function formatDateISO(iso) {
      if (!iso || !iso.includes('-')) return iso;
      const parts = iso.split('-');
      return `${parts[2]}.${parts[1]}.${parts[0]}`;
  }

  function renderCards(list) {
      const container = document.getElementById('cards');
      if (!container) return;
      
      container.innerHTML = '';

      const checkmarkSvg = `<svg width="14" height="14" viewBox="0 0 16 16" fill="none" style="margin-left: 4px; display: inline-block; vertical-align: middle;">
          <path d="M13.5 4.5L6.5 11.5L3 8" stroke="#489520" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`;

      list.forEach(item => {
          const now = getCurrentAppDate(item);
          const start = new Date(item.start);
          const end   = new Date(item.end);

          start.setHours(0, 0, 0, 0);
          end.setHours(23, 59, 59, 999);

          const isActive = now >= start && now <= end;

          const card = document.createElement('div');
          card.className = 'card';
          card.onclick = () => openPopup(item);

          card.innerHTML = `
              <div class="logo">
                  <img src="${item.logo}" alt="${item.city}">
              </div>
              <div class="card-main">
                  <div class="city-title">${item.city}</div>
                  <div class="company">${item.company}</div>
                  
                  <div class="info-row">
                      <div class="info-label">Строк дії</div>
                      <div class="info-value">${formatDateISO(item.start)} - ${formatDateISO(item.end)}</div>
                  </div>

                  <div class="info-row">
                      <div class="info-label">Дійсний</div>
                      <div class="info-value">
                          ${isActive ? (now.toLocaleDateString('uk-UA') + ' ' + now.toLocaleTimeString('uk-UA') + checkmarkSvg) : 'Ні'}
                      </div>
                  </div>
              </div>
              <div class="icons">
                  <img src="${item.icon}" alt="транспорт" class="${!isActive ? 'gray' : ''}" style="width:26px; height:auto;">
              </div>
          `;

          container.appendChild(card);
      });
  }

  let popupTimerInterval = null;

  function openPopup(ticket) {
      const popup = document.getElementById('popup');
      if (!popup) return;

      activePopupTicketId = ticket.id;

      document.getElementById('series').textContent = ticket.series;
      document.getElementById('popup-city').textContent = ticket.city;
      document.getElementById('popup-logo').src = ticket.logo;

      popup.style.display = 'block';

      requestAnimationFrame(() => {
          requestAnimationFrame(() => {
              popup.classList.add('active');
          });
      });

      updatePopupData(ticket);
      if (popupTimerInterval) clearInterval(popupTimerInterval);
      popupTimerInterval = setInterval(() => {
        const currentTicket = cardsData.find(c => c.id === activePopupTicketId);
        if (currentTicket) updatePopupData(currentTicket);
      }, 1000);
  }

  function updatePopupData(ticket) {
      const now = getCurrentAppDate(ticket);

      const [sYear, sMonth, sDay] = ticket.start.split('-').map(Number);
      const [eYear, eMonth, eDay] = ticket.end.split('-').map(Number);

      const ticketStart = new Date(sYear, sMonth - 1, sDay, 0, 0, 0, 0);
      const ticketEnd = new Date(eYear, eMonth - 1, eDay, 23, 59, 59, 999);

      const isActive = now >= ticketStart && now <= ticketEnd;
      const dynamicContent = document.getElementById('dynamic-ticket-content');

      const startDayStr = String(sDay).padStart(2, '0');
      const startMonthStr = String(sMonth).padStart(2, '0');
      const endDayStr = String(eDay).padStart(2, '0');
      const endMonthStr = String(eMonth).padStart(2, '0');

      document.getElementById('range').textContent = `${startDayStr}.${startMonthStr}.${sYear} - ${endDayStr}.${endMonthStr}.${eYear}`;

      const validityContainer = document.getElementById('validity-info-container');
      let buyBtn = document.getElementById('popup-buy-btn');

      if (!buyBtn) {
          buyBtn = document.createElement('button');
          buyBtn.id = 'popup-buy-btn';
          buyBtn.className = 'buy-btn-popup';
          buyBtn.textContent = 'Купити';
          buyBtn.onclick = () => showToast('Перехід до купівлі квитка');
          
          const cardElem = document.querySelector('.ticket-card');
          if (cardElem) cardElem.appendChild(buyBtn);
      }

      if (!isActive) {
          if (dynamicContent) {
              dynamicContent.innerHTML = `
                  <div class="invalid-banner">
                      <div class="status-invalid">Недійсний</div>
                      <div class="sub-invalid">Закінчився термін дії</div>
                  </div>
              `;
          }

          const daysLeftElem = document.getElementById('daysLeft');
          if (daysLeftElem) daysLeftElem.style.display = 'none';

          if (validityContainer) validityContainer.classList.remove('validity-warning-box');
          if (buyBtn) buyBtn.style.display = 'block';

      } else {
          const currentDayStr = String(now.getDate()).padStart(2, '0');
          const currentMonthStr = String(now.getMonth() + 1).padStart(2, '0');
          const hours = String(now.getHours()).padStart(2, '0');
          const minutes = String(now.getMinutes()).padStart(2, '0');
          const seconds = String(now.getSeconds()).padStart(2, '0');

          if (dynamicContent) {
              let timeElem = document.getElementById('time');
              
              if (!timeElem || dynamicContent.dataset.renderedTicket !== String(ticket.series) || dynamicContent.dataset.renderedGif !== String(ticket.gifOption)) {
                  const gifSrc = ticket.gifOption === 2 ? './tramvay2.gif' : './tramvay.gif';

                  dynamicContent.dataset.renderedTicket = ticket.series;
                  dynamicContent.dataset.renderedGif = ticket.gifOption;

                  dynamicContent.innerHTML = `
                      <img src="${gifSrc}?t=${Date.now()}" 
                      alt="Трамвай"
                      style="margin-top: 6px; width: 100%; height: auto; max-height: 40px; margin-bottom: 6px; display: block; background: transparent;">

                      <div class="line-time">
                        <div class="progress">
                          <div class="progress-bar" id="progress"></div>
                        </div>
                        <div class="row">
                          <div class="date" id="date">${currentDayStr}.${currentMonthStr}</div>
                          <div class="time" id="time">${hours}:${minutes}:${seconds}</div>
                        </div>
                      </div>
                  `;
              } else {
                  document.getElementById('date').textContent = `${currentDayStr}.${currentMonthStr}`;
                  timeElem.textContent = `${hours}:${minutes}:${seconds}`;
              }
          }

          const totalDurationMs = ticketEnd - ticketStart;
          const elapsedMs = now - ticketStart;
          const progressPercent = Math.min(100, Math.max(0, (elapsedMs / totalDurationMs) * 100));

          const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          const endDateOnly = new Date(eYear, eMonth - 1, eDay);
          const msPerDay = 1000 * 60 * 60 * 24;
          const daysLeft = Math.max(0, Math.round((endDateOnly - todayStart) / msPerDay));

          const daysLeftElem = document.getElementById('daysLeft');
          if (daysLeftElem) {
              daysLeftElem.style.display = 'block';
              daysLeftElem.textContent = `До закінчення строку дії залишилося «${daysLeft}» днів`;
          }

          const progressElem = document.getElementById('progress');
          if (progressElem) {
              progressElem.style.width = `${progressPercent}%`;
              if (progressPercent >= 80) {
                  progressElem.style.backgroundColor = '#ea4335';
              } else if (progressPercent >= 50) {
                  progressElem.style.backgroundColor = '#fbbc05';
              } else {
                  progressElem.style.backgroundColor = '#4da723';
              }
          }

          if (daysLeft <= 14) {
              if (validityContainer) validityContainer.classList.add('validity-warning-box');
              if (buyBtn) buyBtn.style.display = 'block';
          } else {
              if (validityContainer) validityContainer.classList.remove('validity-warning-box');
              if (buyBtn) buyBtn.style.display = 'none';
          }
      }
  }

  function closePopup() {
      const popup = document.getElementById('popup');
      if (!popup) return;

      if (popupTimerInterval) clearInterval(popupTimerInterval);
      activePopupTicketId = null;

      popup.classList.remove('active');
      setTimeout(() => {
          popup.style.display = 'none';
      }, 350);
  }

  let currentTab = 'pass'; 

  function switchTab(tab) {
    currentTab = tab;
    const container = document.getElementById('tabs-container');
    const tabTicket = document.getElementById('tab-ticket');
    const tabPass = document.getElementById('tab-pass');
    const glider = document.getElementById('glider');

    const pages = container.querySelectorAll('.tab-page');

    if (tab === 'ticket') {
      container.style.transform = 'translate3d(0%, 0, 0)';
      glider.style.transform = 'translateX(0%)';
      
      tabTicket.classList.add('active');
      tabPass.classList.remove('active');

      pages[0].classList.add('active-page');
      pages[1].classList.remove('active-page');
    } else {
      container.style.transform = 'translate3d(-50%, 0, 0)';
      glider.style.transform = 'translateX(100%)';
      
      tabPass.classList.add('active');
      tabTicket.classList.remove('active');

      pages[1].classList.add('active-page');
      pages[0].classList.remove('active-page');
    }
  }

  function setInitialTrainDate() {
    selectedDate = new Date();
    applyCalendarDate();
  }

  document.addEventListener('DOMContentLoaded', () => {
    setInitialTrainDate();
    renderCards(cardsData);
    switchTab('pass'); 
    initSwipeEvents();
    initDeveloperSelect();
    loadTicketData();
  });

  function initSwipeEvents() {
    const touchArea = document.getElementById('touch-area');
    let startX = 0;
    let startY = 0;
    let distX = 0;
    let distY = 0;

    touchArea.addEventListener('touchstart', (e) => {
      const touch = e.touches[0];
      startX = touch.clientX;
      startY = touch.clientY;
      distX = 0;
      distY = 0;
    }, { passive: true });

    touchArea.addEventListener('touchmove', (e) => {
      if (!startX || !startY) return;
      const touch = e.touches[0];
      distX = touch.clientX - startX;
      distY = touch.clientY - startY;
    }, { passive: true });

    touchArea.addEventListener('touchend', () => {
      if (Math.abs(distX) > 50 && Math.abs(distX) > Math.abs(distY)) {
        if (distX < 0 && currentTab === 'ticket') {
          switchTab('pass');
        } else if (distX > 0 && currentTab === 'pass') {
          switchTab('ticket');
        }
      }
      startX = 0;
      startY = 0;
    });
  }

  function scanQR() {
      showToast('Запустити сканер QR');
  }