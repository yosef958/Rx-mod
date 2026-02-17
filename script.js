const openApplyBtn = document.getElementById('openApplyBtn');
const introCard = document.getElementById('introCard');
const applyCard = document.getElementById('applyCard');
const closeApply = document.getElementById('closeApply');

const applyForm = document.getElementById('applyForm');
const clearBtn = document.getElementById('clearBtn');
const submitBtn = document.getElementById('submitBtn');

const customAlert = document.getElementById('customAlert');

const fields = {
name: document.getElementById('name'),
age: document.getElementById('age'),
location: document.getElementById('location'),
experience: document.getElementById('experience'),
value: document.getElementById('value'),
discord: document.getElementById('discord')
};

let WEBHOOK_URL = null;
let WEBHOOK_NAME = null;
let WEBHOOK_AVATAR = null;

fetch('config.json')
.then(r => r.json())
.then(cfg => {
WEBHOOK_URL = cfg.webhook_url;
WEBHOOK_NAME = cfg.webhook_name;
WEBHOOK_AVATAR = cfg.webhook_avatar;
})
.catch(err => {
console.warn('خطأ بتحميل config.json أو لم يتم تعيين webhook_url:', err);
});

openApplyBtn.addEventListener('click', () => {

introCard.classList.add('hidden');
applyCard.classList.remove('hidden');
introCard.setAttribute('aria-hidden', 'true');
applyCard.setAttribute('aria-hidden', 'false');

setTimeout(() => fields.name.focus(), 160);
});

closeApply.addEventListener('click', () => {
applyCard.classList.add('hidden');
introCard.classList.remove('hidden');
applyCard.setAttribute('aria-hidden', 'true');
introCard.setAttribute('aria-hidden', 'false');
});

clearBtn.addEventListener('click', () => {
Object.values(fields).forEach(f => { f.value = ''; });

showTemporarySmallNotice('تم مسح الحقول');
});

function showTemporarySmallNotice(text) {
const el = document.createElement('div');
el.textContent = text;
el.style.position = 'fixed';
el.style.right = '20px';
el.style.bottom = '20px';
el.style.padding = '8px 12px';
el.style.background = 'rgba(7,10,30,0.9)';
el.style.border = '1px solid rgba(59,130,246,0.12)';
el.style.borderRadius = '10px';
el.style.color = '#fff';
el.style.boxShadow = '0 10px 30px rgba(2,6,23,0.6)';
el.style.zIndex = 99999;
document.body.appendChild(el);
setTimeout(() => el.remove(), 1800);
}

applyForm.addEventListener('submit', async (e) => {
e.preventDefault();

const payloadData = {
name: fields.name.value.trim(),
age: fields.age.value.trim(),
location: fields.location.value.trim(),
experience: fields.experience.value.trim(),
value: fields.value.value.trim(),
discord: fields.discord.value.trim()
};

for (const [k,v] of Object.entries(payloadData)) {
if (!v) {
showTemporarySmallNotice('اكمل كل الحقول من فضلك');
return;
}
}

if (!WEBHOOK_URL) {
showTemporarySmallNotice('يوجد خطأ في الويبهوك يرجى التأكد من صحته');
console.error('Webhook URL غير موجود في config.json');
return;
}

const now = new Date().toISOString();
const embed = {
title: "تقديم جديد",
color: 3447003, // لون الإيمبد هذا أزرق
fields: [
{ name: "الاسم", value: payloadData.name || '—', inline: true },
{ name: "العمر", value: payloadData.age || '—', inline: true },
{ name: "المكان", value: payloadData.location || '—', inline: true },
{ name: "اليوزر/الأيدي", value: payloadData.discord || '—', inline: true },
{ name: "الخبرات", value: payloadData.experience || '—', inline: false },
{ name: "سيسهم بـ", value: payloadData.value || '—', inline: false },
],
footer: { text: `مقدم عبر الموقع • ${now}` }
};

const body = {
username: WEBHOOK_NAME,
avatar_url: WEBHOOK_AVATAR,
embeds: [embed]
};

try {
submitBtn.disabled = true;
submitBtn.textContent = 'جاري الإرسال...';

const res = await fetch(WEBHOOK_URL, {  
  method: 'POST',  
  headers: { 'Content-Type': 'application/json' },  
  body: JSON.stringify(body)  
});  

if (!res.ok) {  
  throw new Error(`HTTP ${res.status}`);  
}  

Object.values(fields).forEach(f => { f.value = ''; });  

showCustomAlert();

} catch (err) {
console.error('خطأ بالإرسال:', err);
showTemporarySmallNotice('فشل الإرسال. تأكد من webhook أو جرب لاحقاً.');
} finally {
submitBtn.disabled = false;
submitBtn.textContent = 'إرسال التقديم';
}
});

function showCustomAlert() {
customAlert.classList.remove('hidden');

customAlert.classList.add('show');

setTimeout(() => {
customAlert.classList.remove('show');
customAlert.classList.add('hidden');
}, 9000);
   }
