# BatteryThresholds 🔋

**EN:** Extension for Ubuntu (GNOME Shell 46) to control the minimum and maximum charge levels at which the battery is charged or not charged. Tested on **Huawei Matebook 14 FLMH-X**.  

**RU:** Расширение для Ubuntu (GNOME Shell 46) для контроля минимального и максимального уровня заряда батареи. Работает и протестировано на ноутбуке **Huawei Matebook 14 FLMH-X**.  

---

## Installation / Установка

### 1. Install required packages / Установка зависимостей
```bash
sudo apt update
sudo apt install gnome-shell-extensions gnome-tweaks
sudo apt install git gnome-shell-extension-prefs build-essential
```

### 2. Create the script / Создание скрипта
```bash
cd /usr/local/bin
sudo touch set_battery_thresholds_for_ext.sh
sudo chmod +x set_battery_thresholds_for_ext.sh
```
[`set_battery_thresholds_for_ext.sh`](https://github.com/Dmitriy-10SA/BatteryThresholds/blob/main/set_battery_thresholds_for_ext.sh)  


3. Allow passwordless sudo for the script / Разрешение выполнения без пароля
```bash
sudo nano /etc/sudoers.d/battery-threshold
# CHANGE / ЗАМЕНИТЕ USERNAME!
USERNAME ALL=(ALL) NOPASSWD: /usr/local/bin/set_battery_thresholds_for_ext.sh
```

4. Install the GNOME Shell extension / Установка расширения
```bash
mkdir -p ~/.local/share/gnome-shell/extensions/battery-thresholds@dsemkin
cd ~/.local/share/gnome-shell/extensions/battery-thresholds@dsemkin
touch extension.js metadata.json
```
[`extension.js`](https://github.com/Dmitriy-10SA/BatteryThresholds/blob/main/extension.js)  
[`metadata.json`](https://github.com/Dmitriy-10SA/BatteryThresholds/blob/main/metadata.json)  

5. Restart GNOME / Перезагрузка GNOME
```bash
sudo reboot
```
6. Enable the extension / Включение расширения

You can enable an extension through the extension manager (Gnome UI) or bash / Вы можете включить расширение с помощью менеджера расширений (Gnome UI) или bash
```bash
gnome-extensions enable battery-thresholds@dsemkin
```
