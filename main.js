const { Plugin, ItemView, FileSystemAdapter, Notice, PluginSettingTab } = require('obsidian');
const fs = require('fs');
const path = require('path');

const VIEW_TYPE = 'focus-tracker';
const DATA_FILE = 'focus-tracker-data.json';

class FocusTrackerView extends ItemView {
  constructor(leaf, plugin) {
    super(leaf);
    this.plugin = plugin;
  }

  getViewType() {
    return VIEW_TYPE;
  }

  getDisplayText() {
    return 'Calm Focus Log';
  }

  getIcon() {
    return 'calendar-check';
  }

  async onOpen() {
    this.contentEl.empty();
    this.contentEl.addClass('focus-tracker-view');

    this.iframe = this.contentEl.createEl('iframe', {
      cls: 'focus-tracker-iframe',
      attr: { title: 'Calm Focus Log' }
    });

    const html = this.plugin.readAsset('tracker.html');
    if (!html) {
      this.contentEl.createEl('p', {
        text: 'Could not load tracker.html from the plugin folder.'
      });
      return;
    }

    this.iframe.srcdoc = html;
    this.messageHandler = (event) => this.handleMessage(event);
    window.addEventListener('message', this.messageHandler);
  }

  async handleMessage(event) {
    if (event.data?.source !== 'focus-tracker') return;
    if (event.source !== this.iframe?.contentWindow) return;

    const { type, payload } = event.data;

    if (type === 'ready' || type === 'load') {
      const result = await this.plugin.loadTrackerData();
      event.source.postMessage({
        source: 'focus-tracker-plugin',
        type: 'init',
        result
      }, '*');
    }

    if (type === 'save') {
      await this.plugin.saveTrackerData(payload || {});
    }
  }

  async onClose() {
    window.removeEventListener('message', this.messageHandler);
  }
}

module.exports = class FocusTrackerPlugin extends Plugin {
  readAsset(filename) {
    const adapter = this.app.vault.adapter;
    if (!(adapter instanceof FileSystemAdapter)) {
      new Notice('Calm Focus Log: local file access is unavailable on this platform.');
      return null;
    }

    const base = adapter.getBasePath();
    const full = path.join(
      base,
      this.app.vault.configDir,
      'plugins',
      this.manifest.id,
      filename
    );

    try {
      return fs.readFileSync(full, 'utf8');
    } catch (err) {
      console.error('Calm Focus Log: failed to read asset', full, err);
      return null;
    }
  }

  async loadTrackerData() {
    const file = this.app.vault.getAbstractFileByPath(DATA_FILE);
    if (!file) return {};

    try {
      const raw = await this.app.vault.read(file);
      return raw ? JSON.parse(raw) : {};
    } catch (err) {
      console.error('Calm Focus Log: failed to parse data file', err);
      new Notice('Calm Focus Log: data file is corrupted.');
      return {};
    }
  }

  async saveTrackerData(data) {
    const content = JSON.stringify(data, null, 2);
    let file = this.app.vault.getAbstractFileByPath(DATA_FILE);

    if (file) {
      await this.app.vault.modify(file, content);
    } else {
      await this.app.vault.create(DATA_FILE, content);
    }
  }

  async activateView() {
    const { workspace } = this.app;
    let leaf = workspace.getLeavesOfType(VIEW_TYPE)[0];

    if (!leaf) {
      const right = workspace.getRightLeaf(false);
      if (right) {
        leaf = right;
      } else {
        leaf = workspace.getLeaf(true);
      }
      await leaf.setViewState({ type: VIEW_TYPE, active: true });
    }

    workspace.revealLeaf(leaf);
  }

  async onload() {
    this.registerView(VIEW_TYPE, (leaf) => new FocusTrackerView(leaf, this));

    this.addCommand({
      id: 'open-calm-focus-log',
      name: 'Open calm focus log',
      callback: () => this.activateView()
    });

    this.addRibbonIcon('calendar-check', 'Calm focus log', () => this.activateView());

    this.addSettingTab(new FocusTrackerSettingTab(this.app, this));
  }
};

class FocusTrackerSettingTab extends PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display() {
    const { containerEl } = this;
    containerEl.empty();

    containerEl.createEl('p', {
      text: `Sessions are saved to ${DATA_FILE} in your vault root.`
    });
    containerEl.createEl('p', {
      text: 'Open via the ribbon icon or command palette: Open calm focus log.'
    });
  }
}
