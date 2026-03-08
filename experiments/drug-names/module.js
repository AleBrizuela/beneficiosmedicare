/**
 * EXPERIMENT: drug-names
 * Medication Checklist Step
 *
 * Inserts after health conditions step. Shows a categorized checklist
 * of 25 common Medicare drugs (targeted at Latino 65+ population).
 *
 * Activate: ?exp=drug-names
 *
 * Preserved from widget.html v3 (commit b8243d5), adapted for widget-v4 architecture.
 */

// ── DRUG DATABASE ──
// 25 most prescribed for Medicare beneficiaries (esp. Latino population)
// Ordered by prevalence in Latino 65+ Medicare population
const DRUG_DB = [
  // Diabetes (~50% of Latinos age 70-74)
  {id:'metformin', brand:'Glucophage', es:'Metformina', cat_en:'Diabetes', cat_es:'Diabetes'},
  {id:'insulin_glargine', brand:'Lantus', es:'Insulina Glargina', cat_en:'Diabetes', cat_es:'Diabetes'},
  {id:'semaglutide', brand:'Ozempic', es:'Semaglutida', cat_en:'Diabetes', cat_es:'Diabetes'},
  {id:'glipizide', brand:'Glucotrol', es:'Glipizida', cat_en:'Diabetes', cat_es:'Diabetes'},
  // Blood Pressure
  {id:'lisinopril', brand:'Prinivil', es:'Lisinopril', cat_en:'Blood Pressure', cat_es:'Presion'},
  {id:'amlodipine', brand:'Norvasc', es:'Amlodipina', cat_en:'Blood Pressure', cat_es:'Presion'},
  {id:'losartan', brand:'Cozaar', es:'Losartan', cat_en:'Blood Pressure', cat_es:'Presion'},
  {id:'hydrochlorothiazide', brand:'HCTZ', es:'Hidroclorotiazida', cat_en:'Blood Pressure', cat_es:'Presion'},
  // Cholesterol
  {id:'atorvastatin', brand:'Lipitor', es:'Atorvastatina', cat_en:'Cholesterol', cat_es:'Colesterol'},
  {id:'rosuvastatin', brand:'Crestor', es:'Rosuvastatina', cat_en:'Cholesterol', cat_es:'Colesterol'},
  // Heart
  {id:'metoprolol', brand:'Lopressor', es:'Metoprolol', cat_en:'Heart', cat_es:'Corazon'},
  // Blood Thinner
  {id:'apixaban', brand:'Eliquis', es:'Apixaban', cat_en:'Blood Thinner', cat_es:'Sangre'},
  {id:'warfarin', brand:'Coumadin', es:'Warfarina', cat_en:'Blood Thinner', cat_es:'Sangre'},
  // Stomach
  {id:'omeprazole', brand:'Prilosec', es:'Omeprazol', cat_en:'Stomach', cat_es:'Estomago'},
  {id:'pantoprazole', brand:'Protonix', es:'Pantoprazol', cat_en:'Stomach', cat_es:'Estomago'},
  // Thyroid
  {id:'levothyroxine', brand:'Synthroid', es:'Levotiroxina', cat_en:'Thyroid', cat_es:'Tiroides'},
  // Diuretic
  {id:'furosemide', brand:'Lasix', es:'Furosemida', cat_en:'Diuretic', cat_es:'Retencion liquidos'},
  // Pain & Nerve
  {id:'gabapentin', brand:'Neurontin', es:'Gabapentina', cat_en:'Nerve Pain', cat_es:'Dolor nervios'},
  {id:'tramadol', brand:'Ultram', es:'Tramadol', cat_en:'Pain', cat_es:'Dolor'},
  {id:'acetaminophen_hydrocodone', brand:'Norco', es:'Acetaminofen/Hidrocodona', cat_en:'Pain', cat_es:'Dolor'},
  // Respiratory
  {id:'albuterol', brand:'ProAir', es:'Albuterol', cat_en:'Respiratory', cat_es:'Pulmones'},
  {id:'montelukast', brand:'Singulair', es:'Montelukast', cat_en:'Respiratory', cat_es:'Pulmones'},
  // Mental Health
  {id:'sertraline', brand:'Zoloft', es:'Sertralina', cat_en:'Depression', cat_es:'Depresion'},
  {id:'escitalopram', brand:'Lexapro', es:'Escitalopram', cat_en:'Anxiety', cat_es:'Ansiedad'},
  {id:'alprazolam', brand:'Xanax', es:'Alprazolam', cat_en:'Anxiety', cat_es:'Ansiedad'},
];

// ── CSS ──
const DRUG_CSS = `
.drug-checklist{max-height:340px;overflow-y:auto;border:1px solid var(--border);border-radius:8px;margin:8px 0}
.drug-cat-hdr{padding:8px 12px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;color:var(--gray);background:#f8f9fa;border-bottom:1px solid var(--border);position:sticky;top:0;z-index:1}
.drug-row{display:flex;align-items:center;padding:10px 12px;border-bottom:1px solid #f0f0f0;cursor:pointer;transition:background 0.15s}
.drug-row:hover{background:#f0f8ff}
.drug-row.checked{background:#e6f7ee}
.drug-row input{width:18px;height:18px;margin-right:10px;accent-color:var(--teal);flex-shrink:0}
.drug-label strong{color:var(--dark)}
.drug-label span{color:#888;font-size:13px;margin-left:4px}
.drug-count{text-align:center;font-size:13px;color:var(--gray);margin:4px 0}
`;

// ── STEP FUNCTION ──
// Call this from the widget flow. Pass the current lang, D object, and next callback.
// Example: expDrugNames(lang, D, () => go(flowResults));
function expDrugNames(lang, D, nextCallback) {
  const isES = lang === 'es';

  // Inject CSS once
  if (!document.getElementById('exp-drug-css')) {
    const style = document.createElement('style');
    style.id = 'exp-drug-css';
    style.textContent = DRUG_CSS;
    document.head.appendChild(style);
  }

  const selected = new Set();
  let lastCat = '';

  let html = `<div class="bot-msg">${isES ? 'Que medicinas toma? (Seleccione todas las que aplican)' : 'What medications do you take? (Select all that apply)'}</div>`;
  html += '<div class="drug-checklist">';

  DRUG_DB.forEach(drug => {
    const cat = isES ? drug.cat_es : drug.cat_en;
    if (cat !== lastCat) {
      html += `<div class="drug-cat-hdr">${cat}</div>`;
      lastCat = cat;
    }
    html += `<label class="drug-row" data-id="${drug.id}">
      <input type="checkbox" onchange="toggleDrug(this,'${drug.id}')">
      <span class="drug-label"><strong>${drug.brand}</strong> <span>(${isES ? drug.es : drug.id.replace(/_/g,' ')})</span></span>
    </label>`;
  });

  html += '</div>';
  html += `<div class="drug-count" id="drug-count">${isES ? '0 medicinas seleccionadas' : '0 medications selected'}</div>`;
  html += `<button class="btn-p" onclick="confirmDrugs()">${isES ? 'Continuar' : 'Continue'}</button>`;
  html += `<div style="text-align:center;margin-top:6px"><button class="btn-skip" onclick="skipDrugs()" style="background:none;border:none;color:var(--gray);font-size:13px;cursor:pointer;text-decoration:underline">${isES ? 'No tomo medicinas / Saltar' : 'I don\'t take any / Skip'}</button></div>`;

  document.getElementById('wb').innerHTML = html;

  // Make functions available globally for onclick handlers
  window._drugSelected = selected;
  window._drugLang = lang;
  window._drugNext = nextCallback;
  window._drugD = D;

  window.toggleDrug = function(cb, id) {
    const row = cb.closest('.drug-row');
    if (cb.checked) { selected.add(id); row.classList.add('checked'); }
    else { selected.delete(id); row.classList.remove('checked'); }
    const countEl = document.getElementById('drug-count');
    if (countEl) {
      countEl.textContent = isES
        ? `${selected.size} medicinas seleccionadas`
        : `${selected.size} medication${selected.size !== 1 ? 's' : ''} selected`;
    }
  };

  window.confirmDrugs = function() {
    const meds = [...selected];
    D.medications = meds;
    D.experiment = 'drug-names';
    D.experimentData = { medications: meds, medicationBrands: meds.map(id => {
      const d = DRUG_DB.find(x => x.id === id);
      return d ? d.brand : id;
    })};
    nextCallback();
  };

  window.skipDrugs = function() {
    D.medications = [];
    D.experiment = 'drug-names';
    D.experimentData = { medications: [], skipped: true };
    nextCallback();
  };
}
