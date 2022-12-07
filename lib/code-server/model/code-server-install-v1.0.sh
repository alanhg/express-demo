
arch() {
  uname_m=$(uname -m)
  case $uname_m in
    aarch64) echo arm64 ;;
    x86_64) echo amd64 ;;
    *) echo "$uname_m" ;;
  esac
}

os() {
  uname="$(uname)"
  case $uname in
    Linux) echo linux ;;
    Darwin) echo macos ;;
    FreeBSD) echo freebsd ;;
    *) echo "$uname" ;;
  esac
}

 init_environment_variables(){
  export CODE_SERVER_PORT=35999
  export CODE_SERVER_VERSION=4.7.1
  export CODE_SERVER_DIR=$HOME/.term/code-server
  export CODE_SERVER_RUN_DIR=$HOME/.term/code-server-run
  export BIND_ADDR=0.0.0.0:$CODE_SERVER_PORT
  export USER_DATA_PATH=$CODE_SERVER_DIR/share
  export CONFIG_PATH=$CODE_SERVER_DIR/.config/config.yaml
  export EXTENSION_PATH=$CODE_SERVER_DIR/share/extensions
  PATH="$CODE_SERVER_DIR/bin:$PATH"


  OS=${OS:-$(os)}
  ARCH=${ARCH:-$(arch)}
}


# 安装主程序包
 install_code_server(){
  echo '0. install code-server'
  mkdir -p $CODE_SERVER_DIR/lib $CODE_SERVER_DIR/bin $CODE_SERVER_DIR/share/extensions $CODE_SERVER_RUN_DIR

  if [ -d $CODE_SERVER_DIR/lib/code-server-$CODE_SERVER_VERSION ]; then
  echo "0. install code-server-$CODE_SERVER_VERSION installed"
  else
  curl  -fsSL https://github.com/coder/code-server/releases/download/v$CODE_SERVER_VERSION/code-server-$CODE_SERVER_VERSION-$OS-$ARCH.tar.gz \
    | tar -C $CODE_SERVER_DIR/lib -xz

  mv $CODE_SERVER_DIR/lib/code-server-$CODE_SERVER_VERSION-$OS-$ARCH $CODE_SERVER_DIR/lib/code-server-$CODE_SERVER_VERSION
  fi
  ln -sf $CODE_SERVER_DIR/lib/code-server-$CODE_SERVER_VERSION/bin/code-server $CODE_SERVER_DIR/bin/code-server
}

# 瀹夎鎻掍欢
 install_extensions(){
  echo '1. install extensions'
  if [ -d $CODE_SERVER_DIR/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal ]; then
  echo '1. install extensions installed'
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
    "label": "中文(简体)"
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
  $CODE_SERVER_RUN_DIR/supervisord-conf/bin/supervisord -c $CODE_SERVER_RUN_DIR/supervisord-conf/supervisord.conf -d
  client_status=$($CODE_SERVER_RUN_DIR/supervisord-conf/bin/supervisord -c $CODE_SERVER_RUN_DIR/supervisord-conf/supervisord.conf ctl status code-server)

if test -n "${client_status#*RUNNING}" -o -z "${client_status#*running}"; then
  client_status=$($CODE_SERVER_RUN_DIR/supervisord-conf/bin/supervisord -c $CODE_SERVER_RUN_DIR/supervisord-conf/supervisord.conf ctl restart code-server)
elif test -n "${client_status#*STARTED}" -o -z "${client_status#*started}"; then
  client_status=$($CODE_SERVER_RUN_DIR/supervisord-conf/bin/supervisord -c $CODE_SERVER_RUN_DIR/supervisord-conf/supervisord.conf ctl restart code-server)
else
  client_status=$($CODE_SERVER_RUN_DIR/supervisord-conf/bin/supervisord -c $CODE_SERVER_RUN_DIR/supervisord-conf/supervisord.conf ctl start code-server)
fi


if test -n "${client_status#*RUNNING}" -o -z "${client_status#*running}"; then
  echo "6. init success: $client_status"
elif test -n "${client_status#*STARTED}" -o -z "${client_status#*started}"; then
  echo "6. init success: $client_status"
else
  echo "6. init failed: $client_status"
fi
}


start_caddy_proxy(){
  mkdir -p $CODE_SERVER_RUN_DIR/nginx
  curl -sS https://raw.githubusercontent.com/alanhg/express-demo/master/lib/code-server/model/nginx/conf/default.conf > $CODE_SERVER_RUN_DIR/nginx/conf/default.conf
#  /usr/bin/caddy start --config $CODE_SERVER_RUN_DIR/caddy/Caddyfile --force
  nginx -c $CODE_SERVER_RUN_DIR/nginx/default.conf restart
}

init_environment_variables
install_code_server
install_extensions
init_user_settings
init_supervisor_settings
start_supervisor_server
start_caddy_proxy
