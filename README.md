1. Clone git repository

If you are WINDOW user, in WSL environment such as ubuntu, copy the below code

```console
git clone https://capstone-cs.eng.utah.edu/biology_clinic/biology_clinic.git
```

after cloning.

```console
#   type ls to see if it is cloned correctly
root@DESKTOP-M7CME86:~# ls
biology_clinic     <= it will be shown

root@DESKTOP-M7CME86:~# cd biology_clinic    <= move to biology_clinic directory

root@DESKTOP-M7CME86:~/biology_clinic# code . <= open the directory in VS code
```

2. Install React

For installing yarn, we need a npm. For installing npm, we need a node.js

node.js -> npm -> yarn

```console
#   Step for installing node.js
#   update sudo
root@admin:~# sudo apt update

#   install nodejs
root@admin:~# sudo apt install nodejs

#   check if node version if it's installed
root@admin:~# sudo node -v

```

~~node.js~~ -> npm -> yarn



```console
#   step for installing npm

#   installing npm
root@admin:~# sudo apt install npm
#   
root@admin:~# sudo npm install -g n
#   check npm version
root@admin:~# sudo n -V
#   update node to lts version
root@admin:~# sudo n lts

```

Current process: 
~~node.js~~ -> ~~npm~~ -> yarn

```console
#   step for installing yarn

#   installing yarn
root@admin:~# sudo npm install -g yarn

#   check yarn version
root@admin:~# yarn -v
root@admin:~# yarn

```

Current process: 
~~node.js~~ -> ~~npm~~ -> ~~yarn~~

you can type 

```console
yarn dev --host 0.0.0.0 
```
for running React

3. Backend

```console
#   check python3 version if it is installed or not.
root@admin:~# pip --version

#   if not
root@admin:~# apt install python3-pip

# install django
root@admin:~# pip install django

#   install django framework
root@admin:~# pip install djangorestframework

root@admin:~# pip install django-cors-headers

root@admin:~# pip install psycopg2-binary


```


4. PostgreSQL

```console
#   apt update before download PostgreSQL
root@admin:~# sudo apt update

#   install PostgreSQL
root@admin:~# sudo apt install postgresql postgresql-contrib

#   check if postgresql is activate or not
root@admin:~# sudo service postgresql status

sudo service postgresql start

sudo -i -u postgres psql

#   we will install DB in local temporarly
CREATE database genventory;
create user admin with encrypted password 'utah123';
grant all privileges on database genventory to admin;
```


```
*************************MERGE REQUEST*************************
 *************************IMPORTANT*************************

DO NOT MERGE YOUR CODE TO MAIN DIRECTLY.

MERGE MAIN TO YOUR BRANCH FIRST AND FIX CONFLICT FIRST.

IT IS YOUR RESPONSIBLE TO RESOLVE CONFLICT AND CHECK IF IT IS WORKING

```
