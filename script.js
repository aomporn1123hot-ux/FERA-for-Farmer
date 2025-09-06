let currentPageIndex = 0;
const pages = document.querySelectorAll(".page");
let answers = {};

// ✅ ฟังก์ชันสลับหน้า
function showPage(index) {
  currentPageIndex = index;
  pages.forEach((p, i) => {
    p.classList.toggle("active", i === index);
  });
}

// ✅ เริ่มการประเมิน
window.startAssessment = function() {
  console.log("เริ่มการประเมินแล้ว ✅");
  createImageOptions("upperPostureOptions", "upperPosture", 10, "บน");
  createImageOptions("lowerPostureOptions", "lowerPosture", 8, "ล่าง");
  showPage(1);
};

// ✅ สร้างตัวเลือกภาพ
function createImageOptions(containerId, name, count, folder) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";
  for (let i = 1; i <= count; i++) {
    const label = document.createElement("label");
    label.innerHTML = `
      <input type="radio" name="${name}" value="${i}">
      <img src="ภาพ${folder}/${i}.png" alt="${name}${i}" style="width:120px;">
    `;
    container.appendChild(label);
  }
}

// ✅ หน้า 1 → หน้า 2
function nextUpperTimePage() {
  const container = document.getElementById("page2");
  container.innerHTML = `
    <h2>ข้อ2. ระยะเวลาที่ทำงานในท่าดังกล่าว (ส่วนบน)</h2>
    <label><input type="radio" name="upperTime" value="1"> น้อยกว่า 1 ชั่วโมง</label><br>
    <label><input type="radio" name="upperTime" value="2"> 1–2 ชั่วโมง</label><br>
    <label><input type="radio" name="upperTime" value="3"> มากกว่า 2 ชั่วโมง</label><br>
    <button onclick="nextLowerPosturePage()">ถัดไป</button>
  `;
  showPage(2);
}

// ✅ หน้า 2 → หน้า 3
function nextLowerPosturePage() {
  showPage(3);
}

// ✅ หน้า 3 → หน้า 4
function nextLowerTimePage() {
  const container = document.getElementById("page4");
  container.innerHTML = `
    <h2>ข้อ4. ระยะเวลาที่ทำงานในท่าดังกล่าว (ส่วนล่าง)</h2>
    <label><input type="radio" name="lowerTime" value="1"> น้อยกว่า 1 ชั่วโมง</label><br>
    <label><input type="radio" name="lowerTime" value="2"> 1–2 ชั่วโมง</label><br>
    <label><input type="radio" name="lowerTime" value="3"> มากกว่า 2 ชั่วโมง</label><br>
    <button onclick="nextForcePage()">ถัดไป</button>
  `;
  showPage(4);
}

// ✅ หน้า 4 → หน้า 5
function nextForcePage() {
  const container = document.getElementById("forceOptions");
  container.innerHTML = `
    <label><input type="radio" name="force" value="1"> เบา</label><br>
    <label><input type="radio" name="force" value="2"> ปานกลาง</label><br>
    <label><input type="radio" name="force" value="3"> มาก</label>
  `;
  showPage(5);
}

// ✅ หน้า 5 → หน้า 6
function nextRepetitionPage() {
  const container = document.getElementById("repetitionOptions");
  container.innerHTML = `
    <label><input type="radio" name="repetition" value="1"> น้อย</label><br>
    <label><input type="radio" name="repetition" value="2"> ปานกลาง</label><br>
    <label><input type="radio" name="repetition" value="3"> มาก</label>
  `;
  showPage(6);
}

// ✅ หน้า 6 → หน้า 7
function nextTwistPage() {
  const container = document.getElementById("twistOptions");
  container.innerHTML = `
    <label><input type="radio" name="twist" value="1"> ไม่บิด</label><br>
    <label><input type="radio" name="twist" value="2"> บิดเล็กน้อย</label><br>
    <label><input type="radio" name="twist" value="3"> บิดมาก</label>
  `;
  showPage(7);
}

// ✅ แสดงผลลัพธ์
function showResult() {
  let resultText = "คุณทำการประเมินเสร็จแล้ว ✅ (ระบบยังไม่คำนวณคะแนนจริง)";
  document.getElementById("result").innerHTML = resultText;
  showPage(8);
}

// ✅ เริ่มใหม่
function restart() {
  showPage(0);
}
