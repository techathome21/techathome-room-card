# Tech@Home Room Card


![Status](https://img.shields.io/badge/status-Production-green)

![Version](https://img.shields.io/badge/version-v2.0.1-blue)

![Home Assistant](https://img.shields.io/badge/Home%20Assistant-2026+-41BDF5)


Professional Room Card for Home Assistant.

Developed by **Tech@Home – Automação Residencial**.

The Tech@Home Room Card is a premium Lovelace card designed for professional Home Assistant installations. It combines a modern user interface with performance, reliability and long-term maintainability.

---

## Features

- Modern room interface
- Background image support
- Temperature display
- Quick control buttons
- Cover position indicators
- Room navigation
- Visual Lovelace editor
- Optimized for desktop, tablet and mobile devices

---

## Compatibility

| Component | Version |
|-----------|----------|
| Home Assistant | 2026+ |
| Browser | Chrome, Edge, Firefox |
| Mobile App | Android / iOS |

---

## Installation

Copy the card to:

```text
/config/www/
```

Add the resource:

```text
/local/techathome-room-card.js
```

Restart Home Assistant or clear the browser/app cache if required.

---

## Basic Configuration

```yaml
type: custom:techathome-room-card
name: Living Room
icon: mdi:sofa
entity: switch.living_room
temperature_entity: sensor.living_room_temperature
background: /local/living-room.jpg
navigation_path: living-room

controls:
  - light.living_room
  - light.led_strip
  - switch.tv
  - input_boolean.scene_movie

covers:
  - entity: cover.blind
    type: persiana
```

---

## Repository Structure

```
techathome-room-card/

docs/
examples/
screenshots/
src/

README.md
```

---

## Documentation

| File | Description |
|------|-------------|
| docs/ARCHITECTURE.md | Internal architecture and design decisions |
| docs/CHANGELOG.md | Version history |

---

## Current Version

**v2.0.1 Production**

---

## Roadmap

- Performance improvements
- Internal refactoring
- Future feature expansion

---

Developed by **Tech@Home – Automação Residencial**
