import GLib from 'gi://GLib';
import Gio from 'gi://Gio';
import St from 'gi://St';
import Clutter from 'gi://Clutter';
import {Extension} from 'resource:///org/gnome/shell/extensions/extension.js';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import * as PanelMenu from 'resource:///org/gnome/shell/ui/panelMenu.js';
import * as PopupMenu from 'resource:///org/gnome/shell/ui/popupMenu.js';

export default class BatteryThresholdsExtension extends Extension {
    readBatteryThresholds() {
        const startPath = '/sys/class/power_supply/BAT0/charge_control_start_threshold';
        const endPath   = '/sys/class/power_supply/BAT0/charge_control_end_threshold';
        try {
            const start = GLib.file_get_contents(startPath)[1].toString().trim();
            const end   = GLib.file_get_contents(endPath)[1].toString().trim();
            return { start: parseInt(start), end: parseInt(end) };
        } catch (e) {
            return null;
        }
    }
    
    getIconForMode(modeIndex) {
        switch(modeIndex) {
            case 0: return 'battery-low-symbolic'; 
            case 1: return 'battery-good-symbolic'; 
            case 2: return 'battery-full-symbolic';  
            default: return 'battery-full-symbolic';
        }
    }
    
    setIconColor(color) {
        this.icon.set_style(`color: ${color};`);
    }

    enable() {
        this.batteryMenu = new PanelMenu.Button(0.0, this.metadata.name, false);
        this.icon = new St.Icon({
            icon_name: 'face-laugh-symbolic',
            style_class: 'system-status-icon',
        });
        this.batteryMenu.add_child(this.icon);
        this.modes = [
            { name: "Эко (40–60%)", start: 40, end: 60 },
            { name: "Баланс (20–80%)", start: 20, end: 80 },
            { name: "Полный (0–100%)", start: 0, end: 100 }  
        ];
        const thresholds = this.readBatteryThresholds();
        this.currentModeIndex = this.modes.findIndex(mode => 
            thresholds && mode.start === thresholds.start && mode.end === thresholds.end
        );
        if (this.currentModeIndex === -1) {
            this.currentModeIndex = 0;
        }
        this.icon.icon_name = this.getIconForMode(this.currentModeIndex);
        switch (this.currentModeIndex) {
            case 0: this.setIconColor('green'); break;
            case 1: this.setIconColor('orange'); break;
            case 2: this.setIconColor('red'); break;
        }
        this.menuItems = [];
        this.modes.forEach((mode, index) => {
            const item = new PopupMenu.PopupMenuItem(mode.name);
            
            if (index === this.currentModeIndex) {
                item.label.set_style('text-decoration: underline; font-weight: bold;');
            }
            item.connect('activate', () => {
                if (this.menuItems[this.currentModeIndex]) {
                    this.menuItems[this.currentModeIndex].label.set_style('');
                }
                item.label.set_style('text-decoration: underline; font-weight: bold;');
                this.currentModeIndex = index;
                this.icon.icon_name = this.getIconForMode(index);
                switch (index) {
                    case 0: this.setIconColor('green'); break;
                    case 1: this.setIconColor('orange'); break;
                    case 2: this.setIconColor('red'); break;
                }
                const cmd = `sudo /usr/local/bin/set_battery_thresholds_for_ext.sh ${mode.start} ${mode.end}`;
                GLib.spawn_command_line_async(cmd);
            });
            this.menuItems.push(item);
            this.batteryMenu.menu.addMenuItem(item);
        });
        Main.panel.addToStatusArea(this.uuid, this.batteryMenu);
    }

    disable() {
        this.batteryMenu?.destroy();
        this.batteryMenu = null;
    }
}
