.PHONY: docker-build sync-webui-image reload-stack deploy-webui


docker-build:
		docker build -t iphound-webui .

sync-webui-image:
		docker save iphound-webui:latest | ssh rnvps -C 'docker load'

reload-stack:
		ssh -C rnvps 'docker compose -f /home/ops/configs/iphound/docker-compose.yaml up --force-recreate -t 0 -d'

deploy-webui: docker-build sync-webui-image reload-stack
