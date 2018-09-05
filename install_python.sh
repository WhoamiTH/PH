#！/bin/bash
sudo apt-get install zlib1g-dev
sudo apt-get install libbz2-dev
sudo apt-get install libsqlite3-dev
sudo apt-get install python3-dev
sudo apt-get install libssl1.0.0 libssl-dev tcl tk sqlite sqlite3 libbz2-1.0 libexpat1 libexpat1-dev libgdbm3 libgdbm-dev  libreadline5 libreadline6 libreadline-dev libreadline6-dev libsqlite0 libsqlite0-dev libsqlite3-0 openssl
sudo tar -zxvf Python-3.6.2.tgz
cd Python-3.6.2
sudo ./configure --prefix=/usr/local --enable-shared
sudo make
sudo make install
sudo cp /usr/local/lib/libpython3.6m.so.1.0 /usr/lib/
sudo apt install python-pip
sudo apt install python3-pip
sudo pip install --upgrade pip

