(() => {
  const STORAGE_KEY = "khadija_business_data_v1";

  const DEFAULT_DATA = {
    businessName: "استوديو خديجة إبراهيم للحلول الرقمية",
    tagline: "تصميم وتطوير مواقع وحلول رقمية متكاملة",
    heroBadge: "شريكك الموثوق للتحول الرقمي",
    heroTitle: "نصمّم حضورك الرقمي باحترافية تعكس قيمة علامتك",
    heroDescription: "نساعد الشركات ورواد الأعمال على إطلاق مواقع ويب سريعة ومتجاوبة باللغة العربية، مع تصميم تجربة مستخدم واضحة تزيد ثقة العملاء وتضاعف فرص التواصل والمبيعات.",
    whatsappNumber: "+966 50 123 4567",
    address: "الرياض، حي العليا — طريق الملك فهد",
    workingHours: "الأحد - الخميس: 9:00 صباحاً - 6:00 مساءً",
    email: "hello@khadija-studio.example",
    heroImage: "assets/images/hero-studio.jpg",
    aboutImage: "assets/images/about-team.jpg",
    aboutHeading: "رؤيتنا ومنهجيتنا في العمل",
    aboutStory: "انطلق استوديو خديجة إبراهيم برؤية واضحة تجمع بين الدقة الهندسية وجمال التصميم العربي المعاصر. نؤمن أن الموقع التجاري الناجح لا يكتفي بالمظهر الجيد، بل يقدّم رسالة واضحة، وسرعة تحميل عالية، وتجربة سلسة على الجوال تقود الزائر مباشرة إلى اتخاذ القرار.",
    aboutMission: "تمكين المشاريع الطموحة من امتلاك واجهة رقمية موثوقة وسهلة الإدارة دون تعقيد تقني.",
    services: [
      {
        id: "srv-1",
        icon: "◈",
        tag: "تسليم خلال 7 أيام",
        title: "تصميم وتطوير المواقع التعريفية",
        description: "بناء موقع احترافي متجاوب بالكامل باللغة العربية، مهيأ لمحركات البحث وسريع التحميل على الجوال والكمبيوتر."
      },
      {
        id: "srv-2",
        icon: "✦",
        tag: "هوية وتجربة مستخدم",
        title: "تصميم تجربة المستخدم (UI/UX)",
        description: "إعادة هيكلة رحلة العميل وتصميم واجهات واضحة ترفع معدل التحويل وتقلل تشتت الزوار."
      },
      {
        id: "srv-3",
        icon: "⚡",
        tag: "استشارة وتنفيذ",
        title: "تطوير صفحات الهبوط والحملات",
        description: "صفحات مخصصة للحملات الإعلانية مرتبطة مباشرة بواتساب لالتقاط طلبات العملاء بأعلى كفاءة."
      }
    ]
  };

  let state = loadState();
  let editMode = false;
  let editingServiceId = null;
  let toastTimer = null;

  const page = document.body.dataset.page || "home";
  const toggleEditBtn = document.getElementById("toggle-edit-btn");
  const toggleEditLabel = document.getElementById("toggle-edit-label");
  const editToolbar = document.getElementById("edit-toolbar");
  const exportBtn = document.getElementById("export-btn");
  const importFile = document.getElementById("import-file");
  const resetBtn = document.getElementById("reset-btn");
  const navToggle = document.getElementById("nav-toggle");
  const mainNav = document.getElementById("main-nav");
  const toastEl = document.getElementById("toast");

  const yearEl = document.getElementById("current-year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  function cloneDefaults() {
    return JSON.parse(JSON.stringify(DEFAULT_DATA));
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return cloneDefaults();
      return normalizeState(JSON.parse(raw));
    } catch {
      return cloneDefaults();
    }
  }

  function normalizeState(raw) {
    const def = cloneDefaults();
    return {
      businessName: strOr(raw.businessName, def.businessName),
      tagline: typeof raw.tagline === "string" ? raw.tagline : def.tagline,
      heroBadge: typeof raw.heroBadge === "string" ? raw.heroBadge : def.heroBadge,
      heroTitle: strOr(raw.heroTitle, def.heroTitle),
      heroDescription: typeof raw.heroDescription === "string" ? raw.heroDescription : def.heroDescription,
      whatsappNumber: strOr(raw.whatsappNumber, def.whatsappNumber),
      address: strOr(raw.address, def.address),
      workingHours: typeof raw.workingHours === "string" ? raw.workingHours : def.workingHours,
      email: typeof raw.email === "string" ? raw.email : def.email,
      heroImage: typeof raw.heroImage === "string" ? raw.heroImage : def.heroImage,
      aboutImage: typeof raw.aboutImage === "string" ? raw.aboutImage : def.aboutImage,
      aboutHeading: strOr(raw.aboutHeading, def.aboutHeading),
      aboutStory: typeof raw.aboutStory === "string" ? raw.aboutStory : def.aboutStory,
      aboutMission: typeof raw.aboutMission === "string" ? raw.aboutMission : def.aboutMission,
      services: Array.isArray(raw.services)
        ? raw.services.map((s, idx) => ({
            id: s.id || `srv-${Date.now()}-${idx}`,
            icon: String(s.icon || "◈").trim() || "◈",
            tag: String(s.tag || "").trim(),
            title: String(s.title || "").trim() || "خدمة",
            description: String(s.description || "").trim()
          }))
        : def.services
    };
  }

  function strOr(val, fallback) {
    return typeof val === "string" && val.trim() ? val : fallback;
  }

  function saveState(msg) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      if (msg) showToast(msg);
    } catch {
      showToast("تعذر الحفظ محلياً: المساحة ممتلئة، صدّر البيانات أو صغّر الصور.");
    }
  }

  function showToast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastEl.hidden = true;
    }, 2600);
  }

  // Clean WhatsApp number: convert Arabic-Indic digits, strip symbols, remove leading 00
  function cleanWhatsAppNumber(raw) {
    const arabicDigits = "٠١٢٣٤٥٦٧٨٩";
    let normalized = String(raw || "").replace(/[٠-٩]/g, (d) => String(arabicDigits.indexOf(d)));
    let digits = normalized.replace(/[^\d]/g, "");
    if (digits.startsWith("00")) digits = digits.slice(2);
    return digits;
  }

  function buildWhatsAppUrl(text = "") {
    const digits = cleanWhatsAppNumber(state.whatsappNumber);
    if (!digits) return "#";
    const base = `https://wa.me/${digits}`;
    return text ? `${base}?text=${encodeURIComponent(text)}` : base;
  }

  function compressImageFile(file, maxSize = 960, maxBytes = 160 * 1024) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error("read_failed"));
      reader.onload = () => {
        const img = new Image();
        img.onerror = () => reject(new Error("decode_failed"));
        img.onload = () => {
          let width = img.naturalWidth || img.width;
          let height = img.naturalHeight || img.height;
          if (width > maxSize || height > maxSize) {
            const ratio = Math.min(maxSize / width, maxSize / height);
            width = Math.max(1, Math.round(width * ratio));
            height = Math.max(1, Math.round(height * ratio));
          }
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, width, height);
          ctx.drawImage(img, 0, 0, width, height);

          let quality = 0.82;
          let dataUrl = canvas.toDataURL("image/jpeg", quality);
          while (dataUrl.length * 0.75 > maxBytes && quality > 0.35) {
            quality -= 0.1;
            dataUrl = canvas.toDataURL("image/jpeg", quality);
          }
          resolve(dataUrl);
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    });
  }

  function bindSharedTextAndLinks() {
    const map = {
      businessName: state.businessName,
      tagline: state.tagline,
      heroBadge: state.heroBadge,
      heroTitle: state.heroTitle,
      heroDescription: state.heroDescription,
      whatsappDisplay: state.whatsappNumber,
      address: state.address,
      workingHours: state.workingHours,
      email: state.email,
      aboutHeading: state.aboutHeading,
      aboutStory: state.aboutStory,
      aboutMission: state.aboutMission
    };

    document.querySelectorAll("[data-bind]").forEach((el) => {
      const key = el.getAttribute("data-bind");
      if (key in map) el.textContent = map[key];
    });

    const waHref = buildWhatsAppUrl("مرحباً، أود الاستفسار عن خدماتكم.");
    document.querySelectorAll("[data-bind-wa='true']").forEach((a) => {
      a.href = waHref;
    });

    const emailLink = document.getElementById("email-link");
    if (emailLink) {
      emailLink.href = `mailto:${state.email}`;
    }

    if (page === "home") {
      document.title = `${state.businessName} | الرئيسية والخدمات`;
    } else if (page === "about") {
      document.title = `عن النشاط | ${state.businessName}`;
    } else if (page === "contact") {
      document.title = `تواصل معنا | ${state.businessName}`;
    }
  }

  function renderHome() {
    const heroView = document.getElementById("hero-view");
    const heroEditForm = document.getElementById("hero-edit-form");
    const heroImgEl = document.getElementById("hero-image-el");
    const heroImgPh = document.getElementById("hero-image-placeholder");
    const heroImgControls = document.getElementById("hero-image-controls");
    const addServiceBtn = document.getElementById("add-service-btn");

    if (heroView) heroView.hidden = editMode;
    if (heroEditForm) heroEditForm.hidden = !editMode;
    if (heroImgControls) heroImgControls.hidden = !editMode;
    if (addServiceBtn) addServiceBtn.hidden = !editMode;

    if (heroImgEl && heroImgPh) {
      if (state.heroImage) {
        heroImgEl.src = state.heroImage;
        heroImgEl.hidden = false;
        heroImgPh.hidden = true;
      } else {
        heroImgEl.hidden = true;
        heroImgPh.hidden = false;
        heroImgPh.textContent = state.businessName;
      }
    }

    // Populate home edit inputs
    setVal("edit-business-name", state.businessName);
    setVal("edit-tagline", state.tagline);
    setVal("edit-hero-badge", state.heroBadge);
    setVal("edit-whatsapp", state.whatsappNumber);
    setVal("edit-hero-title", state.heroTitle);
    setVal("edit-hero-desc", state.heroDescription);
    setVal("edit-address", state.address);

    renderServices();
  }

  function renderServices() {
    const grid = document.getElementById("services-grid");
    if (!grid) return;
    grid.innerHTML = "";

    if (!state.services.length) {
      const empty = document.createElement("div");
      empty.className = "empty-state";
      empty.textContent = "لا توجد خدمات مضافة حالياً. فعّل وضع التحرير لإضافة خدمات.";
      grid.appendChild(empty);
      return;
    }

    state.services.forEach((srv) => {
      const card = document.createElement("article");
      card.className = "service-card";

      const top = document.createElement("div");
      top.className = "service-top";

      const icon = document.createElement("span");
      icon.className = "service-icon";
      icon.setAttribute("aria-hidden", "true");
      icon.textContent = srv.icon || "◈";
      top.appendChild(icon);

      if (srv.tag) {
        const tag = document.createElement("span");
        tag.className = "service-tag";
        tag.textContent = srv.tag;
        top.appendChild(tag);
      }

      const title = document.createElement("h3");
      title.className = "service-title";
      title.textContent = srv.title;

      const desc = document.createElement("p");
      desc.className = "service-desc";
      desc.textContent = srv.description;

      const footer = document.createElement("div");
      footer.className = "service-footer";

      const askBtn = document.createElement("a");
      askBtn.className = "btn btn-outline btn-xs";
      askBtn.href = buildWhatsAppUrl(`مرحباً، أود الاستفسار عن خدمة: ${srv.title}`);
      askBtn.target = "_blank";
      askBtn.rel = "noopener noreferrer";
      askBtn.textContent = "اطلب عبر واتساب ↗";
      footer.appendChild(askBtn);

      if (editMode) {
        const editActions = document.createElement("div");
        editActions.className = "service-edit-actions";

        const editBtn = document.createElement("button");
        editBtn.type = "button";
        editBtn.className = "btn btn-primary btn-xs";
        editBtn.textContent = "تعديل";
        editBtn.addEventListener("click", () => openServiceModal(srv));

        const delBtn = document.createElement("button");
        delBtn.type = "button";
        delBtn.className = "btn btn-danger-outline btn-xs";
        delBtn.textContent = "حذف";
        delBtn.addEventListener("click", () => {
          state.services = state.services.filter((item) => item.id !== srv.id);
          saveState("تم حذف الخدمة");
          renderServices();
        });

        editActions.append(editBtn, delBtn);
        footer.appendChild(editActions);
      }

      card.append(top, title, desc, footer);
      grid.appendChild(card);
    });
  }

  function renderAbout() {
    const aboutView = document.getElementById("about-view");
    const aboutEditForm = document.getElementById("about-edit-form");
    const aboutImgEl = document.getElementById("about-image-el");
    const aboutImgPh = document.getElementById("about-image-placeholder");
    const aboutImgControls = document.getElementById("about-image-controls");

    if (aboutView) aboutView.hidden = editMode;
    if (aboutEditForm) aboutEditForm.hidden = !editMode;
    if (aboutImgControls) aboutImgControls.hidden = !editMode;

    if (aboutImgEl && aboutImgPh) {
      if (state.aboutImage) {
        aboutImgEl.src = state.aboutImage;
        aboutImgEl.hidden = false;
        aboutImgPh.hidden = true;
      } else {
        aboutImgEl.hidden = true;
        aboutImgPh.hidden = false;
        aboutImgPh.textContent = state.businessName;
      }
    }

    setVal("edit-about-heading", state.aboutHeading);
    setVal("edit-about-story", state.aboutStory);
    setVal("edit-about-mission", state.aboutMission);
    setVal("edit-about-address", state.address);
    setVal("edit-about-hours", state.workingHours);
  }

  function renderContact() {
    const contactEditForm = document.getElementById("contact-edit-form");
    if (contactEditForm) contactEditForm.hidden = !editMode;

    setVal("edit-contact-business", state.businessName);
    setVal("edit-contact-wa", state.whatsappNumber);
    setVal("edit-contact-address", state.address);
    setVal("edit-contact-hours", state.workingHours);
    setVal("edit-contact-email", state.email);

    const serviceSelect = document.getElementById("visitor-service");
    if (serviceSelect) {
      serviceSelect.innerHTML = "";
      state.services.forEach((s) => {
        const opt = document.createElement("option");
        opt.value = s.title;
        opt.textContent = s.title;
        serviceSelect.appendChild(opt);
      });
      const generalOpt = document.createElement("option");
      generalOpt.value = "استفسار عام";
      generalOpt.textContent = "استفسار عام";
      serviceSelect.appendChild(generalOpt);
    }
  }

  function setVal(id, value) {
    const el = document.getElementById(id);
    if (el && document.activeElement !== el) {
      el.value = value;
    }
  }

  function renderAll() {
    if (toggleEditBtn) toggleEditBtn.setAttribute("aria-pressed", String(editMode));
    if (toggleEditLabel) toggleEditLabel.textContent = editMode ? "إنهاء التحرير" : "وضع التحرير";
    if (editToolbar) editToolbar.hidden = !editMode;

    bindSharedTextAndLinks();
    if (page === "home") renderHome();
    if (page === "about") renderAbout();
    if (page === "contact") renderContact();
  }

  // Home page editing listeners
  function setupHomeListeners() {
    const bindInput = (id, key, fallback) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.addEventListener("input", () => {
        state[key] = fallback ? (el.value.trim() || fallback) : el.value;
        saveState();
        bindSharedTextAndLinks();
      });
    };

    bindInput("edit-business-name", "businessName", DEFAULT_DATA.businessName);
    bindInput("edit-tagline", "tagline");
    bindInput("edit-hero-badge", "heroBadge");
    bindInput("edit-whatsapp", "whatsappNumber", DEFAULT_DATA.whatsappNumber);
    bindInput("edit-hero-title", "heroTitle", DEFAULT_DATA.heroTitle);
    bindInput("edit-hero-desc", "heroDescription");
    bindInput("edit-address", "address", DEFAULT_DATA.address);

    const heroUpload = document.getElementById("hero-image-upload");
    const heroRemove = document.getElementById("hero-image-remove");
    const heroImgEl = document.getElementById("hero-image-el");

    if (heroImgEl) {
      heroImgEl.addEventListener("error", () => {
        heroImgEl.hidden = true;
        const ph = document.getElementById("hero-image-placeholder");
        if (ph) ph.hidden = false;
      });
    }

    if (heroUpload) {
      heroUpload.addEventListener("change", async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
          state.heroImage = await compressImageFile(file, 1000, 160 * 1024);
          saveState("تم ضغط صورة الواجهة وحفظها");
          renderHome();
        } catch {
          showToast("تعذر قراءة الصورة المختارة.");
        } finally {
          heroUpload.value = "";
        }
      });
    }

    if (heroRemove) {
      heroRemove.addEventListener("click", () => {
        state.heroImage = "";
        saveState("تم حذف صورة الواجهة");
        renderHome();
      });
    }

    // Service modal
    const addServiceBtn = document.getElementById("add-service-btn");
    const modal = document.getElementById("service-modal");
    const modalClose = document.getElementById("service-modal-close");
    const modalCancel = document.getElementById("service-modal-cancel");
    const serviceForm = document.getElementById("service-form");

    if (addServiceBtn) {
      addServiceBtn.addEventListener("click", () => openServiceModal(null));
    }
    if (modalClose) modalClose.addEventListener("click", closeServiceModal);
    if (modalCancel) modalCancel.addEventListener("click", closeServiceModal);
    if (modal) {
      modal.addEventListener("click", (e) => {
        if (e.target === modal) closeServiceModal();
      });
    }

    if (serviceForm) {
      serviceForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const title = document.getElementById("service-title-input").value.trim();
        const tag = document.getElementById("service-tag-input").value.trim();
        const icon = document.getElementById("service-icon-input").value.trim() || "◈";
        const description = document.getElementById("service-desc-input").value.trim();
        if (!title || !description) return;

        if (editingServiceId) {
          const srv = state.services.find((s) => s.id === editingServiceId);
          if (srv) Object.assign(srv, { title, tag, icon, description });
          saveState("تم تحديث الخدمة");
        } else {
          state.services.push({ id: `srv-${Date.now()}`, title, tag, icon, description });
          saveState("تمت إضافة الخدمة الجديدة");
        }
        closeServiceModal();
        renderServices();
      });
    }
  }

  function openServiceModal(service) {
    const modal = document.getElementById("service-modal");
    const modalTitle = document.getElementById("service-modal-title");
    if (!modal) return;
    editingServiceId = service ? service.id : null;
    modalTitle.textContent = service ? "تعديل الخدمة" : "إضافة خدمة جديدة";

    document.getElementById("service-title-input").value = service ? service.title : "";
    document.getElementById("service-tag-input").value = service ? service.tag : "";
    document.getElementById("service-icon-input").value = service ? service.icon : "✦";
    document.getElementById("service-desc-input").value = service ? service.description : "";

    modal.hidden = false;
  }

  function closeServiceModal() {
    const modal = document.getElementById("service-modal");
    if (modal) modal.hidden = true;
    editingServiceId = null;
  }

  // About page listeners
  function setupAboutListeners() {
    const bindInput = (id, key, fallback) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.addEventListener("input", () => {
        state[key] = fallback ? (el.value.trim() || fallback) : el.value;
        saveState();
        bindSharedTextAndLinks();
      });
    };

    bindInput("edit-about-heading", "aboutHeading", DEFAULT_DATA.aboutHeading);
    bindInput("edit-about-story", "aboutStory");
    bindInput("edit-about-mission", "aboutMission");
    bindInput("edit-about-address", "address", DEFAULT_DATA.address);
    bindInput("edit-about-hours", "workingHours");

    const aboutUpload = document.getElementById("about-image-upload");
    const aboutRemove = document.getElementById("about-image-remove");
    const aboutImgEl = document.getElementById("about-image-el");

    if (aboutImgEl) {
      aboutImgEl.addEventListener("error", () => {
        aboutImgEl.hidden = true;
        const ph = document.getElementById("about-image-placeholder");
        if (ph) ph.hidden = false;
      });
    }

    if (aboutUpload) {
      aboutUpload.addEventListener("change", async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
          state.aboutImage = await compressImageFile(file, 1000, 160 * 1024);
          saveState("تم ضغط الصورة وحفظها");
          renderAbout();
        } catch {
          showToast("تعذر قراءة الصورة المختارة.");
        } finally {
          aboutUpload.value = "";
        }
      });
    }

    if (aboutRemove) {
      aboutRemove.addEventListener("click", () => {
        state.aboutImage = "";
        saveState("تم حذف الصورة");
        renderAbout();
      });
    }
  }

  // Contact page listeners
  function setupContactListeners() {
    const bindInput = (id, key, fallback) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.addEventListener("input", () => {
        state[key] = fallback ? (el.value.trim() || fallback) : el.value;
        saveState();
        bindSharedTextAndLinks();
      });
    };

    bindInput("edit-contact-business", "businessName", DEFAULT_DATA.businessName);
    bindInput("edit-contact-wa", "whatsappNumber", DEFAULT_DATA.whatsappNumber);
    bindInput("edit-contact-address", "address", DEFAULT_DATA.address);
    bindInput("edit-contact-hours", "workingHours");
    bindInput("edit-contact-email", "email");

    const quickWaForm = document.getElementById("quick-wa-form");
    if (quickWaForm) {
      quickWaForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const name = document.getElementById("visitor-name").value.trim();
        const service = document.getElementById("visitor-service").value;
        const message = document.getElementById("visitor-message").value.trim();
        const fullText = `مرحباً، أنا ${name}.\nالخدمة المطلوبة: ${service}\nالتفاصيل: ${message}`;
        const url = buildWhatsAppUrl(fullText);
        if (url === "#") {
          showToast("يرجى التحقق من رقم الواتساب في وضع التحرير.");
          return;
        }
        window.open(url, "_blank", "noopener,noreferrer");
      });
    }
  }

  // Shared Navigation & Toolbar Events
  if (navToggle && mainNav) {
    navToggle.addEventListener("click", () => {
      const isOpen = mainNav.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });
  }

  if (toggleEditBtn) {
    toggleEditBtn.addEventListener("click", () => {
      editMode = !editMode;
      renderAll();
      showToast(editMode ? "تم تفعيل وضع التحرير" : "تم حفظ التعديلات وإغلاق التحرير");
    });
  }

  if (exportBtn) {
    exportBtn.addEventListener("click", () => {
      const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "data.json";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      showToast("تم تصدير ملف data.json بنجاح");
    });
  }

  if (importFile) {
    importFile.addEventListener("change", (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          state = normalizeState(JSON.parse(String(reader.result)));
          saveState("تم استيراد البيانات وتطبيقها");
          renderAll();
        } catch {
          showToast("ملف JSON غير صالح.");
        } finally {
          importFile.value = "";
        }
      };
      reader.readAsText(file, "utf-8");
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      if (!window.confirm("هل تريد استعادة البيانات الافتراضية وحذف التعديلات؟")) return;
      localStorage.removeItem(STORAGE_KEY);
      state = cloneDefaults();
      renderAll();
      showToast("تمت استعادة البيانات الافتراضية");
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeServiceModal();
  });

  if (page === "home") setupHomeListeners();
  if (page === "about") setupAboutListeners();
  if (page === "contact") setupContactListeners();

  renderAll();
})();
