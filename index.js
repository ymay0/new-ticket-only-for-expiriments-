 window.initPopup = function() {
 function getRandomSeries() {
    // Генерирует 9-значное число
    return Math.floor(100000000 + Math.random() * 900000000);
  }

const tramImg = document.querySelector('img[alt="Трамвай"]');
const randomTram = Math.random() < 0.5 ? "tramvay.gif" : "tramvay2.gif";
tramImg.src = `./${randomTram}`;

  // Сгенерировать номер серии один раз при загрузке страницы
  document.getElementById("series").textContent = getRandomSeries();

  function update() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const start = new Date(year, month, 1); // начало месяца
    const end = new Date(year, month + 1, 0, 23, 59, 59); // конец месяца

    // время
    const t = now.toLocaleTimeString("uk-UA",{hour:'2-digit',minute:'2-digit',second:'2-digit'});
    document.getElementById("time").textContent = t;

    // дата
    const day = String(now.getDate()).padStart(2,'0');
    const mon = String(now.getMonth()+1).padStart(2,'0');
    document.getElementById("date").textContent = `${day}.${mon}`;

    // дни
    const diff = Math.ceil((end - now)/(1000*60*60*24));
    document.getElementById("daysLeft").textContent = 
      `До закінчення строку дії залишилося «${diff-1>0?diff-1:0}» днів`;

    // прогресс (чем ближе к концу месяца, тем больше полоска)
   const total = end - start;
const passed = now - start; // сколько времени прошло с начала месяца
let pct = Math.max(0, Math.min(100, (passed / total) * 100));
document.getElementById("progress").style.width = pct + "%";



// смена цвета на 15-й день
if (now.getDate() >= 15) {
  document.getElementById("progress").style.background = "#ef6f00";
} else {
  document.getElementById("progress").style.background = "#4da723";
}
}
  setInterval(update,1000);
  update();
}