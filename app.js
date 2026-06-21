const DAYS = [
  { id: "mon", label: "周一", type: "weekday" },
  { id: "tue", label: "周二", type: "weekday" },
  { id: "wed", label: "周三", type: "weekday" },
  { id: "thu", label: "周四", type: "weekday" },
  { id: "fri", label: "周五", type: "weekday" },
  { id: "sat", label: "周六", type: "weekend" },
  { id: "sun", label: "周日", type: "weekend" },
];

const SUBJECTS = {
  homework: { label: "学校作业", color: "#17324d" },
  chinese: { label: "语文", color: "#2563eb" },
  math: { label: "数学", color: "#0f9f6e" },
  english: { label: "英语", color: "#c77913" },
  course: { label: "课外", color: "#8b5cf6" },
  reading: { label: "阅读", color: "#7c3aed" },
  habits: { label: "习惯", color: "#d9485f" },
  sports: { label: "运动", color: "#64748b" },
};

const DAY_COLORS = {
  mon: { head: "#dbeafe", soft: "#f8fbff", line: "#60a5fa", text: "#17324d" },
  tue: { head: "#dcfce7", soft: "#f7fdf9", line: "#34d399", text: "#065f46" },
  wed: { head: "#ffedd5", soft: "#fffaf5", line: "#fb923c", text: "#9a3412" },
  thu: { head: "#ede9fe", soft: "#fbfaff", line: "#a78bfa", text: "#5b21b6" },
  fri: { head: "#ffe4e6", soft: "#fff8f9", line: "#fb7185", text: "#9f1239" },
  sat: { head: "#cffafe", soft: "#f6feff", line: "#22d3ee", text: "#155e75" },
  sun: { head: "#fef3c7", soft: "#fffdf5", line: "#fbbf24", text: "#92400e" },
};

const EXPORT_SUBJECT_FILLS = {
  homework: { fill: "#dbe3ee", soft: "#f6f8fb", text: "#17324d", line: "#17324d" },
  chinese: { fill: "#dbeafe", soft: "#f8fbff", text: "#1d4ed8", line: "#2563eb" },
  math: { fill: "#dcfce7", soft: "#f7fdf9", text: "#047857", line: "#0f9f6e" },
  english: { fill: "#ffedd5", soft: "#fffaf5", text: "#b45309", line: "#c77913" },
  course: { fill: "#ede9fe", soft: "#fbfaff", text: "#6d28d9", line: "#8b5cf6" },
  sports: { fill: "#e2e8f0", soft: "#f8fafc", text: "#475569", line: "#64748b" },
  habits: { fill: "#ffe4e6", soft: "#fff8f9", text: "#be123c", line: "#d9485f" },
};

const STUDY_SUBJECTS = ["homework", "chinese", "math", "english"];
const LIBRARY_SUBJECTS = [...STUDY_SUBJECTS, "sports"];

const CONTENT_OPTIONS = {
  homework: [{ id: "other", label: "其他" }],
  chinese: [{ id: "other", label: "其他" }],
  math: [{ id: "other", label: "其他" }],
  english: [{ id: "other", label: "其他" }],
  sports: [{ id: "other", label: "其他" }],
};

const COURSE_KINDS = {
  course: { label: "课外课程", placeholder: "如：钢琴课、围棋课、编程课" },
  sports: { label: "运动", placeholder: "如：跳绳、篮球训练、游泳" },
};

const STATUS_OPTIONS = [
  { id: "todo", label: "未完成" },
  { id: "partial", label: "部分完成" },
  { id: "done", label: "已完成" },
];

const HOMEWORK_MINUTES = 20;
const CONTENT_LIBRARY_VERSION = "manual-defaults-only-v1";
const REMOVED_DEFAULT_CONTENT_LABELS = ["阅读", "口算", "学霸", "abc reading", "运动"];

const DEFAULT_FORM = {
  studentName: "小朋友",
  gradeStage: "二下",
  city: "",
  weekTheme: "按每天实际作业和课程手动安排",
  weekStartDate: getCurrentWeekMonday(),
  semesterWeek: 1,
};

const GRADE_STAGE_ALIASES = {
  二年级下学期: "二下",
  二年级暑假: "二升三暑假",
  三年级上预备: "三上",
};

let state = {
  form: { ...DEFAULT_FORM },
  plan: [],
  contentLibrary: createEmptyContentLibrary(),
  contentLibraryVersion: CONTENT_LIBRARY_VERSION,
};

const els = {};

document.addEventListener("DOMContentLoaded", () => {
  bindElements();
  fillStaticSelects();
  loadState();
  hydrateForm();
  state.plan = normalizePlan(state.plan);
  updateContentOptions();
  renderContentLibrary();
  refreshDayOptions();
  render();
  bindEvents();
});

function bindElements() {
  [
    "plannerForm",
    "studentName",
    "gradeStage",
    "city",
    "weekTheme",
    "weekStartDate",
    "applyWeekStartDate",
    "semesterWeek",
    "customDayChoices",
    "customMode",
    "customSubject",
    "customContent",
    "studyFields",
    "otherTaskField",
    "customOtherLabel",
    "customOther",
    "courseFields",
    "courseKind",
    "courseTimeMode",
    "sportsContent",
    "sportsContentField",
    "courseTitleField",
    "courseTitleLabel",
    "courseTitle",
    "courseTimeRange",
    "courseStart",
    "courseEnd",
    "customMinutes",
    "addCustomTask",
    "librarySubject",
    "libraryBatchInput",
    "addLibraryOptions",
    "removeLibraryOptions",
    "libraryOptionList",
    "removeAllLibraryOptions",
    "libraryAllList",
    "libraryHint",
    "printPlan",
    "exportExcel",
    "exportPdf",
    "clearHomework",
    "resetPlan",
    "planTitle",
    "totalMinutes",
    "summaryTheme",
    "summaryRhythm",
    "summaryReview",
    "weekGrid",
    "printWeekTable",
    "subjectBars",
    "parentTips",
  ].forEach((id) => {
    els[id] = document.getElementById(id);
  });
}

function fillStaticSelects() {
  DAYS.forEach((day) => {
    const label = document.createElement("label");
    label.className = "day-choice";
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.name = "customDay";
    checkbox.value = day.id;
    checkbox.checked = day.id === "mon";
    const text = document.createElement("span");
    text.className = "day-choice-label";
    text.textContent = day.label;
    label.append(checkbox, text);
    els.customDayChoices.append(label);
  });

  STUDY_SUBJECTS.forEach((id) => {
    const option = document.createElement("option");
    option.value = id;
    option.textContent = SUBJECTS[id].label;
    els.customSubject.append(option);
  });

  LIBRARY_SUBJECTS.forEach((id) => {
    const option = document.createElement("option");
    option.value = id;
    option.textContent = SUBJECTS[id].label;
    els.librarySubject.append(option);
  });

  updateContentOptions();
  updateSportsContentOptions();
}

function bindEvents() {
  els.plannerForm.addEventListener("submit", (event) => {
    event.preventDefault();
    state.form = readForm();
    state.plan = normalizePlan(state.plan);
    saveState();
    refreshDayOptions();
    render();
  });

  els.applyWeekStartDate.addEventListener("click", () => {
    applyCurrentFormInfo();
  });

  els.weekStartDate.addEventListener("input", () => {
    applyCurrentFormInfo({ requireDate: true });
  });

  els.weekStartDate.addEventListener("change", () => {
    applyCurrentFormInfo({ requireDate: true });
  });

  els.weekStartDate.addEventListener("blur", () => {
    applyCurrentFormInfo();
  });

  els.weekStartDate.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      applyCurrentFormInfo();
    }
  });

  [els.weekTheme, els.semesterWeek].forEach((input) => {
    input.addEventListener("change", () => {
      applyCurrentFormInfo();
    });
  });

  els.addCustomTask.addEventListener("click", () => {
    const task = buildSelectedTask();
    if (!task) {
      return;
    }

    const selectedDayIds = getSelectedDayIds();
    if (!selectedDayIds.length) {
      els.customDayChoices.querySelector("input")?.focus();
      return;
    }

    selectedDayIds.forEach((dayId) => {
      const day = state.plan.find((item) => item.id === dayId);
      if (day) {
        day.tasks.push(cloneTaskForDay(task));
      }
    });

    clearTaskInputs();
    saveState();
    render();
  });

  els.customMode.addEventListener("change", () => {
    updateModeFields();
  });

  els.customSubject.addEventListener("change", () => {
    updateContentOptions();
  });

  els.customContent.addEventListener("change", () => {
    updateDetailFields();
  });

  els.librarySubject.addEventListener("change", () => {
    setLibraryHint("");
    renderLibraryOptions();
  });

  els.addLibraryOptions.addEventListener("click", () => {
    addLibraryOptions();
  });

  els.removeLibraryOptions.addEventListener("click", () => {
    removeSelectedLibraryOptions();
  });

  els.removeAllLibraryOptions.addEventListener("click", () => {
    removeSelectedLibraryOptionsFromAll();
  });

  [els.courseStart, els.courseEnd].forEach((input) => {
    input.addEventListener("change", updateCourseMinutes);
  });

  els.courseKind.addEventListener("change", updateCourseFields);
  els.courseTimeMode.addEventListener("change", updateCourseFields);
  els.sportsContent.addEventListener("change", updateCourseFields);

  els.printPlan.addEventListener("click", () => {
    window.print();
  });

  els.exportExcel.addEventListener("click", () => {
    exportExcelPlan();
  });

  els.exportPdf.addEventListener("click", () => {
    exportPdfPlan();
  });

  els.clearHomework.addEventListener("click", () => {
    clearDefaultHomework();
  });

  els.resetPlan.addEventListener("click", () => {
    state = {
      form: readForm(),
      plan: createBlankPlan(),
      contentLibrary: state.contentLibrary,
      contentLibraryVersion: CONTENT_LIBRARY_VERSION,
    };
    clearTaskInputs();
    saveState();
    hydrateForm();
    render();
  });
}

function clearDefaultHomework() {
  state.plan = state.plan.map((day) => ({
    ...day,
    homeworkRemoved: true,
    tasks: day.tasks.filter((task) => task.fixedType !== "homework"),
  }));
  saveState();
  render();
}

function applyCurrentFormInfo(options = {}) {
  if (options.requireDate && !els.weekStartDate.value) {
    return;
  }
  state.form = readForm();
  saveState();
  refreshDayOptions();
  render();
}

function updateContentOptions(options = {}) {
  const subject = els.customSubject.value || "chinese";
  const previousValue = options.preferredValue || els.customContent.value;
  els.customContent.innerHTML = "";
  getContentOptions(subject).forEach((content) => {
    const option = document.createElement("option");
    option.value = content.id;
    option.textContent = content.label;
    els.customContent.append(option);
  });
  if ([...els.customContent.options].some((option) => option.value === previousValue)) {
    els.customContent.value = previousValue;
  }
  updateDetailFields();
}

function updateSportsContentOptions(options = {}) {
  const previousValue = options.preferredValue || els.sportsContent.value;
  els.sportsContent.innerHTML = "";
  getContentOptions("sports").forEach((content) => {
    const option = document.createElement("option");
    option.value = content.id;
    option.textContent = content.label;
    els.sportsContent.append(option);
  });
  if ([...els.sportsContent.options].some((option) => option.value === previousValue)) {
    els.sportsContent.value = previousValue;
  }
}

function updateModeFields() {
  const isCourse = els.customMode.value === "course";
  els.studyFields.classList.toggle("is-hidden", isCourse);
  els.courseFields.classList.toggle("is-hidden", !isCourse);
  if (isCourse) {
    updateCourseFields();
  }
  updateDetailFields();
}

function updateDetailFields() {
  const content = els.customContent.value;
  const subject = els.customSubject.value;
  const isStudy = els.customMode.value === "study";
  const needsManualContent = isStudy && (content === "other" || content === "exercise");
  els.otherTaskField.classList.toggle("is-hidden", !needsManualContent);
  if (subject === "homework") {
    els.customOtherLabel.textContent = "作业细项";
    els.customOther.placeholder = "如：语文默写、数学订正、英语听读";
  } else {
    els.customOtherLabel.textContent = "其他内容";
    els.customOther.placeholder = "如：订正数学单元练习";
  }
}

function updateCourseFields() {
  const kind = COURSE_KINDS[els.courseKind.value] || COURSE_KINDS.course;
  const isSports = els.courseKind.value === "sports";
  updateSportsContentOptions({ preferredValue: els.sportsContent.value });
  const needsManualTitle = !isSports || els.sportsContent.value === "other";
  els.sportsContentField.classList.toggle("is-hidden", !isSports);
  els.courseTitleField.classList.toggle("is-hidden", !needsManualTitle);
  els.courseTitleLabel.textContent = isSports ? "其他运动内容" : "课程内容";
  els.courseTitle.placeholder = kind.placeholder;
  const isDurationOnly = els.courseTimeMode.value === "duration";
  els.courseTimeRange.classList.toggle("is-hidden", isDurationOnly);
  if (isDurationOnly) {
    els.courseStart.value = "";
    els.courseEnd.value = "";
  } else {
    updateCourseMinutes();
  }
}

function updateCourseMinutes() {
  const minutes = minutesFromTimeRange(els.courseStart.value, els.courseEnd.value);
  if (minutes) {
    els.customMinutes.value = minutes;
  }
}

function buildSelectedTask() {
  if (els.customMode.value === "course") {
    return buildCourseTask();
  }
  return buildStudyTask();
}

function buildStudyTask() {
  const subject = els.customSubject.value;
  const contentType = els.customContent.value;
  const subjectLabel = SUBJECTS[subject].label;
  const minutes = clamp(Number(els.customMinutes.value) || 20, 5, 180);
  const task = {
    id: createId("selected"),
    subject,
    minutes,
    source: "selected",
    contentType,
    status: "",
    statusTouched: false,
  };

  if (contentType === "other") {
    const custom = els.customOther.value.trim();
    if (!custom) {
      els.customOther.focus();
      return null;
    }
    task.customTitle = custom;
    task.title = subject === "homework" ? custom : `${subjectLabel}：${custom}`;
  } else {
    const selectedContent = getContentOptions(subject).find((option) => option.id === contentType);
    if (!selectedContent) {
      return null;
    }
    task.customTitle = selectedContent.label;
    task.title = subject === "homework"
      ? selectedContent.label
      : `${subjectLabel}：${selectedContent.label}`;
  }

  return task;
}

function addLibraryOptions() {
  const subject = els.librarySubject.value || "chinese";
  const labels = parseBatchContent(els.libraryBatchInput.value);
  if (!labels.length) {
    els.libraryBatchInput.focus();
    return;
  }

  const added = [];
  labels.forEach((label) => {
    if (contentLabelExists(subject, label)) {
      return;
    }
    const option = { id: createId("content"), label };
    state.contentLibrary[subject].push(option);
    added.push(option);
  });

  els.libraryBatchInput.value = "";
  saveState();
  if (subject === "sports") {
    syncSportsContentSelection(added[0]?.id);
  } else {
    syncStudyContentSelection(subject, added[0]?.id);
  }
  renderContentLibrary();
  setLibraryHint(added.length ? `已添加 ${added.length} 项` : "没有新增内容");
}

function removeSelectedLibraryOptions() {
  const subject = els.librarySubject.value || "chinese";
  const selectedIds = [...els.libraryOptionList.querySelectorAll("input:checked")].map((input) => input.value);
  if (!selectedIds.length) {
    setLibraryHint("请先勾选要取消的内容");
    return;
  }

  state.contentLibrary[subject] = state.contentLibrary[subject].filter(
    (option) => !selectedIds.includes(option.id),
  );
  saveState();
  refreshContentOptionsForSubject(subject, selectedIds);
  renderContentLibrary();
  setLibraryHint(`已取消 ${selectedIds.length} 项`);
}

function removeSelectedLibraryOptionsFromAll() {
  const selectedItems = [...els.libraryAllList.querySelectorAll("input:checked")].map((input) => ({
    subject: input.dataset.subject,
    id: input.value,
  }));
  if (!selectedItems.length) {
    setLibraryHint("请先在总览里勾选要删除的内容");
    return;
  }

  const removedIdsBySubject = selectedItems.reduce((groups, item) => {
    if (!groups[item.subject]) {
      groups[item.subject] = [];
    }
    groups[item.subject].push(item.id);
    return groups;
  }, {});

  Object.entries(removedIdsBySubject).forEach(([subject, ids]) => {
    state.contentLibrary[subject] = (state.contentLibrary[subject] || []).filter(
      (option) => !ids.includes(option.id),
    );
  });

  saveState();
  Object.entries(removedIdsBySubject).forEach(([subject, ids]) => {
    refreshContentOptionsForSubject(subject, ids);
  });
  renderContentLibrary();
  setLibraryHint(`已删除 ${selectedItems.length} 项`);
}

function renderContentLibrary() {
  renderLibraryOptions();
  renderLibraryAllOptions();
}

function renderLibraryOptions() {
  const subject = els.librarySubject.value || "chinese";
  const options = state.contentLibrary[subject] || [];
  els.libraryOptionList.innerHTML = "";
  els.removeLibraryOptions.disabled = !options.length;

  if (!options.length) {
    const empty = document.createElement("div");
    empty.className = "library-empty";
    empty.textContent = "暂无自定义内容";
    els.libraryOptionList.append(empty);
    return;
  }

  options.forEach((option) => {
    const row = document.createElement("label");
    row.className = "library-option-row";
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.value = option.id;
    const text = document.createElement("span");
    text.textContent = option.label;
    row.append(checkbox, text);
    els.libraryOptionList.append(row);
  });
}

function renderLibraryAllOptions() {
  const total = countCustomContentOptions();
  els.libraryAllList.innerHTML = "";
  els.removeAllLibraryOptions.disabled = total === 0;

  if (!total) {
    const empty = document.createElement("div");
    empty.className = "library-empty";
    empty.textContent = "暂无自定义内容";
    els.libraryAllList.append(empty);
    return;
  }

  LIBRARY_SUBJECTS.forEach((subject) => {
    const options = state.contentLibrary[subject] || [];
    const group = document.createElement("section");
    group.className = "library-subject-group";

    const head = document.createElement("div");
    head.className = "library-subject-head";
    const name = document.createElement("strong");
    name.textContent = SUBJECTS[subject].label;
    const count = document.createElement("span");
    count.textContent = `${options.length} 项`;
    head.append(name, count);
    group.append(head);

    if (!options.length) {
      const empty = document.createElement("div");
      empty.className = "library-empty compact-empty";
      empty.textContent = "暂无";
      group.append(empty);
    }

    options.forEach((option) => {
      const row = document.createElement("label");
      row.className = "library-option-row";
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.value = option.id;
      checkbox.dataset.subject = subject;
      const text = document.createElement("span");
      text.textContent = option.label;
      row.append(checkbox, text);
      group.append(row);
    });

    els.libraryAllList.append(group);
  });
}

function countCustomContentOptions() {
  return LIBRARY_SUBJECTS.reduce(
    (total, subject) => total + (state.contentLibrary[subject] || []).length,
    0,
  );
}

function refreshContentOptionsForSubject(subject, removedIds = []) {
  if (subject === "sports") {
    const previousValue = els.sportsContent.value;
    updateSportsContentOptions();
    if (previousValue && !removedIds.includes(previousValue)) {
      els.sportsContent.value = previousValue;
      updateCourseFields();
    }
    return;
  }
  if (els.customSubject.value !== subject) {
    return;
  }
  const previousValue = els.customContent.value;
  updateContentOptions();
  if (previousValue && !removedIds.includes(previousValue)) {
    els.customContent.value = previousValue;
    updateDetailFields();
  }
}

function syncStudyContentSelection(subject, preferredContentId = "") {
  els.customMode.value = "study";
  els.customSubject.value = subject;
  updateModeFields();
  updateContentOptions({ preferredValue: preferredContentId || els.customContent.value });
}

function syncSportsContentSelection(preferredContentId = "") {
  els.customMode.value = "course";
  els.courseKind.value = "sports";
  updateModeFields();
  updateSportsContentOptions({ preferredValue: preferredContentId || els.sportsContent.value });
  if (preferredContentId) {
    els.sportsContent.value = preferredContentId;
  }
  updateCourseFields();
}

function parseBatchContent(value) {
  const seen = new Set();
  return String(value || "")
    .split(/[\n,，;；]+/)
    .map((item) => item.trim())
    .filter((item) => {
      const key = normalizeContentName(item);
      if (!key || seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
}

function contentLabelExists(subject, label) {
  const key = normalizeContentName(label);
  return getContentOptions(subject).some((option) => normalizeContentName(option.label) === key);
}

function setLibraryHint(message) {
  els.libraryHint.textContent = message;
}

function buildCourseTask() {
  const courseKind = els.courseKind.value || "course";
  const kindLabel = getCourseKindLabel({ courseKind });
  const isSports = courseKind === "sports";
  const selectedSportsContent = getContentOptions("sports").find((option) => option.id === els.sportsContent.value);
  const courseTitle = isSports && selectedSportsContent?.id !== "other"
    ? selectedSportsContent.label
    : els.courseTitle.value.trim();
  if (!courseTitle) {
    (isSports ? els.sportsContent : els.courseTitle).focus();
    return null;
  }

  const isDurationOnly = els.courseTimeMode.value === "duration";
  const startTime = isDurationOnly ? "" : els.courseStart.value;
  const endTime = isDurationOnly ? "" : els.courseEnd.value;
  const calculatedMinutes = minutesFromTimeRange(startTime, endTime);
  const minutes = clamp(calculatedMinutes || Number(els.customMinutes.value) || 45, 5, 180);
  const schedule = getCourseSchedule({
    startTime,
    endTime,
    minutes,
  });

  return {
    id: createId("course"),
    subject: isSports ? "sports" : "course",
    title: `${kindLabel}：${courseTitle}`,
    minutes,
    source: "selected",
    contentType: "course",
    courseKind,
    sportsContentId: isSports ? els.sportsContent.value : "",
    status: "",
    statusTouched: false,
    courseTitle,
    startTime: schedule.start,
    endTime: schedule.end,
    timeLabel: schedule.label,
  };
}

function cloneTaskForDay(task) {
  const prefix = task.contentType === "course" ? "course" : "selected";
  return {
    ...task,
    id: createId(prefix),
    status: "",
    statusTouched: false,
  };
}

function getSelectedDayIds() {
  return [...els.customDayChoices.querySelectorAll("input:checked")].map((input) => input.value);
}

function clearTaskInputs() {
  els.customOther.value = "";
  els.courseTitle.value = "";
  els.courseStart.value = "";
  els.courseEnd.value = "";
  els.courseTimeMode.value = "time";
  els.sportsContent.value = "other";
  updateCourseFields();
  resetDayChoices();
}

function resetDayChoices() {
  [...els.customDayChoices.querySelectorAll("input")].forEach((input) => {
    input.checked = input.value === "mon";
  });
}

function readForm() {
  return {
    studentName: els.studentName.value.trim() || DEFAULT_FORM.studentName,
    gradeStage: els.gradeStage.value,
    city: els.city.value.trim() || DEFAULT_FORM.city,
    weekTheme: els.weekTheme.value.trim() || DEFAULT_FORM.weekTheme,
    weekStartDate: els.weekStartDate.value || DEFAULT_FORM.weekStartDate,
    semesterWeek: clamp(Number(els.semesterWeek.value) || 1, 1, 30),
  };
}

function hydrateForm() {
  els.studentName.value = state.form.studentName;
  els.gradeStage.value = state.form.gradeStage;
  els.city.value = state.form.city;
  els.weekTheme.value = state.form.weekTheme;
  els.weekStartDate.value = state.form.weekStartDate;
  els.semesterWeek.value = state.form.semesterWeek;
}

function createBlankPlan() {
  return DAYS.map((day) => ({
    ...day,
    homeworkRemoved: false,
    tasks: [createHomeworkTask(day.id)],
  }));
}

function normalizePlan(plan) {
  const savedDays = Array.isArray(plan) ? plan : [];
  return DAYS.map((day) => {
    const savedDay = savedDays.find((item) => item.id === day.id);
    const homeworkRemoved = Boolean(savedDay?.homeworkRemoved);
    return {
      ...day,
      homeworkRemoved,
      tasks: normalizeDayTasks(day, savedDay?.tasks, homeworkRemoved),
    };
  });
}

function normalizeDayTasks(day, tasks, homeworkRemoved = false) {
  const savedTasks = Array.isArray(tasks)
    ? tasks
        .filter((task) => task.source !== "generated")
        .map((task) => ({
          ...task,
          status: task.statusTouched ? task.status || "" : "",
          statusTouched: Boolean(task.statusTouched && task.status),
        }))
    : [];
  const homework = homeworkRemoved
    ? null
    : savedTasks.find((task) => task.fixedType === "homework") || createHomeworkTask(day.id);
  const migratedExercise = migrateFixedExerciseTask(savedTasks.find((task) => task.fixedType === "exercise"));
  const selectedTasks = savedTasks.filter((task) => !["homework", "exercise"].includes(task.fixedType));
  const normalizedTasks = [
    ...(homework ? [homework] : []),
    ...(migratedExercise ? [migratedExercise] : []),
    ...selectedTasks,
  ];
  return normalizedTasks.map((task) =>
    normalizeCourseTask(migrateLegacySportsTask({
      ...task,
      title: task.fixedType === "exercise" ? task.title || "" : task.title,
      minutes: normalizeTaskMinutes(task),
      status: task.statusTouched ? task.status || "" : "",
      statusTouched: Boolean(task.statusTouched && task.status),
    })),
  );
}

function normalizeTaskMinutes(task) {
  if (task.fixedType === "homework") {
    return HOMEWORK_MINUTES;
  }
  return clamp(Number(task.minutes) || 20, 5, 180);
}

function createHomeworkTask(dayId) {
  return {
    id: `homework-${dayId}`,
    subject: "homework",
    title: "学校作业",
    minutes: HOMEWORK_MINUTES,
    source: "fixed",
    fixedType: "homework",
    contentType: "homework",
    status: "",
    statusTouched: false,
  };
}

function normalizeCourseTask(task) {
  if (task.contentType !== "course") {
    return task;
  }
  const schedule = getCourseSchedule(task);
  return {
    ...task,
    startTime: schedule.start,
    endTime: schedule.end,
    timeLabel: schedule.label,
  };
}

function render() {
  renderHeader();
  renderWeek();
  renderPrintWeekTable();
  renderInsights();
}

function renderHeader() {
  const total = getTotalMinutes();
  els.planTitle.textContent = `${state.form.studentName}的${state.form.gradeStage}周计划`;
  els.totalMinutes.textContent = `${total} 分钟`;
  els.summaryTheme.textContent = state.form.weekTheme;
  els.summaryRhythm.textContent = `第 ${state.form.semesterWeek} 周 · ${formatWeekRange(state.form.weekStartDate)}`;
  els.summaryReview.textContent = total ? "打印后逐项勾选完成" : "先选择学习内容";
}

function renderWeek() {
  els.weekGrid.innerHTML = "";
  state.plan.forEach((day) => {
    const column = document.createElement("article");
    column.className = `day-column day-${day.id}`;

    const head = document.createElement("header");
    head.className = "day-head";
    const totals = getDayTotals(day);
    head.innerHTML = `
      <h3><span>${day.label}</span><small>${getDayDateLabel(day.id)}</small></h3>
      <div class="day-totals" aria-label="${day.label}时间汇总">
        <span>学习 ${totals.study} 分钟</span>
        <span>运动 ${totals.sports} 分钟</span>
      </div>
    `;
    column.append(head);

    const list = document.createElement("div");
    list.className = "task-list";
    const sortedTasks = getSortedTasks(day.tasks);
    if (!sortedTasks.length) {
      const empty = document.createElement("div");
      empty.className = "empty-day";
      empty.textContent = "从左侧选择内容加入这一天";
      list.append(empty);
    }

    sortedTasks.forEach((task) => {
      list.append(renderTask(day.id, task));
    });

    column.append(list);
    els.weekGrid.append(column);
  });
}

function renderPrintWeekTable() {
  if (!els.printWeekTable) {
    return;
  }
  const rows = createWeeklyMatrixRows();
  els.printWeekTable.innerHTML = "";
  const table = document.createElement("table");
  table.className = "print-plan-table";

  const colGroup = document.createElement("colgroup");
  ["print-subject-col", "print-content-col", ...DAYS.map(() => "print-day-col")].forEach((className) => {
    const col = document.createElement("col");
    col.className = className;
    colGroup.append(col);
  });
  table.append(colGroup);

  const thead = document.createElement("thead");
  const headRow = document.createElement("tr");
  ["学科", "学习内容"].forEach((text) => {
    const th = document.createElement("th");
    th.textContent = text;
    headRow.append(th);
  });
  DAYS.forEach((day) => {
    const colors = DAY_COLORS[day.id];
    const planDay = state.plan.find((item) => item.id === day.id) || day;
    const totals = getDayTotals(planDay);
    const th = document.createElement("th");
    th.className = `print-day-head print-day-${day.id}`;
    th.style.setProperty("--print-day-bg", colors.head);
    th.style.setProperty("--print-day-line", colors.line);
    th.style.setProperty("--print-day-ink", colors.text);
    th.textContent = `${day.label}\n${getDayDateLabel(day.id)}\n学习${totals.study}分 运动${totals.sports}分`;
    headRow.append(th);
  });
  thead.append(headRow);
  table.append(thead);

  const tbody = document.createElement("tbody");
  rows.forEach((row) => {
    const colors = getSubjectExportColors(row.subjectId);
    const tr = document.createElement("tr");
    tr.style.setProperty("--print-subject-bg", colors.fill);
    tr.style.setProperty("--print-subject-soft", colors.soft);
    tr.style.setProperty("--print-subject-line", colors.line);
    tr.style.setProperty("--print-subject-ink", colors.text);

    const subjectCell = document.createElement("td");
    subjectCell.className = "print-subject-cell";
    subjectCell.textContent = row.subject;
    tr.append(subjectCell);

    const contentCell = document.createElement("td");
    contentCell.className = "print-content-cell";
    contentCell.textContent = row.title;
    tr.append(contentCell);

    DAYS.forEach((day) => {
      const td = document.createElement("td");
      td.className = "print-day-cell";
      td.textContent = getPrintDayCellText(row.tasksByDay[day.id]);
      tr.append(td);
    });
    tbody.append(tr);
  });
  table.append(tbody);
  els.printWeekTable.append(table);
}

function renderTask(dayId, task) {
  const subject = SUBJECTS[task.subject] || SUBJECTS.habits;
  const item = document.createElement("div");
  item.className = `task subject-${task.subject}`;
  item.style.setProperty("--subject-color", subject.color);

  const meta = document.createElement("div");
  meta.className = "task-meta";

  const chip = document.createElement("span");
  chip.className = "subject-chip";
  chip.textContent = subject.label;

  const minutes = document.createElement("input");
  minutes.className = "task-minutes no-print";
  minutes.type = "number";
  minutes.min = "5";
  minutes.max = "180";
  minutes.step = "5";
  minutes.value = task.minutes;
  minutes.title = "调整分钟数";
  minutes.addEventListener("change", () => {
    updateTask(dayId, task.id, { minutes: readTaskMinutes(minutes.value, task) });
  });

  const timeControl = document.createElement("div");
  timeControl.className = "task-time-control no-print";
  const timeUnit = document.createElement("span");
  timeUnit.textContent = "分钟";
  timeControl.append(minutes, timeUnit);

  const printedMinutes = document.createElement("span");
  printedMinutes.className = "print-only";
  printedMinutes.textContent = `${task.minutes} 分钟`;

  meta.append(chip, timeControl, printedMinutes);

  const title = document.createElement("div");
  title.className = task.contentType === "course" ? "task-title course-title" : "task-title";
  title.contentEditable = task.fixedType === "homework" ? "false" : "true";
  title.spellcheck = false;
  if (task.contentType === "course") {
    title.append(createCourseTitlePrefix(task), createCourseTitleName(task));
  } else if (shouldUseSubjectTitle(task)) {
    title.classList.add("study-title");
    title.append(createStudyTitlePrefix(task), createStudyTitleName(task));
  } else {
    title.textContent = task.title;
  }
  if (task.fixedType === "homework") {
    title.title = "默认学校作业；如需细分，可删除后从左侧添加学校作业细项";
  }
  title.addEventListener("blur", () => {
    if (task.fixedType !== "homework") {
      updateTask(dayId, task.id, { title: title.textContent.trim() });
    }
  });

  const statusRow = document.createElement("div");
  statusRow.className = "status-checks no-print";
  const statusLabelText = document.createElement("span");
  statusLabelText.className = "status-label";
  statusLabelText.textContent = "完成情况";
  statusRow.append(statusLabelText);
  const statusOptions = document.createElement("div");
  statusOptions.className = "status-options";

  STATUS_OPTIONS.forEach((status) => {
    const option = document.createElement("label");
    option.className = "status-option";
    const radio = document.createElement("input");
    radio.type = "checkbox";
    radio.name = `status-${task.id}`;
    radio.value = status.id;
    radio.checked = Boolean(task.statusTouched && task.status === status.id);
    radio.addEventListener("change", () => {
      updateTask(
        dayId,
        task.id,
        radio.checked
          ? { status: status.id, statusTouched: true }
          : { status: "", statusTouched: false },
      );
    });
    const text = document.createElement("span");
    text.textContent = status.label;
    option.append(radio, text);
    statusOptions.append(option);
  });
  statusRow.append(statusOptions);

  const printedStatus = document.createElement("div");
  printedStatus.className = "print-only task-note";
  printedStatus.textContent = `完成情况：\n${STATUS_OPTIONS.map((status) => `□ ${status.label}`).join("  ")}`;

  const scheduleText = getTaskScheduleText(task);
  const note = document.createElement("div");
  note.className = task.contentType === "course" ? "task-note course-time" : "task-note";
  note.textContent = scheduleText;

  const actions = document.createElement("div");
  actions.className = "task-actions no-print";
  if (canRemoveTask(dayId, task)) {
    const remove = document.createElement("button");
    remove.className = "icon-button";
    remove.type = "button";
    remove.title = task.fixedType === "homework" ? "删除默认学校作业" : "删除任务";
    remove.textContent = "×";
    remove.addEventListener("click", () => {
      removeTask(dayId, task.id);
    });
    actions.append(remove);
  }

  item.append(meta, title, statusRow, printedStatus);
  if (scheduleText) {
    item.append(note);
  }
  if (actions.children.length) {
    item.append(actions);
  }
  return item;
}

function createCourseTitlePrefix(task) {
  const prefix = document.createElement("span");
  prefix.className = "course-title-prefix";
  prefix.textContent = getCourseKindLabel(task);
  return prefix;
}

function createCourseTitleName(task) {
  const name = document.createElement("strong");
  name.className = "course-title-name";
  name.textContent = getCourseDisplayName(task);
  return name;
}

function shouldUseSubjectTitle(task) {
  return ["chinese", "math", "english"].includes(task.subject);
}

function createStudyTitlePrefix(task) {
  const prefix = document.createElement("span");
  prefix.className = "study-title-prefix";
  prefix.textContent = `${SUBJECTS[task.subject]?.label || ""}：`;
  return prefix;
}

function createStudyTitleName(task) {
  const name = document.createElement("strong");
  name.className = "study-title-name";
  name.textContent = getStudyDisplayName(task);
  return name;
}

function canRemoveTask(dayId, task) {
  return true;
}

function getSortedTasks(tasks = []) {
  return tasks
    .map((task, index) => ({ task, index, key: getTaskSortKey(task) }))
    .sort((a, b) => a.key - b.key || a.index - b.index)
    .map((item) => item.task);
}

function getTaskSortKey(task) {
  if (task.contentType === "course") {
    const schedule = getCourseSchedule(task);
    if (schedule.start) {
      return timeToMinutes(schedule.start);
    }
  }
  return Number.POSITIVE_INFINITY;
}

function renderInsights() {
  const totals = getSubjectTotals();
  const max = Math.max(...Object.values(totals), 1);
  els.subjectBars.innerHTML = "";

  Object.entries(SUBJECTS).forEach(([id, subject]) => {
    const minutes = totals[id] || 0;
    if (!minutes) {
      return;
    }

    const row = document.createElement("div");
    row.className = "bar-row";
    row.style.setProperty("--subject-color", subject.color);
    row.style.setProperty("--bar-width", `${Math.max((minutes / max) * 100, 8)}%`);
    row.innerHTML = `
      <div class="bar-label">
        <span>${subject.label}</span>
        <span>${minutes} 分钟</span>
      </div>
      <div class="bar-track"><div class="bar-fill"></div></div>
    `;
    els.subjectBars.append(row);
  });

  els.parentTips.innerHTML = "";
  parentTips(state.form).forEach((tip) => {
    const li = document.createElement("li");
    li.textContent = tip;
    els.parentTips.append(li);
  });
}

function updateTask(dayId, taskId, patch) {
  const task = findTask(dayId, taskId);
  if (!task) {
    return;
  }
  Object.assign(task, patch);
  saveState();
  render();
}

function removeTask(dayId, taskId) {
  const day = state.plan.find((item) => item.id === dayId);
  const task = day?.tasks.find((item) => item.id === taskId);
  if (task?.fixedType === "homework") {
    day.homeworkRemoved = true;
  }
  day.tasks = day.tasks.filter((task) => task.id !== taskId);
  saveState();
  render();
}

function findTask(dayId, taskId) {
  const day = state.plan.find((item) => item.id === dayId);
  return day?.tasks.find((task) => task.id === taskId);
}

function getTotalMinutes() {
  return state.plan.reduce((sum, day) => sum + sumDay(day), 0);
}

function sumDay(day) {
  return (day.tasks || []).reduce((sum, task) => sum + Number(task.minutes || 0), 0);
}

function getDayTotals(day) {
  return (day.tasks || []).reduce(
    (totals, task) => {
      const minutes = Number(task.minutes || 0);
      if (task.subject === "sports") {
        totals.sports += minutes;
      } else {
        totals.study += minutes;
      }
      return totals;
    },
    { study: 0, sports: 0 },
  );
}

function getSubjectTotals() {
  return state.plan.reduce((totals, day) => {
    day.tasks.forEach((task) => {
      totals[task.subject] = (totals[task.subject] || 0) + Number(task.minutes || 0);
    });
    return totals;
  }, {});
}

function parentTips(form) {
  const tips = [
    "学校作业默认放入每天，假期可以一键清空，也可以按语文、数学、英语细分添加。",
    "添加内容时可以复选周一到周日，固定训练一次排进多个日期。",
    "运动通过课外课程入口添加，但总时长会单独计入运动。",
    "打印后可以让孩子自己勾选完成项，周末一起看完成情况。",
    "导出 Excel 适合留档和复盘，导出 PDF 适合打印或发给家人查看。",
  ];

  if (form.city) {
    tips.push(`结合${form.city}本地校内进度，先把当天必须完成的内容排进去。`);
  }

  return tips.slice(0, 4);
}

function exportExcelPlan() {
  const locationMeta = state.form.city ? `学习地点：${escapeHtml(state.form.city)}　` : "";
  const html = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <style>
      @page { margin: 0.35in; mso-page-orientation: landscape; }
      body { margin: 0; background: #f5f7fb; font-family: "Microsoft YaHei", Arial, sans-serif; color: #172033; }
      .page { padding: 16px; }
      h1 { margin: 0 0 6px; font-size: 22px; text-align: center; }
      .meta { margin-bottom: 10px; color: #555; font-size: 12px; text-align: center; }
      .summary { width: 100%; border-collapse: separate; border-spacing: 8px 0; margin-bottom: 12px; table-layout: fixed; }
      .summary td { border: 1px solid #d9e2ef; background: #ffffff; padding: 8px; font-size: 12px; vertical-align: top; }
      .summary span { display: block; color: #667085; font-size: 11px; font-weight: 700; }
      .summary strong { display: block; margin-top: 3px; color: #172033; font-size: 13px; }
      .week-board { width: 100%; border-collapse: separate; border-spacing: 8px 0; table-layout: fixed; }
      .day-cell { width: 14.28%; border: 1px solid #d9e2ef; border-top-width: 4px; border-radius: 8px; vertical-align: top; padding: 0; }
      .day-head { border-bottom: 1px solid #d9e2ef; padding: 8px; font-weight: 800; }
      .day-name { display: block; font-size: 15px; }
      .day-date { display: block; font-size: 11px; color: #667085; }
      .day-total { display: block; margin-top: 2px; font-size: 10px; color: #667085; }
      .tasks { padding: 7px; }
      .task-card { margin-bottom: 7px; border: 1px solid #d9e2ef; border-left-width: 5px; border-radius: 7px; background: #ffffff; padding: 7px; font-size: 11px; line-height: 1.28; }
      .task-meta { margin-bottom: 4px; }
      .subject-chip { display: inline-block; border-radius: 999px; padding: 2px 7px; color: #ffffff; font-size: 10px; font-weight: 800; }
      .task-title { clear: both; margin-top: 4px; color: #26384d; font-weight: 800; }
      .course-title-prefix { display: inline-block; margin-right: 4px; color: #64748b; font-size: 10px; font-weight: 800; }
      .course-title-name { display: inline-block; border-radius: 4px; background: #ede9fe; color: #5b21b6; padding: 2px 6px; font-size: 13px; font-weight: 900; }
      .study-title-prefix { display: inline-block; margin-right: 4px; color: #64748b; font-size: 10px; font-weight: 800; }
      .study-title-name { display: inline-block; border-radius: 4px; background: #eff6ff; color: #1d4ed8; padding: 2px 6px; font-size: 13px; font-weight: 900; }
      .task-title-minutes { display: inline-block; margin-left: 4px; color: #64748b; font-size: 9px; font-weight: 800; }
      .task-note { margin-top: 4px; color: #475569; font-size: 10px; }
      .course-time { color: #5b21b6; font-size: 12px; font-weight: 900; }
      .task-status { margin-top: 4px; color: #344054; font-size: 10px; }
      .empty-day { padding: 18px 8px; color: #94a3b8; font-size: 11px; text-align: center; }
    </style>
  </head>
  <body>
    <div class="page">
      <h1>${escapeHtml(state.form.studentName)}的${escapeHtml(state.form.gradeStage)}周计划</h1>
      <div class="meta">${locationMeta}本学期第 ${escapeHtml(state.form.semesterWeek)} 周　日期：${escapeHtml(formatWeekRange(state.form.weekStartDate))}　总时长：${getTotalMinutes()} 分钟</div>
      <table class="summary">
        <tr>
          <td><span>周主题</span><strong>${escapeHtml(state.form.weekTheme)}</strong></td>
          <td><span>安排方式</span><strong>第 ${escapeHtml(state.form.semesterWeek)} 周 · ${escapeHtml(formatWeekRange(state.form.weekStartDate))}</strong></td>
          <td><span>完成方式</span><strong>打印后逐项勾选完成</strong></td>
        </tr>
      </table>
      ${exportPageStyleWeekHtml()}
    </div>
  </body>
</html>`;

  const blob = new Blob(["\ufeff", html], { type: "application/vnd.ms-excel;charset=utf-8" });
  downloadBlob(blob, `${safeFileName(state.form.studentName)}-${safeFileName(state.form.gradeStage)}-学习计划.xls`);
}

function exportPdfPlan() {
  const previousTitle = document.title;
  document.title = `${state.form.studentName}-${state.form.gradeStage}-学习计划`;
  window.print();
  setTimeout(() => {
    document.title = previousTitle;
  }, 500);
}

function getSubjectExportColors(subjectId) {
  return EXPORT_SUBJECT_FILLS[subjectId] || EXPORT_SUBJECT_FILLS.habits;
}

function excelStyle(declarations) {
  const style = declarations.filter(Boolean).join("; ");
  return style ? ` style="${style}"` : "";
}

function exportPageStyleWeekHtml() {
  return `<table class="week-board">
    <tr>
      ${state.plan.map((day) => exportPageStyleDayHtml(day)).join("")}
    </tr>
  </table>`;
}

function exportPageStyleDayHtml(day) {
  const colors = DAY_COLORS[day.id];
  const totals = getDayTotals(day);
  const sortedTasks = getSortedTasks(day.tasks);
  const taskHtml = sortedTasks.length
    ? sortedTasks.map((task) => exportPageStyleTaskHtml(task)).join("")
    : '<div class="empty-day">从左侧选择内容加入这一天</div>';
  return `<td class="day-cell" bgcolor="${colors.soft}"${excelStyle([
    `background: ${colors.soft}`,
    `border-color: ${colors.line}`,
    `border-top: 4px solid ${colors.line}`,
  ])}>
    <div class="day-head"${excelStyle([
      `background: ${colors.head}`,
      `border-bottom: 1px solid ${colors.line}`,
      `color: ${colors.text}`,
    ])}>
      <span class="day-name">${escapeHtml(day.label)}</span>
      <span class="day-date">${escapeHtml(getDayDateLabel(day.id))}</span>
      <span class="day-total">学习 ${totals.study} 分钟</span>
      <span class="day-total">运动 ${totals.sports} 分钟</span>
    </div>
    <div class="tasks">${taskHtml}</div>
  </td>`;
}

function exportPageStyleTaskHtml(task) {
  const subject = SUBJECTS[task.subject] || SUBJECTS.habits;
  const subjectColors = getSubjectExportColors(task.subject);
  const scheduleText = getTaskScheduleText(task);
  const statusText = STATUS_OPTIONS.map((status) => `□ ${status.label}`).join("　");
  return `<div class="task-card" bgcolor="${subjectColors.soft}"${excelStyle([
    `background: ${subjectColors.soft}`,
    `border-left: 5px solid ${subject.color}`,
    `border-color: ${subjectColors.line}`,
  ])}>
    <div class="task-meta">
      <span class="subject-chip"${excelStyle([`background: ${subject.color}`])}>${escapeHtml(subject.label)}</span>
    </div>
    ${exportPageStyleTaskTitleHtml(task)}
    ${scheduleText ? `<div class="task-note ${task.contentType === "course" ? "course-time" : ""}">${escapeHtml(scheduleText)}</div>` : ""}
    <div class="task-status">完成情况：${escapeHtml(statusText)}</div>
  </div>`;
}

function exportPageStyleTaskTitleHtml(task) {
  if (task.contentType !== "course") {
    if (shouldUseSubjectTitle(task)) {
      return `<div class="task-title study-title"><span class="study-title-prefix">${escapeHtml(SUBJECTS[task.subject]?.label || "")}：</span><strong class="study-title-name">${escapeHtml(getStudyDisplayName(task))}</strong><span class="task-title-minutes">${escapeHtml(formatMinutes(task.minutes))}</span></div>`;
    }
    return `<div class="task-title">${escapeHtml(task.title || contentLabel(task) || "未命名内容")}<span class="task-title-minutes">${escapeHtml(formatMinutes(task.minutes))}</span></div>`;
  }
  return `<div class="task-title course-title"><span class="course-title-prefix">${escapeHtml(getCourseKindLabel(task))}</span><strong class="course-title-name">${escapeHtml(getCourseDisplayName(task))}</strong><span class="task-title-minutes">${escapeHtml(formatMinutes(task.minutes))}</span></div>`;
}

function createWeeklyMatrixRows() {
  const rowMap = new Map();
  state.plan.forEach((day) => {
    day.tasks.forEach((task) => {
      const title = getTaskExportTitle(task);
      const key = `${task.subject}::${title}`;
      if (!rowMap.has(key)) {
        rowMap.set(key, {
          subject: SUBJECTS[task.subject]?.label || "其他",
          subjectId: task.subject,
          title,
          firstSeen: rowMap.size,
          tasksByDay: {},
        });
      }
      const row = rowMap.get(key);
      if (!row.tasksByDay[day.id]) {
        row.tasksByDay[day.id] = [];
      }
      row.tasksByDay[day.id].push(task);
    });
  });

  return [...rowMap.values()].sort((a, b) => {
    const subjectDelta = subjectExportOrder(a.subjectId) - subjectExportOrder(b.subjectId);
    return subjectDelta || a.firstSeen - b.firstSeen;
  });
}

function subjectExportOrder(subjectId) {
  const order = ["homework", "chinese", "math", "english", "sports", "course", "habits"];
  const index = order.indexOf(subjectId);
  return index === -1 ? order.length : index;
}

function cssClassToken(value) {
  return String(value || "other").replace(/[^a-z0-9_-]/gi, "-");
}

function exportDayPlanCell(tasks = []) {
  if (!tasks.length) {
    return '<span class="empty-cell">—</span>';
  }
  return tasks.map((task) => {
    const timeLines = getExportTimeLines(task)
      .filter(Boolean)
      .map((line) => escapeHtml(line))
      .join("<br>");
    return `<div class="time-line">${timeLines}</div><div class="status-line">${exportStatusBoxes(task)}</div>`;
  }).join("<br>");
}

function getPrintDayCellText(tasks = []) {
  const sortedTasks = getSortedTasks(tasks);
  if (!sortedTasks.length) {
    return "";
  }
  return sortedTasks
    .map((task) => {
      const status = "□未 □半 □完";
  if (task.contentType === "course") {
    const schedule = getCourseScheduleLabel(task);
    return [schedule, `${task.minutes}分钟`, status].filter(Boolean).join("\n");
      }
      return [`${task.minutes}分钟`, status].join("\n");
    })
    .join("\n");
}

function getTaskExportTitle(task) {
  const title = task.title || contentLabel(task) || "未命名内容";
  if (task.contentType !== "course") {
    return title;
  }
  const courseTitle = getCourseDisplayName(task);
  const schedule = getCourseScheduleLabel(task);
  const label = getCourseKindLabel(task);
  return schedule ? `${label}：${courseTitle}（${schedule}）` : `${label}：${courseTitle}`;
}

function getCourseDisplayName(task) {
  const title = task.title || "";
  return task.courseTitle || title.replace(/^(课外课程|运动)：/, "").trim() || "未填写内容";
}

function getCourseKindLabel(task) {
  return COURSE_KINDS[task?.courseKind]?.label || COURSE_KINDS.course.label;
}

function getStudyDisplayName(task) {
  const subjectLabel = SUBJECTS[task.subject]?.label || "";
  const title = task.title || contentLabel(task) || "未命名内容";
  return subjectLabel ? title.replace(new RegExp(`^${escapeRegExp(subjectLabel)}[：:]\\s*`), "").trim() || title : title;
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function getExportTimeLines(task) {
  if (task.contentType === "course") {
    return [getCourseScheduleLabel(task), formatMinutes(task.minutes)];
  }
  return [formatMinutes(task.minutes), task.timeLabel ? `时间：${task.timeLabel}` : ""];
}

function getTaskScheduleText(task) {
  if (task.contentType === "course") {
    return getCourseScheduleText(task);
  }
  return task.timeLabel ? `时间：${task.timeLabel}` : "";
}

function getCourseScheduleText(task) {
  const label = getCourseScheduleLabel(task);
  return label ? `${getCourseKindLabel(task)}时间：${label}` : "";
}

function getCourseScheduleLabel(task) {
  return getCourseSchedule(task).label;
}

function getCourseSchedule(task) {
  const parsed = parseTimeRange(task.timeLabel);
  let start = normalizeTimeValue(task.startTime) || parsed.start;
  let end = normalizeTimeValue(task.endTime) || parsed.end;
  const minutes = clamp(Number(task.minutes) || minutesFromTimeRange(start, end) || 45, 5, 180);

  if (start && !end) {
    end = addMinutesToTime(start, minutes);
  }
  if (!start && end) {
    start = addMinutesToTime(end, -minutes);
  }

  const label = start && end ? `${start}-${end}` : start ? `开始 ${start}` : end ? `结束 ${end}` : "";
  return { start: start || "", end: end || "", label };
}

function parseTimeRange(value) {
  const text = String(value || "");
  const times = text.match(/\b\d{1,2}:\d{2}\b/g) || [];
  return {
    start: normalizeTimeValue(times[0]),
    end: normalizeTimeValue(times[1]),
  };
}

function normalizeTimeValue(value) {
  const match = String(value || "").match(/\b(\d{1,2}):(\d{2})\b/);
  if (!match) {
    return "";
  }
  const hour = Number(match[1]);
  const minute = Number(match[2]);
  if (hour < 0 || hour > 23 || minute < 0 || minute > 59) {
    return "";
  }
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

function addMinutesToTime(timeValue, minutesDelta) {
  const normalized = normalizeTimeValue(timeValue);
  if (!normalized) {
    return "";
  }
  const dayMinutes = 24 * 60;
  const total = (timeToMinutes(normalized) + Number(minutesDelta || 0) + dayMinutes) % dayMinutes;
  return minutesToTime(total);
}

function minutesToTime(totalMinutes) {
  const hour = Math.floor(totalMinutes / 60);
  const minute = totalMinutes % 60;
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

function exportStatusBoxes(task) {
  return STATUS_OPTIONS.map((status) => {
    const mark = task.statusTouched && task.status === status.id ? "☑" : "□";
    return `${mark}${status.label}`;
  }).join(" ");
}

function createExportRows() {
  return state.plan.flatMap((day) => {
    if (!day.tasks.length) {
      return [
        {
          day: `${day.label} ${getDayDateLabel(day.id)}`,
          semesterWeek: `第 ${state.form.semesterWeek} 周`,
          subject: "",
          title: "",
          time: "",
          minutes: "",
          status: "",
          pages: "",
          note: "未安排",
        },
      ];
    }

    return day.tasks.map((task) => ({
      day: `${day.label} ${getDayDateLabel(day.id)}`,
      semesterWeek: `第 ${state.form.semesterWeek} 周`,
      subject: SUBJECTS[task.subject]?.label || "",
      title: task.title || "",
      time: task.timeLabel || "",
      minutes: formatMinutes(task.minutes),
      status: exportStatusLabel(task),
      pages: getPageLabel(task),
      note: getTaskNote(task),
    }));
  });
}

function getPageLabel(task) {
  if (!task.pageStart) {
    return "";
  }
  return `第${task.pageStart}${task.pageEnd ? `-${task.pageEnd}` : ""}页`;
}

function getTaskNote(task) {
  if (task.contentType === "course") {
    return task.courseTitle || "";
  }
  if (task.contentType === "other") {
    return task.customTitle || "";
  }
  return task.customTitle || contentLabel(task);
}

function contentLabel(task) {
  if (task.contentType === "homework") {
    return "学校作业";
  }
  if (task.contentType === "exercise") {
    return "运动";
  }
  const options = getContentOptions(task.subject);
  return options.find((option) => option.id === task.contentType)?.label || "";
}

function getContentOptions(subject) {
  const baseOptions = CONTENT_OPTIONS[subject] || [];
  const customOptions = state.contentLibrary?.[subject] || [];
  if (!customOptions.length) {
    return baseOptions;
  }

  const otherIndex = baseOptions.findIndex((option) => option.id === "other");
  if (otherIndex === -1) {
    return [...baseOptions, ...customOptions];
  }
  return [...baseOptions.slice(0, otherIndex), ...customOptions, ...baseOptions.slice(otherIndex)];
}

function createEmptyContentLibrary() {
  return LIBRARY_SUBJECTS.reduce((library, subject) => {
    library[subject] = [];
    return library;
  }, {});
}

function normalizeContentLibrary(contentLibrary) {
  const normalized = createEmptyContentLibrary();
  if (!contentLibrary || typeof contentLibrary !== "object") {
    return normalized;
  }

  LIBRARY_SUBJECTS.forEach((subject) => {
    const savedOptions = Array.isArray(contentLibrary[subject]) ? contentLibrary[subject] : [];
    savedOptions.forEach((option) => {
      const label = String(typeof option === "string" ? option : option?.label || "").trim();
      if (!label || contentLabelExistsInList([...(CONTENT_OPTIONS[subject] || []), ...normalized[subject]], label)) {
        return;
      }
      const id = typeof option === "object" && option?.id ? String(option.id) : createId("content");
      normalized[subject].push({ id, label });
    });
  });

  return normalized;
}

function removeLegacyDefaultContentOptions(contentLibrary) {
  const removedLabels = new Set(REMOVED_DEFAULT_CONTENT_LABELS.map(normalizeContentName));
  LIBRARY_SUBJECTS.forEach((subject) => {
    contentLibrary[subject] = (contentLibrary[subject] || []).filter(
      (option) => !removedLabels.has(normalizeContentName(option.label)),
    );
  });
}

function contentLabelExistsInList(options, label) {
  const key = normalizeContentName(label);
  return options.some((option) => normalizeContentName(option.label) === key);
}

function normalizeContentName(value) {
  return String(value || "")
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase();
}

function statusLabel(statusId) {
  return STATUS_OPTIONS.find((status) => status.id === statusId)?.label || "未完成";
}

function exportStatusLabel(task) {
  return task.statusTouched ? statusLabel(task.status) : "";
}

function readTaskMinutes(value, task) {
  return clamp(Number(value) || Number(task.minutes) || 20, 5, 180);
}

function formatMinutes(value) {
  return value === "" || value == null ? "" : `${value} 分钟`;
}

function migrateFixedExerciseTask(task) {
  if (!task || (!task.title && (task.minutes === "" || task.minutes == null))) {
    return null;
  }
  const courseTitle = getLegacySportsCourseTitle(task);
  return {
    ...task,
    id: createId("exercise"),
    source: "selected",
    fixedType: undefined,
    subject: "sports",
    contentType: "course",
    courseKind: "sports",
    courseTitle,
    title: `运动：${courseTitle}`,
    minutes: clamp(Number(task.minutes) || 20, 5, 180),
  };
}

function migrateLegacySportsTask(task) {
  if (!task || (task.subject !== "sports" && task.contentType !== "exercise")) {
    return task;
  }
  const courseTitle = getLegacySportsCourseTitle(task);
  return {
    ...task,
    subject: "sports",
    contentType: "course",
    courseKind: "sports",
    courseTitle,
    title: `运动：${courseTitle}`,
    fixedType: undefined,
  };
}

function getLegacySportsCourseTitle(task) {
  const title = String(task.courseTitle || task.customTitle || task.title || "").replace(/^运动：/, "").trim();
  return title || "运动";
}

function downloadBlob(blob, fileName) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function safeFileName(value) {
  return String(value || "学习计划").replace(/[\\/:*?"<>|]/g, "-");
}

function saveState() {
  localStorage.setItem("study-planner-state", JSON.stringify(state));
}

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem("study-planner-state") || "null");
    if (saved?.form && Array.isArray(saved?.plan)) {
      state = {
        form: normalizeForm({ ...DEFAULT_FORM, ...saved.form }),
        plan: normalizePlan(saved.plan),
        contentLibrary: normalizeContentLibrary(saved.contentLibrary),
        contentLibraryVersion: saved.contentLibraryVersion || "",
      };
    } else if (saved?.contentLibrary) {
      state.contentLibrary = normalizeContentLibrary(saved.contentLibrary);
      state.contentLibraryVersion = saved.contentLibraryVersion || "";
    }
    if (state.contentLibraryVersion !== CONTENT_LIBRARY_VERSION) {
      removeLegacyDefaultContentOptions(state.contentLibrary);
      state.contentLibraryVersion = CONTENT_LIBRARY_VERSION;
      saveState();
    }
  } catch {
    state = {
      form: { ...DEFAULT_FORM },
      plan: createBlankPlan(),
      contentLibrary: createEmptyContentLibrary(),
      contentLibraryVersion: CONTENT_LIBRARY_VERSION,
    };
  }
}

function normalizeForm(form) {
  return {
    ...form,
    city: form.city === "苏州" ? "" : form.city || DEFAULT_FORM.city,
    gradeStage: GRADE_STAGE_ALIASES[form.gradeStage] || form.gradeStage || DEFAULT_FORM.gradeStage,
    weekStartDate: form.weekStartDate || DEFAULT_FORM.weekStartDate,
    semesterWeek: clamp(Number(form.semesterWeek) || DEFAULT_FORM.semesterWeek, 1, 30),
  };
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function minutesFromTimeRange(start, end) {
  if (!start || !end) {
    return 0;
  }
  const startMinutes = timeToMinutes(start);
  const endMinutes = timeToMinutes(end);
  if (endMinutes <= startMinutes) {
    return 0;
  }
  return endMinutes - startMinutes;
}

function formatTimeRange(start, end) {
  return getCourseSchedule({ startTime: start, endTime: end, minutes: 45 }).label;
}

function timeToMinutes(timeValue) {
  const [hour, minute] = timeValue.split(":").map(Number);
  return hour * 60 + minute;
}

function createId(prefix) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
}

function refreshDayOptions() {
  [...els.customDayChoices.querySelectorAll(".day-choice-label")].forEach((label, index) => {
    const day = DAYS[index];
    label.textContent = `${day.label} ${getDayDateLabel(day.id)}`;
  });
}

function getDayDateLabel(dayId) {
  const dayIndex = DAYS.findIndex((day) => day.id === dayId);
  const date = addDays(parseInputDate(state.form.weekStartDate), dayIndex);
  return formatMonthDay(date);
}

function formatWeekRange(startValue) {
  const start = parseInputDate(startValue);
  const end = addDays(start, 6);
  return `${formatMonthDay(start)}-${formatMonthDay(end)}`;
}

function getCurrentWeekMonday() {
  const today = new Date();
  const day = today.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  return formatDateInput(addDays(today, diff));
}

function parseInputDate(value) {
  if (!value) {
    return parseInputDate(DEFAULT_FORM.weekStartDate);
  }
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function addDays(date, days) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function formatMonthDay(date) {
  return `${date.getMonth() + 1}月${date.getDate()}日`;
}

function formatDateInput(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
