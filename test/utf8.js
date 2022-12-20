console.log( `
      renew_password() {
    if [ -e $ORCA_CODE_SERVER_DIR/.config/config.yaml ];then
      cat <<EOF >  $ORCA_CODE_SERVER_DIR/.config/config.yaml
bind-addr: 127.0.0.1:8080
auth: password
cert: false
EOF
    fi
      }
      
client_status=$($ORCA_CODE_SERVER_RUN_DIR/supervisord-conf/bin/supervisord -c $ORCA_CODE_SERVER_RUN_DIR/supervisord-conf/supervisord.conf ctl status code-server)
client_status=$(echo "$client_status" | tr '[:upper:]' '[:lower:]')

if test -n "\${client_status#*stopped}"; then
 renew_password
elif [ "$client_status" = "" ]; then
 renew_password
 fi
    `)
