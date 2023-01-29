#!/bin/sh

  init_environment_variables(){
  export CODE_SERVER_DIR=$HOME/.term/code-server
  export CODE_SERVER_RUN_DIR=$HOME/.term/code-server-run
}

  stop_code_server(){
  pkill -f "supervisord-conf"
  echo 'code-server service stopped'
}
  uninstall_code_server(){
  rm -rf $CODE_SERVER_DIR
  rm -rf $CODE_SERVER_RUN_DIR
  echo 'code-server uninstalled'
}

init_environment_variables
stop_code_server
uninstall_code_server
