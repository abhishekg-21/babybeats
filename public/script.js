class PregnancyApp {
  constructor() {
    this.currentDate = new Date(2025, 3, 1); // April 2025 to match design
    this.appointments = [];
    this.currentView = "home";
    this.monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    this.init();
  }

  async init() {
    this.setupEventListeners();
    this.setupNavigationHandlers();
    this.setupInteractiveFeatures();
    await this.loadAppointments();
    this.renderCalendar();
    this.startProgressAnimation();
  }

  setupEventListeners() {
    // Calendar navigation
    document.getElementById("prevMonth").addEventListener("click", () => {
      this.currentDate.setMonth(this.currentDate.getMonth() - 1);
      this.renderCalendar();
      this.loadAppointments();
    });

    document.getElementById("nextMonth").addEventListener("click", () => {
      this.currentDate.setMonth(this.currentDate.getMonth() + 1);
      this.renderCalendar();
      this.loadAppointments();
    });

    // Add click handler for calendar days
    document.addEventListener("click", (e) => {
      if (
        e.target.classList.contains("calendar-day") &&
        !e.target.classList.contains("other-month")
      ) {
        this.handleDayClick(e.target);
      }
    });
  }

  setupNavigationHandlers() {
    const navLinks = document.querySelectorAll(".nav-link");
    navLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();

        // Remove active class from all nav items
        document.querySelectorAll(".nav-item").forEach((item) => {
          item.classList.remove("active");
        });

        // Add active class to clicked item
        link.parentElement.classList.add("active");

        // Handle navigation based on link text
        const section = link.textContent.toLowerCase().replace(" ", "-");
        this.navigateToSection(section);
      });
    });
  }

  setupInteractiveFeatures() {
    // Add hover effects to tip cards
    const tipCards = document.querySelectorAll(".tip-card");
    tipCards.forEach((card) => {
      card.addEventListener("mouseenter", () => {
        card.style.transform = "translateY(-2px)";
        card.style.boxShadow = "0 8px 25px rgba(0, 0, 0, 0.1)";
      });

      card.addEventListener("mouseleave", () => {
        card.style.transform = "translateY(0)";
        card.style.boxShadow = "none";
      });
    });

    // Add click handlers for tip cards
    tipCards.forEach((card) => {
      card.addEventListener("click", () => {
        const tipTitle = card.querySelector(".tip-title").textContent;
        this.showTipDetails(tipTitle);
      });
    });

    // Add notification bell interaction
    const notificationBell = document.querySelector(".notification-bell");
    notificationBell.addEventListener("click", () => {
      this.showNotifications();
    });

    // Add profile avatar interaction
    const profileAvatar = document.querySelector(".profile-avatar");
    profileAvatar.addEventListener("click", () => {
      this.showProfileMenu();
    });

    // Add growth tracker interaction
    const growthCard = document.querySelector(".growth-card");
    growthCard.addEventListener("click", () => {
      this.showGrowthDetails();
    });
  }

  navigateToSection(section) {
    this.currentView = section;

    // Add visual feedback
    this.showToast(
      `Mapsd to ${section.charAt(0).toUpperCase() + section.slice(1)}`,
      "success"
    );

    // In a real app, this would show/hide different content sections
    console.log(`[v0] Navigating to section: ${section}`);
  }

  showTipDetails(tipTitle) {
    let content = "";

    if (tipTitle.includes("Hydrate")) {
      content = `
        <div class="tip-detail">
          <div class="tip-icon-large">💧</div>
          <h3>Stay Hydrated During Pregnancy</h3>
          <p>Proper hydration is crucial during pregnancy. Here are some tips:</p>
          <ul>
            <li>Drink 8-10 glasses of water daily</li>
            <li>Add lemon or cucumber for flavor</li>
            <li>Monitor urine color - it should be light yellow</li>
            <li>Increase intake during hot weather or exercise</li>
          </ul>
          <div class="hydration-tracker">
            <h4>Today's Progress</h4>
            <div class="water-glasses">
              ${Array.from(
                { length: 8 },
                (_, i) => `
                <div class="water-glass ${
                  i < 3 ? "filled" : ""
                }" onclick="app.toggleWaterGlass(${i})">
                  💧
                </div>
              `
              ).join("")}
            </div>
          </div>
        </div>
      `;
    } else if (tipTitle.includes("Rest")) {
      content = `
        <div class="tip-detail">
          <div class="tip-icon-large">😴</div>
          <h3>Rest and Sleep During Pregnancy</h3>
          <p>Quality rest is essential for you and your baby's health:</p>
          <ul>
            <li>Aim for 7-9 hours of sleep per night</li>
            <li>Take 15-20 minute power naps when needed</li>
            <li>Sleep on your left side for better circulation</li>
            <li>Use pregnancy pillows for comfort</li>
          </ul>
          <div class="rest-timer">
            <button onclick="app.startNapTimer()" class="btn-primary">Start 20-min Nap Timer</button>
          </div>
        </div>
      `;
    }

    const modal = this.createModal("Tip Details", content);
    document.body.appendChild(modal);
  }

  toggleWaterGlass(index) {
    const glass = document.querySelectorAll(".water-glass")[index];
    glass.classList.toggle("filled");

    const filledGlasses = document.querySelectorAll(
      ".water-glass.filled"
    ).length;
    if (filledGlasses === 8) {
      this.showToast(
        "Great job! You've reached your daily hydration goal! 🎉",
        "success"
      );
    }
  }

  startNapTimer() {
    let timeLeft = 20 * 60; // 20 minutes in seconds

    const modal = this.createModal(
      "Nap Timer",
      `
      <div class="nap-timer">
        <div class="timer-display">
          <span id="timerMinutes">20</span>:<span id="timerSeconds">00</span>
        </div>
        <div class="timer-controls">
          <button onclick="app.stopTimer()" class="btn-secondary">Stop Timer</button>
        </div>
        <p>Relax and enjoy your rest time 😴</p>
      </div>
    `
    );

    document.body.appendChild(modal);

    this.napTimerInterval = setInterval(() => {
      const minutes = Math.floor(timeLeft / 60);
      const seconds = timeLeft % 60;

      document.getElementById("timerMinutes").textContent = minutes
        .toString()
        .padStart(2, "0");
      document.getElementById("timerSeconds").textContent = seconds
        .toString()
        .padStart(2, "0");

      timeLeft--;

      if (timeLeft < 0) {
        clearInterval(this.napTimerInterval);
        this.showToast(
          "Nap time is over! Hope you feel refreshed! ✨",
          "success"
        );
        modal.remove();
      }
    }, 1000);
  }

  stopTimer() {
    if (this.napTimerInterval) {
      clearInterval(this.napTimerInterval);
      document.querySelector(".modal").remove();
    }
  }

  showNotifications() {
    const notifications = [
      {
        id: 1,
        title: "Appointment Reminder",
        message: "Doctor appointment tomorrow at 10:00 AM",
        time: "2 hours ago",
      },
      {
        id: 2,
        title: "Week Update",
        message: "You've entered week 22! Check your milestones",
        time: "1 day ago",
      },
      {
        id: 3,
        title: "Tip of the Day",
        message: "Don't forget to take your prenatal vitamins",
        time: "2 days ago",
      },
    ];

    const content = `
      <div class="notifications-list">
        ${notifications
          .map(
            (notif) => `
          <div class="notification-item">
            <div class="notification-content">
              <h4>${notif.title}</h4>
              <p>${notif.message}</p>
              <span class="notification-time">${notif.time}</span>
            </div>
            <button onclick="app.dismissNotification(${notif.id})" class="btn-dismiss">×</button>
          </div>
        `
          )
          .join("")}
      </div>
    `;

    const modal = this.createModal("Notifications", content);
    document.body.appendChild(modal);
  }

  dismissNotification(id) {
    const notificationItem = event.target.closest(".notification-item");
    notificationItem.style.opacity = "0";
    notificationItem.style.transform = "translateX(100%)";
    setTimeout(() => notificationItem.remove(), 300);
  }

  showProfileMenu() {
    const content = `
      <div class="profile-menu">
        <div class="profile-info">
          <img src="/placeholder.svg?height=80&width=80" alt="Emily" class="profile-image">
          <h3>Emily Johnson</h3>
          <p>Week 22 • Due Aug 15, 2025</p>
        </div>
        <div class="profile-actions">
          <button onclick="app.editProfile()" class="profile-btn">Edit Profile</button>
          <button onclick="app.viewSettings()" class="profile-btn">Settings</button>
          <button onclick="app.exportData()" class="profile-btn">Export Data</button>
          <button onclick="app.logout()" class="profile-btn logout">Logout</button>
        </div>
      </div>
    `;

    const modal = this.createModal("Profile", content);
    document.body.appendChild(modal);
  }

  showGrowthDetails() {
    const content = `
      <div class="growth-details">
        <h3>Baby Growth - Week 22</h3>
        <div class="growth-visual">
          <div class="baby-size">
            <span class="size-emoji">👶</span>
            <p>Your baby is about the size of a papaya!</p>
          </div>
        </div>
        <div class="growth-stats-detailed">
          <div class="stat-item">
            <span class="stat-icon">⚖️</span>
            <div>
              <strong>Weight</strong>
              <p>1.05 lb (475g)</p>
            </div>
          </div>
          <div class="stat-item">
            <span class="stat-icon">📏</span>
            <div>
              <strong>Length</strong>
              <p>10.9 in (27.8cm)</p>
            </div>
          </div>
          <div class="stat-item">
            <span class="stat-icon">🦵</span>
            <div>
              <strong>Movements</strong>
              <p>8 kicks today</p>
            </div>
          </div>
        </div>
        <div class="growth-milestones">
          <h4>This Week's Developments</h4>
          <ul>
            <li>Baby's senses are developing rapidly</li>
            <li>Taste buds are forming</li>
            <li>Baby can hear sounds from outside the womb</li>
            <li>Fingernails are growing</li>
          </ul>
        </div>
      </div>
    `;

    const modal = this.createModal("Baby Growth Tracker", content);
    document.body.appendChild(modal);
  }

  startProgressAnimation() {
    const progressCircle = document.querySelector(
      ".progress-circle circle:last-child"
    );
    if (progressCircle) {
      progressCircle.style.strokeDashoffset = "220";
      setTimeout(() => {
        progressCircle.style.transition = "stroke-dashoffset 2s ease-in-out";
        progressCircle.style.strokeDashoffset = "66";
      }, 500);
    }
  }

  async loadAppointments() {
    try {
      const month = this.currentDate.getMonth() + 1;
      const year = this.currentDate.getFullYear();

      const response = await fetch(`/api/appointments/${month}/${year}`);
      if (response.ok) {
        this.appointments = await response.json();
        this.renderCalendar(); // Re-render to show appointments
      }
    } catch (error) {
      console.error("Error loading appointments:", error);
      this.showErrorMessage(
        "Failed to load appointments. Please check your connection."
      );
    }
  }

  renderCalendar() {
    const monthYear = document.getElementById("monthYear");
    const calendarDays = document.getElementById("calendarDays");

    // Update month/year display
    monthYear.textContent = `${
      this.monthNames[this.currentDate.getMonth()]
    } ${this.currentDate.getFullYear()}`;

    // Clear previous calendar
    calendarDays.innerHTML = "";

    // Get first day of month and number of days
    const firstDay = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth(),
      1
    );
    const lastDay = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth() + 1,
      0
    );
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      const prevMonthDay = new Date(
        this.currentDate.getFullYear(),
        this.currentDate.getMonth(),
        0 - (startingDayOfWeek - 1 - i)
      );
      const dayElement = this.createDayElement(prevMonthDay.getDate(), true);
      calendarDays.appendChild(dayElement);
    }

    // Add days of the current month
    for (let day = 1; day <= daysInMonth; day++) {
      const dayElement = this.createDayElement(day, false);
      calendarDays.appendChild(dayElement);
    }

    // Add days from next month to fill the grid
    const totalCells = calendarDays.children.length;
    const remainingCells = 42 - totalCells; // 6 rows × 7 days
    for (let day = 1; day <= remainingCells && remainingCells < 14; day++) {
      const dayElement = this.createDayElement(day, true);
      calendarDays.appendChild(dayElement);
    }

    // Set the initial active day if it's the current month
    const today = new Date();
    if (
      today.getMonth() === this.currentDate.getMonth() &&
      today.getFullYear() === this.currentDate.getFullYear()
    ) {
      this.setActiveDay(today.getDate());
    }
  }

  createDayElement(day, isOtherMonth) {
    const dayElement = document.createElement("div");
    dayElement.className = "calendar-day";
    dayElement.textContent = day;
    dayElement.dataset.day = day;

    if (isOtherMonth) {
      dayElement.classList.add("other-month");
    } else {
      // Check if this day has appointments
      const dateStr = `${this.currentDate.getFullYear()}-${String(
        this.currentDate.getMonth() + 1
      ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      const hasAppointment = this.appointments.some(
        (apt) => apt.date === dateStr
      );

      if (hasAppointment) {
        dayElement.classList.add("has-appointment");
        dayElement.title = this.getAppointmentTitles(dateStr);
      }
    }

    return dayElement;
  }

  getAppointmentTitles(dateStr) {
    const dayAppointments = this.appointments.filter(
      (apt) => apt.date === dateStr
    );
    return dayAppointments.map((apt) => `${apt.time}: ${apt.title}`).join("\n");
  }

  async handleDayClick(dayElement) {
    // Visually select the clicked day
    this.setActiveDay(Number.parseInt(dayElement.dataset.day));

    const day = Number.parseInt(dayElement.dataset.day);
    const dateStr = `${this.currentDate.getFullYear()}-${String(
      this.currentDate.getMonth() + 1
    ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

    // Check if day already has appointments
    const existingAppointments = this.appointments.filter(
      (apt) => apt.date === dateStr
    );

    if (existingAppointments.length > 0) {
      this.showAppointmentDetails(existingAppointments, dateStr);
    } else {
      this.showAddAppointmentDialog(dateStr);
    }
  }

  // New method to handle active day styling
  setActiveDay(day) {
    const calendarDaysContainer = document.getElementById("calendarDays");
    if (calendarDaysContainer) {
      // Remove active class from all days
      calendarDaysContainer.querySelectorAll(".calendar-day").forEach((el) => {
        el.classList.remove("selected-day");
      });

      // Add active class to the clicked day
      const dayElement = calendarDaysContainer.querySelector(
        `.calendar-day[data-day='${day}']`
      );
      if (dayElement) {
        dayElement.classList.add("selected-day");
      }
    }
  }

  showAppointmentDetails(appointments, dateStr) {
    const modal = this.createModal(
      "Appointments",
      `
      <div class="appointment-list">
        ${appointments
          .map(
            (apt) => `
          <div class="appointment-item">
            <div class="appointment-info">
              <strong>${apt.title}</strong>
              <span class="appointment-time">${apt.time}</span>
              <span class="appointment-type">${apt.type}</span>
            </div>
            <div class="appointment-actions">
              <button onclick="app.editAppointment(${apt.id})" class="btn-edit">Edit</button>
              <button onclick="app.deleteAppointment(${apt.id})" class="btn-delete">Delete</button>
            </div>
          </div>
        `
          )
          .join("")}
      </div>
      <button onclick="app.showAddAppointmentDialog('${dateStr}')" class="btn-add">Add New Appointment</button>
    `
    );

    document.body.appendChild(modal);
  }

  showAddAppointmentDialog(dateStr) {
    const modal = this.createModal(
      "Add Appointment",
      `
      <form id="appointmentForm">
        <div class="form-group">
          <label for="appointmentTitle">Title:</label>
          <input type="text" id="appointmentTitle" required>
        </div>
        <div class="form-group">
          <label for="appointmentTime">Time:</label>
          <input type="time" id="appointmentTime" value="12:00">
        </div>
        <div class="form-group">
          <label for="appointmentType">Type:</label>
          <select id="appointmentType">
            <option value="medical">Medical</option>
            <option value="class">Class</option>
            <option value="personal">Personal</option>
            <option value="general">General</option>
          </select>
        </div>
        <div class="form-actions">
          <button type="submit" class="btn-primary">Add Appointment</button>
          <button type="button" onclick="this.closest('.modal').remove()" class="btn-secondary">Cancel</button>
        </div>
      </form>
    `
    );

    const form = modal.querySelector("#appointmentForm");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      this.addAppointment(dateStr, modal);
    });

    document.body.appendChild(modal);
  }

  async addAppointment(dateStr, modal) {
    const title = document.getElementById("appointmentTitle").value;
    const time = document.getElementById("appointmentTime").value;
    const type = document.getElementById("appointmentType").value;

    // Convert time to 12-hour format
    const timeFormatted = this.formatTime(time);

    try {
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date: dateStr,
          title: title,
          time: timeFormatted,
          type: type,
        }),
      });

      if (response.ok) {
        await this.loadAppointments();
        modal.remove();
        this.showSuccessMessage("Appointment added successfully!");
      } else {
        throw new Error("Failed to add appointment");
      }
    } catch (error) {
      console.error("Error adding appointment:", error);
      this.showErrorMessage("Failed to add appointment. Please try again.");
    }
  }

  async deleteAppointment(appointmentId) {
    if (!confirm("Are you sure you want to delete this appointment?")) {
      return;
    }

    try {
      const response = await fetch(`/api/appointments/${appointmentId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await this.loadAppointments();
        document.querySelector(".modal")?.remove();
        this.showSuccessMessage("Appointment deleted successfully!");
      } else {
        throw new Error("Failed to delete appointment");
      }
    } catch (error) {
      console.error("Error deleting appointment:", error);
      this.showErrorMessage("Failed to delete appointment. Please try again.");
    }
  }

  createModal(title, content) {
    const modal = document.createElement("div");
    modal.className = "modal";
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h3>${title}</h3>
          <button class="modal-close" onclick="this.closest('.modal').remove()">&times;</button>
        </div>
        <div class="modal-body">
          ${content}
        </div>
      </div>
    `;

    // Close modal when clicking outside
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.remove();
      }
    });

    return modal;
  }

  formatTime(time24) {
    const [hours, minutes] = time24.split(":");
    const hour12 = hours % 12 || 12;
    const ampm = hours >= 12 ? "PM" : "AM";
    return `${hour12}:${minutes} ${ampm}`;
  }

  showSuccessMessage(message) {
    this.showToast(message, "success");
  }

  showErrorMessage(message) {
    this.showToast(message, "error");
  }

  showToast(message, type) {
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.textContent = message;

    document.body.appendChild(toast);

    // Animate in
    setTimeout(() => toast.classList.add("show"), 100);

    // Remove after 3 seconds
    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  // Placeholder methods for profile actions
  editProfile() {
    this.showToast("Profile editing feature coming soon!", "success");
    document.querySelector(".modal").remove();
  }

  viewSettings() {
    this.showToast("Settings page coming soon!", "success");
    document.querySelector(".modal").remove();
  }

  exportData() {
    this.showToast("Data export feature coming soon!", "success");
    document.querySelector(".modal").remove();
  }

  logout() {
    if (confirm("Are you sure you want to logout?")) {
      this.showToast("Logged out successfully!", "success");
      document.querySelector(".modal").remove();
    }
  }
}

// Initialize the app when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  window.app = new PregnancyApp();
});
