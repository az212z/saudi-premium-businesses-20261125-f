// Preview build: no storage, no network calls of our own. The floating WhatsApp button links to the centre's verified WhatsApp Business number.
const WA = ""; // set to "966562356957" after approval to send booking requests directly
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const ar = (n) => Number(n).toLocaleString("ar-SA");

document.querySelectorAll("input[type=date]").forEach((d) => {
  const toText = () => { if (!d.value) { d.type = "text"; d.placeholder = "اختر التاريخ"; } };
  d.addEventListener("focus", () => { if (d.type !== "date") { d.type = "date"; try { d.showPicker(); } catch {} } });
  d.addEventListener("blur", toText); toText();
});
const io = "IntersectionObserver" in window && !reduce ? new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { rootMargin: "0px 0px -8% 0px" }) : null;
document.querySelectorAll(".reveal").forEach((el) => (io ? io.observe(el) : el.classList.add("in")));

// Readiness checklist (general guidance)
const SKILLS = [
  ["ar", "يميّز الحروف العربية", "التعرّف على الحروف العربية وأصواتها"],
  ["name", "يكتب اسمه", "كتابة الاسم ومسك القلم بشكل صحيح"],
  ["count", "يعدّ حتى ٢٠", "العدّ والأرقام حتى ٢٠"],
  ["en", "يعرف حروفاً إنجليزية", "أساسيات الحروف الإنجليزية"],
  ["steps", "ينفّذ تعليمات من خطوتين", "الاستماع وتنفيذ التعليمات"],
  ["self", "يعتمد على نفسه في الأكل واللبس", "الاستقلالية والعناية الذاتية"],
];
const box = document.getElementById("skills"), focus = document.getElementById("focus"), arc = document.getElementById("arc"), pct = document.getElementById("pct");
SKILLS.forEach(([id, label]) => {
  const l = document.createElement("label");
  const c = Object.assign(document.createElement("input"), { type: "checkbox", name: "sk", value: id });
  c.addEventListener("change", update);
  l.append(c, document.createTextNode(label)); box.append(l);
});
function update() {
  const on = new Set([...box.querySelectorAll("input:checked")].map((i) => i.value));
  const p = Math.round((on.size / SKILLS.length) * 100);
  pct.textContent = `${ar(p)}٪`;
  arc.style.strokeDashoffset = String(326.7 * (1 - p / 100));
  const todo = SKILLS.filter(([id]) => !on.has(id));
  focus.replaceChildren(...(todo.length ? todo.map(([, , f]) => Object.assign(document.createElement("li"), { textContent: f }))
    : [Object.assign(document.createElement("li"), { textContent: "طفلك متقدّم! نكمل معه بأنشطة تثري مهاراته.", className: "done" })]));
}
update();

// Open-now: Sun–Thu 07:00–21:00 (Google Maps listing)
const now = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Riyadh" }));
const d = now.getDay(), m = now.getHours() * 60 + now.getMinutes(), st = document.getElementById("status"), stt = document.getElementById("st");
const work = d >= 0 && d <= 4;
if (work && m >= 420 && m < 1260) { st.classList.add("open"); stt.textContent = "المركز مفتوح الآن · حتى ٩ مساءً"; }
else { st.classList.add("closed"); stt.textContent = "المركز مغلق الآن · الدوام الأحد إلى الخميس ٧ص – ٩م"; }

// Visit request → WhatsApp preview
const vf = document.getElementById("vf");
vf.addEventListener("submit", (e) => {
  e.preventDefault();
  const day = vf.elements.day, err = document.getElementById("err");
  if (!day.value) { err.hidden = false; day.setAttribute("aria-invalid", "true"); day.focus(); return; }
  err.hidden = true; day.removeAttribute("aria-invalid");
  const dd = new Date(day.value + "T12:00").toLocaleDateString("ar-SA-u-ca-gregory", { weekday: "long", day: "numeric", month: "long" });
  const lines = ["السلام عليكم، أبغى أحجز زيارة لمركز كنف.", `عمر الطفل: ${vf.elements.age.value}`, `اليوم: ${dd}`, `الوقت: ${vf.elements.time.value}`];
  if (vf.elements.att.checked) {
    const have = SKILLS.filter(([id]) => box.querySelector(`input[value=${id}]:checked`)).map(([, l]) => l);
    lines.push(`مهارات طفلي الحالية: ${have.length ? have.join("، ") : "لم أحدد بعد"}`);
  }
  const msg = lines.join("\n");
  if (WA) { window.open(`https://wa.me/${WA}?text=${encodeURIComponent(msg)}`, "_blank", "noopener"); return; }
  document.getElementById("msg").textContent = msg;
  const o = document.getElementById("out"); o.hidden = false; o.scrollIntoView({ block: "nearest", behavior: reduce ? "auto" : "smooth" });
});
