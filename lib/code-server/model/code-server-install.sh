# 安装code-server包，也可以使用官方脚本 curl -fsSL https://code-server.dev/install.sh | sh

VERSION=4.7.1
PORT=36000
ROOT_PATH=~/.webshell/code-server

mkdir -p $ROOT_PATH/.local/lib $ROOT_PATH/.local/bin

curl -fL https://github.com/coder/code-server/releases/download/v$VERSION/code-server-$VERSION-linux-amd64.tar.gz \
  | tar -C $ROOT_PATH/.local/lib -xz

mv $ROOT_PATH/.local/lib/code-server-$VERSION-linux-amd64 $ROOT_PATH/.local/lib/code-server-$VERSION

ln -s $ROOT_PATH/.local/lib/code-server-$VERSION/bin/code-server $ROOT_PATH/.local/bin/code-server

PATH="$ROOT_PATH/.local/bin:$PATH"

# 预装插件
code-server --install-extension ms-ceintl.vscode-language-pack-zh-hans --extensions-dir $ROOT_PATH/.local/share/extensions

# 个性化配置
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

cat << EOF >  $ROOT_PATH/.local/share/User/argv.json
{"locale": "zh-cn"}
EOF


# 服务化code-server
cat > /usr/lib/systemd/system/webshell-code-server@.service << EOF
[Unit]
Description=webshell-code-server
After=network.target

[Service]
Type=exec
ExecStart=$ROOT_PATH/.local/bin/code-server --bind-addr=127.0.0.1:$PORT --auth none --user-data-dir=$ROOT_PATH/.local/share --config $ROOT_PATH/.config/config.yaml  --disable-update-check --locale=zh-cn
Restart=always
#User=%i

[Install]
WantedBy=default.target
EOF

# Now visit http://127.0.0.1:8080. Your password is in ~/.config/code-server/config.yaml
