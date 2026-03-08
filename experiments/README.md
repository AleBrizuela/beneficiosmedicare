# Widget Experiments (A/B Testing)

## How It Works

Each experiment is a **modular step** that can be injected into the widget flow via URL parameter.

### Running an Experiment

Add `&exp=EXPERIMENT_NAME` to the widget URL:

```
widget-v4.html?lang=en&exp=drug-names
widget-v4.html?lang=es&exp=drug-names
widget-v4.html?lang=en&theme=california&exp=drug-names&zip=90210
```

Multiple experiments can run simultaneously with comma separation:

```
widget-v4.html?lang=en&exp=drug-names,extended-priorities
```

### How Data Gets Tagged

Every lead submitted while an experiment is active includes:

```json
{
  "experiment": "drug-names",
  "experimentData": { "medications": ["metformin", "lisinopril"] }
}
```

This lets you filter the LEAD spreadsheet by experiment name to compare conversion rates.

### Experiment Lifecycle

1. **IDEA** - documented in this folder with hypothesis
2. **READY** - code module written and tested locally
3. **LIVE** - activated via URL param on one or both sites
4. **COMPLETE** - results analyzed, decision made (keep/discard/iterate)

### Folder Structure

```
experiments/
  README.md              <- This file
  registry.json          <- Master list of all experiments
  drug-names/
    EXPERIMENT.md        <- Hypothesis, metrics, how to activate
    module.js            <- Self-contained step code (CSS + HTML + JS)
  [future-experiment]/
    EXPERIMENT.md
    module.js
```

### Creating a New Experiment

1. Create a folder: `experiments/my-experiment/`
2. Write `EXPERIMENT.md` with hypothesis and success metrics
3. Write `module.js` exporting a step function
4. Add entry to `registry.json`
5. Wire it into widget-v4.html's experiment loader

### Integration Point in Widget

The widget checks for `?exp=` param at load time. Each experiment name maps to a step function that gets injected into the flow at a specific point (after health conditions, before results, etc.).

The core flow is:

```
ZIP -> DOB -> Enrollment Window -> Health Conditions -> [EXPERIMENT STEPS] -> Results -> Contact -> Submit
```

Experiments slot into the `[EXPERIMENT STEPS]` position or can replace existing steps.
