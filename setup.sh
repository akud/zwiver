#!/usr/bin/bash
set -ex

#install sphinx
zwiver_dir=`pwd`
tar xzvf sphinx-2.0.5-release.tar.gz  
cd $zwiver_dir/sphinx-2.0.5-release
./configure --with-pgsql=`pg_config --pkgincludedir`
make 
make install

#configure rails
cd $zwiver_dir/api
bundle install
rake db:create
rake db:migrate
rake ts:index
rails server -d

#setup nginx
apt-get install nginx
ln -s $zwiver_dir/web/server/zwiver.com /etc/nginx/sites-available
ln -s /etc/nginx/sites-available/zwiver.com /etc/nginx/sites-enabled/zwiver.com
nginx -s reload
