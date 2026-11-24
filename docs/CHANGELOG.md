# Changelog

All notable changes to this project are documented in this file.

The project follows Semantic Versioning (SemVer).


---

## [v2.2.2] - 2026-11-24 - Marketplace packaging

### Added
- Added the Marketplace/HACS repository manifest and installation/migration documentation.
- Added distribution license terms.

### Preserved
- Room Card functionality and navigation fix from v2.2.1 remain unchanged.

---

## [v2.2.1] - 2026-11-24 - Production

### Fixed
- Fixed subview back navigation history by recording the originating URL and dispatching the Home Assistant location change event with `replace: false`.
- Preserved both controls modes and existing configuration.

---

## [v2.2.0] - 2026-10-07 - Production

### Added
- Added `controls_type` with `buttons` and `entities` modes.
- Added a native Home Assistant entities card for up to four `light`, `switch`, and `input_boolean` controls.
- Added the `Tipo de controlos` selector to the visual editor.

### Compatibility
- Omitting `controls_type` remains identical to `controls_type: buttons` and preserves the v2.1.0 renderer.
- Covers, navigation, room double-tap, background, title positioning, and existing YAML remain compatible.

### Validated
- Promoted the approved `2.2.0-lab.6` candidate without additional visual or behavioral changes.
- Automated syntax and interaction regression suite passed before release.

---

## [v2.2.0-lab.6] - LAB Pre-release

### Fixed
- Added a 14 px right offset to the entities controls container.
- This compensates for the native entities card's original `margin: -15px` and restores the visible right inset from the manual card.

### Preserved
- Outer-card title, background, shadow, padding, and grid remain identical to buttons mode and Production.

---

## [v2.2.0-lab.5] - LAB Pre-release

### Fixed
- Removed entities-only overrides for the outer card background position and shadow.
- Removed entities-only overrides for outer padding, grid, and state positioning.
- Both control types now share the exact same outer-card CSS; only the right-side controls renderer changes.

### Preserved
- The native Home Assistant entities card and the original compact internal `card_mod` styling remain unchanged.
- The buttons renderer remains unchanged.

---

## [v2.2.0-lab.4] - LAB Pre-release

### Changed
- Matched the original manual room-card layout when `controls_type: entities` is selected.
- Restored the original entities-mode padding, four-column grid, `bottom right` background position, and `inset 0px 0px 100px 30px black` shadow.
- Kept the native entities card and its original compact `card_mod` styling.
- Limited these layout changes to entities mode so the buttons renderer remains unchanged.

---

## [v2.2.0-lab.3] - LAB Pre-release

### Changed
- Reduced the room-card inner shadow opacity from `0.82` to `0.52` for a lighter background treatment.
- Kept the external shadow unchanged at `rgba(0,0,0,0.35) 0px 5px 15px`.

---

## [v2.2.0-lab.2] - LAB Pre-release

### Changed
- Replaced the custom entities renderer with Home Assistant's native `entities` card.
- Matched the compact `card_mod` styling from the original manual configuration.
- Native entity rows now retain their standard Home Assistant interactions.
- Entity-card clicks are isolated from room navigation and double-tap handling.
- `controls` accepts entity IDs and native entity-row objects in entities mode.

### Compatibility
- The `buttons` renderer remains unchanged and is still the default.
- Covers, background navigation, and room double-tap remain available.

---

## [v2.2.0-lab.1] - LAB Pre-release

### Added
- Added optional `controls_type` with `buttons` and `entities` modes.
- Added an entities panel for up to four `light`, `switch`, and `input_boolean` controls.
- Added a visual-editor selector for the control type.
- Added isolated regression tests and a LAB YAML example.

### Changed
- LAB branch version identifier only; no production release or merge.

### Compatibility
- Omitting `controls_type` remains identical to `controls_type: buttons`.
- The existing buttons renderer, covers, navigation, and room double-tap action are preserved.

---

## [v2.1.0] - Production

### Added
- Added double-tap action on the Room Card.
- Double-tap turns off the room's main entity.

### Changed
- No visual changes.
- Full backward compatibility maintained.

---

## [v2.0.1] - Production

### Added
- Initial GitHub repository.
- Initial project documentation.
- README.
- Architecture documentation.

### Fixed
- Fixed Big Icon active state isolation.
- Improved compatibility with recent Home Assistant versions.
- Improved compatibility with the Home Assistant Android App.

### Changed
- Established the Tech@Home Lean Engineering project structure.
- Repository prepared for long-term development.



### Changed

### Fixed

### Removed
