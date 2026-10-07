# Changelog

All notable changes to this project are documented in this file.

The project follows Semantic Versioning (SemVer).


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
