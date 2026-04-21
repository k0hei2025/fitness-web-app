/* ========================================
   FitPlan — App Logic
   ======================================== */

(function () {
  // --- Day Tab Navigation ---
  const tabs = document.querySelectorAll('.day-tab');
  const sections = document.querySelectorAll('.day-section');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const day = tab.dataset.day;

      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      sections.forEach(s => {
        s.classList.remove('active');
        if (s.id === 'day-' + day) {
          s.classList.add('active');
        }
      });
    });
  });

  // --- Streak Tracker ---
  const STREAK_KEY = 'fitplan_streak';
  const LAST_LOG_KEY = 'fitplan_last_log';
  const streakBadge = document.getElementById('streakBadge');
  const streakCount = document.getElementById('streakCount');

  function getToday() {
    return new Date().toISOString().split('T')[0];
  }

  function loadStreak() {
    const streak = parseInt(localStorage.getItem(STREAK_KEY) || '0', 10);
    const lastLog = localStorage.getItem(LAST_LOG_KEY);
    const today = getToday();

    // Check if streak is still valid (last log was yesterday or today)
    if (lastLog) {
      const last = new Date(lastLog);
      const now = new Date(today);
      const diffDays = Math.floor((now - last) / (1000 * 60 * 60 * 24));

      if (diffDays > 1) {
        // Streak broken
        localStorage.setItem(STREAK_KEY, '0');
        streakCount.textContent = '0';
        return;
      }

      if (lastLog === today) {
        streakBadge.classList.add('logged');
      }
    }

    streakCount.textContent = streak;
  }

  function logWorkout() {
    const today = getToday();
    const lastLog = localStorage.getItem(LAST_LOG_KEY);
    let streak = parseInt(localStorage.getItem(STREAK_KEY) || '0', 10);

    if (lastLog === today) {
      // Already logged today
      return;
    }

    if (lastLog) {
      const last = new Date(lastLog);
      const now = new Date(today);
      const diffDays = Math.floor((now - last) / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        streak += 1;
      } else if (diffDays > 1) {
        streak = 1;
      }
    } else {
      streak = 1;
    }

    localStorage.setItem(STREAK_KEY, streak.toString());
    localStorage.setItem(LAST_LOG_KEY, today);
    streakCount.textContent = streak;
    streakBadge.classList.add('logged');
  }

  streakBadge.addEventListener('click', logWorkout);
  loadStreak();

  // --- Auto-select today's workout day ---
  const dayMap = { 2: 'tuesday', 4: 'thursday', 6: 'saturday', 0: 'sunday' };
  const todayDay = new Date().getDay();
  const autoDay = dayMap[todayDay];

  if (autoDay) {
    const autoTab = document.querySelector(`[data-day="${autoDay}"]`);
    if (autoTab) {
      autoTab.click();
    }
  }

  // --- Meal Plan ---
  const mealDays = [
    { label: "Mon", sub: "Office", home: false, cals: 1680, pro: 118, iron: 15, cal: 1010 },
    { label: "Tue", sub: "Home", home: true, cals: 1710, pro: 122, iron: 15, cal: 1050 },
    { label: "Wed", sub: "Office", home: false, cals: 1680, pro: 118, iron: 15, cal: 1010 },
    { label: "Thu", sub: "Home", home: true, cals: 1710, pro: 122, iron: 15, cal: 1050 },
    { label: "Fri", sub: "Office", home: false, cals: 1680, pro: 118, iron: 14, cal: 1010 },
    { label: "Sat", sub: "Home", home: true, cals: 1800, pro: 126, iron: 16, cal: 1080 },
    { label: "Sun", sub: "Home", home: true, cals: 1780, pro: 124, iron: 15, cal: 1060 },
  ];

  function getMeals(isHome) {
    return [
      {
        num: "01", badge: "Breakfast", bc: "#7F77DD", bt: "#EEEDFE",
        name: "Protein power bowl", time: "7:00 \u2013 8:00 AM", loc: null,
        items: [
          { tag: "mt-food", label: "food", name: "Oats 50g cooked in milk 250ml", note: "Cook oats in milk \u2014 thick and creamy base", p: 16, f: 1.6, c: 320 },
          { tag: "mt-supp", label: "supplement", name: "MyProtein choc brownie 1 scoop", note: "Stir in AFTER cooking. Cool 2 min first \u2014 never heat powder", p: 25, f: 2, c: 180 },
          { tag: "mt-supp", label: "supplement", name: "MyProtein peanut butter 1 tbsp", note: "Mix in \u2014 healthy fat, keeps you full until lunch", p: 4, f: 0.3, c: 10 },
          { tag: "mt-food", label: "food", name: "Dry fruits \u2014 5 almonds + 2 walnuts + 2 dates", note: "Top on bowl. Almonds = iron + calcium. Dates = iron + sweetness.", p: 3, f: 1.2, c: 45 },
          { tag: "mt-food", label: "food", name: "Chia seeds 1 tbsp (sprinkle on top)", note: "Iron + calcium + omega-3. No taste. Just put on top.", p: 2, f: 1.0, c: 90 },
        ],
        tip: "Cook oats in milk \u2192 cool 2 min \u2192 stir protein + peanut butter \u2192 top with dry fruits + chia. Eat as a proper sit-down bowl.",
        totals: { p: 50, f: 6.1, c: 645, kcal: 510 }
      },
      {
        num: "02", badge: "Lunch", bc: "#BA7517", bt: "#FAEEDA",
        name: "Sprouted bowl + normal food", time: "12:30 \u2013 1:00 PM", loc: null,
        items: [
          { tag: "mt-food", label: "food", name: "Soaked green moong dal 60g (raw \u2014 8\u201312hr soak)", note: "Sprouted = 15% more protein + double iron vs cooked", p: 6, f: 1.5, c: 40 },
          { tag: "mt-food", label: "food", name: "Soaked black chickpeas 60g (raw \u2014 12hr soak)", note: "Indian store. Soak overnight. Best iron legume you have.", p: 7, f: 2.0, c: 50 },
          { tag: "mt-food", label: "food", name: "Curd 150g", note: "Probiotics help digest raw sprouts. Always pair together.", p: 5, f: 0.1, c: 180 },
          { tag: "mt-food", label: "food", name: "Lemon + chaat masala + cucumber", note: "MUST \u2014 vitamin C from lemon doubles iron absorption", p: 0, f: 0, c: 0 },
          { tag: "mt-food", label: "food", name: "Cooked dal 100g + roti 2 pcs", note: "Hot normal food alongside \u2014 main carbs for the day", p: 15, f: 2.2, c: 30 },
        ],
        tip: "Always add lemon on sprouts before eating. This is non-negotiable \u2014 it doubles every mg of iron you absorb.",
        totals: { p: 33, f: 5.8, c: 300, kcal: 470 }
      },
      isHome ? {
        num: "03", badge: "Evening snack", bc: "#D85A30", bt: "#FAECE7",
        name: "Home protein sandwich", time: "5:00 \u2013 6:00 PM", loc: "home",
        items: [
          { tag: "mt-home", label: "home", name: "Multigrain bread 2 slices (supermarket)", note: "Multigrain = more protein + fibre vs white shokupan", p: 6, f: 1.0, c: 30 },
          { tag: "mt-home", label: "home", name: "Paneer 80g \u2014 slice or crumble (Indian store)", note: "Grill or use raw. Best protein filling for sandwich.", p: 14, f: 0.3, c: 384 },
          { tag: "mt-home", label: "home", name: "Cheese slice 1 pc (supermarket/conbini)", note: "Adds calcium + extra protein. Melts well if toasted.", p: 4, f: 0, c: 150 },
          { tag: "mt-home", label: "home", name: "Cucumber + tomato slices + chaat masala", note: "Adds freshness. Vitamin C helps iron from paneer.", p: 1, f: 0.2, c: 15 },
          { tag: "mt-supp", label: "supplement", name: "MyProtein peanut butter 1 tbsp (spread on bread)", note: "Spread on one slice instead of butter \u2014 adds protein + healthy fat", p: 4, f: 0.3, c: 10 },
          { tag: "mt-supp", label: "supplement", name: "MyProtein creatine 5g in water", note: "Take alongside sandwich. Every day \u2014 same time always.", p: 0, f: 0, c: 0 },
          { tag: "mt-food", label: "food", name: "2 breads + 1 spoon peanut butter", note: "Extra energy \u2014 healthy fats + slow carbs for sustained fuel", p: 6, f: 0.5, c: 20 },
          { tag: "mt-food", label: "food", name: "1 piece of fruit (banana/apple)", note: "Natural sugars + fibre \u2014 quick energy before/after workout", p: 1, f: 0.2, c: 10 },
          { tag: "mt-food", label: "food", name: "Cinnamon powder (sprinkle)", note: "Anti-inflammatory + helps regulate blood sugar. Add on fruit or bread.", p: 0, f: 0.1, c: 10 },
        ],
        tip: "Toast the bread for 2 min \u2014 melts cheese, makes paneer slightly warm. Quick, high protein, zero effort. Can prepare in 5 minutes at home.",
        totals: { p: 36, f: 2.6, c: 629, kcal: 450 },
        extra: "Paneer sandwich is your best home option \u2014 29g protein + 584mg calcium in one snack. No cooking skill needed. Just slice, fill, toast."
      } : {
        num: "03", badge: "Evening snack", bc: "#D85A30", bt: "#FAECE7",
        name: "Office conbini snack", time: "5:00 PM", loc: "office",
        items: [
          { tag: "mt-jp", label: "conbini", name: "Natto 1 pack \u2014 \u5c0f\u7c92 small grain (50g)", note: "Open pack, mix included sauce, eat at desk with spoon", p: 8, f: 1.7, c: 45 },
          { tag: "mt-supp", label: "supplement", name: "MyProtein choc brownie 1 scoop in milk 200ml", note: "Shaker bottle at desk. Buy Meiji milk carton \u00a580 at conbini.", p: 32, f: 0.1, c: 300 },
          { tag: "mt-supp", label: "supplement", name: "MyProtein creatine 5g in water", note: "Every day \u2014 same 5 PM time. Mix in water bottle at desk.", p: 0, f: 0, c: 0 },
          { tag: "mt-food", label: "food", name: "2 breads + 1 spoon peanut butter", note: "Extra energy \u2014 healthy fats + slow carbs for sustained fuel", p: 6, f: 0.5, c: 20 },
          { tag: "mt-food", label: "food", name: "1 piece of fruit (banana/apple)", note: "Natural sugars + fibre \u2014 quick energy before/after workout", p: 1, f: 0.2, c: 10 },
          { tag: "mt-food", label: "food", name: "Cinnamon powder (sprinkle)", note: "Anti-inflammatory + helps regulate blood sugar. Add on fruit or bread.", p: 0, f: 0.1, c: 10 },
        ],
        tip: "Total ~\u00a5160. Shaker bottle stays permanently at office. Bring protein in zip-lock bag. Natto from conbini fridge section.",
        totals: { p: 47, f: 2.6, c: 385, kcal: 430 },
        extra: null
      },
      {
        num: "04", badge: "Dinner", bc: "#378ADD", bt: "#E6F1FB",
        name: "Light dinner \u2014 rotate options", time: "9:00 \u2013 9:30 PM", loc: null,
        items: [
          { tag: "mt-opt", label: "option", name: "Option A (Mon/Wed/Fri) \u2014 Dal 150g + roti 1 pc", note: "Masoor or moong. Thin \u2014 easy to digest at night.", p: 16, f: 2.5, c: 40 },
          { tag: "mt-opt", label: "option", name: "Option B (Tue/Thu) \u2014 Curd rice small + paneer 50g", note: "Very light. Paneer = overnight casein protein.", p: 16, f: 0.3, c: 360 },
          { tag: "mt-opt", label: "option", name: "Option C (Sat/Sun) \u2014 Moong dal khichdi + ghee 1 tsp", note: "One pot, 10 min. Best post-gym night meal.", p: 13, f: 1.8, c: 40 },
          { tag: "mt-food", label: "food", name: "Warm milk 200ml \u2014 every night before sleep", note: "Non-negotiable. Casein feeds muscles 6\u20138 hrs during sleep.", p: 7, f: 0.1, c: 300 },
        ],
        tip: "Always finish by 9:30 PM. Warm milk is the last thing before sleep \u2014 every single night without exception.",
        totals: { p: 23, f: 2.6, c: 400, kcal: 310 }
      }
    ];
  }

  let mealActive = 0;

  function renderMeals() {
    const d = mealDays[mealActive];
    document.getElementById('mealMacros').innerHTML = `
      <div class="meal-mc"><div class="meal-mc-label">Calories</div><div class="meal-mc-val" style="color:var(--text)">${d.cals}</div></div>
      <div class="meal-mc"><div class="meal-mc-label">Protein</div><div class="meal-mc-val" style="color:#1D9E75">${d.pro}g</div></div>
      <div class="meal-mc"><div class="meal-mc-label">Iron</div><div class="meal-mc-val" style="color:#D85A30">${d.iron}mg</div></div>
      <div class="meal-mc"><div class="meal-mc-label">Calcium</div><div class="meal-mc-val" style="color:#378ADD">${d.cal}mg</div></div>
    `;

    const meals = getMeals(d.home);
    document.getElementById('mealContent').innerHTML = meals.map(m => {
      const locHtml = m.loc === 'home'
        ? '<span class="meal-loc-badge" style="background:rgba(29,158,117,0.15);color:#1D9E75">At home</span>'
        : m.loc === 'office'
        ? '<span class="meal-loc-badge" style="background:rgba(55,138,221,0.15);color:#378ADD">At office</span>'
        : '';
      return `
      <div class="meal-card">
        <div class="meal-card-head">
          <span class="meal-num-badge">${m.num}</span>
          <span class="meal-type-badge" style="background:${m.bc};color:${m.bt}">${m.badge}</span>
          <span class="meal-card-name">${m.name}</span>
          ${locHtml}
          <span class="meal-card-time">${m.time}</span>
        </div>
        <div class="meal-card-body">
          ${m.items.map(it => `
            <div class="meal-item-row">
              <div class="meal-item-left">
                <span class="meal-item-tag ${it.tag}">${it.label}</span>
                <div>
                  <div class="meal-item-name">${it.name}</div>
                  <div class="meal-item-note">${it.note}</div>
                </div>
              </div>
              <div class="meal-item-macros">
                ${it.p > 0 ? `<span class="mp">${it.p}g P</span>` : ''}
                ${it.f > 0 ? `<span class="mf">${it.f}mg Fe</span>` : ''}
                ${it.c > 0 ? `<span class="mc">${it.c}mg Ca</span>` : ''}
              </div>
            </div>
          `).join('')}
          <div class="meal-totals-row">
            <span class="meal-chip" style="background:rgba(29,158,117,0.15);color:#1D9E75">${m.totals.p}g Protein</span>
            ${m.totals.f > 0 ? `<span class="meal-chip" style="background:rgba(216,90,48,0.15);color:#D85A30">${m.totals.f}mg Iron</span>` : ''}
            ${m.totals.c > 0 ? `<span class="meal-chip" style="background:rgba(55,138,221,0.15);color:#378ADD">${m.totals.c}mg Ca</span>` : ''}
            <span class="meal-chip" style="background:rgba(255,255,255,0.06);color:var(--text-muted)">~${m.totals.kcal} kcal</span>
          </div>
          <div class="meal-tip">${m.tip}</div>
          ${m.extra ? `<div class="meal-home-box">${m.extra}</div>` : ''}
        </div>
      </div>
    `}).join('');
  }

  // Build meal day tabs
  const mealTabsEl = document.getElementById('mealTabs');
  if (mealTabsEl) {
    mealDays.forEach((d, i) => {
      const btn = document.createElement('button');
      btn.className = 'meal-dt' + (i === 0 ? ' active' : '');
      btn.innerHTML = `${d.label} <span style="font-size:9px;opacity:0.7">${d.sub}</span>`;
      btn.addEventListener('click', () => {
        mealActive = i;
        document.querySelectorAll('.meal-dt').forEach((el, j) => el.classList.toggle('active', j === i));
        renderMeals();
      });
      mealTabsEl.appendChild(btn);
    });
    renderMeals();
  }
})();
