# 安装code-server包，也可以使用官方脚本 https://raw.githubusercontent.com/coder/code-server/main/install.sh

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
code-server --install-extension ms-ceintl.vscode-language-pack-zh-hans

# 个性化配置

cat << EOF >  $ROOT_PATH/.local/share/code-server/User/settings.json
{"window.commandCenter": true,"window.menuBarVisibility": "classic"}
EOF

cat << EOF >  $ROOT_PATH/.local/share/code-server/User/argv.json
{"locale": "zh-cn"}
EOF


# 服务化code-server
cat > /usr/lib/systemd/system/webshell-code-server@.service << EOF
[Unit]
Description=webshell-code-server
After=network.target

[Service]
Type=exec
ExecStart=$ROOT_PATH/.local/bin/code-server --bind-addr=127.0.0.1:$PORT --auth none --user-data-dir=$ROOT_PATH/.local/share --extensions-dir $ROOT_PATH/.local/share/extensions --config $ROOT_PATH
Restart=always
#User=%i

[Install]
WantedBy=default.target
EOF

# Now visit http://127.0.0.1:8080. Your password is in ~/.config/code-server/config.yaml
