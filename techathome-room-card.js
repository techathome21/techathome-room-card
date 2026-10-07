/*
 * Tech@Home Room Card
 * Version: 2.2.0-lab.1
 * Status : LAB Pre-release
 *
 * Notes:
 * - Visual appearance intentionally preserved from the original card.
 * - Shadow DOM isolates styles and state per card instance.
 * - Event listeners are registered once per instance.
 * - Big icon active state is local to each card instance.
 * - Single tap navigates to the configured room path.
 * - Double tap turns off the configured room lighting entity.
 * - controls_type selects the classic buttons or the LAB entities panel.
 */

class TechAtHomeRoomCard extends HTMLElement {
  constructor() {
    super();
    this._hass = null;
    this.config = null;
    this._rendered = false;
    this._isPreview = false;
    this._tapTimer = null;
    this._tapDelay = 260;
    this.attachShadow({ mode: "open" });
  }

  static getStubConfig() {
    return {
      name: "Sala",
      icon: "mdi:sofa",
      entity: "light.preview_sala",
      temperature_entity: "sensor.preview_temperatura_sala",
      background: "/local/demo.jpg",
      navigation_path: "home",
      controls: [
        "light.preview_sala",
        "light.preview_sanca",
        "switch.preview_tv",
        "input_boolean.preview_ambiente"
      ],
      covers: [
        { entity: "cover.preview_estore_sala", type: "persiana" },
        { entity: "cover.preview_cortina_sala", type: "cortina" }
      ]
    };
  }

  static getConfigElement() {
    return document.createElement("techathome-room-card-editor");
  }

  setConfig(config) {
    this.config = config || TechAtHomeRoomCard.getStubConfig();
    this._renderBase();
    this._updateCard();
  }

  set hass(hass) {
    this._hass = hass;
    this._renderBase();
    this._updateCard();
  }

  _escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  _domain(entityId) {
    return String(entityId || "").split(".")[0];
  }

  _isOn(stateObj) {
    return stateObj?.state === "on";
  }


  _navigateToRoom() {
    const config = this.config || TechAtHomeRoomCard.getStubConfig();
    if (this._isPreview) return;
    if (!config.navigation_path) return;

    window.history.pushState(null, "", config.navigation_path);
    window.dispatchEvent(new Event("location-changed"));
  }

  _turnOffRoomEntity() {
    const config = this.config || TechAtHomeRoomCard.getStubConfig();
    if (this._isPreview || !this._hass) return;
    if (!config.entity) return;

    this._hass.callService("homeassistant", "turn_off", {
      entity_id: config.entity,
    });
  }

  _handleCardTap() {
    if (this._tapTimer) {
      clearTimeout(this._tapTimer);
      this._tapTimer = null;
      this._turnOffRoomEntity();
      return;
    }

    this._tapTimer = setTimeout(() => {
      this._tapTimer = null;
      this._navigateToRoom();
    }, this._tapDelay);
  }

  _renderBase() {
    if (this._rendered) return;

    this.shadowRoot.innerHTML = `
      <style>
        ha-card {
          height: 230px;
          border-radius: 22px;
          overflow: hidden;
          border: none;
          position: relative;
          background-size: cover;
          background-position: center;
          box-shadow:
            inset 0px 0px 100px 50px rgba(0,0,0,0.82),
            rgba(0,0,0,0.35) 0px 5px 15px;
          cursor: pointer;
        }

        ha-card::before {
          content: "";
          position: absolute;
          inset: 0;
          background:
            radial-gradient(circle at 20% 90%, rgba(255,255,255,0.13), transparent 34%),
            linear-gradient(135deg, rgba(255,255,255,0.08), transparent 45%);
          pointer-events: none;
          z-index: 1;
        }

        .content {
          position: relative;
          z-index: 2;
          height: 100%;
          padding: 22px 8px 22px 22px;
          box-sizing: border-box;
          display: grid;
          grid-template-areas:
            "name buttons"
            "state buttons"
            "icon buttons";
          grid-template-columns: 1fr min-content;
          grid-template-rows: min-content min-content 1fr;
        }

        .name {
          grid-area: name;
          justify-self: start;
          align-self: start;
          font-size: 18px;
          font-weight: 500;
          color: white;
          text-shadow: 1px 1px 1px black;
          line-height: 1.05;
        }

        .state {
          grid-area: state;
          justify-self: start;
          align-self: start;
          min-height: 80px;
          font-size: 14px;
          font-weight: 400;
          color: white;
          opacity: 0.7;
          text-shadow: 1px 1px 1px black;
          margin-top: 2px;
          line-height: 1.05;
        }

        .covers {
          position: absolute;
          top: 30%;
          left: 20px;
          display: grid;
          grid-template-columns: repeat(2, auto);
          gap: 4px 8px;
          z-index: 4;
          font-size: 14px;
          color: white;
          opacity: 0.7;
          text-shadow: 1px 1px 1px black;
        }

        .cover {
          display: flex;
          align-items: center;
          gap: 4px;
          white-space: nowrap;
        }

        .cover ha-icon {
          width: 20px;
          height: 20px;
          --mdc-icon-size: 20px;
        }

        .buttons {
          grid-area: buttons;
          display: flex;
          flex-direction: column;
          gap: 7px;
          justify-content: center;
          align-self: stretch;
          justify-self: end;
          height: 100%;
          transform: translateY(2px);
          z-index: 5;
        }

        .buttons.entities {
          width: min(194px, 52vw);
          height: auto;
          padding: 8px;
          gap: 4px;
          align-self: center;
          box-sizing: border-box;
          border: 1px solid rgba(255,255,255,0.18);
          border-radius: 16px;
          background: rgba(0,0,0,0.58);
          box-shadow: 0 4px 18px rgba(0,0,0,0.35);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          transform: none;
        }

        .entity-control {
          width: 100%;
          min-width: 0;
          height: 38px;
          padding: 0 7px;
          border: 0;
          border-radius: 10px;
          background: transparent;
          color: white;
          display: grid;
          grid-template-columns: 24px minmax(0, 1fr) 34px;
          align-items: center;
          gap: 7px;
          text-align: left;
          cursor: pointer;
        }

        .entity-control:hover {
          background: rgba(255,255,255,0.09);
        }

        .entity-control:focus-visible {
          outline: 2px solid rgba(255,215,0,0.95);
          outline-offset: -2px;
        }

        .entity-control > ha-icon {
          width: 21px;
          height: 21px;
          --mdc-icon-size: 21px;
          color: rgba(255,255,255,0.9);
        }

        .entity-control.on > ha-icon {
          color: rgba(255,215,0,0.95);
        }

        .entity-name {
          min-width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: 13px;
          line-height: 1.1;
          text-shadow: 1px 1px 1px black;
        }

        .entity-toggle {
          position: relative;
          width: 32px;
          height: 18px;
          border-radius: 9px;
          background: rgba(255,255,255,0.28);
          transition: background 160ms ease;
        }

        .entity-toggle::after {
          content: "";
          position: absolute;
          width: 14px;
          height: 14px;
          top: 2px;
          left: 2px;
          border-radius: 50%;
          background: white;
          box-shadow: 0 1px 4px rgba(0,0,0,0.45);
          transition: transform 160ms ease;
        }

        .entity-control.on .entity-toggle {
          background: rgba(255,200,0,0.92);
        }

        .entity-control.on .entity-toggle::after {
          transform: translateX(14px);
        }

        .control {
          width: 46px;
          height: 46px;
          min-width: 46px;
          min-height: 46px;
          max-width: 46px;
          max-height: 46px;
          aspect-ratio: 1 / 1;
          flex-shrink: 0;
          border-radius: 50%;
          border: 1px solid rgba(245,245,245,0.3);
          background: rgba(0,0,0,0.7);
          box-shadow: 0px 0px 10px black;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;
          margin: 0;
          line-height: 0;
          color: white;
          transition: transform 160ms ease, background 160ms ease, box-shadow 160ms ease;
        }

        .control:hover {
          transform: scale(1.04);
        }

        .control.on {
          background: rgba(255, 200, 0, 0.9);
          color: #1a1a1a;
          box-shadow: 0 0 12px rgba(255, 200, 0, 0.8);
        }

        .control ha-icon {
          width: 22px;
          height: 22px;
          --mdc-icon-size: 22px;
          color: currentColor;
        }

        .control.on ha-icon {
          color: #1a1a1a !important;
        }

        .big-icon {
          position: absolute;
          width: 130px;
          height: 130px;
          left: -30px;
          bottom: -30px;
          border-radius: 500px;
          background: rgba(254,199,180,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 3;
        }

        .big-icon ha-icon {
          width: 60px;
          height: 60px;
          --mdc-icon-size: 60px;
          color: rgba(0,0,0,0.45);
          filter: none;
        }

        .big-icon.active ha-icon {
          color: rgba(255,215,0,0.95);
          filter: drop-shadow(0 0 12px rgba(255,215,0,0.8));
        }
      </style>

      <ha-card>
        <div class="content">
          <div class="name"></div>
          <div class="state"></div>

          <div class="covers"></div>

          <div class="buttons"></div>

          <div class="big-icon">
            <ha-icon></ha-icon>
          </div>
        </div>
      </ha-card>
    `;

    this.shadowRoot.querySelector("ha-card").addEventListener("click", () => {
      this._handleCardTap();
    });

    this.shadowRoot.querySelector(".buttons").addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-entity]");
      if (!btn) return;

      e.stopPropagation();
      if (this._isPreview || !this._hass) return;

      const entityId = btn.dataset.entity;
      if (!entityId) return;

      if (btn.classList.contains("control") && this._domain(entityId) === "button") {
        this._hass.callService("button", "press", { entity_id: entityId });
      } else {
        this._hass.callService("homeassistant", "toggle", { entity_id: entityId });
      }
    });

    this._rendered = true;
  }

  _updateCard() {
    if (!this._rendered) return;

    const hass = this._hass;
    const config = this.config || TechAtHomeRoomCard.getStubConfig();

    this._isPreview =
      config.entity?.includes("preview_") ||
      config.temperature_entity?.includes("preview_");

    const mainEntity = config.entity;
    const mainStateObj = mainEntity ? hass?.states?.[mainEntity] : null;
    const roomActive = mainStateObj ? this._isOn(mainStateObj) : this._isPreview;

    const tempEntity = config.temperature_entity;
    const tempStateObj = tempEntity ? hass?.states?.[tempEntity] : null;

    const rawTemp = tempStateObj ? tempStateObj.state : this._isPreview ? "21.8" : "—";
    const unit = tempStateObj?.attributes?.unit_of_measurement || (this._isPreview ? "°C" : "");

    const numericTemp = Number(rawTemp);
    const temperature = isNaN(numericTemp)
      ? rawTemp
      : `${numericTemp.toFixed(1)}${unit}`;

    const background = config.background || "";

    const card = this.shadowRoot.querySelector("ha-card");
    card.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.18), rgba(0,0,0,0.72)), url('${String(background).replace(/'/g, "\\'")}')`;

    this.shadowRoot.querySelector(".name").textContent = config.name || "Divisão";
    this.shadowRoot.querySelector(".state").textContent = temperature;

    const bigIcon = this.shadowRoot.querySelector(".big-icon");
    bigIcon.classList.toggle("active", roomActive);
    this.shadowRoot.querySelector(".big-icon ha-icon").setAttribute("icon", config.icon || "mdi:home");

    this._updateControls(config, hass);
    this._updateCovers(config, hass);
  }

  _updateControls(config, hass) {
    const controlsType = config.controls_type === "entities" ? "entities" : "buttons";
    const controlsContainer = this.shadowRoot.querySelector(".buttons");

    controlsContainer.classList.toggle("entities", controlsType === "entities");

    if (controlsType === "entities") {
      this._updateEntityControls(config, hass, controlsContainer);
      return;
    }

    const previewIcons = [
      "mdi:ceiling-light",
      "mdi:led-strip-variant",
      "mdi:television",
      "mdi:lightbulb-night"
    ];

    const controls = (config.controls || []).slice(0, 4).map((entityId, index) => {
      const s = hass?.states?.[entityId];
      const domain = this._domain(entityId);
      const isMomentaryButton = domain === "button";
      const isOn = isMomentaryButton ? false : (s ? this._isOn(s) : this._isPreview && index < 2);
      const icon = s?.attributes?.icon || previewIcons[index] || "mdi:lightbulb";

      return `
        <button class="control ${isOn ? "on" : ""}" data-entity="${this._escapeHtml(entityId)}" title="${this._escapeHtml(entityId)}">
          <ha-icon icon="${this._escapeHtml(icon)}"></ha-icon>
        </button>
      `;
    }).join("");

    controlsContainer.innerHTML = controls;
  }

  _updateEntityControls(config, hass, controlsContainer) {
    const supportedDomains = new Set(["light", "switch", "input_boolean"]);
    const fallbackIcons = {
      light: "mdi:lightbulb",
      switch: "mdi:toggle-switch",
      input_boolean: "mdi:toggle-switch-outline"
    };

    const controls = (config.controls || [])
      .filter(entityId => supportedDomains.has(this._domain(entityId)))
      .slice(0, 4)
      .map((entityId, index) => {
        const stateObj = hass?.states?.[entityId];
        const domain = this._domain(entityId);
        const isOn = stateObj ? this._isOn(stateObj) : this._isPreview && index < 2;
        const icon = stateObj?.attributes?.icon || fallbackIcons[domain];
        const friendlyName = stateObj?.attributes?.friendly_name || entityId;

        return `
          <button
            class="entity-control ${isOn ? "on" : ""}"
            data-entity="${this._escapeHtml(entityId)}"
            title="${this._escapeHtml(friendlyName)}"
            aria-label="${this._escapeHtml(friendlyName)}"
            role="switch"
            aria-checked="${isOn ? "true" : "false"}"
          >
            <ha-icon icon="${this._escapeHtml(icon)}"></ha-icon>
            <span class="entity-name">${this._escapeHtml(friendlyName)}</span>
            <span class="entity-toggle" aria-hidden="true"></span>
          </button>
        `;
      })
      .join("");

    controlsContainer.innerHTML = controls;
  }

  _updateCovers(config, hass) {
    const covers = (config.covers || []).map((c, index) => {
      const s = hass?.states?.[c.entity];
      const rawPos = s?.attributes?.current_position ?? (this._isPreview ? (index === 0 ? 72 : 45) : null);
      const numericPos = Number(rawPos);
      const hasNumericPosition = rawPos !== null && rawPos !== undefined && rawPos !== "" && !isNaN(numericPos);

      if (!hasNumericPosition) return "";

      const pos = Math.round(numericPos);
      const isClosed = pos === 0 || s?.state === "closed";

      const icon = c.type === "persiana"
        ? (isClosed ? "mdi:roller-shade-closed" : "mdi:roller-shade")
        : (isClosed ? "mdi:curtains-closed" : "mdi:curtains");

      return `
        <span class="cover">
          <ha-icon icon="${icon}"></ha-icon>
          ${pos}%
        </span>
      `;
    }).join("");

    this.shadowRoot.querySelector(".covers").innerHTML = covers;
  }

  getCardSize() {
    return 4;
  }
}

if (!customElements.get("techathome-room-card")) {
  customElements.define("techathome-room-card", TechAtHomeRoomCard);
}

class TechAtHomeRoomCardEditor extends HTMLElement {
  setConfig(config) {
    this._config = config;

    if (!this._form) {
      this.render();
    }
  }

  set hass(hass) {
    this._hass = hass;
    if (this._form) {
      this._form.hass = hass;
    }
  }

  get _schema() {
    return [
      {
        name: "name",
        label: "Nome da divisão",
        selector: { text: {} }
      },
      {
        name: "icon",
        label: "Ícone",
        selector: { icon: {} }
      },
      {
        name: "entity",
        label: "Grupo de iluminação da divisão",
        selector: {
          entity: { domain: ["switch", "light"] }
        }
      },
      {
        name: "temperature_entity",
        label: "Sensor de temperatura",
        selector: {
          entity: { domain: "sensor" }
        }
      },
      {
        name: "background",
        label: "Imagem de fundo",
        selector: { text: {} }
      },
      {
        name: "navigation_path",
        label: "Caminho de navegação",
        selector: { text: {} }
      },
      {
        name: "controls_type",
        label: "Tipo de controlos",
        selector: {
          select: {
            options: [
              { value: "buttons", label: "Botões rápidos" },
              { value: "entities", label: "Entidades" }
            ]
          }
        }
      },
      {
        name: "controls",
        label: this._config?.controls_type === "entities" ? "Entidades" : "Botões rápidos",
        selector: {
          entity: {
            multiple: true,
            domain: ["switch", "light", "button", "input_boolean"]
          }
        }
      },

      {
        type: "constant",
        label: "Estores / Cortinas"
      },

      {
        name: "cover_1_entity",
        label: "Cover 1",
        selector: { entity: { domain: "cover" } }
      },
      {
        name: "cover_1_type",
        label: "Tipo 1",
        selector: {
          select: {
            options: [
              { value: "persiana", label: "Persiana" },
              { value: "cortina", label: "Cortina" }
            ]
          }
        }
      },

      {
        name: "cover_2_entity",
        label: "Cover 2",
        selector: { entity: { domain: "cover" } }
      },
      {
        name: "cover_2_type",
        label: "Tipo 2",
        selector: {
          select: {
            options: [
              { value: "persiana", label: "Persiana" },
              { value: "cortina", label: "Cortina" }
            ]
          }
        }
      },

      {
        name: "cover_3_entity",
        label: "Cover 3",
        selector: { entity: { domain: "cover" } }
      },
      {
        name: "cover_3_type",
        label: "Tipo 3",
        selector: {
          select: {
            options: [
              { value: "persiana", label: "Persiana" },
              { value: "cortina", label: "Cortina" }
            ]
          }
        }
      },

      {
        name: "cover_4_entity",
        label: "Cover 4",
        selector: { entity: { domain: "cover" } }
      },
      {
        name: "cover_4_type",
        label: "Tipo 4",
        selector: {
          select: {
            options: [
              { value: "persiana", label: "Persiana" },
              { value: "cortina", label: "Cortina" }
            ]
          }
        }
      }
    ];
  }

  _configToFormData(config) {
    const covers = config.covers || [];

    return {
      ...config,
      controls_type: config.controls_type === "entities" ? "entities" : "buttons",

      cover_1_entity: covers[0]?.entity || "",
      cover_1_type: covers[0]?.type || "persiana",

      cover_2_entity: covers[1]?.entity || "",
      cover_2_type: covers[1]?.type || "persiana",

      cover_3_entity: covers[2]?.entity || "",
      cover_3_type: covers[2]?.type || "persiana",

      cover_4_entity: covers[3]?.entity || "",
      cover_4_type: covers[3]?.type || "persiana"
    };
  }

  _formDataToConfig(data) {
    const config = { ...data };

    config.controls = Array.isArray(data.controls)
      ? data.controls
      : data.controls
        ? [data.controls]
        : [];

    config.covers = [1, 2, 3, 4]
      .map(i => {
        const entity = data[`cover_${i}_entity`];
        const type = data[`cover_${i}_type`] || "persiana";

        if (!entity) return null;

        return { entity, type };
      })
      .filter(Boolean);

    for (let i = 1; i <= 4; i++) {
      delete config[`cover_${i}_entity`];
      delete config[`cover_${i}_type`];
    }

    return config;
  }

  render() {
    this.innerHTML = `
      <style>
        .editor {
          padding: 12px;
        }
      </style>

      <div class="editor">
        <ha-form></ha-form>
      </div>
    `;

    this._form = this.querySelector("ha-form");

    this._form.hass = this._hass;
    this._form.schema = this._schema;
    this._form.data = this._configToFormData(this._config || {});
    this._form.computeLabel = schema => schema.label;

    this._form.addEventListener("value-changed", ev => {
      const previousControlsType = this._config?.controls_type || "buttons";
      const newConfig = this._formDataToConfig(ev.detail.value);
      this._config = newConfig;

      if (previousControlsType !== newConfig.controls_type) {
        this._form.schema = this._schema;
      }

      this.dispatchEvent(
        new CustomEvent("config-changed", {
          detail: { config: newConfig },
          bubbles: true,
          composed: true
        })
      );
    });
  }
}

if (!customElements.get("techathome-room-card-editor")) {
  customElements.define("techathome-room-card-editor", TechAtHomeRoomCardEditor);
}

window.customCards = window.customCards || [];
window.customCards.push({
  type: "techathome-room-card",
  name: "Tech@Home Room Card",
  description: "Cartão premium de divisão Tech@Home",
  preview: true,
});
