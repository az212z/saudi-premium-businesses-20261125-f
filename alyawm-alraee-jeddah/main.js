// Preview build: no storage, no network calls of our own. The floating WhatsApp button links to the centre's verified WhatsApp Business number.
const WA = ""; // set to "966505670718" after approval to send visit requests directly
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

document.querySelectorAll("input[type=date]").forEach((d) => {
  const toText = () => { if (!d.value) { d.type = "text"; d.placeholder = "اختر التاريخ"; } };
  d.addEventListener("focus", () => { if (d.type !== "date") { d.type = "date"; try { d.showPicker(); } catch {} } });
  d.addEventListener("blur", toText); toText();
});
const io = "IntersectionObserver" in window && !reduce ? new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { rootMargin: "0px 0px -8% 0px" }) : null;
document.querySelectorAll(".reveal").forEach((el) => (io ? io.observe(el) : el.classList.add("in")));

// Parent priorities → paraphrased themes from public Google reviews (not verbatim quotes)
const THEMES = {
  safe: ["الأمان", "بيئة آمنة ومريحة", "يذكر الأهالي أنهم يشعرون بالاطمئنان وهم يتركون أطفالهم، وأن البيئة مناسبة للأطفال وآمنة."],
  clean: ["النظافة", "مكان مرتّب ونظيف", "تتكرر الإشارة إلى أن المكان مرتّب ونظيف ومريح من أول زيارة."],
  teachers: ["المعلمات", "اهتمام وحنان", "يصف الأهالي المعلمات بالاهتمام والصبر والحرص على أدق تفاصيل الطفل."],
  manners: ["الأخلاق والتعامل", "تعامل راقٍ", "يمتدح الأهالي حسن التعامل والأدب والأخلاق مع الأطفال."],
  welcome: ["الاستقبال", "تجاوب سريع", "يذكر الأهالي أن الاستقبال بشوش ومتجاوب منذ أول تواصل."],
};
const sel = new Set(["safe", "teachers"]);
const chips = document.getElementById("chips"), said = document.getElementById("said");
Object.entries(THEMES).forEach(([k, [label]]) => {
  const b = Object.assign(document.createElement("button"), { type: "button", textContent: label });
  b.setAttribute("aria-pressed", String(sel.has(k)));
  b.addEventListener("click", () => { sel.has(k) ? sel.delete(k) : sel.add(k); b.setAttribute("aria-pressed", String(sel.has(k))); render(); });
  chips.append(b);
});
function render() {
  if (!sel.size) { said.replaceChildren(Object.assign(document.createElement("p"), { className: "empty", textContent: "اختر أولوية واحدة على الأقل." })); return; }
  said.replaceChildren(...[...sel].map((k) => {
    const [, t, d] = THEMES[k]; const a = document.createElement("article");
    a.append(Object.assign(document.createElement("h3"), { textContent: t }), Object.assign(document.createElement("p"), { textContent: d }));
    return a;
  }));
}
render();

// Open-now: Sun–Thu 07:00–20:00 (Google Maps listing)
const now = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Riyadh" }));
const d = now.getDay(), m = now.getHours() * 60 + now.getMinutes(), st = document.getElementById("status"), stt = document.getElementById("st");
if (d <= 4 && m >= 420 && m < 1200) { st.classList.add("open"); stt.textContent = "المركز مفتوح الآن · حتى ٨ مساءً"; }
else { st.classList.add("closed"); stt.textContent = "المركز مغلق الآن · الدوام الأحد – الخميس ٧ص – ٨م"; }

// Visit request → WhatsApp preview
const vf = document.getElementById("vf");
vf.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = vf.elements.name.value.trim(), day = vf.elements.day, err = document.getElementById("err");
  if (!name || !day.value) { err.hidden = false; (name ? day : vf.elements.name).focus(); return; }
  err.hidden = true;
  const dd = new Date(day.value + "T12:00").toLocaleDateString("ar-SA-u-ca-gregory", { weekday: "long", day: "numeric", month: "long" });
  const pri = [...sel].map((k) => THEMES[k][0]).join("، ");
  const msg = ["السلام عليكم، أبغى أحجز زيارة لمركز اليوم الرائع.", `ولي الأمر: ${name}`, `عمر الطفل: ${vf.elements.age.value}`, `يوم الزيارة: ${dd}`, pri ? `أهم ما يهمني: ${pri}` : null].filter(Boolean).join("\n");
  if (WA) { window.open(`https://wa.me/${WA}?text=${encodeURIComponent(msg)}`, "_blank", "noopener"); return; }
  document.getElementById("msg").textContent = msg;
  const o = document.getElementById("out"); o.hidden = false; o.scrollIntoView({ block: "nearest", behavior: reduce ? "auto" : "smooth" });
});
