# 安装code-server包，也可以使用官方脚本 curl -fsSL https://code-server.dev/install.sh | sh

VERSION=4.7.1
PORT=36000
ROOT_PATH=~/.webshell/code-server
# 安装主程序包
mkdir -p $ROOT_PATH/.local/lib $ROOT_PATH/.local/bin $ROOT_PATH/.local/share/extensions

curl -fL https://github.com/coder/code-server/releases/download/v$VERSION/code-server-$VERSION-linux-amd64.tar.gz \
  | tar -C $ROOT_PATH/.local/lib -xz

mv $ROOT_PATH/.local/lib/code-server-$VERSION-linux-amd64 $ROOT_PATH/.local/lib/code-server-$VERSION

ln -s $ROOT_PATH/.local/lib/code-server-$VERSION/bin/code-server $ROOT_PATH/.local/bin/code-server

PATH="$ROOT_PATH/.local/bin:$PATH"

# 预装插件
curl https://raw.githubusercontent.com/alanhg/express-demo/master/lib/code-server/model/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal.gz > $ROOT_PATH/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal.gz
tar zxvf $ROOT_PATH/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal.gz  --remove-files
mv ./ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal $ROOT_PATH/.local/share/extensions/
rm -rf $ROOT_PATH/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal.gz

cat << EOF >  $ROOT_PATH/.local/share/extensions/languagepacks.json
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
      "vscode": "/root/.webshell/code-server/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/main.i18n.json",
      "vscode.bat": "/root/.webshell/code-server/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/bat.i18n.json",
      "vscode.clojure": "/root/.webshell/code-server/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/clojure.i18n.json",
      "vscode.coffeescript": "/root/.webshell/code-server/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/coffeescript.i18n.json",
      "vscode.configuration-editing": "/root/.webshell/code-server/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/configuration-editing.i18n.json",
      "vscode.cpp": "/root/.webshell/code-server/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/cpp.i18n.json",
      "vscode.csharp": "/root/.webshell/code-server/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/csharp.i18n.json",
      "vscode.css-language-features": "/root/.webshell/code-server/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/css-language-features.i18n.json",
      "vscode.css": "/root/.webshell/code-server/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/css.i18n.json",
      "vscode.dart": "/root/.webshell/code-server/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/dart.i18n.json",
      "vscode.debug-auto-launch": "/root/.webshell/code-server/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/debug-auto-launch.i18n.json",
      "vscode.debug-server-ready": "/root/.webshell/code-server/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/debug-server-ready.i18n.json",
      "vscode.diff": "/root/.webshell/code-server/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/diff.i18n.json",
      "vscode.docker": "/root/.webshell/code-server/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/docker.i18n.json",
      "vscode.emmet": "/root/.webshell/code-server/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/emmet.i18n.json",
      "vscode.extension-editing": "/root/.webshell/code-server/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/extension-editing.i18n.json",
      "vscode.fsharp": "/root/.webshell/code-server/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/fsharp.i18n.json",
      "vscode.git-base": "/root/.webshell/code-server/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/git-base.i18n.json",
      "vscode.git": "/root/.webshell/code-server/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/git.i18n.json",
      "vscode.github-authentication": "/root/.webshell/code-server/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/github-authentication.i18n.json",
      "vscode.github": "/root/.webshell/code-server/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/github.i18n.json",
      "vscode.go": "/root/.webshell/code-server/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/go.i18n.json",
      "vscode.groovy": "/root/.webshell/code-server/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/groovy.i18n.json",
      "vscode.grunt": "/root/.webshell/code-server/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/grunt.i18n.json",
      "vscode.gulp": "/root/.webshell/code-server/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/gulp.i18n.json",
      "vscode.handlebars": "/root/.webshell/code-server/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/handlebars.i18n.json",
      "vscode.hlsl": "/root/.webshell/code-server/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/hlsl.i18n.json",
      "vscode.html-language-features": "/root/.webshell/code-server/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/html-language-features.i18n.json",
      "vscode.html": "/root/.webshell/code-server/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/html.i18n.json",
      "vscode.image-preview": "/root/.webshell/code-server/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/image-preview.i18n.json",
      "vscode.ini": "/root/.webshell/code-server/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/ini.i18n.json",
      "vscode.ipynb": "/root/.webshell/code-server/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/ipynb.i18n.json",
      "vscode.jake": "/root/.webshell/code-server/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/jake.i18n.json",
      "vscode.java": "/root/.webshell/code-server/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/java.i18n.json",
      "vscode.javascript": "/root/.webshell/code-server/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/javascript.i18n.json",
      "vscode.json-language-features": "/root/.webshell/code-server/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/json-language-features.i18n.json",
      "vscode.json": "/root/.webshell/code-server/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/json.i18n.json",
      "vscode.julia": "/root/.webshell/code-server/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/julia.i18n.json",
      "vscode.latex": "/root/.webshell/code-server/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/latex.i18n.json",
      "vscode.less": "/root/.webshell/code-server/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/less.i18n.json",
      "vscode.log": "/root/.webshell/code-server/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/log.i18n.json",
      "vscode.lua": "/root/.webshell/code-server/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/lua.i18n.json",
      "vscode.make": "/root/.webshell/code-server/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/make.i18n.json",
      "vscode.markdown-basics": "/root/.webshell/code-server/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/markdown-basics.i18n.json",
      "vscode.markdown-language-features": "/root/.webshell/code-server/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/markdown-language-features.i18n.json",
      "vscode.markdown-math": "/root/.webshell/code-server/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/markdown-math.i18n.json",
      "vscode.merge-conflict": "/root/.webshell/code-server/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/merge-conflict.i18n.json",
      "vscode.microsoft-authentication": "/root/.webshell/code-server/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/microsoft-authentication.i18n.json",
      "vscode.ms-vscode.js-debug": "/root/.webshell/code-server/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/ms-vscode.js-debug.i18n.json",
      "vscode.notebook-renderers": "/root/.webshell/code-server/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/notebook-renderers.i18n.json",
      "vscode.npm": "/root/.webshell/code-server/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/npm.i18n.json",
      "vscode.objective-c": "/root/.webshell/code-server/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/objective-c.i18n.json",
      "vscode.perl": "/root/.webshell/code-server/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/perl.i18n.json",
      "vscode.php-language-features": "/root/.webshell/code-server/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/php-language-features.i18n.json",
      "vscode.php": "/root/.webshell/code-server/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/php.i18n.json",
      "vscode.powershell": "/root/.webshell/code-server/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/powershell.i18n.json",
      "vscode.pug": "/root/.webshell/code-server/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/pug.i18n.json",
      "vscode.python": "/root/.webshell/code-server/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/python.i18n.json",
      "vscode.r": "/root/.webshell/code-server/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/r.i18n.json",
      "vscode.razor": "/root/.webshell/code-server/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/razor.i18n.json",
      "vscode.references-view": "/root/.webshell/code-server/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/references-view.i18n.json",
      "vscode.restructuredtext": "/root/.webshell/code-server/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/restructuredtext.i18n.json",
      "vscode.ruby": "/root/.webshell/code-server/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/ruby.i18n.json",
      "vscode.rust": "/root/.webshell/code-server/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/rust.i18n.json",
      "vscode.scss": "/root/.webshell/code-server/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/scss.i18n.json",
      "vscode.search-result": "/root/.webshell/code-server/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/search-result.i18n.json",
      "vscode.shaderlab": "/root/.webshell/code-server/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/shaderlab.i18n.json",
      "vscode.shellscript": "/root/.webshell/code-server/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/shellscript.i18n.json",
      "vscode.simple-browser": "/root/.webshell/code-server/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/simple-browser.i18n.json",
      "vscode.sql": "/root/.webshell/code-server/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/sql.i18n.json",
      "vscode.swift": "/root/.webshell/code-server/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/swift.i18n.json",
      "vscode.theme-abyss": "/root/.webshell/code-server/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/theme-abyss.i18n.json",
      "vscode.theme-defaults": "/root/.webshell/code-server/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/theme-defaults.i18n.json",
      "vscode.theme-kimbie-dark": "/root/.webshell/code-server/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/theme-kimbie-dark.i18n.json",
      "vscode.theme-monokai-dimmed": "/root/.webshell/code-server/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/theme-monokai-dimmed.i18n.json",
      "vscode.theme-monokai": "/root/.webshell/code-server/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/theme-monokai.i18n.json",
      "vscode.theme-quietlight": "/root/.webshell/code-server/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/theme-quietlight.i18n.json",
      "vscode.theme-red": "/root/.webshell/code-server/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/theme-red.i18n.json",
      "vscode.theme-seti": "/root/.webshell/code-server/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/theme-seti.i18n.json",
      "vscode.theme-solarized-dark": "/root/.webshell/code-server/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/theme-solarized-dark.i18n.json",
      "vscode.theme-solarized-light": "/root/.webshell/code-server/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/theme-solarized-light.i18n.json",
      "vscode.theme-tomorrow-night-blue": "/root/.webshell/code-server/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/theme-tomorrow-night-blue.i18n.json",
      "vscode.typescript-basics": "/root/.webshell/code-server/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/typescript-basics.i18n.json",
      "vscode.typescript-language-features": "/root/.webshell/code-server/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/typescript-language-features.i18n.json",
      "vscode.vb": "/root/.webshell/code-server/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/vb.i18n.json",
      "vscode.xml": "/root/.webshell/code-server/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/xml.i18n.json",
      "vscode.yaml": "/root/.webshell/code-server/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/yaml.i18n.json"
    },
    "label": "中文(简体)"
  }
}

EOF


# 编辑器主题配置
mkdir -p $ROOT_PATH/.local/share/User/
cat << EOF >  $ROOT_PATH/.local/share/User/settings.json
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

# 服务化code-server
cat > /usr/lib/systemd/system/webshell-code-server@.service << EOF
[Unit]
Description=webshell-code-server
After=network.target

[Service]
Type=exec
ExecStart=$ROOT_PATH/.local/bin/code-server --bind-addr=127.0.0.1:$PORT --auth none --user-data-dir=$ROOT_PATH/.local/share --config $ROOT_PATH/.config/config.yaml  --disable-update-check --locale=zh-cn --extensions-dir=$ROOT_PATH/.local/share/extensions
Restart=always
#User=%i

[Install]
WantedBy=default.target
EOF
