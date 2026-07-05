// ── ShopZone Auth — OTP (sessionStorage, no permanent storage) ───────────────

function isLoggedIn(){ try{ return !!JSON.parse(sessionStorage.getItem('sz_user')||'null')?.mobile; }catch{ return false; } }
function getUser(){ try{ return JSON.parse(sessionStorage.getItem('sz_user')||'null'); }catch{ return null; } }
function loginUser(name,mobile){ sessionStorage.setItem('sz_user',JSON.stringify({name,mobile})); sessionStorage.removeItem('sz_otp'); sessionStorage.removeItem('sz_otp_mobile'); }
function logoutUser(){ sessionStorage.removeItem('sz_user'); sessionStorage.removeItem('sz_otp'); sessionStorage.removeItem('sz_otp_mobile'); }

// Generate OTP — calls real API if configured, else demo fallback
async function generateOTP(mobile){
  const otp=String(Math.floor(100000+Math.random()*900000));
  sessionStorage.setItem('sz_otp',otp);
  sessionStorage.setItem('sz_otp_mobile',mobile);

  // ── Real OTP API (replace URL/key in admin Site Settings) ──
  // The API endpoint and key come from your SMS provider (e.g. Fast2SMS, 2Factor, MSG91)
  // Admin can set otp_api_url and otp_api_key in Admin Panel → Store Settings
  try{
    const cfgRes=await fetch('/api/config');
    const cfgData=await cfgRes.json();
    const apiUrl=cfgData?.config?.otp_api_url;
    const apiKey=cfgData?.config?.otp_api_key;

    if(apiUrl && apiUrl!=='https://api.example.com/send-otp' && apiKey && apiKey!=='YOUR_OTP_API_KEY_HERE'){
      // POST to your SMS API — adjust body format as per your provider
      await fetch(apiUrl,{
        method:'POST',
        headers:{'Content-Type':'application/json','Authorization':'Bearer '+apiKey},
        body:JSON.stringify({ mobile:'+91'+mobile, otp, message:`Your ShopZone OTP is ${otp}. Valid for 10 minutes.` })
      });
      console.log('[ShopZone] OTP sent via SMS API to +91'+mobile);
      return otp;
    }
  }catch(e){ console.warn('[ShopZone] SMS API call failed, using demo OTP',e.message); }

  // ── Demo fallback — show on screen ──
  console.log(`[ShopZone Demo] OTP for +91${mobile}: ${otp}`);
  return otp;
}

function verifyOTP(input){ const s=sessionStorage.getItem('sz_otp'); return s&&s===input.trim(); }

// ── Auth Popup ────────────────────────────────────────────────────────────────
function showAuthPopup(onSuccess){
  if(isLoggedIn()){ if(onSuccess)onSuccess(); return; }
  document.getElementById('authPopup')?.remove();
  const isHi=getLang?getLang()==='hi':false;

  const popup=document.createElement('div');
  popup.id='authPopup';
  popup.innerHTML=`
  <div class="auth-overlay" onclick="closeAuthPopup()"></div>
  <div class="auth-popup-box">
    <button class="auth-popup-close" onclick="closeAuthPopup()">✕</button>
    <div class="auth-popup-logo"><img src="/images/logo.png" alt="ShopZone"></div>

    <!-- Step 1: Name + Mobile -->
    <div id="authS1">
      <h2 class="auth-popup-title">${isHi?'साइन इन करें या अकाउंट बनाएं':'Sign in or create account'}</h2>
      <p class="auth-popup-sub">${isHi?'मोबाइल नंबर दर्ज करें':'Enter mobile number'}</p>
      <div class="form-group">
        <label>${isHi?'पूरा नाम':'Full Name'}</label>
        <input type="text" id="aName" placeholder="${isHi?'अपना नाम':'Your name'}" style="width:100%;padding:10px 12px;border:1.5px solid #ddd;border-radius:4px;font-size:14px;margin-bottom:10px;outline:none;">
      </div>
      <div class="form-group">
        <label>${isHi?'मोबाइल नंबर या ईमेल एंटर करें':'Mobile number or Email'}</label>
        <input type="tel" id="aMobile" maxlength="10" placeholder="${isHi?'10 अंकों का नंबर':'10-digit number'}" style="width:100%;padding:10px 12px;border:1.5px solid #ddd;border-radius:4px;font-size:14px;outline:none;" onkeydown="if(event.key==='Enter')sendOTP_popup()">
      </div>
      <button class="submit-btn" onclick="sendOTP_popup()">${isHi?'जारी रखें':'Continue'}</button>
      <div style="font-size:11px;color:var(--muted);text-align:center;margin-top:10px;">${isHi?'जारी रखकर, आप हमारी शर्तों से सहमत हैं':'By continuing, you agree to our Terms & Conditions'}</div>
      <hr style="margin:14px 0;border-color:#eee;">
      <div style="font-size:12px;color:var(--muted);text-align:center;">${isHi?'काम के लिए खरीदना?':'Buying for work?'}</div>
      <div style="text-align:center;"><a href="#" style="color:var(--link);font-size:12px;">${isHi?'फ्री बिज़नेस अकाउंट बनाएं':'Create a free business account'}</a></div>
    </div>

    <!-- Step 2: OTP -->
    <div id="authS2" style="display:none;">
      <button class="auth-back-btn" onclick="document.getElementById('authS1').style.display='block';document.getElementById('authS2').style.display='none';">← ${isHi?'वापस':'Back'}</button>
      <h2 class="auth-popup-title">OTP ${isHi?'सत्यापन':'Verification'}</h2>
      <p class="auth-popup-sub" id="aOtpSub"></p>
      <div id="aOtpDemo" style="background:#fff3cd;border:1px solid #f59e0b;border-radius:4px;padding:10px;margin-bottom:12px;font-size:13px;text-align:center;"></div>
      <div class="form-group">
        <label>OTP ${isHi?'दर्ज करें':'Enter'}</label>
        <input type="text" id="aOtp" maxlength="6" placeholder="● ● ● ● ● ●" style="width:100%;padding:10px;border:1.5px solid #ddd;border-radius:4px;font-size:22px;letter-spacing:10px;text-align:center;outline:none;" onkeydown="if(event.key==='Enter')verifyOTP_popup()">
      </div>
      <button class="submit-btn" onclick="verifyOTP_popup()">${isHi?'सत्यापित करें और लॉगिन करें':'Verify & Login'}</button>
      <div style="text-align:center;margin-top:10px;">
        <button onclick="resendOTP_popup()" style="color:var(--link);font-size:13px;background:none;border:none;cursor:pointer;">${isHi?'OTP दोबारा भेजें':'Resend OTP'}</button>
      </div>
    </div>
  </div>`;
  document.body.appendChild(popup);
  popup._cb=onSuccess;
  setTimeout(()=>document.getElementById('aName')?.focus(),100);
}

function closeAuthPopup(){ document.getElementById('authPopup')?.remove(); }

async function sendOTP_popup(){
  const isHi=getLang?getLang()==='hi':false;
  const name=document.getElementById('aName').value.trim();
  const mob=document.getElementById('aMobile').value.trim().replace(/\D/g,'');
  if(!name){ alert(isHi?'कृपया नाम दर्ज करें':'Please enter your name'); return; }
  if(mob.length!==10){ alert(isHi?'सही 10 अंकों का मोबाइल नंबर दर्ज करें':'Enter valid 10-digit mobile'); return; }
  const otp=await generateOTP(mob);
  document.getElementById('authS1').style.display='none';
  document.getElementById('authS2').style.display='block';
  document.getElementById('aOtpSub').textContent=(isHi?'OTP भेजा गया +91 ':'OTP sent to +91 ')+mob;
  document.getElementById('aOtpDemo').innerHTML=`📱 <strong>${isHi?'डेमो OTP':'Demo OTP'}:</strong> <span style="font-size:20px;font-weight:800;letter-spacing:4px;">${otp}</span><br><small style="color:#565959;">${isHi?'(Real app में SMS द्वारा आएगा)':'(In production this comes via SMS API)'}</small>`;
  setTimeout(()=>document.getElementById('aOtp')?.focus(),100);
}

async function resendOTP_popup(){
  const mob=sessionStorage.getItem('sz_otp_mobile')||'';
  if(!mob){ document.getElementById('authS1').style.display='block'; document.getElementById('authS2').style.display='none'; return; }
  const otp=await generateOTP(mob);
  document.getElementById('aOtpDemo').innerHTML=`📱 <strong>OTP:</strong> <span style="font-size:20px;font-weight:800;letter-spacing:4px;">${otp}</span>`;
  if(typeof showToast==='function') showToast('OTP resent!');
}

function verifyOTP_popup(){
  const isHi=getLang?getLang()==='hi':false;
  const otp=document.getElementById('aOtp').value.trim();
  if(!verifyOTP(otp)){ alert(isHi?'गलत OTP. दोबारा कोशिश करें':'Invalid OTP. Please try again.'); return; }
  const name=document.getElementById('aName')?.value.trim()||'User';
  const mob=sessionStorage.getItem('sz_otp_mobile')||'';
  loginUser(name,mob);
  closeAuthPopup();
  if(typeof showToast==='function') showToast((isHi?'✓ स्वागत है, ':'✓ Welcome, ')+name+'!');
  if(typeof updateProfileLabel==='function') updateProfileLabel();
  const popup=document.getElementById('authPopup');
  const cb=popup?popup._cb:null;
  if(cb) cb();
  else if(window._authCallback){ window._authCallback(); window._authCallback=null; }
}
