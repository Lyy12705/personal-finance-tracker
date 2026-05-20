const expenseForm = document.querySelector("#expenseForm");
const dateInput = document.querySelector("#dateInput");
const categoryInput = document.querySelector("#categoryInput");
const amountInput = document.querySelector("#amountInput");
const noteInput = document.querySelector("#noteInput");
const recordList = document.querySelector("#recordList");
const totalExpense = document.querySelector("#totalExpense");
const recordCount = document.querySelector("#recordCount");
const categoryStatsContent = document.querySelector("#categoryStatsContent");
const categoryChart = document.querySelector("#categoryChart");
const categoryChartTotal = document.querySelector("#categoryChartTotal");
const categoryStatsList = document.querySelector("#categoryStatsList");
const categoryEmptyState = document.querySelector("#categoryEmptyState");

const STORAGE_KEY = "personalFinanceTrackerRecords";
const CATEGORY_ORDER = ["餐飲", "交通", "購物", "娛樂", "其他"];
const CATEGORY_COLORS = {
  餐飲: "#1f8a70",
  交通: "#2f6fbb",
  購物: "#b98525",
  娛樂: "#805ad5",
  其他: "#63716b",
};

let records = loadRecords();
let nextRecordId = getNextRecordId();

function loadRecords() {
  try {
    const savedRecords = localStorage.getItem(STORAGE_KEY);

    if (!savedRecords) {
      return [];
    }

    const parsedRecords = JSON.parse(savedRecords);

    if (!Array.isArray(parsedRecords)) {
      return [];
    }

    return parsedRecords
      .map((record) => ({
        id: String(record.id),
        date: record.date,
        category: record.category,
        amount: Number(record.amount),
        note: record.note,
      }))
      .filter(
        (record) =>
          record.id &&
          record.date &&
          record.category &&
          Number.isFinite(record.amount) &&
          record.amount > 0 &&
          record.note,
      );
  } catch (error) {
    console.warn("無法讀取 localStorage 記帳資料", error);
    return [];
  }
}

function saveRecords() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch (error) {
    console.warn("無法儲存 localStorage 記帳資料", error);
  }
}

function getNextRecordId() {
  const maxId = records.reduce((max, record) => {
    const recordId = Number(record.id);
    return Number.isFinite(recordId) ? Math.max(max, recordId) : max;
  }, 0);

  return maxId + 1;
}

function formatCurrency(amount) {
  return `$${amount.toLocaleString("en-US")}`;
}

function calculateTotal() {
  return records.reduce((sum, record) => sum + record.amount, 0);
}

function calculateCategoryTotals() {
  const totals = records.reduce((summary, record) => {
    summary[record.category] = (summary[record.category] || 0) + record.amount;
    return summary;
  }, {});

  return CATEGORY_ORDER.map((category) => ({
    category,
    amount: totals[category] || 0,
  })).filter((item) => item.amount > 0);
}

function renderSummary() {
  totalExpense.textContent = formatCurrency(calculateTotal());
  recordCount.textContent = `${records.length} 筆支出`;
}

function renderCategoryStats() {
  const total = calculateTotal();
  const categoryTotals = calculateCategoryTotals();

  categoryStatsList.textContent = "";
  categoryChartTotal.textContent = formatCurrency(total);

  if (categoryTotals.length === 0) {
    categoryStatsContent.classList.add("is-hidden");
    categoryEmptyState.classList.remove("is-hidden");
    categoryChart.style.background = "";
    categoryChart.setAttribute("aria-label", "目前尚無支出資料");
    return;
  }

  categoryStatsContent.classList.remove("is-hidden");
  categoryEmptyState.classList.add("is-hidden");

  let currentPercent = 0;
  const gradientStops = categoryTotals.map((item, index) => {
    const percent = (item.amount / total) * 100;
    const startPercent = currentPercent;
    currentPercent += percent;
    const endPercent = index === categoryTotals.length - 1 ? 100 : currentPercent;
    const color = CATEGORY_COLORS[item.category];

    return `${color} ${startPercent}% ${endPercent}%`;
  });

  categoryChart.style.background = `conic-gradient(${gradientStops.join(", ")})`;
  categoryChart.setAttribute(
    "aria-label",
    categoryTotals
      .map(
        (item) =>
          `${item.category} ${Math.round((item.amount / total) * 100)}%`,
      )
      .join("，"),
  );

  categoryTotals.forEach((item) => {
    categoryStatsList.append(createCategoryStatItem(item, total));
  });
}

function createCategoryStatItem(item, total) {
  const statItem = document.createElement("li");
  statItem.className = "category-item";

  const colorDot = document.createElement("span");
  colorDot.className = "category-dot";
  colorDot.style.background = CATEGORY_COLORS[item.category];

  const content = document.createElement("div");
  content.className = "category-content";

  const categoryName = document.createElement("strong");
  categoryName.textContent = item.category;

  const percent = document.createElement("span");
  percent.textContent = `${Math.round((item.amount / total) * 100)}%`;

  content.append(categoryName, percent);

  const amount = document.createElement("strong");
  amount.className = "category-amount";
  amount.textContent = formatCurrency(item.amount);

  statItem.append(colorDot, content, amount);

  return statItem;
}

function createRecordItem(record) {
  const item = document.createElement("li");
  item.className = "record-item";

  const recordContent = document.createElement("div");
  recordContent.className = "record-content";

  const compactText = document.createElement("span");
  compactText.className = "record-text sr-only";
  compactText.textContent = `${record.date}｜${record.category}｜${formatCurrency(
    record.amount,
  )}｜${record.note}`;

  const recordDate = document.createElement("div");
  recordDate.className = "record-date";

  const dateLabel = document.createElement("span");
  dateLabel.textContent = "日期";

  const dateValue = document.createElement("strong");
  dateValue.textContent = record.date;

  recordDate.append(dateLabel, dateValue);

  const recordDetails = document.createElement("div");
  recordDetails.className = "record-details";

  const categoryDetail = createRecordDetail("類別", record.category);
  const amountDetail = createRecordDetail("金額", formatCurrency(record.amount));
  amountDetail.classList.add("record-amount");
  const noteDetail = createRecordDetail("備註", record.note);

  recordDetails.append(categoryDetail, amountDetail, noteDetail);
  recordContent.append(compactText, recordDate, recordDetails);

  const deleteButton = document.createElement("button");
  deleteButton.className = "delete-button";
  deleteButton.type = "button";
  deleteButton.textContent = "刪除";
  deleteButton.dataset.id = record.id;
  deleteButton.setAttribute(
    "aria-label",
    `刪除 ${record.date} ${record.category} ${record.note}`,
  );

  item.append(recordContent, deleteButton);

  return item;
}

function createRecordDetail(label, value) {
  const detail = document.createElement("div");
  detail.className = "record-detail";

  const detailLabel = document.createElement("span");
  detailLabel.textContent = label;

  const detailValue = document.createElement("strong");
  detailValue.textContent = value;

  detail.append(detailLabel, detailValue);

  return detail;
}

function renderRecords() {
  recordList.textContent = "";
  renderSummary();
  renderCategoryStats();

  if (records.length === 0) {
    const emptyItem = document.createElement("li");
    emptyItem.className = "empty-state";
    emptyItem.textContent = "尚無記帳資料";
    recordList.append(emptyItem);
    return;
  }

  records.forEach((record) => {
    recordList.append(createRecordItem(record));
  });
}

function resetForm() {
  expenseForm.reset();
  dateInput.focus();
}

expenseForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const amount = Number(amountInput.value);
  const note = noteInput.value.trim();
  noteInput.setCustomValidity("");

  if (!note) {
    noteInput.setCustomValidity("請輸入備註");
  }

  if (
    !dateInput.value ||
    !categoryInput.value ||
    !Number.isInteger(amount) ||
    amount <= 0 ||
    !note
  ) {
    expenseForm.reportValidity();
    return;
  }

  records.push({
    id: String(nextRecordId),
    date: dateInput.value,
    category: categoryInput.value,
    amount,
    note,
  });
  nextRecordId += 1;

  saveRecords();
  renderRecords();
  resetForm();
});

recordList.addEventListener("click", (event) => {
  const deleteButton = event.target.closest(".delete-button");

  if (!deleteButton) {
    return;
  }

  records = records.filter((record) => record.id !== deleteButton.dataset.id);
  saveRecords();
  renderRecords();
});

renderRecords();
