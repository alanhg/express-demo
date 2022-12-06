
 init_environment_variables(){
  export CODE_SERVER_PORT=36000
  export CODE_SERVER_VERSION=4.7.1
  export CODE_SERVER_DIR=$HOME/.term/code-server
  export CODE_SERVER_RUN_DIR=$HOME/.term/code-server-run
  export BIND_ADDR=127.0.0.1:$CODE_SERVER_PORT
  export USER_DATA_PATH=$CODE_SERVER_DIR/share
  export CONFIG_PATH=$CODE_SERVER_DIR/.config/config.yaml
  export EXTENSION_PATH=$CODE_SERVER_DIR/share/extensions
  PATH="$CODE_SERVER_DIR/bin:$PATH"
}


# 安装主程序包
 install_code_server(){
  echo '0. install code-server'

  if which $CODE_SERVER_DIR/bin/code-server >/dev/null; then
    echo "0. install code-server-$CODE_SERVER_VERSION installed"
     return
  fi

  mkdir -p $CODE_SERVER_DIR/lib $CODE_SERVER_DIR/bin $CODE_SERVER_DIR/share/extensions $CODE_SERVER_RUN_DIR

  curl -fLsS https://github.com/coder/code-server/releases/download/v$CODE_SERVER_VERSION/code-server-$CODE_SERVER_VERSION-linux-amd64.tar.gz \
    | tar -C $CODE_SERVER_DIR/lib -xz

  mv $CODE_SERVER_DIR/lib/code-server-$CODE_SERVER_VERSION-linux-amd64 $CODE_SERVER_DIR/lib/code-server-$CODE_SERVER_VERSION

  ln -s $CODE_SERVER_DIR/lib/code-server-$CODE_SERVER_VERSION/bin/code-server $CODE_SERVER_DIR/bin/code-server
}

# 瀹夎鎻掍欢
 install_extensions(){
  echo '1. install extensions'
  if [ -d $CODE_SERVER_DIR/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal ]; then
#    echo '1. install extensions skipped'
     return
  fi
  curl -fLsS https://raw.githubusercontent.com/alanhg/express-demo/master/lib/code-server/model/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal.gz \
  | tar -C $CODE_SERVER_DIR/share/extensions -xz
}

 init_user_settings(){
  echo '2. init user settings'

cat <<EOF >  $CODE_SERVER_DIR/share/languagepacks.json
{
  "zh-cn": {
    "hash": "7e362a7c22d4de1987d4809ea0dadc08",
    "extensions": [
      {
        "extensionIdentifier": {
          "id": "ms-ceintl.vscode-language-pack-zh-hans",
          "uuid": "e4ee7751-6514-4731-9cdb-7580ffa9e70b"
        },
        "version": "1.71.0"
      }
    ],
    "translations": {
      "vscode": "$CODE_SERVER_DIR/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/main.i18n.json"
    },
    "label": "涓枃(绠€浣�)"
  }
}
EOF
settings_json=$CODE_SERVER_DIR/share/User/settings.json
if [ ! -e $settings_json ]
then
 mkdir -p $CODE_SERVER_DIR/share/User/
    curl -sS https://raw.githubusercontent.com/alanhg/express-demo/master/lib/code-server/model/default-settings.json >  $CODE_SERVER_DIR/share/User/settings.json
fi
#  echo '2. init user settings skipped'
}

 init_supervisor_settings(){
  echo '4. init supervisor settings'
  if [ -d $CODE_SERVER_RUN_DIR/supervisord-conf ]; then
#    echo '4. init supervisor settings skipped'
      return
  fi
  curl -fLsS https://raw.githubusercontent.com/alanhg/express-demo/master/lib/code-server/model/supervisord-conf.tar.gz \
    | tar -C $CODE_SERVER_RUN_DIR -xz
}

 start_supervisor_server(){
  echo '5. start supervisor server'
  regex="RUNNING|STARTED|running|started"
  $CODE_SERVER_RUN_DIR/supervisord-conf/bin/supervisord -c $CODE_SERVER_RUN_DIR/supervisord-conf/supervisord.conf -d
  client_status=$($CODE_SERVER_RUN_DIR/supervisord-conf/bin/supervisord -c $CODE_SERVER_RUN_DIR/supervisord-conf/supervisord.conf ctl status code-server)
  if [[ $client_status =~ $regex ]]; then
#    echo '6. start supervisor client skipped'
    client_status=$($CODE_SERVER_RUN_DIR/supervisord-conf/bin/supervisord -c $CODE_SERVER_RUN_DIR/supervisord-conf/supervisord.conf ctl restart code-server)
  else
    client_status=$($CODE_SERVER_RUN_DIR/supervisord-conf/bin/supervisord -c $CODE_SERVER_RUN_DIR/supervisord-conf/supervisord.conf ctl start code-server)
  fi

  if [[ $client_status =~ $regex ]]; then
        echo '6. init success'
        return
      else
        echo '6. init failed'
        return
 fi
}

init_environment_variables
install_code_server
install_extensions
init_user_settings
init_supervisor_settings
start_supervisor_server
