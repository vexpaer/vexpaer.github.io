// Right-click settings panel.
//
// A DOM port of the owner-drawn Win32 panel: same groups, same labels, same
// ranges, same defaults, same per-group reset behaviour, and the same dark
// palette (background 24,26,32 / accent 92,142,255).

import {
  DEFAULT_SETTINGS,
  sizeSliderPositionFromValue,
  sizeValueFromSliderPosition,
} from './liquid-glass.js';

const EXCLUDE_ATTRIBUTE = 'data-liquid-glass-exclude';

const SLIDERS = {
  dispersion: {label: '色散程度', min: 0, max: 200, unit: '%'},
  internalReflection: {label: '内反射强度', min: 0, max: 200, unit: '%'},
  edgeRefraction: {label: '边缘折射强度', min: 0, max: 200, unit: '%'},
  externalReflection: {label: '外部反射强度', min: 0, max: 200, unit: '%'},
  shadowDepth: {label: '阴影深度', min: 0, max: 200, unit: '%'},
  highlightDirection: {label: '方向', min: 0, max: 360, unit: '°'},
  highlightStrength: {label: '高光强度', min: 0, max: 200, unit: '%'},
  internalBlur: {label: '内部虚化', min: 0, max: 100, unit: '%'},
  // The size track is a 0..100 control mapped through a quadratic curve.
  size: {label: '大小', min: 0, max: 100, unit: '%', curved: true},
  length: {label: '长度（仅胶囊型）', min: 25, max: 175, unit: '%'},
};

function element(tag, className, parent) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (parent) parent.appendChild(node);
  return node;
}

export class LiquidGlassPanel {
  constructor(glass, options = {}) {
    this.glass = glass;
    this.onClose = options.onClose || null;
    this.sliders = new Map();
    this.toggles = new Map();
    this.visible = false;
    this.build();
    glass.onContextMenu = (event) => this.openAt(event.clientX, event.clientY);
  }

  build() {
    const root = element('div', 'lg-panel');
    root.setAttribute(EXCLUDE_ATTRIBUTE, '');
    root.hidden = true;
    this.root = root;

    const header = element('div', 'lg-panel-header', root);
    element('div', 'lg-panel-title', header).textContent = '液态玻璃';
    const dismiss = element('button', 'lg-dismiss', header);
    dismiss.type = 'button';
    dismiss.setAttribute('aria-label', '关闭面板');
    dismiss.addEventListener('click', () => this.close());
    this.makeDraggable(header);

    const body = element('div', 'lg-panel-body', root);

    this.group(body, '光学');
    this.slider(body, 'dispersion');
    this.slider(body, 'internalReflection');
    this.slider(body, 'edgeRefraction');
    this.slider(body, 'externalReflection');
    this.reset(body, ['dispersion', 'internalReflection', 'edgeRefraction',
                      'externalReflection']);

    this.group(body, '阴影');
    this.slider(body, 'shadowDepth');
    this.reset(body, ['shadowDepth']);

    this.group(body, '高光');
    this.slider(body, 'highlightDirection');
    this.slider(body, 'highlightStrength');
    this.toggle(body, 'highlightFollowMouse', '自动跟踪鼠标', true);
    this.reset(body, ['highlightDirection', 'highlightStrength',
                      'highlightFollowMouse']);

    this.group(body, '内部夹层');
    this.slider(body, 'internalBlur');

    this.group(body, '鼠标反馈');
    const feedback = element('div', 'lg-row lg-row-split', body);
    this.toggle(feedback, 'touchFeedback', '触碰反馈');
    this.toggle(feedback, 'dragFeedback', '拖动反馈');
    this.reset(body, ['touchFeedback', 'dragFeedback']);

    this.group(body, '形状');
    const shape = element('div', 'lg-row lg-row-split', body);
    this.shapeCircle = this.shapeButton(shape, '圆形', true);
    this.shapeCapsule = this.shapeButton(shape, '胶囊型', false);

    this.group(body, '尺寸');
    this.slider(body, 'size');
    this.slider(body, 'length');
    this.reset(body, ['size', 'length']);

    const footer = element('div', 'lg-row lg-row-end', body);
    const close = element('button', 'lg-button lg-button-danger', footer);
    close.type = 'button';
    close.textContent = '关闭';
    close.addEventListener('click', () => {
      this.close();
      if (this.onClose) this.onClose();
    });

    document.body.appendChild(root);
    this.refresh();

    this.handleKeydown = (event) => {
      if (event.key === 'Escape' && this.visible) this.close();
    };
    window.addEventListener('keydown', this.handleKeydown);
  }

  group(parent, title) {
    element('div', 'lg-group', parent).textContent = title;
  }

  slider(parent, key) {
    const definition = SLIDERS[key];
    const row = element('div', 'lg-row lg-slider-row', parent);
    const label = element('label', 'lg-label', row);
    label.textContent = definition.label;
    const input = element('input', 'lg-slider', row);
    input.type = 'range';
    input.min = String(definition.min);
    input.max = String(definition.max);
    input.step = '1';
    const value = element('span', 'lg-value', row);
    input.addEventListener('input', () => {
      const raw = Number(input.value);
      const applied = definition.curved
          ? sizeValueFromSliderPosition(raw) : raw;
      this.glass.updateSettings({[key]: applied});
      this.paintSlider(key);
    });
    this.sliders.set(key, {row, input, value, definition});
    return input;
  }

  reset(parent, keys) {
    const row = element('div', 'lg-row lg-row-end', parent);
    const button = element('button', 'lg-button', row);
    button.type = 'button';
    button.textContent = '恢复默认值';
    button.addEventListener('click', () => {
      const patch = {};
      for (const key of keys) patch[key] = DEFAULT_SETTINGS[key];
      this.glass.updateSettings(patch);
      this.refresh();
    });
  }

  toggle(parent, key, label, fullWidth = false) {
    const button = element(
        'button', `lg-button lg-toggle${fullWidth ? ' lg-button-wide' : ''}`,
        parent);
    button.type = 'button';
    button.textContent = label;
    button.addEventListener('click', () => {
      this.glass.updateSettings({[key]: !this.glass.settings[key]});
      this.refresh();
    });
    this.toggles.set(key, button);
    return button;
  }

  shapeButton(parent, label, circle) {
    const button = element('button', 'lg-button lg-toggle', parent);
    button.type = 'button';
    button.textContent = label;
    button.addEventListener('click', () => {
      this.glass.updateSettings({circle});
      this.refresh();
    });
    return button;
  }

  paintSlider(key) {
    const entry = this.sliders.get(key);
    if (!entry) return;
    const {input, value, definition} = entry;
    const settingValue = this.glass.settings[key];
    const position = definition.curved
        ? sizeSliderPositionFromValue(settingValue) : settingValue;
    if (Number(input.value) !== position) input.value = String(position);
    const range = Math.max(definition.max - definition.min, 1);
    const filled = (position - definition.min) / range;
    input.style.setProperty('--lg-fill', `${(filled * 100).toFixed(2)}%`);
    value.textContent = `${settingValue}${definition.unit}`;
  }

  setDisabled(key, disabled) {
    const entry = this.sliders.get(key);
    if (!entry) return;
    entry.row.classList.toggle('lg-disabled', disabled);
    entry.input.disabled = disabled;
  }

  refresh() {
    for (const key of this.sliders.keys()) this.paintSlider(key);
    for (const [key, button] of this.toggles) {
      button.classList.toggle('lg-active', Boolean(this.glass.settings[key]));
    }
    const circle = this.glass.settings.circle;
    this.shapeCircle.classList.toggle('lg-active', circle);
    this.shapeCapsule.classList.toggle('lg-active', !circle);
    this.setDisabled('length', circle);
    this.setDisabled('highlightDirection',
                     this.glass.settings.highlightFollowMouse);
  }

  makeDraggable(handle) {
    let origin = null;
    handle.addEventListener('pointerdown', (event) => {
      if (event.target.closest('.lg-dismiss')) return;
      origin = {
        x: event.clientX,
        y: event.clientY,
        left: this.root.offsetLeft,
        top: this.root.offsetTop,
      };
      handle.setPointerCapture(event.pointerId);
      event.preventDefault();
    });
    handle.addEventListener('pointermove', (event) => {
      if (!origin) return;
      this.root.style.left = `${origin.left + event.clientX - origin.x}px`;
      this.root.style.top = `${origin.top + event.clientY - origin.y}px`;
    });
    const release = () => {
      origin = null;
    };
    handle.addEventListener('pointerup', release);
    handle.addEventListener('pointercancel', release);
  }

  openAt(clientX, clientY) {
    this.root.hidden = false;
    this.visible = true;
    this.refresh();
    const width = this.root.offsetWidth;
    const height = this.root.offsetHeight;
    const left = Math.min(Math.max(clientX + 8, 8), window.innerWidth - width - 8);
    const top = Math.min(Math.max(clientY + 8, 8), window.innerHeight - height - 8);
    this.root.style.left = `${Math.max(left, 8)}px`;
    this.root.style.top = `${Math.max(top, 8)}px`;
  }

  close() {
    this.root.hidden = true;
    this.visible = false;
  }

  destroy() {
    window.removeEventListener('keydown', this.handleKeydown);
    this.root.remove();
  }
}
