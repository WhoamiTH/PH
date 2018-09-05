# Workflow Editor for Precision Health

# 1. Introduction

The Precision Health System is a system which measures the state of health of individuals and gives appropriate suggestions before they suffering from potential diseases. The Workflow Editor for Precision Health is designed to define and execute the workflow and display the intermediate results. In addition, it saves the data in the database which is prepared for the further analysis.

# 2. Files structure

The root directory `Workflow_Editor_for_Precision_Health` contains serveral directories and files.
1. The source code directory `workflow`.
2. The archives of the other tools which need to be installed. For example, `Python 3.6.2`, `MySQL 5.7.23`. And the script files for installing the tools, `install_python.sh` and `install_mysql.sh`.
3. The file for the package requirements, `requirements.txt`. 
4. The database file, `precision_health.sql`. 
5. Two examples workflow files are put in the example directory.

```
Workflow_Editor_for_Precision_Health
├── example
│   ├── add.txt
│   └── precision_health.txt
├── install_mysql.sh
├── install_packages.sh
├── install_python.sh
├── mysql-server_5.7.23-1ubuntu16.04_amd64.deb-bundle.tar
├── precision_health.sql
├── Python-3.6.2.tgz
├── requirements.txt
└── workflow
    ├── service.py
    ├── static
    ├── templates
    └── workflow.py
```


# 3. Requirements
There are several requirements for executing the Workflow Editor for Precision Health system. These requirements can be divided into 2 parts, the environment requirements, and the package requirements.

## 3.1 Environment requirements
Python 3.6.2 is used to develop the system, and the database employed in this system is MySQL 5.7.23, therefore, Python 3.6.2 and MySQL 5.7.23 are required.

## 3.2 Packages requirements
The packages requirements contain the packages which are adopted in this system. They are mainly Flask, which is the framework of building the website, PyMySQL, which is used to connect with the MySQL database, numpy, which is employed to handle the data. All the packages which are demanded are listed in the requirements.txt.

# 4 Installation
The Workflow Editor is designed to be implemented on the Ubuntu 16.04, therefore, the install methods which will be introduced are based on the Ubuntu 16.04. And some resources and dependecy packages may be downloaded from the Internet automatically. 

## 4.1 Install the environment requirements

### 4.1.1 Install Python 3.6.2

Open the terminal at the Workflow Editor for Precision Health directory, and use the command:
```
sudo sh install_python.sh
```
### 4.1.2 Install MySQL database and import the database file

* Install mysql server from the command line:
```
sudo sh install_mysql.sh
```

* Execute command-line mysql client from the console:
```
mysql –u (username) –p (your password)
```
* Create the database:
```
mysql> CREATE DATABASE precision_health;
mysql> exit
```
* Import the database schema:
```
mysql –u (username) –p precision_health < precision_health.sql
```

## 4.2 Install the packages requirements

The package requirements, including the name and version, are listed in the file `requirements.txt`, all the exact packages can be downloaded and installed automatically by the following command.

```
sudo sh install_packages.sh
```

# 5. Run

After successfully setting up the environment and the packages, the **Workflow Editor for Precision Health** system can be executed. Change the directory into the workflow directory. Run the system from the command line:
```
 cd workflow
 python3.6 workflow.py
```

The following parameters have been set with default values. 


| Parameters | Meaning | Default value |
| -------- | -------- | -------- |
| host     | the host name of the database | localhost |
| user | the user name for connecting database | root |
| password | the password for connecting database | 123456 |
| database_name | the name of the database | precision_health |
| username| the identification of different users | 1 |


To modify these parameters, the name of parameter and the value can be appended after the running command. 

An example is given below.

```
python workflow.py host=127.0.0.1 password=111111 username=2
```
Finally, filling the address bar of the browser by using `127.0.0.1:5000`, the Workflow Editor for Precision Health is available.

![](https://i.imgur.com/QeZmno1.png)
<center>Figure 1. The webpage of the Workflow Editor for Precision Health</center>

# 6 Examples

## 6.1 Add workflow
This is an example workflow which achieve the add funciton. The Process1 generates the sum of the two number from the input node. The Process2 calculates the sum of the result of Process1 and the first number of the input node. The output node displays the results of Process1 and Process2.
![](https://i.imgur.com/edjC1GD.png)
<center>Figure 2. The add workflow example</center>

## 6.2 Precision Health workflow
This is a precision health system workflow example. The data is collected by the input node and is delieved to different process. After calculating, the state of health and the suggestion will be generated. 
![](https://i.imgur.com/h8VbNyS.png)

<center>Figure 3. The Precision Health workflow example</center>


