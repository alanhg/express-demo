#!/bin/sh
YUM_CMD=$(which yum)
APT_GET_CMD=$(which apt-get)
APT_CMD=$(which apt)
PIP_CMD=$(which pip)
PACKAGE=supervisor

 if [ ! -z $YUM_CMD ]; then
    yum install -y $PACKAGE
 elif [ ! -z $APT_GET_CMD ]; then
    apt-get install -y $PACKAGE
 elif [ ! -z $APT_CMD ]; then
    apt install -y $PACKAGE
 elif [ ! -z $PIP_CMD ]; then
    pip install $PACKAGE
 else
    echo "error can't install package $PACKAGE"
    exit 1;
 fi
