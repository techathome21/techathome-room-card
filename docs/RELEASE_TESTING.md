# Release test plan: entities controls

Target branch: `main`
Release version: `2.2.0`

## Install in staging

1. Copy `techathome-room-card.js` from the release to the staging Home Assistant
   `/config/www/` directory.
2. Register or update the Lovelace resource to use
   `/local/techathome-room-card.js?v=2.2.0` as a JavaScript module.
3. Reload the dashboard in a fresh browser tab. If the old source remains visible,
   clear the staging dashboard/app cache and reload.
4. Add the configuration from `examples/entities-controls.yaml`, replacing the
   example entity IDs with entities available in staging.

`card-mod` must be installed to reproduce the compact appearance of the
original manual entities card.

No Home Assistant restart should be required for a frontend-only resource update.

## Acceptance checks

### Compatibility and existing features

- Load one existing v2.1.0 card without `controls_type`; its controls must look and
  behave exactly like the original quick buttons.
- Repeat with `controls_type: buttons`; the result must be identical.
- Confirm cover percentages/icons still render.
- Tap only the card background once; the configured `navigation_path` must open.
- Double-tap only the card background; `config.entity` must receive `turn_off` and
  the card must not navigate.

### Entities mode

- Test configurations with one, two, three, and four supported controls.
- Confirm the embedded card has the standard Home Assistant entities-card appearance
  with the compact manual styling, entity icon, name, state, and native control.
- Toggle each `light`, `switch`, and `input_boolean`; each action must produce one
  state change and must not navigate or invoke the room double-tap action.
- Place a `button` or another unsupported domain in `controls`; it must not appear
  in entities mode.
- Configure five supported entities; only the first four supported entities must
  appear.
- Confirm long names remain usable and do not overlap the native control.
- Confirm unavailable/missing entities do not crash the card.

### Visual editor

- Open the card editor and confirm `Tipo de controlos` offers `Botões rápidos` and
  `Entidades`.
- Switch between both choices and confirm the controls field label follows the mode.
- Save and reopen the card; the selected mode and controls must persist.

## Automated checks

From the repository root:

```text
node --check techathome-room-card.js
node --test tests/room-card.test.cjs
git diff --check
```

The automated suite uses synthetic Home Assistant state and service-call objects.
It verifies frontend contracts without connecting to, or actuating, a live Home
Assistant instance.
