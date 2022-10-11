# 安装code-server包，也可以使用官方脚本 https://raw.githubusercontent.com/coder/code-server/main/install.sh

VERSION=4.7.1
PORT=8090

mkdir -p ~/.local/lib ~/.local/bin

curl -fL https://github.com/coder/code-server/releases/download/v$VERSION/code-server-$VERSION-linux-amd64.tar.gz \
  | tar -C ~/.local/lib -xz

mv ~/.local/lib/code-server-$VERSION-linux-amd64 ~/.local/lib/code-server-$VERSION

ln -s ~/.local/lib/code-server-$VERSION/bin/code-server ~/.local/bin/code-server
ln -s ~/.local/lib/code-server-$VERSION/bin/code-server /usr/bin/code-server

# PATH="~/.local/bin:$PATH"

# 预装插件
code-server --install-extension ms-ceintl.vscode-language-pack-zh-hans

# 个性化配置

cat << EOF >  ~/.local/share/code-server/User/settings.json
{"window.commandCenter": true,"window.menuBarVisibility": "classic"}
EOF

cat << EOF >  ~/.local/share/code-server/User/argv.json
{"locale": "zh-cn"}
EOF


# 服务化code-server，自定义端口,端口修改还有一个办法是 ~/.config/code-server/config.yaml修改缺省配置值
cat > /usr/lib/systemd/system/code-server@.service << EOF
[Unit]
Description=code-server
After=network.target

[Service]
Type=exec
ExecStart=/usr/bin/code-server --bind-addr=0.0.0.0:$PORT --auth none
Restart=always
#User=%i

[Install]
WantedBy=default.target
EOF

# Now visit http://127.0.0.1:8080. Your password is in ~/.config/code-server/config.yaml
