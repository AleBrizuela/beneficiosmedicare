// Lead Capture Script for Beneficios Medicare & Medicare California
// Spreadsheet: AB Insurance Master.xlsx
// Routes each lead into one of 4 tabs based on age / existing-customer signal,
// and sends an instant email alert on every submission.
//
// SETUP NOTE: paste this whole file into the Apps Script editor (replacing
// Code.gs), then Deploy > Manage deployments > Edit (pencil icon) > New version
// > Deploy. Keep the SAME deployment (don't create a brand-new one) so the
// existing /exec URL hardcoded in contacto.html / contacto-en.html / widget-v4.html
// keeps working without touching the website code.

var SHEET_ID = '1loI6CIMJ9wt-zoFueE0tuhc0UsmD0OF1eulN_7rNu0k';

var TAB_CURRENT      = 'Current Leads';
var TAB_FUTURE       = 'Future Leads';
var TAB_EXISTING     = 'Existing Customers';
var TAB_APPOINTMENTS = 'Appointments & Bookings';

// Header row used when a tab has to be created because it doesn't exist yet.
var HEADER_ROW = ['Timestamp','First Name','Last Name','Phone','Email','ZIP','County',
  'State','DOB','Age','','Doctor Name','Doctor NPI','Meds/Conditions','Language',
  'Lead Type','Plan','Carrier','Source Site','Routed Tab'];

var NOTIFY_EMAILS = ['alejamedicare@gmail.com'];

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.openById(SHEET_ID);

    var now = new Date();
    var ts = Utilities.formatDate(now, 'America/Los_Angeles', 'M/d/yyyy H:mm');

    var firstName = data.firstName || '';
    var lastName = data.lastName || '';
    if (!firstName && data.name) {
      var parts = data.name.trim().split(/\s+/);
      firstName = parts[0] || '';
      lastName = parts.slice(1).join(' ') || '';
    }
    if (!firstName && data.fullName) {
      var parts2 = data.fullName.trim().split(/\s+/);
      firstName = parts2[0] || '';
      lastName = parts2.slice(1).join(' ') || '';
    }

    var dob = '';
    if (data.dob_month && data.dob_day) {
      dob = data.dob_month + '/' + data.dob_day;
      if (data.dob_year) dob += '/' + data.dob_year;
    } else if (data.dob) {
      dob = data.dob;
    }

    var age = '';
    if (data.dob_year && data.dob_month && data.dob_day) {
      var bd = new Date(parseInt(data.dob_year), parseInt(data.dob_month)-1, parseInt(data.dob_day));
      age = Math.floor((now - bd) / (365.25 * 24 * 60 * 60 * 1000));
    }

    var docName = data.docName || '';
    var docNPI = data.docNPI || '';
    var meds = '';
    if (data.medications) {
      meds = Array.isArray(data.medications) ? data.medications.join(', ') : data.medications;
    }
    var conditions = '';
    if (data.conditions) {
      conditions = Array.isArray(data.conditions) ? data.conditions.join(', ') : data.conditions;
    }

    var lang = data.lang || data.language || 'en';
    var leadType = data.leadType || data.type || 'enroll';
    var planName = data.selectedPlan || '';
    var carrier = '';
    if (planName) {
      var cm = planName.match(/^([\w\s]+?)(?:\s+(?:Senior|Medicare|Classic|Signature|Essential))/i);
      if (cm) carrier = cm[1].trim();
    }

    var source = data.source || data.site || 'unknown';

    var targetTab = routeToTab(data, age);

    var row = [
      ts, firstName, lastName, data.phone || '', data.email || '',
      data.zip || '', data.county || '', data.state || '',
      dob, age, '', docName, docNPI, meds || conditions,
      lang, leadType, planName, carrier, source, targetTab
    ];

    var sheet = getOrCreateTab(ss, targetTab);
    sheet.appendRow(row);

    sendNotification(data, firstName, lastName, ts, source, age, dob, targetTab);

    return ContentService.createTextOutput(JSON.stringify({status:'ok', tab: targetTab})).setMimeType(ContentService.MimeType.JSON);
  } catch(err) {
    return ContentService.createTextOutput(JSON.stringify({status:'error',msg:err.message})).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({status:'ok',msg:'Lead capture script is running'})).setMimeType(ContentService.MimeType.JSON);
}

// ── Routing ──────────────────────────────────────────────────────────────
// Best-effort classification from the fields the site actually sends.
// Existing Customers takes priority over age, since "I want to change my
// current plan" / "I already have a plan" implies they're already a
// policyholder regardless of how old they are.
//   - contacto.html sends data.topic = 'new' | 'change' | 'info' | 'other'
//     ('change' = "Quiero cambiar mi plan actual" / "I want to change my
//     current plan")
//   - widget-v4.html's "recently moved" flow sends data.curPlan =
//     'advantage' | 'medigap' | 'original' | 'unknown' when the person
//     already has an existing Medicare plan.
// Otherwise: age >= 64.5 (or a special-eligibility condition under 65,
// e.g. disability/ESRD/ALS flagged by data.under65) -> Current Leads.
// Age known and < 64.5 -> Future Leads. Age unknown and no other signal
// defaults to Future Leads (safer than assuming immediate eligibility).
function routeToTab(data, age) {
  if (data.topic === 'change' || data.curPlan) {
    return TAB_EXISTING;
  }
  if (data.under65) {
    return TAB_CURRENT; // disability/ESRD/ALS special-eligibility -> Medicare-eligible now
  }
  if (age !== '' && age !== null && !isNaN(age)) {
    return age >= 64.5 ? TAB_CURRENT : TAB_FUTURE;
  }
  return TAB_FUTURE;
}

function getOrCreateTab(ss, tabName) {
  var sheet = ss.getSheetByName(tabName);
  if (!sheet) {
    sheet = ss.insertSheet(tabName);
    sheet.appendRow(HEADER_ROW);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

// ── Email alert ──────────────────────────────────────────────────────────
function formTypeLabel(data) {
  if (data.topic === 'new') return 'Contact Form - New Enrollment';
  if (data.topic === 'change') return 'Contact Form - Plan Change';
  if (data.topic === 'info') return 'Contact Form - Info Request';
  if (data.topic === 'other') return 'Contact Form - Other';
  var lt = data.leadType || data.type;
  if (lt === 'enroll') return 'Widget - Help Me Decide';
  if (lt === 'help') return 'Widget - Consultation Request';
  if (lt === 'question') return 'Widget - Question/Call Request';
  if (lt === 'snooze') return 'Widget - Reminder Request';
  return 'Lead Form';
}

function siteLabel(source) {
  if (source === 'medicare-california') return 'MedicareCalifornia';
  if (source === 'beneficiosmedicare') return 'BeneficiosMedicare';
  return source;
}

function sendNotification(data, firstName, lastName, ts, source, age, dob, targetTab) {
  try {
    var fullName = (firstName + ' ' + lastName).trim() || 'Unknown';
    var formType = formTypeLabel(data);
    var site = siteLabel(source);
    var subject = '[NEW LEAD - ' + site + '] ' + fullName + ' - ' + formType;

    var ageDob = dob ? dob + (age !== '' ? ' (age ' + age + ')' : '') : (age !== '' ? 'age ' + age : 'N/A');

    var body = '<h2>New Medicare Lead</h2>'
      + '<p><b>Full Name:</b> ' + fullName + '</p>'
      + '<p><b>Phone:</b> ' + (data.phone || 'N/A') + '</p>'
      + '<p><b>Email:</b> ' + (data.email || 'N/A') + '</p>'
      + '<p><b>Site Source:</b> ' + site + '</p>'
      + '<p><b>Language:</b> ' + (data.lang || data.language || 'en') + '</p>'
      + '<p><b>Age/DOB:</b> ' + ageDob + '</p>'
      + '<p><b>Target Sheet Tab:</b> ' + targetTab + '</p>'
      + '<p><b>Form Type:</b> ' + formType + '</p>'
      + '<p><b>Time:</b> ' + ts + '</p>';

    for (var i = 0; i < NOTIFY_EMAILS.length; i++) {
      GmailApp.sendEmail(NOTIFY_EMAILS[i], subject, '', {htmlBody: body});
    }
  } catch(emailErr) {
    Logger.log('Email notification failed: ' + emailErr.message);
  }
}
