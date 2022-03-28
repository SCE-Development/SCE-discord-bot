#!/bin/bash
echo 'Running Reboot Script'
if [ ! "$(docker ps -q -f name=bot)" ]; then
	if [ "$(docker ps -a -q -f status=exited -f name=bot)" ]; then
		docker rm bot
		echo 'Removed Bot Image'
	fi
	echo 'Running bot'
	cd /home/sce/SCE-discord-bot
	/usr/local/bin/docker-compose -f docker-compose.yml up -d
else
	echo 'Bot is already running!'
fi
