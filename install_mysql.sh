#！/bin/bash
sudo tar -xvf mysql-server_5.7.23-1ubuntu16.04_amd64.deb-bundle.tar
sudo apt-get install libaio1
sudo dpkg -i mysql-common_5.7.23-1ubuntu16.04_amd64.deb
sudo dpkg -i libmysqlclient20_5.7.23-1ubuntu16.04_amd64.deb
sudo dpkg -i libmysqlclient-dev_5.7.23-1ubuntu16.04_amd64.deb
sudo dpkg -i libmysqld-dev_5.7.23-1ubuntu16.04_amd64.deb
sudo dpkg -i mysql-community-client_5.7.23-1ubuntu16.04_amd64.deb
sudo dpkg -i mysql-client_5.7.23-1ubuntu16.04_amd64.deb
sudo apt-get upgrade
sudo apt-get update
sudo apt-get -f install
sudo dpkg -i mysql-community-server_5.7.23-1ubuntu16.04_amd64.deb
sudo dpkg -i mysql-server_5.7.23-1ubuntu16.04_amd64.deb
sudo apt-get upgrade
sudo apt-get update
sudo apt-get -f install
