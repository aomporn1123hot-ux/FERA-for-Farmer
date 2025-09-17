// Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDf0D2GLLDHoAVX4zq-tLuVocSmsrFhs38",
  authDomain: "fera-2215e.firebaseapp.com",
  databaseURL: "https://fera-2215e-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "fera-2215e",
  storageBucket: "fera-2215e.appspot.com",
  messagingSenderId: "810225127285",
  appId: "1:810225127285:web:fa87166d4e3e4770670d3c"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const auth = firebase.auth();
auth.signInAnonymously().catch(console.error);

// Pages
const pages = document.querySelectorAll(".page");
let currentPageIndex = 0;
function showPage(index){ currentPageIndex=index; pages.forEach((p,i)=>p.classList.toggle("active",i===index)); }
function prevPage(){ if(currentPageIndex>0) showPage(currentPageIndex-1); }

// สร้างตัวเลือกภาพ
function createImageOptions(containerId,name,count,prefix){
  const container=document.getElementById(containerId);
  container.innerHTML="";
  for(let i=1;i<=count;i++){
    const label=document.createElement("div");
    label.className="image-option";
    label.innerHTML=`
      <input type="radio" name="${name}" value="${i}">
      <img src="${prefix}${i}.png" alt="${prefix}${i}">
      <div class="checkmark">✔</div>`;
    label.addEventListener("click",()=>{
      document.querySelectorAll(`#${containerId} .image-option`).forEach(opt=>opt.classList.remove("selected"));
      label.classList.add("selected");
      label.querySelector("input").checked=true;
    });
    container.appendChild(label);
  }
}

// เริ่มประเมิน
function startAssessment(){
  createImageOptions("upperPostureOptions","upperPosture",10,"บน");
  createImageOptions("lowerPostureOptions","lowerPosture",8,"ล่าง");
  showPage(1);
}

// หน้า 1→2
function nextUpperTimePage(){
  const selected=document.querySelector('input[name="upperPosture"]:checked');
  if(!selected)return alert("กรุณาเลือกท่าทางส่วนบน");
  const val=parseInt(selected.value);
  const labels={1:["1-2 นาที","3-7 นาที","8-18 นาที","17 นาที"],2:["1 นาที","2-6 นาที","7-13 นาที","14 นาที"],3:["1 นาที","2-8 นาที","9-12 นาที"],4:["1 นาที","2-7 นาที","8-11 นาที"],5:["1-4 นาที","5-12 นาที"],6:["1 นาที","2-7 นาที"],7:["1 นาที","2-8 นาที"],8:["1-2 นาที"],9:["1-4 นาที"],10:["1-3 นาที"]};
  const container=document.getElementById("page2");
  container.innerHTML=`<h2>ข้อ2. ระยะเวลาที่ทำงานในท่าดังกล่าว (ส่วนบน)</h2>`;
  labels[val].forEach((text,i)=>{ container.innerHTML+=`<label><input type="radio" name="upperTime" value="${i}"> ${text}</label><br>`; });
  container.innerHTML+=`<div class="nav-buttons"><button type="button" onclick="prevPage()">ย้อนกลับ</button><button type="button" onclick="showPage(3)">ถัดไป</button></div>`;
  showPage(2);
}

// หน้า 3→4
function nextLowerTimePage(){
  const selected=document.querySelector('input[name="lowerPosture"]:checked');
  if(!selected)return alert("กรุณาเลือกท่าทางส่วนล่าง");
  const val=parseInt(selected.value);
  const labels={1:["1-10 นาที","11-32 นาที","33 นาที"],2:["1-11 นาที","12 นาที"],3:["1 นาที"],4:["1 นาที"],5:["1 นาที"],6:["1-8 นาที","9 นาที"],7:["1-2 นาที","3 นาที"],8:["1-3 นาที","4 นาที"]};
  const container=document.getElementById("page4");
  container.innerHTML=`<h2>ข้อ4. ระยะเวลาที่ทำงานในท่าดังกล่าว (ส่วนล่าง)</h2>`;
  labels[val].forEach((text,i)=>{ container.innerHTML+=`<label><input type="radio" name="lowerTime" value="${i}"> ${text}</label><br>`; });
  container.innerHTML+=`<div class="nav-buttons"><button type="button" onclick="prevPage()">ย้อนกลับ</button><button type="button" onclick="showPage(5)">ถัดไป</button></div>`;
  showPage(4);
}

// เก็บคำตอบ
function collectAnswersForFirebase(){
  const getVal=name=>document.querySelector(`input[name="${name}"]:checked`)?.value||"";
  return { upperPosture:getVal("upperPosture"), upperTime:getVal("upperTime"), lowerPosture:getVal("lowerPosture"), lowerTime:getVal("lowerTime"), force:getVal("force"), repetition:getVal("repetition"), twist:getVal("twist"), timestamp:Date.now()};
}
function sendToFirebase(data){ db.ref("assessments").push(data,error=>{ if(error) console.error("เกิดข้อผิดพลาดในการบันทึก:",error); else console.log("ส่งข้อมูลเรียบร้อย:",data); }); }

// ผลลัพธ์
function calculateResult(){
  const getVal=name=>parseInt(document.querySelector(`input[name="${name}"]:checked`)?.value||0);
  const upperMap={1:[0,0,1,2],2:[0,0,1,2],3:[1,2,3],4:[1,2,3],5:[2,3],6:[2,3],7:[2,3],8:[3],9:[3],10:[3]};
  const lowerMap={1:[1,2,3],2:[2,3],3:[3],4:[3],5:[3],6:[2,3],7:[2,3],8:[2,3]};
  const upPosture=getVal("upperPosture"), ut=getVal("upperTime"), lowerPosture=getVal("lowerPosture"), lt=getVal("lowerTime"), f=getVal("force"), r=getVal("repetition"), t=getVal("twist");
  const utScore=upperMap[upPosture]?.[ut]??0;
  const ltScore=lowerMap[lowerPosture]?.[lt]??0;
  const total=(1+utScore)*(1+ltScore)+f+r+t;

  let level="", image="";
  if(total===1){ level="ระดับยอมรับได้"; image="ยอมรับได้.png"; }
  else if(total<=3){ level="ระดับต่ำ"; image="ความเสี่ยงต่ำ.png"; }
  else if(total<=7){ level="ระดับปานกลาง"; image="ปานกลาง.png"; }
  else if(total<=14){ level="ระดับสูง"; image="ความเสี่ยงสูง.png"; }
  else{ level="ระดับสูงมาก"; image="ความเสี่ยงสูงมาก.png"; }

  const answers=collectAnswersForFirebase();
  answers.totalScore=total;
  answers.level=level;
  sendToFirebase(answers);

  document.getElementById("resultText").textContent=`คะแนนรวม: ${total} (${level})`;
  const resultImg=document.getElementById("resultImage");
  resultImg.src=image;
  document.getElementById("downloadLink").href=image;
  showPage(6);
}

// Feedback
function goToFeedback(){ window.location.href="https://aomporn1123hot-ux.github.io/Like/"; }
