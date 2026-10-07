const assert = require("node:assert/strict");
const path = require("node:path");
const test = require("node:test");

class FakeClassList {
  constructor() {
    this.values = new Set();
  }

  contains(value) {
    return this.values.has(value);
  }

  toggle(value, force) {
    const enabled = force === undefined ? !this.values.has(value) : force;
    if (enabled) this.values.add(value);
    else this.values.delete(value);
    return enabled;
  }
}

class FakeElement {
  constructor() {
    this.attributes = {};
    this.classList = new FakeClassList();
    this.dataset = {};
    this.innerHTML = "";
    this.listeners = {};
    this.style = {};
    this.textContent = "";
    this.children = [];
  }

  addEventListener(type, listener) {
    this.listeners[type] = listener;
  }

  setAttribute(name, value) {
    this.attributes[name] = value;
  }

  replaceChildren(...children) {
    this.children = children;
    this.innerHTML = "";
  }
}

class FakeShadowRoot extends FakeElement {
  constructor() {
    super();
    this.nodes = new Map([
      ["ha-card", new FakeElement()],
      [".name", new FakeElement()],
      [".state", new FakeElement()],
      [".covers", new FakeElement()],
      [".buttons", new FakeElement()],
      [".big-icon", new FakeElement()],
      [".big-icon ha-icon", new FakeElement()]
    ]);
  }

  querySelector(selector) {
    return this.nodes.get(selector) || null;
  }
}

class FakeHTMLElement extends FakeElement {
  attachShadow() {
    this.shadowRoot = new FakeShadowRoot();
    return this.shadowRoot;
  }

  dispatchEvent() {
    return true;
  }
}

const registry = new Map();
const createdCards = [];
global.HTMLElement = FakeHTMLElement;
global.customElements = {
  define(name, constructor) {
    registry.set(name, constructor);
  },
  get(name) {
    return registry.get(name);
  }
};
global.document = { createElement: () => new FakeElement() };
global.window = {
  customCards: [],
  dispatched: [],
  loadCardHelpers: async () => ({
    createCardElement(config) {
      const card = new FakeElement();
      card.cardConfig = config;
      createdCards.push(card);
      return card;
    }
  }),
  history: {
    pushed: [],
    pushState(_state, _title, url) {
      this.pushed.push(url);
    }
  },
  dispatchEvent(event) {
    this.dispatched.push(event.type);
  }
};

require(path.resolve(__dirname, "..", "techathome-room-card.js"));

const RoomCard = registry.get("techathome-room-card");
const RoomCardEditor = registry.get("techathome-room-card-editor");

function createHass() {
  const calls = [];
  return {
    calls,
    states: {
      "light.room": { state: "on", attributes: { friendly_name: "Room" } },
      "light.one": { state: "on", attributes: { friendly_name: "One", icon: "mdi:ceiling-light" } },
      "switch.two": { state: "off", attributes: { friendly_name: "Two" } },
      "input_boolean.three": { state: "on", attributes: { friendly_name: "Night mode" } },
      "light.four": { state: "off", attributes: { friendly_name: "Four" } },
      "light.five": { state: "on", attributes: { friendly_name: "Five" } },
      "sensor.temperature": { state: "21.8", attributes: { unit_of_measurement: "°C" } },
      "cover.blind": { state: "open", attributes: { current_position: 72 } }
    },
    callService(domain, service, data) {
      calls.push({ domain, service, data });
    }
  };
}

function createCard(config, hass = createHass()) {
  const card = new RoomCard();
  card.setConfig({
    name: "Room",
    icon: "mdi:sofa",
    entity: "light.room",
    temperature_entity: "sensor.temperature",
    navigation_path: "/room",
    controls: ["light.one", "switch.two"],
    ...config
  });
  card.hass = hass;
  return { card, hass };
}

test("missing controls_type renders exactly like explicit buttons mode", () => {
  const implicit = createCard({}).card;
  const explicit = createCard({ controls_type: "buttons" }).card;

  assert.equal(
    implicit.shadowRoot.querySelector(".buttons").innerHTML,
    explicit.shadowRoot.querySelector(".buttons").innerHTML
  );
  assert.equal(implicit.shadowRoot.querySelector(".buttons").classList.contains("entities"), false);
});

test("entities mode embeds a native HA entities card with the manual styling contract", async () => {
  const { card } = createCard({
    controls_type: "entities",
    controls: [
      "button.unsupported",
      "light.one",
      { entity: "switch.two", name: "Custom switch name" },
      "input_boolean.three",
      "light.four",
      "light.five"
    ]
  });
  const container = card.shadowRoot.querySelector(".buttons");
  await card._entitiesCardPromise;
  const entitiesCard = container.children[0];

  assert.equal(container.classList.contains("entities"), true);
  assert.equal(entitiesCard.cardConfig.type, "entities");
  assert.equal(entitiesCard.cardConfig.state_color, true);
  assert.equal(entitiesCard.cardConfig.show_header_toggle, false);
  assert.deepEqual(entitiesCard.cardConfig.entities, [
    "light.one",
    { entity: "switch.two", name: "Custom switch name" },
    "input_boolean.three",
    "light.four"
  ]);
  assert.match(entitiesCard.cardConfig.card_mod.style["."], /margin-top: -10px/);
  assert.match(entitiesCard.cardConfig.card_mod.style["."], /--mdc-icon-size: 40%/);
  assert.equal(entitiesCard.hass.states["light.one"].state, "on");
});

test("events from the native entities card stop before reaching room-card gestures", async () => {
  const { card, hass } = createCard({ controls_type: "entities" });
  const controlContainer = card.shadowRoot.querySelector(".buttons");
  await card._entitiesCardPromise;
  let stopped = false;

  controlContainer.listeners.click({
    target: controlContainer.children[0],
    stopPropagation: () => { stopped = true; }
  });

  assert.equal(stopped, true);
  assert.deepEqual(hass.calls, []);
  assert.equal(card._tapTimer, null);
});

test("HA state updates reuse the mounted native entities card", async () => {
  const { card } = createCard({ controls_type: "entities" });
  await card._entitiesCardPromise;
  const mountedCard = card._entitiesCard;
  const updatedHass = createHass();
  updatedHass.states["light.one"].state = "off";

  card.hass = updatedHass;

  assert.equal(card._entitiesCard, mountedCard);
  assert.equal(mountedCard.hass, updatedHass);
});

test("classic momentary buttons retain the button.press service contract", () => {
  const { card, hass } = createCard({ controls: ["button.scene"] });
  const controlContainer = card.shadowRoot.querySelector(".buttons");
  const classicButton = new FakeElement();
  classicButton.classList.toggle("control", true);
  classicButton.dataset.entity = "button.scene";

  controlContainer.listeners.click({
    target: { closest: () => classicButton },
    stopPropagation() {}
  });

  assert.deepEqual(hass.calls, [{
    domain: "button",
    service: "press",
    data: { entity_id: "button.scene" }
  }]);
});

test("background single tap navigates and double tap turns off the room entity", async () => {
  window.history.pushed.length = 0;
  const { card, hass } = createCard({});
  card._tapDelay = 10;

  card.shadowRoot.querySelector("ha-card").listeners.click();
  await new Promise(resolve => setTimeout(resolve, 20));
  assert.deepEqual(window.history.pushed, ["/room"]);

  window.history.pushed.length = 0;
  card.shadowRoot.querySelector("ha-card").listeners.click();
  card.shadowRoot.querySelector("ha-card").listeners.click();
  await new Promise(resolve => setTimeout(resolve, 20));

  assert.deepEqual(window.history.pushed, []);
  assert.deepEqual(hass.calls.at(-1), {
    domain: "homeassistant",
    service: "turn_off",
    data: { entity_id: "light.room" }
  });
});

test("covers remain rendered in entities mode", () => {
  const { card } = createCard({
    controls_type: "entities",
    covers: [{ entity: "cover.blind", type: "persiana" }]
  });

  assert.match(card.shadowRoot.querySelector(".covers").innerHTML, /mdi:roller-shade/);
  assert.match(card.shadowRoot.querySelector(".covers").innerHTML, /72%/);
});

test("visual editor exposes both control types and defaults legacy configs to buttons", () => {
  const editor = new RoomCardEditor();
  editor._config = {};
  const controlType = editor._schema.find(field => field.name === "controls_type");

  assert.equal(controlType.label, "Tipo de controlos");
  assert.deepEqual(controlType.selector.select.options, [
    { value: "buttons", label: "Botões rápidos" },
    { value: "entities", label: "Entidades" }
  ]);
  assert.equal(editor._configToFormData({}).controls_type, "buttons");

  editor._config = { controls_type: "entities" };
  assert.equal(editor._schema.find(field => field.name === "controls").label, "Entidades");
});
