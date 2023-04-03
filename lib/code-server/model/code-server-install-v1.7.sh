#!/bin/sh

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
  export CODE_SERVER_PORT=36000
  export CODE_SERVER_VERSION=4.7.1
  export SUPERVISOR_CONF_VERSION=0.3
  export CODE_SERVER_DIR=$HOME/.term/code-server
  export CODE_SERVER_RUN_DIR=$HOME/.term/code-server-run
  export BIND_ADDR=0.0.0.0:$CODE_SERVER_PORT
  export USER_DATA_PATH=$CODE_SERVER_DIR/share
  export CONFIG_PATH=$CODE_SERVER_DIR/.config/config.yaml
  export EXTENSION_PATH=$CODE_SERVER_DIR/share/extensions
  PATH="$CODE_SERVER_DIR/bin:$PATH"


  OS=${OS:-$(os)}
  ARCH=${ARCH:-$(arch)}
  ECHO_SPACER="  "
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
  echo '1. extensions installed'
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
      "vscode": "$CODE_SERVER_DIR/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/main.i18n.json",
      "vscode.bat": "$CODE_SERVER_DIR/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/bat.i18n.json",
      "vscode.clojure": "$CODE_SERVER_DIR/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/clojure.i18n.json",
      "vscode.coffeescript": "$CODE_SERVER_DIR/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/coffeescript.i18n.json",
      "vscode.configuration-editing": "$CODE_SERVER_DIR/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/configuration-editing.i18n.json",
      "vscode.cpp": "$CODE_SERVER_DIR/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/cpp.i18n.json",
      "vscode.csharp": "$CODE_SERVER_DIR/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/csharp.i18n.json",
      "vscode.css-language-features": "$CODE_SERVER_DIR/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/css-language-features.i18n.json",
      "vscode.css": "$CODE_SERVER_DIR/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/css.i18n.json",
      "vscode.dart": "$CODE_SERVER_DIR/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/dart.i18n.json",
      "vscode.debug-auto-launch": "$CODE_SERVER_DIR/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/debug-auto-launch.i18n.json",
      "vscode.debug-server-ready": "$CODE_SERVER_DIR/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/debug-server-ready.i18n.json",
      "vscode.diff": "$CODE_SERVER_DIR/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/diff.i18n.json",
      "vscode.docker": "$CODE_SERVER_DIR/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/docker.i18n.json",
      "vscode.emmet": "$CODE_SERVER_DIR/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/emmet.i18n.json",
      "vscode.extension-editing": "$CODE_SERVER_DIR/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/extension-editing.i18n.json",
      "vscode.fsharp": "$CODE_SERVER_DIR/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/fsharp.i18n.json",
      "vscode.git-base": "$CODE_SERVER_DIR/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/git-base.i18n.json",
      "vscode.git": "$CODE_SERVER_DIR/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/git.i18n.json",
      "vscode.github-authentication": "$CODE_SERVER_DIR/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/github-authentication.i18n.json",
      "vscode.github": "$CODE_SERVER_DIR/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/github.i18n.json",
      "vscode.go": "$CODE_SERVER_DIR/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/go.i18n.json",
      "vscode.groovy": "$CODE_SERVER_DIR/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/groovy.i18n.json",
      "vscode.grunt": "$CODE_SERVER_DIR/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/grunt.i18n.json",
      "vscode.gulp": "$CODE_SERVER_DIR/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/gulp.i18n.json",
      "vscode.handlebars": "$CODE_SERVER_DIR/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/handlebars.i18n.json",
      "vscode.hlsl": "$CODE_SERVER_DIR/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/hlsl.i18n.json",
      "vscode.html-language-features": "$CODE_SERVER_DIR/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/html-language-features.i18n.json",
      "vscode.html": "$CODE_SERVER_DIR/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/html.i18n.json",
      "vscode.image-preview": "$CODE_SERVER_DIR/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/image-preview.i18n.json",
      "vscode.ini": "$CODE_SERVER_DIR/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/ini.i18n.json",
      "vscode.ipynb": "$CODE_SERVER_DIR/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/ipynb.i18n.json",
      "vscode.jake": "$CODE_SERVER_DIR/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/jake.i18n.json",
      "vscode.java": "$CODE_SERVER_DIR/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/java.i18n.json",
      "vscode.javascript": "$CODE_SERVER_DIR/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/javascript.i18n.json",
      "vscode.json-language-features": "$CODE_SERVER_DIR/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/json-language-features.i18n.json",
      "vscode.json": "$CODE_SERVER_DIR/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/json.i18n.json",
      "vscode.julia": "$CODE_SERVER_DIR/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/julia.i18n.json",
      "vscode.latex": "$CODE_SERVER_DIR/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/latex.i18n.json",
      "vscode.less": "$CODE_SERVER_DIR/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/less.i18n.json",
      "vscode.log": "$CODE_SERVER_DIR/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/log.i18n.json",
      "vscode.lua": "$CODE_SERVER_DIR/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/lua.i18n.json",
      "vscode.make": "$CODE_SERVER_DIR/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/make.i18n.json",
      "vscode.markdown-basics": "$CODE_SERVER_DIR/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/markdown-basics.i18n.json",
      "vscode.markdown-language-features": "$CODE_SERVER_DIR/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/markdown-language-features.i18n.json",
      "vscode.markdown-math": "$CODE_SERVER_DIR/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/markdown-math.i18n.json",
      "vscode.merge-conflict": "$CODE_SERVER_DIR/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/merge-conflict.i18n.json",
      "vscode.microsoft-authentication": "$CODE_SERVER_DIR/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/microsoft-authentication.i18n.json",
      "vscode.ms-vscode.js-debug": "$CODE_SERVER_DIR/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/ms-vscode.js-debug.i18n.json",
      "vscode.notebook-renderers": "$CODE_SERVER_DIR/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/notebook-renderers.i18n.json",
      "vscode.npm": "$CODE_SERVER_DIR/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/npm.i18n.json",
      "vscode.objective-c": "$CODE_SERVER_DIR/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/objective-c.i18n.json",
      "vscode.perl": "$CODE_SERVER_DIR/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/perl.i18n.json",
      "vscode.php-language-features": "$CODE_SERVER_DIR/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/php-language-features.i18n.json",
      "vscode.php": "$CODE_SERVER_DIR/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/php.i18n.json",
      "vscode.powershell": "$CODE_SERVER_DIR/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/powershell.i18n.json",
      "vscode.pug": "$CODE_SERVER_DIR/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/pug.i18n.json",
      "vscode.python": "$CODE_SERVER_DIR/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/python.i18n.json",
      "vscode.r": "$CODE_SERVER_DIR/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/r.i18n.json",
      "vscode.razor": "$CODE_SERVER_DIR/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/razor.i18n.json",
      "vscode.references-view": "$CODE_SERVER_DIR/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/references-view.i18n.json",
      "vscode.restructuredtext": "$CODE_SERVER_DIR/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/restructuredtext.i18n.json",
      "vscode.ruby": "$CODE_SERVER_DIR/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/ruby.i18n.json",
      "vscode.rust": "$CODE_SERVER_DIR/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/rust.i18n.json",
      "vscode.scss": "$CODE_SERVER_DIR/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/scss.i18n.json",
      "vscode.search-result": "$CODE_SERVER_DIR/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/search-result.i18n.json",
      "vscode.shaderlab": "$CODE_SERVER_DIR/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/shaderlab.i18n.json",
      "vscode.shellscript": "$CODE_SERVER_DIR/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/shellscript.i18n.json",
      "vscode.simple-browser": "$CODE_SERVER_DIR/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/simple-browser.i18n.json",
      "vscode.sql": "$CODE_SERVER_DIR/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/sql.i18n.json",
      "vscode.swift": "$CODE_SERVER_DIR/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/swift.i18n.json",
      "vscode.theme-abyss": "$CODE_SERVER_DIR/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/theme-abyss.i18n.json",
      "vscode.theme-defaults": "$CODE_SERVER_DIR/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/theme-defaults.i18n.json",
      "vscode.theme-kimbie-dark": "$CODE_SERVER_DIR/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/theme-kimbie-dark.i18n.json",
      "vscode.theme-monokai-dimmed": "$CODE_SERVER_DIR/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/theme-monokai-dimmed.i18n.json",
      "vscode.theme-monokai": "$CODE_SERVER_DIR/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/theme-monokai.i18n.json",
      "vscode.theme-quietlight": "$CODE_SERVER_DIR/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/theme-quietlight.i18n.json",
      "vscode.theme-red": "$CODE_SERVER_DIR/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/theme-red.i18n.json",
      "vscode.theme-seti": "$CODE_SERVER_DIR/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/theme-seti.i18n.json",
      "vscode.theme-solarized-dark": "$CODE_SERVER_DIR/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/theme-solarized-dark.i18n.json",
      "vscode.theme-solarized-light": "$CODE_SERVER_DIR/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/theme-solarized-light.i18n.json",
      "vscode.theme-tomorrow-night-blue": "$CODE_SERVER_DIR/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/theme-tomorrow-night-blue.i18n.json",
      "vscode.typescript-basics": "$CODE_SERVER_DIR/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/typescript-basics.i18n.json",
      "vscode.typescript-language-features": "$CODE_SERVER_DIR/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/typescript-language-features.i18n.json",
      "vscode.vb": "$CODE_SERVER_DIR/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/vb.i18n.json",
      "vscode.xml": "$CODE_SERVER_DIR/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/xml.i18n.json",
      "vscode.yaml": "$CODE_SERVER_DIR/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/yaml.i18n.json"
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
  if [ -d $CODE_SERVER_RUN_DIR/supervisord-conf-$SUPERVISOR_CONF_VERSION ]; then
  echo "4. supervisor settings ${SUPERVISOR_CONF_VERSION} installed"
  else
  curl -fLsS https://raw.githubusercontent.com/alanhg/express-demo/master/lib/code-server/model/supervisord-conf-$SUPERVISOR_CONF_VERSION.tar.gz \
  | tar -C $CODE_SERVER_RUN_DIR -xz
  fi
  ln -sf $CODE_SERVER_RUN_DIR/supervisord-conf-$SUPERVISOR_CONF_VERSION $CODE_SERVER_RUN_DIR/supervisord-conf
}

 start_supervisor_server(){
     echo '5. start supervisor server'
     client_status=$($CODE_SERVER_RUN_DIR/supervisord-conf/bin/supervisord -c $CODE_SERVER_RUN_DIR/supervisord-conf/supervisord.conf ctl status code-server)

  if [ "$client_status" = "" ]
  then
     $CODE_SERVER_RUN_DIR/supervisord-conf/bin/supervisord -c $CODE_SERVER_RUN_DIR/supervisord-conf/supervisord.conf -d
     $CODE_SERVER_RUN_DIR/supervisord-conf/bin/supervisord -c $CODE_SERVER_RUN_DIR/supervisord-conf/supervisord.conf ctl start code-server
   fi

   count=1
   while [ $count -le 10 ]
   do
    sleep 1
    client_status=$($CODE_SERVER_RUN_DIR/supervisord-conf/bin/supervisord -c $CODE_SERVER_RUN_DIR/supervisord-conf/supervisord.conf ctl start code-server)
    client_status=$(echo "$client_status" | tr '[:upper:]' '[:lower:]')


   if echo "$client_status" | grep -q "stopped"; then
     $CODE_SERVER_RUN_DIR/supervisord-conf/bin/supervisord -c $CODE_SERVER_RUN_DIR/supervisord-conf/supervisord.conf ctl start code-server
   elif echo "$client_status" | grep -q "running"; then
     echo "6. init success: $client_status"
     break
   fi
   count=$((count+1))
   done

   if test -n "${client_status#*running}"; then
     echo "6. init success: $client_status"
   elif test -n "${client_status#*started}"; then
     echo "6. init success: $client_status"
   else
     echo "6. init failed: $client_status"
   fi

   if echo "$client_status" | grep -qv "running"; then
     echo "6. init failed: $client_status"
   echo "$ECHO_SPACER log: $CODE_SERVER_RUN_DIR/supervisord-conf/code-server.log"
   tail -n 20 $CODE_SERVER_RUN_DIR/supervisord-conf/code-server.log

   echo "$ECHO_SPACER log: $CODE_SERVER_RUN_DIR/supervisord-conf/supervisord.log"
   tail -n 5 $CODE_SERVER_RUN_DIR/supervisord-conf/supervisord.log
   fi
}


delete_file(){
  if [ -n "$1" ]; then
      rm -r $1
    fi
}

delete_old_installers(){
    current_shell=$(basename "$0")
    delete_file "$(find . -type f -name 'code-server-install-v*.sh' | grep -v $current_shell)"
    delete_file "$(find $CODE_SERVER_DIR/lib/* -maxdepth 0 -type d -name 'code-server-*' | grep -v $CODE_SERVER_DIR/lib/code-server-$CODE_SERVER_VERSION)"
    delete_file "$(find $CODE_SERVER_RUN_DIR/* -maxdepth 0 -type d -name 'supervisord-conf-*' | grep -v $CODE_SERVER_RUN_DIR/supervisord-conf-$SUPERVISOR_CONF_VERSION)"
}
init_environment_variables
install_code_server
install_extensions
init_user_settings
init_supervisor_settings
start_supervisor_server
delete_old_installers
