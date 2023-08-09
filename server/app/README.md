# Instalação

`cd server`

## somente na primeira execução após a clonagem do repositório

1. `npm install`
2. `python -m venv venv`
3. `source venv/bin/activate`
4. `pip install --upgrade pip`
5. `pip install --upgrade setuptools`
6. `pip install PyYAML==5.3.1`
7. `pip install awsebcli`

## nas demais execuções

`python -m venv venv`
`source venv/bin/activate`

## sair do ambiente virtual

`deactivate`

## associar a branch atual a um ambiente

`eb use ravin-project`

## deploy

`eb deploy`
