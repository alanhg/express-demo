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

cat << EOF >  $ROOT_PATH/.local/share/languagepacks.json
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
      "vscode": "$ROOT_PATH/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/main.i18n.json",
      "vscode.bat": "$ROOT_PATH/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/bat.i18n.json",
      "vscode.clojure": "$ROOT_PATH/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/clojure.i18n.json",
      "vscode.coffeescript": "$ROOT_PATH/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/coffeescript.i18n.json",
      "vscode.configuration-editing": "$ROOT_PATH/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/configuration-editing.i18n.json",
      "vscode.cpp": "$ROOT_PATH/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/cpp.i18n.json",
      "vscode.csharp": "$ROOT_PATH/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/csharp.i18n.json",
      "vscode.css-language-features": "$ROOT_PATH/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/css-language-features.i18n.json",
      "vscode.css": "$ROOT_PATH/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/css.i18n.json",
      "vscode.dart": "$ROOT_PATH/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/dart.i18n.json",
      "vscode.debug-auto-launch": "$ROOT_PATH/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/debug-auto-launch.i18n.json",
      "vscode.debug-server-ready": "$ROOT_PATH/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/debug-server-ready.i18n.json",
      "vscode.diff": "$ROOT_PATH/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/diff.i18n.json",
      "vscode.docker": "$ROOT_PATH/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/docker.i18n.json",
      "vscode.emmet": "$ROOT_PATH/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/emmet.i18n.json",
      "vscode.extension-editing": "$ROOT_PATH/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/extension-editing.i18n.json",
      "vscode.fsharp": "$ROOT_PATH/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/fsharp.i18n.json",
      "vscode.git-base": "$ROOT_PATH/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/git-base.i18n.json",
      "vscode.git": "$ROOT_PATH/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/git.i18n.json",
      "vscode.github-authentication": "$ROOT_PATH/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/github-authentication.i18n.json",
      "vscode.github": "$ROOT_PATH/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/github.i18n.json",
      "vscode.go": "$ROOT_PATH/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/go.i18n.json",
      "vscode.groovy": "$ROOT_PATH/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/groovy.i18n.json",
      "vscode.grunt": "$ROOT_PATH/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/grunt.i18n.json",
      "vscode.gulp": "$ROOT_PATH/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/gulp.i18n.json",
      "vscode.handlebars": "$ROOT_PATH/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/handlebars.i18n.json",
      "vscode.hlsl": "$ROOT_PATH/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/hlsl.i18n.json",
      "vscode.html-language-features": "$ROOT_PATH/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/html-language-features.i18n.json",
      "vscode.html": "$ROOT_PATH/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/html.i18n.json",
      "vscode.image-preview": "$ROOT_PATH/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/image-preview.i18n.json",
      "vscode.ini": "$ROOT_PATH/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/ini.i18n.json",
      "vscode.ipynb": "$ROOT_PATH/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/ipynb.i18n.json",
      "vscode.jake": "$ROOT_PATH/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/jake.i18n.json",
      "vscode.java": "$ROOT_PATH/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/java.i18n.json",
      "vscode.javascript": "$ROOT_PATH/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/javascript.i18n.json",
      "vscode.json-language-features": "$ROOT_PATH/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/json-language-features.i18n.json",
      "vscode.json": "$ROOT_PATH/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/json.i18n.json",
      "vscode.julia": "$ROOT_PATH/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/julia.i18n.json",
      "vscode.latex": "$ROOT_PATH/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/latex.i18n.json",
      "vscode.less": "$ROOT_PATH/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/less.i18n.json",
      "vscode.log": "$ROOT_PATH/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/log.i18n.json",
      "vscode.lua": "$ROOT_PATH/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/lua.i18n.json",
      "vscode.make": "$ROOT_PATH/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/make.i18n.json",
      "vscode.markdown-basics": "$ROOT_PATH/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/markdown-basics.i18n.json",
      "vscode.markdown-language-features": "$ROOT_PATH/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/markdown-language-features.i18n.json",
      "vscode.markdown-math": "$ROOT_PATH/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/markdown-math.i18n.json",
      "vscode.merge-conflict": "$ROOT_PATH/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/merge-conflict.i18n.json",
      "vscode.microsoft-authentication": "$ROOT_PATH/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/microsoft-authentication.i18n.json",
      "vscode.ms-vscode.js-debug": "$ROOT_PATH/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/ms-vscode.js-debug.i18n.json",
      "vscode.notebook-renderers": "$ROOT_PATH/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/notebook-renderers.i18n.json",
      "vscode.npm": "$ROOT_PATH/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/npm.i18n.json",
      "vscode.objective-c": "$ROOT_PATH/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/objective-c.i18n.json",
      "vscode.perl": "$ROOT_PATH/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/perl.i18n.json",
      "vscode.php-language-features": "$ROOT_PATH/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/php-language-features.i18n.json",
      "vscode.php": "$ROOT_PATH/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/php.i18n.json",
      "vscode.powershell": "$ROOT_PATH/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/powershell.i18n.json",
      "vscode.pug": "$ROOT_PATH/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/pug.i18n.json",
      "vscode.python": "$ROOT_PATH/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/python.i18n.json",
      "vscode.r": "$ROOT_PATH/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/r.i18n.json",
      "vscode.razor": "$ROOT_PATH/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/razor.i18n.json",
      "vscode.references-view": "$ROOT_PATH/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/references-view.i18n.json",
      "vscode.restructuredtext": "$ROOT_PATH/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/restructuredtext.i18n.json",
      "vscode.ruby": "$ROOT_PATH/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/ruby.i18n.json",
      "vscode.rust": "$ROOT_PATH/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/rust.i18n.json",
      "vscode.scss": "$ROOT_PATH/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/scss.i18n.json",
      "vscode.search-result": "$ROOT_PATH/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/search-result.i18n.json",
      "vscode.shaderlab": "$ROOT_PATH/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/shaderlab.i18n.json",
      "vscode.shellscript": "$ROOT_PATH/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/shellscript.i18n.json",
      "vscode.simple-browser": "$ROOT_PATH/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/simple-browser.i18n.json",
      "vscode.sql": "$ROOT_PATH/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/sql.i18n.json",
      "vscode.swift": "$ROOT_PATH/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/swift.i18n.json",
      "vscode.theme-abyss": "$ROOT_PATH/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/theme-abyss.i18n.json",
      "vscode.theme-defaults": "$ROOT_PATH/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/theme-defaults.i18n.json",
      "vscode.theme-kimbie-dark": "$ROOT_PATH/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/theme-kimbie-dark.i18n.json",
      "vscode.theme-monokai-dimmed": "$ROOT_PATH/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/theme-monokai-dimmed.i18n.json",
      "vscode.theme-monokai": "$ROOT_PATH/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/theme-monokai.i18n.json",
      "vscode.theme-quietlight": "$ROOT_PATH/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/theme-quietlight.i18n.json",
      "vscode.theme-red": "$ROOT_PATH/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/theme-red.i18n.json",
      "vscode.theme-seti": "$ROOT_PATH/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/theme-seti.i18n.json",
      "vscode.theme-solarized-dark": "$ROOT_PATH/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/theme-solarized-dark.i18n.json",
      "vscode.theme-solarized-light": "$ROOT_PATH/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/theme-solarized-light.i18n.json",
      "vscode.theme-tomorrow-night-blue": "$ROOT_PATH/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/theme-tomorrow-night-blue.i18n.json",
      "vscode.typescript-basics": "$ROOT_PATH/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/typescript-basics.i18n.json",
      "vscode.typescript-language-features": "$ROOT_PATH/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/typescript-language-features.i18n.json",
      "vscode.vb": "$ROOT_PATH/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/vb.i18n.json",
      "vscode.xml": "$ROOT_PATH/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/xml.i18n.json",
      "vscode.yaml": "$ROOT_PATH/.local/share/extensions/ms-ceintl.vscode-language-pack-zh-hans-1.71.0-universal/translations/extensions/yaml.i18n.json"
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


# 服务化code-server，非root用户操作有权限问题
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
