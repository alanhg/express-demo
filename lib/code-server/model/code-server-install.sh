# 安装code-server包，也可以使用官方脚本 curl -fsSL https://code-server.dev/install.sh | sh

export CODE_SERVER_VERSION=4.7.1
export CODE_SERVER_PORT=36000
export CODE_SERVER_HOME_PATH=$HOME/.webshell/code-server

# 安装主程序包
mkdir -p $CODE_SERVER_HOME_PATH/lib $CODE_SERVER_HOME_PATH/bin $CODE_SERVER_HOME_PATH/share/extensions

curl -fL https://github.com/coder/code-server/releases/download/v$CODE_SERVER_VERSION/code-server-$CODE_SERVER_VERSION-linux-amd64.tar.gz \
  | tar -C $CODE_SERVER_HOME_PATH/lib -xz

mv $CODE_SERVER_HOME_PATH/lib/code-server-$CODE_SERVER_VERSION-linux-amd64 $CODE_SERVER_HOME_PATH/lib/code-server-$CODE_SERVER_VERSION

ln -s $CODE_SERVER_HOME_PATH/lib/code-server-$CODE_SERVER_VERSION/bin/code-server $CODE_SERVER_HOME_PATH/bin/code-server

PATH="$CODE_SERVER_HOME_PATH/bin:$PATH"

# 预装插件
curl https://raw.githubusercontent.com/alanhg/express-demo/master/lib/code-server/model/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal.gz > $CODE_SERVER_HOME_PATH/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal.gz
tar zxvf $CODE_SERVER_HOME_PATH/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal.gz  --remove-files
mv ./ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal $CODE_SERVER_HOME_PATH/share/extensions/
rm -rf $CODE_SERVER_HOME_PATH/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal.gz

cat << EOF >  $CODE_SERVER_HOME_PATH/share/languagepacks.json
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
      "vscode": "$CODE_SERVER_HOME_PATH/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/main.i18n.json",
      "vscode.bat": "$CODE_SERVER_HOME_PATH/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/bat.i18n.json",
      "vscode.clojure": "$CODE_SERVER_HOME_PATH/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/clojure.i18n.json",
      "vscode.coffeescript": "$CODE_SERVER_HOME_PATH/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/coffeescript.i18n.json",
      "vscode.configuration-editing": "$CODE_SERVER_HOME_PATH/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/configuration-editing.i18n.json",
      "vscode.cpp": "$CODE_SERVER_HOME_PATH/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/cpp.i18n.json",
      "vscode.csharp": "$CODE_SERVER_HOME_PATH/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/csharp.i18n.json",
      "vscode.css-language-features": "$CODE_SERVER_HOME_PATH/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/css-language-features.i18n.json",
      "vscode.css": "$CODE_SERVER_HOME_PATH/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/css.i18n.json",
      "vscode.dart": "$CODE_SERVER_HOME_PATH/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/dart.i18n.json",
      "vscode.debug-auto-launch": "$CODE_SERVER_HOME_PATH/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/debug-auto-launch.i18n.json",
      "vscode.debug-server-ready": "$CODE_SERVER_HOME_PATH/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/debug-server-ready.i18n.json",
      "vscode.diff": "$CODE_SERVER_HOME_PATH/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/diff.i18n.json",
      "vscode.docker": "$CODE_SERVER_HOME_PATH/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/docker.i18n.json",
      "vscode.emmet": "$CODE_SERVER_HOME_PATH/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/emmet.i18n.json",
      "vscode.extension-editing": "$CODE_SERVER_HOME_PATH/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/extension-editing.i18n.json",
      "vscode.fsharp": "$CODE_SERVER_HOME_PATH/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/fsharp.i18n.json",
      "vscode.git-base": "$CODE_SERVER_HOME_PATH/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/git-base.i18n.json",
      "vscode.git": "$CODE_SERVER_HOME_PATH/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/git.i18n.json",
      "vscode.github-authentication": "$CODE_SERVER_HOME_PATH/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/github-authentication.i18n.json",
      "vscode.github": "$CODE_SERVER_HOME_PATH/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/github.i18n.json",
      "vscode.go": "$CODE_SERVER_HOME_PATH/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/go.i18n.json",
      "vscode.groovy": "$CODE_SERVER_HOME_PATH/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/groovy.i18n.json",
      "vscode.grunt": "$CODE_SERVER_HOME_PATH/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/grunt.i18n.json",
      "vscode.gulp": "$CODE_SERVER_HOME_PATH/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/gulp.i18n.json",
      "vscode.handlebars": "$CODE_SERVER_HOME_PATH/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/handlebars.i18n.json",
      "vscode.hlsl": "$CODE_SERVER_HOME_PATH/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/hlsl.i18n.json",
      "vscode.html-language-features": "$CODE_SERVER_HOME_PATH/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/html-language-features.i18n.json",
      "vscode.html": "$CODE_SERVER_HOME_PATH/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/html.i18n.json",
      "vscode.image-preview": "$CODE_SERVER_HOME_PATH/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/image-preview.i18n.json",
      "vscode.ini": "$CODE_SERVER_HOME_PATH/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/ini.i18n.json",
      "vscode.ipynb": "$CODE_SERVER_HOME_PATH/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/ipynb.i18n.json",
      "vscode.jake": "$CODE_SERVER_HOME_PATH/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/jake.i18n.json",
      "vscode.java": "$CODE_SERVER_HOME_PATH/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/java.i18n.json",
      "vscode.javascript": "$CODE_SERVER_HOME_PATH/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/javascript.i18n.json",
      "vscode.json-language-features": "$CODE_SERVER_HOME_PATH/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/json-language-features.i18n.json",
      "vscode.json": "$CODE_SERVER_HOME_PATH/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/json.i18n.json",
      "vscode.julia": "$CODE_SERVER_HOME_PATH/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/julia.i18n.json",
      "vscode.latex": "$CODE_SERVER_HOME_PATH/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/latex.i18n.json",
      "vscode.less": "$CODE_SERVER_HOME_PATH/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/less.i18n.json",
      "vscode.log": "$CODE_SERVER_HOME_PATH/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/log.i18n.json",
      "vscode.lua": "$CODE_SERVER_HOME_PATH/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/lua.i18n.json",
      "vscode.make": "$CODE_SERVER_HOME_PATH/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/make.i18n.json",
      "vscode.markdown-basics": "$CODE_SERVER_HOME_PATH/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/markdown-basics.i18n.json",
      "vscode.markdown-language-features": "$CODE_SERVER_HOME_PATH/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/markdown-language-features.i18n.json",
      "vscode.markdown-math": "$CODE_SERVER_HOME_PATH/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/markdown-math.i18n.json",
      "vscode.merge-conflict": "$CODE_SERVER_HOME_PATH/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/merge-conflict.i18n.json",
      "vscode.microsoft-authentication": "$CODE_SERVER_HOME_PATH/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/microsoft-authentication.i18n.json",
      "vscode.ms-vscode.js-debug": "$CODE_SERVER_HOME_PATH/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/ms-vscode.js-debug.i18n.json",
      "vscode.notebook-renderers": "$CODE_SERVER_HOME_PATH/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/notebook-renderers.i18n.json",
      "vscode.npm": "$CODE_SERVER_HOME_PATH/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/npm.i18n.json",
      "vscode.objective-c": "$CODE_SERVER_HOME_PATH/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/objective-c.i18n.json",
      "vscode.perl": "$CODE_SERVER_HOME_PATH/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/perl.i18n.json",
      "vscode.php-language-features": "$CODE_SERVER_HOME_PATH/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/php-language-features.i18n.json",
      "vscode.php": "$CODE_SERVER_HOME_PATH/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/php.i18n.json",
      "vscode.powershell": "$CODE_SERVER_HOME_PATH/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/powershell.i18n.json",
      "vscode.pug": "$CODE_SERVER_HOME_PATH/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/pug.i18n.json",
      "vscode.python": "$CODE_SERVER_HOME_PATH/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/python.i18n.json",
      "vscode.r": "$CODE_SERVER_HOME_PATH/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/r.i18n.json",
      "vscode.razor": "$CODE_SERVER_HOME_PATH/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/razor.i18n.json",
      "vscode.references-view": "$CODE_SERVER_HOME_PATH/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/references-view.i18n.json",
      "vscode.restructuredtext": "$CODE_SERVER_HOME_PATH/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/restructuredtext.i18n.json",
      "vscode.ruby": "$CODE_SERVER_HOME_PATH/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/ruby.i18n.json",
      "vscode.rust": "$CODE_SERVER_HOME_PATH/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/rust.i18n.json",
      "vscode.scss": "$CODE_SERVER_HOME_PATH/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/scss.i18n.json",
      "vscode.search-result": "$CODE_SERVER_HOME_PATH/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/search-result.i18n.json",
      "vscode.shaderlab": "$CODE_SERVER_HOME_PATH/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/shaderlab.i18n.json",
      "vscode.shellscript": "$CODE_SERVER_HOME_PATH/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/shellscript.i18n.json",
      "vscode.simple-browser": "$CODE_SERVER_HOME_PATH/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/simple-browser.i18n.json",
      "vscode.sql": "$CODE_SERVER_HOME_PATH/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/sql.i18n.json",
      "vscode.swift": "$CODE_SERVER_HOME_PATH/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/swift.i18n.json",
      "vscode.theme-abyss": "$CODE_SERVER_HOME_PATH/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/theme-abyss.i18n.json",
      "vscode.theme-defaults": "$CODE_SERVER_HOME_PATH/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/theme-defaults.i18n.json",
      "vscode.theme-kimbie-dark": "$CODE_SERVER_HOME_PATH/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/theme-kimbie-dark.i18n.json",
      "vscode.theme-monokai-dimmed": "$CODE_SERVER_HOME_PATH/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/theme-monokai-dimmed.i18n.json",
      "vscode.theme-monokai": "$CODE_SERVER_HOME_PATH/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/theme-monokai.i18n.json",
      "vscode.theme-quietlight": "$CODE_SERVER_HOME_PATH/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/theme-quietlight.i18n.json",
      "vscode.theme-red": "$CODE_SERVER_HOME_PATH/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/theme-red.i18n.json",
      "vscode.theme-seti": "$CODE_SERVER_HOME_PATH/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/theme-seti.i18n.json",
      "vscode.theme-solarized-dark": "$CODE_SERVER_HOME_PATH/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/theme-solarized-dark.i18n.json",
      "vscode.theme-solarized-light": "$CODE_SERVER_HOME_PATH/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/theme-solarized-light.i18n.json",
      "vscode.theme-tomorrow-night-blue": "$CODE_SERVER_HOME_PATH/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/theme-tomorrow-night-blue.i18n.json",
      "vscode.typescript-basics": "$CODE_SERVER_HOME_PATH/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/typescript-basics.i18n.json",
      "vscode.typescript-language-features": "$CODE_SERVER_HOME_PATH/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/typescript-language-features.i18n.json",
      "vscode.vb": "$CODE_SERVER_HOME_PATH/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/vb.i18n.json",
      "vscode.xml": "$CODE_SERVER_HOME_PATH/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/xml.i18n.json",
      "vscode.yaml": "$CODE_SERVER_HOME_PATH/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/yaml.i18n.json"
    },
    "label": "中文(简体)"
  }
}

EOF


# 编辑器主题配置
mkdir -p $ROOT_PATH/share/User/
cat << EOF >  $ROOT_PATH/share/User/settings.json
{
        "files.saveConflictResolution": "overwriteFileOnDisk",
        "workbench.colorTheme": "Default Dark+",
        "window.menuBarVisibility": "visible",
        "security.workspace.trust.enabled": false,
        "terminal.integrated.gpuAcceleration": "off",
        "files.eol": "\n",
        "editor.suggest.preview": true,
        "window.commandCenter": true
    }
EOF


# 服务化code-server，非root用户操作有权限问题
cat > /etc/systemd/system/webshell-code-server.service << EOF
[Unit]
Description=webshell-code-server
After=network.target

[Service]
Type=exec
ExecStart=$ROOT_PATH/bin/code-server --bind-addr=127.0.0.1:$PORT --auth none --user-data-dir=$ROOT_PATH/share --config $ROOT_PATH/.config/config.yaml  --disable-update-check --locale=zh-cn --extensions-dir=$ROOT_PATH/share/extensions
Restart=always

[Install]
WantedBy=default.target
EOF
