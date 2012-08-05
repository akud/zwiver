#!/bin/bash
BASE_DIR=`dirname $0`
for script in $BASE_DIR/scrape_*rb; do
  echo "Running $script"
  /usr/local/bin/ruby -I $BASE_DIR $script
done 
