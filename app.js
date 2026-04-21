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
})();
