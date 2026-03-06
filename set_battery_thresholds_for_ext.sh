#!/bin/bash
# Скрипт для установки порогов зарядки батареи
START=$1
END=$2
BAT="/sys/class/power_supply/BAT0"

if [ -w "$BAT/charge_control_start_threshold" ] && [ -w "$BAT/charge_control_end_threshold" ]; then
    echo $START | sudo tee "$BAT/charge_control_start_threshold"
    echo $END | sudo tee "$BAT/charge_control_end_threshold"
fi
