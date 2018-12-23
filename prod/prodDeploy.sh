triton-docker build -t mr-prod .
triton-docker run -d -p 80 -p 443 --name=prod-app-[insert-tag] mr-prod