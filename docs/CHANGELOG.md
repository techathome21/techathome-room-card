# Changelog

All notable changes to this project are documented in this file.

The project follows Semantic Versioning (SemVer).


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
