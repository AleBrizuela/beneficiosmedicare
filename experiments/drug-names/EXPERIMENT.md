# Experiment: Medication Checklist (drug-names)

## Hypothesis

Asking users to select their specific brand-name medications will:
- Increase lead quality (agents know exactly what drugs to check formularies for)
- Improve agent conversion rate (more prepared, more personalized first call)
- May slightly reduce completion rate (extra step = more friction)

## What It Does

After the health conditions step, shows a categorized checklist of 25 common Medicare medications (targeted at Latino 65+ population). Users can check the ones they take. The selections are sent with the lead data as `experimentData.medications`.

Drug categories: Diabetes, Blood Pressure, Cholesterol, Heart, Blood Thinner, Stomach, Thyroid, Diuretic, Pain/Nerve, Respiratory, Mental Health.

## How to Activate

Add `&exp=drug-names` to any widget URL:

```
https://beneficiosmedicare.com/widget-v4.html?lang=es&exp=drug-names
https://beneficiosmedicare.com/widget-v4.html?lang=en&theme=california&exp=drug-names&zip=90210
```

## Success Metrics

| Metric | Control (no drugs) | Target (with drugs) |
|--------|-------------------|---------------------|
| Completion rate | baseline | within 5% of baseline |
| Lead quality (agent rating) | baseline | +20% improvement |
| Time to first appointment | baseline | -15% faster |

## Measuring Results

Filter the LEAD spreadsheet by `experiment` column:
- Rows with `experiment = "drug-names"` are test group
- Rows without are control group
- Compare conversion rates over 2-4 week period

## Origin

Preserved from widget.html (v3), commit b8243d5. The original had a full autosuggest dropdown with brand/generic/Spanish names. Simplified here to a checklist for faster UX.
