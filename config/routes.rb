Events::Application.routes.draw do
  root :to => "root#root"
  resources :events do 
    get 'search', :on => :collection
  end
end
