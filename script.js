const GRADES = {
  "A+": 4.0,
  "A":  4.0,
  "A-": 3.7,
  "B+": 3.3,
  "B":  3.0,
  "B-": 2.7,
  "C+": 2.3,
  "C":  2.0,
  "C-": 1.7,
  "D+": 1.3,
  "D":  1.0,
  "F":  0.0,
};
 
const GPA_LABELS = [
  { min: 3.7, label: "Dean's List 🏆", color: "#c8f560" },
  { min: 3.3, label: "Great Standing 🎉", color: "#8fff6e" },
  { min: 2.7, label: "Good Standing 👍", color: "#60d0f5" },
  { min: 2.0, label: "Satisfactory ✔️", color: "#f5c860" },
  { min: 1.0, label: "Needs Improvement ⚠️", color: "#ff9a5c" },
  { min: 0.0, label: "At Risk ❌", color: "#ff5c5c" },
];
 
let courseCount = 0;
 
const courseList = document.getElementById("course-list");
const addBtn = document.getElementById("add-btn");
const calcBtn = document.getElementById("calc-btn");
const resetBtn = document.getElementById("reset-btn");
const gpaDisplay = document.getElementById("gpa-display");
const gpaTag = document.getElementById("gpa-tag");
const resultCard = document.getElementById("result-card");
 
function createGradeOptions() {
  return Object.keys(GRADES)
    .map(g => `<option value="${g}">${g}</option>`)
    .join("");
}
 
function addCourse(name = "", credits = "3", grade = "A") {
  courseCount++;
  const id = `course-${courseCount}`;
 
  const row = document.createElement("div");
  row.classList.add("course-row");
  row.id = id;
 
  row.innerHTML = `
    <input type="text" placeholder="e.g. Calculus I" value="${name}" aria-label="Course name" />
    <input type="number" min="1" max="6" value="${credits}" aria-label="Credits" />
    <select aria-label="Grade">${createGradeOptions()}</select>
    <button class="remove-btn" aria-label="Remove course">✕</button>
  `;
 
  // Set the selected grade
  row.querySelector("select").value = grade;
 
  // Remove button
  row.querySelector(".remove-btn").addEventListener("click", () => {
    row.style.animation = "none";
    row.style.opacity = "0";
    row.style.transform = "translateX(10px)";
    row.style.transition = "opacity 0.2s, transform 0.2s";
    setTimeout(() => row.remove(), 200);
  });
 
  courseList.appendChild(row);
}
 
function calculateGPA() {
  const rows = courseList.querySelectorAll(".course-row");
 
  if (rows.length === 0) {
    shake(resultCard);
    gpaDisplay.textContent = "—";
    gpaTag.textContent = "Add some courses first!";
    resultCard.classList.remove("glow");
    return;
  }
 
  let totalPoints = 0;
  let totalCredits = 0;
  let valid = true;
 
  rows.forEach(row => {
    const credits = parseFloat(row.querySelector("input[type=number]").value);
    const gradeKey = row.querySelector("select").value;
 
    if (!credits || credits <= 0 || !GRADES.hasOwnProperty(gradeKey)) {
      valid = false;
      return;
    }
 
    totalPoints += GRADES[gradeKey] * credits;
    totalCredits += credits;
  });
 
  if (!valid || totalCredits === 0) {
    gpaDisplay.textContent = "—";
    gpaTag.textContent = "Check your inputs!";
    return;
  }
 
  const gpa = totalPoints / totalCredits;
  const rounded = gpa.toFixed(2);
 
  // Animate display
  gpaDisplay.classList.remove("pop");
  void gpaDisplay.offsetWidth; // reflow
  gpaDisplay.classList.add("pop");
  setTimeout(() => gpaDisplay.classList.remove("pop"), 300);
 
  gpaDisplay.textContent = rounded;
  resultCard.classList.add("glow");
 
  // Label
  const labelObj = GPA_LABELS.find(l => gpa >= l.min) || GPA_LABELS[GPA_LABELS.length - 1];
  gpaTag.textContent = labelObj.label;
  gpaDisplay.style.color = labelObj.color;
}
 
function shake(el) {
  el.style.animation = "none";
  void el.offsetWidth;
  el.style.animation = "shake 0.4s ease";
}
 
// Inject shake keyframes
const style = document.createElement("style");
style.textContent = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    20% { transform: translateX(-8px); }
    40% { transform: translateX(8px); }
    60% { transform: translateX(-5px); }
    80% { transform: translateX(5px); }
  }
`;
document.head.appendChild(style);
 
function reset() {
  courseList.innerHTML = "";
  courseCount = 0;
  gpaDisplay.textContent = "—";
  gpaDisplay.style.color = "var(--accent)";
  gpaTag.textContent = "";
  resultCard.classList.remove("glow");
  addCourse();
  addCourse();
  addCourse();
}
 
// Events
addBtn.addEventListener("click", () => addCourse());
calcBtn.addEventListener("click", calculateGPA);
resetBtn.addEventListener("click", reset);
 
// Init with 3 default rows
addCourse("Introduction to CS", "3", "A");
addCourse("Calculus I", "3", "B+");
addCourse("English Composition", "2", "A-");
 