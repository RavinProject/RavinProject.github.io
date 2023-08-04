cd server

## somente na primeira execução após a clonagem do repositório
npm install
python -m venv venv
source venv/bin/activate
pip install --upgrade pip
pip install --upgrade setuptools
pip install PyYAML==5.3.1
pip install awsebcli

## nas demais execuções
python -m venv venv

## associar a branch atual a um ambiente
eb use ravin-project

## deploy
eb deploy

