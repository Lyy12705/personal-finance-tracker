# 元件外觀範例

這份檔案提供給 Codex 參考，讓它在修改個人記帳網站時，能維持一致的元件樣式與版面語言。

---

## 1. 整體視覺風格

dashboard整體風格要保持：

- 簡潔、乾淨、現代感
- 卡片式區塊
- 淡綠色系背景
- 圓角元件
- 清楚的財務資訊層級
- 桌機版可多欄排列，手機版改為單欄排列

主要色彩建議沿用：

```css
:root {
  --bg: #f4f7f4;
  --surface: #ffffff;
  --surface-strong: #eef3ee;
  --ink: #17211d;
  --muted: #63716b;
  --line: #dbe3dd;
  --green: #1f8a70;
  --green-dark: #17614f;
  --blue: #2f6fbb;
  --red: #d85a45;
  --shadow: 0 18px 50px rgba(31, 49, 41, 0.12);
}
```

---

## 2. 卡片元件

所有主要區塊都應該使用卡片式設計，例如：總覽卡片、新增表單、圖表區、紀錄區。

```html
<article class="metric-card">
  <span>本月結餘</span>
  <strong>$12,000</strong>
  <small>儲蓄率 40%</small>
</article>
```

```css
.metric-card,
.entry-panel,
.chart-panel,
.records-section {
  border: 1px solid var(--line);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: var(--shadow);
  padding: 22px;
}
```

使用原則：

- 卡片背景以白色或半透明白色為主
- 邊框使用 `var(--line)`
- 圓角使用 `8px`
- 重要區塊可加 `box-shadow`
- 卡片內距建議 `18px` 到 `22px`

---

## 3. 統計卡片

統計卡片用於顯示本月結餘、收入、支出、預算餘額。

```html
<article class="metric-card">
  <span>支出</span>
  <strong id="totalExpense">$2,350</strong>
  <small>12 筆支出</small>
</article>
```

```css
.metric-card {
  min-height: 132px;
  padding: 18px;
}

.metric-card span {
  display: block;
  color: var(--muted);
  font-weight: 800;
}

.metric-card strong {
  display: block;
  margin: 18px 0 8px;
  font-size: clamp(1.35rem, 2.6vw, 2.15rem);
  line-height: 1;
}

.metric-card small {
  color: var(--muted);
}
```

使用原則：

- 小標題用 `span`
- 主要金額用 `strong`
- 補充說明用 `small`
- 金額要比其他文字明顯放大

---

## 4. 區塊標題

每個主要區塊都使用 eyebrow 小標籤加上標題。

```html
<div class="section-title">
  <p class="eyebrow">Entry</p>
  <h2>新增收支</h2>
</div>
```

```css
.section-title {
  margin-bottom: 18px;
}

.section-title h2 {
  margin: 0;
  font-size: 1.15rem;
}

.eyebrow {
  margin: 0 0 7px;
  color: var(--green-dark);
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0;
  text-transform: uppercase;
}
```

使用原則：

- 英文小標籤用於區分 dashboard 區塊
- 中文標題用於說明實際功能
- 不要讓標題過大，避免搶走金額資訊焦點

---

## 5. 表單欄位

表單欄位用於日期、分類、金額、項目、備註等輸入。

```html
<label class="field">
  <span>金額</span>
  <input id="amountInput" type="number" min="1" step="1" inputmode="numeric" required />
</label>
```

```html
<label class="field">
  <span>分類</span>
  <select id="categoryInput" required></select>
</label>
```

```css
.field {
  display: grid;
  gap: 7px;
  color: var(--muted);
  font-size: 0.88rem;
  font-weight: 700;
}

input,
select,
textarea {
  width: 100%;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: #fff;
  color: var(--ink);
  outline: none;
}

input,
select {
  height: 44px;
  padding: 0 12px;
}

textarea {
  min-height: 88px;
  padding: 12px;
  resize: vertical;
}

input:focus,
select:focus,
textarea:focus {
  border-color: var(--green);
  box-shadow: 0 0 0 3px rgba(31, 138, 112, 0.15);
}
```

使用原則：

- label 外層統一使用 `.field`
- 欄位高度統一為 `44px`
- focus 狀態使用綠色外框陰影
- 手機版表單改成單欄排列

---

## 6. 雙欄表單列

金額與日期可以在桌機版並排，手機版改為單欄。

```html
<div class="form-row">
  <label class="field">
    <span>金額</span>
    <input type="number" />
  </label>

  <label class="field">
    <span>日期</span>
    <input type="date" />
  </label>
</div>
```

```css
.form-row {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

@media (max-width: 760px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}
```

---

## 7. 收入／支出切換元件

收入與支出切換使用 segmented control，不使用普通 radio 樣式。

```html
<fieldset class="segmented-control" aria-label="收支類型">
  <label>
    <input type="radio" name="type" value="expense" checked />
    <span>支出</span>
  </label>
  <label>
    <input type="radio" name="type" value="income" />
    <span>收入</span>
  </label>
</fieldset>
```

```css
.segmented-control {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  margin: 0;
  padding: 4px;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--surface-strong);
}

.segmented-control input {
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
}

.segmented-control span {
  display: grid;
  min-height: 40px;
  place-items: center;
  border-radius: 6px;
  color: var(--muted);
  font-weight: 800;
}

.segmented-control input:checked + span {
  background: var(--surface);
  color: var(--ink);
  box-shadow: 0 8px 18px rgba(27, 42, 36, 0.1);
}
```

使用原則：

- 不顯示原生 radio 圓點
- 被選取的項目使用白底與陰影
- 未選取項目使用灰綠底

---

## 8. 按鈕元件

主要按鈕、次要按鈕、小型操作按鈕要維持一致圓角與高度。

### 主要按鈕

```html
<button class="primary-button" type="submit">新增紀錄</button>
```

```css
.primary-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 42px;
  padding: 0 18px;
  border: 1px solid transparent;
  border-radius: 8px;
  background: var(--green);
  color: #fff;
  font-weight: 800;
}

.primary-button:hover {
  background: var(--green-dark);
}
```

### 次要按鈕

```html
<button class="ghost-button" type="button">取消編輯</button>
```

```css
.ghost-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 42px;
  padding: 0 14px;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: transparent;
  color: var(--ink);
  font-weight: 800;
}

.ghost-button:hover {
  background: var(--surface-strong);
}
```

### 小型操作按鈕

```html
<button class="mini-button" type="button">編輯</button>
<button class="mini-button" type="button">刪除</button>
```

```css
.mini-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 44px;
  min-height: 36px;
  padding: 0 10px;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: #fff;
  color: var(--ink);
  font-weight: 800;
}

.mini-button:hover {
  background: var(--surface-strong);
}
```

使用原則：

- 新增、儲存等主要行動使用 `.primary-button`
- 取消、重置等次要行動使用 `.ghost-button`
- 編輯、刪除等列表內操作使用 `.mini-button`

---

## 9. 收支紀錄列

每一筆紀錄應該是清楚的列表列，不要只用純文字串接。

```html
<div class="transaction-row">
  <span class="date-pill">05/20</span>

  <div class="transaction-main">
    <strong>午餐</strong>
    <span>餐飲・便當</span>
  </div>

  <span class="type-pill expense">支出</span>
  <strong class="amount expense">-$120</strong>

  <div class="row-actions">
    <button class="mini-button" type="button">編輯</button>
    <button class="mini-button" type="button">刪除</button>
  </div>
</div>
```

```css
.transaction-row {
  display: grid;
  grid-template-columns: 90px minmax(180px, 1fr) 120px 140px 118px;
  gap: 12px;
  align-items: center;
  min-height: 70px;
  padding: 12px;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: #fff;
}

.transaction-main {
  min-width: 0;
}

.transaction-main strong,
.transaction-main span {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.transaction-main span {
  margin-top: 4px;
  color: var(--muted);
  font-size: 0.9rem;
}

.amount {
  text-align: right;
  font-size: 1.08rem;
  font-weight: 900;
}

.amount.income {
  color: var(--blue);
}

.amount.expense {
  color: var(--red);
}

.row-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
```

使用原則：

- 日期使用 pill 樣式
- 項目名稱放在主要欄位
- 備註或分類放在次要文字
- 收入金額用藍色
- 支出金額用紅色
- 手機版紀錄列改為單欄

---

## 10. 日期與類型標籤

```html
<span class="date-pill">05/20</span>
<span class="type-pill income">收入</span>
<span class="type-pill expense">支出</span>
```

```css
.date-pill,
.type-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 30px;
  padding: 0 10px;
  border-radius: 999px;
  background: var(--surface-strong);
  color: var(--muted);
  font-size: 0.82rem;
  font-weight: 800;
}

.type-pill.income {
  background: rgba(47, 111, 187, 0.12);
  color: var(--blue);
}

.type-pill.expense {
  background: rgba(216, 90, 69, 0.12);
  color: var(--red);
}
```

---

## 11. 分類統計列

分類統計應該包含色點、分類名稱、進度條、金額。

```html
<div class="category-row">
  <div class="category-label">
    <span class="category-dot"></span>
    <span class="category-name">餐飲</span>
  </div>

  <div class="bar-track">
    <div class="bar-fill" style="width: 64%;"></div>
  </div>

  <div class="category-amount">$320</div>
</div>
```

```css
.category-row {
  display: grid;
  grid-template-columns: 120px minmax(120px, 1fr) 96px;
  gap: 12px;
  align-items: center;
}

.category-label {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  font-weight: 800;
}

.category-dot {
  flex: 0 0 auto;
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.category-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.bar-track {
  height: 10px;
  overflow: hidden;
  border-radius: 999px;
  background: var(--surface-strong);
}

.bar-fill {
  width: 0;
  height: 100%;
  border-radius: inherit;
  transition: width 180ms ease;
}

.category-amount {
  text-align: right;
  color: var(--muted);
  font-weight: 800;
}
```

使用原則：

- 不顯示金額為 0 的分類
- 分類名稱太長時要省略
- 進度條寬度應依照百分比更新
- 手機版改為單欄排列

---

## 12. 圓餅圖／甜甜圈圖

目前圖表使用 CSS `conic-gradient` 製作甜甜圈圖。

```html
<div id="donutChart" class="donut-chart" aria-hidden="true"></div>
```

```css
.donut-chart {
  flex: 0 0 auto;
  width: 112px;
  height: 112px;
  border-radius: 50%;
  background: conic-gradient(var(--line) 0deg 360deg);
  box-shadow: inset 0 0 0 18px #fff;
}
```

使用原則：

- 沒有資料時，圖表使用灰色圓形
- 有資料時，用 `conic-gradient` 呈現分類比例
- 圖表旁邊搭配分類統計列
- 手機版圖表寬度可以放大，但不可超出容器

---

## 13. 空狀態

沒有資料時，不要讓區塊空白，應顯示提示文字。

```html
<p class="empty-state">這個條件下沒有紀錄。</p>
```

```css
.empty-state {
  margin: 24px 0 6px;
  color: var(--muted);
  text-align: center;
}

.hidden {
  display: none !important;
}
```

使用原則：

- 沒有紀錄時顯示空狀態
- 沒有分類支出時顯示「目前尚無支出資料」
- 不要讓使用者看到空白區塊

---

## 14. 響應式排版

桌機版可以使用 sidebar + dashboard 版面，手機版改為單欄。

```css
.app-shell {
  display: grid;
  grid-template-columns: 280px minmax(0, 1fr);
  min-height: 100vh;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
}

.main-grid {
  display: grid;
  grid-template-columns: minmax(320px, 0.85fr) minmax(0, 1.15fr);
  gap: 16px;
}

@media (max-width: 1060px) {
  .app-shell {
    grid-template-columns: 1fr;
  }

  .metrics-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .main-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 760px) {
  .metrics-grid,
  .filters,
  .form-row,
  .category-row,
  .transaction-row {
    grid-template-columns: 1fr;
  }

  .amount,
  .category-amount {
    text-align: left;
  }

  .row-actions {
    justify-content: stretch;
  }

  .row-actions .mini-button {
    flex: 1;
  }
}
```

使用原則：

- 大螢幕：sidebar + dashboard
- 中螢幕：sidebar 移到上方，主要內容單欄
- 小螢幕：所有卡片、表單、紀錄列改為單欄
- 按鈕在手機版要容易點擊

---

## 15. Codex 修改元件時的原則

請 Codex 修改 UI 時，應遵守：

1. 優先沿用既有 class name，不要隨意重命名。
2. 新增元件時，盡量沿用 `.metric-card`、`.entry-panel`、`.chart-panel`、`.records-section` 這類卡片樣式。
3. 新增按鈕時，依用途選擇 `.primary-button`、`.ghost-button` 或 `.mini-button`。
4. 新增表單欄位時，外層使用 `.field`。
5. 新增列表資料時，參考 `.transaction-row` 的結構。
6. 新增分類統計時，參考 `.category-row` 的結構。
7. 不要破壞 RWD 設定。
8. 不要讓畫面回到普通純文字表單樣式。
