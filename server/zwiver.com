server {
  listen 80;
  server_name localhost www.zwiver.com zwiver.com;

  root /var/www/zwiver.com;
  index index.html index.htm;

  charset utf-8;

  auth_basic "Restricted";
  auth_basic_user_file /home/web/.htpasswd;

  location / {
    if ($http_user_agent ~* '(iPhone|iPod|Android|Mobile)') {
      set $mobile '1';
    }
    if ($uri = '/') {
      set $mobile '$mobile 1';
    }
    if ($mobile = '1 1') {
      rewrite ^ http://www.zwiver.com/mobile.html permanent;
    }
  }

  error_page 404 /404.html;

  # redirect server error pages to the static page /50x.html
  #
  error_page 500 502 503 504 /50x.html;

  # proxy api calls to the rails server
  location ~ /api/.* {
    if ($request_method !~ ^(GET|HEAD|OPTIONS)$ ) {
      return 404;
    }
    rewrite /api/(.*) /$1 break;
    proxy_pass http://127.0.0.1:3000;
  }
}
