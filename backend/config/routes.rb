Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check
  namespace :auth do
    get "alarmbox", to: "alarmbox#authorize"
    post "alarmbox/callback", to: "alarmbox#callback"
  end

  get "exams", to: "exam#index"
  post "exams", to: "exam#create"

  # Defines the root path route ("/")
  # root "posts#index"
end
