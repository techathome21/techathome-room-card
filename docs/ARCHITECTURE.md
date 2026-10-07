# Architecture

## Purpose

The Tech@Home Room Card is a custom Lovelace card developed for professional Home Assistant installations.

Its purpose is to provide a consistent, modern and reliable user interface for controlling and monitoring a room while maintaining high performance and long-term maintainability.

The Room Card is designed to be reused across multiple projects without requiring modifications to existing dashboards.

---

## Design Goals

The architecture of the Room Card is based on five principles.

### 1. Simplicity

The implementation should remain easy to understand and maintain.

Complexity is only introduced when it provides a measurable benefit.

### 2. Reliability

The card must behave predictably in every supported environment.

Stability is always prioritised over new features.

### 3. Backward Compatibility

New versions should not require changes to existing Lovelace dashboards whenever possible.

### 4. Performance

Only the required information should be updated.

Rendering operations should be kept as lightweight as possible.

### 5. Professional Deployment

The card is intended for production installations and must remain suitable for long-term maintenance.

---

# Component Lifecycle

The component follows the standard Home Assistant custom card lifecycle.

```
setConfig()

↓

set hass()

↓

Read Home Assistant states

↓

Evaluate current state

↓

Render interface

↓

Wait for next update
```

Every Home Assistant state update triggers a new evaluation of the component state.

---

# Current Architecture

```
Home Assistant

        │

        ▼

Entity States

        │

        ▼

Room Card

 ├── Configuration
 ├── State Evaluation
 ├── Rendering
 ├── Event Handling
 └── Navigation

        │

        ▼

User Interface
```

Each Room Card instance is completely independent from every other instance.

No shared runtime state should exist between cards.

---

# State Handling

The Room Card does not maintain a permanent internal state.

The current interface is always generated from the latest Home Assistant entity states.

This approach guarantees consistency after reloads, reconnects and Home Assistant restarts.

---

# Rendering Strategy

The current implementation rebuilds the visual interface whenever Home Assistant updates the component.

Although this approach is simple and reliable, future versions will progressively optimise rendering to update only modified elements.

This optimisation must never change the external behaviour of the card.

---

# Event Handling

The Room Card currently supports:

- Navigation
- Quick Control Buttons
- Cover information

User interaction is intentionally simple and predictable.

The LAB branch adds two control renderers selected by `controls_type`:

- `buttons` (default): the unchanged v2.1.0 quick-control renderer.
- `entities`: a native Home Assistant `entities` card that reuses `controls` for up
  to four supported entities and applies the original compact `card_mod` styling.

Nested control clicks stop propagation before issuing their service call, so they
cannot trigger the card-level navigation or double-tap action.

Future interaction methods must remain compatible with existing dashboards.

---

# Compatibility Rules

Every new release should preserve:

- Existing YAML configuration
- Existing Lovelace dashboards
- Existing visual appearance

Internal improvements must remain transparent for existing installations.

---

# Future Direction

Future development will focus on:

- Internal performance improvements
- Rendering optimisation
- Code modularisation
- Additional control capabilities

The visual identity of the Room Card should remain consistent across future releases unless a major version introduces a new design language.

---

# Tech@Home Lean Engineering

The Room Card follows the Tech@Home Lean Engineering methodology.

Architecture is validated before implementation.

Documentation remains concise and practical.

Every release should improve the project while preserving reliability and maintainability.
