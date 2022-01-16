from django.urls import path
from stock_app import views as stock_views
from django.contrib.auth import views as auth_views

urlpatterns = [
    path('', stock_views.Index.as_view()),
    path('hit_forex/', stock_views.HitForexApi.as_view()),
    path('delete_event/', stock_views.DeleteEvent.as_view()),
    path('add_news/', stock_views.AddNews.as_view()),
    path('delete_news/', stock_views.DeleteNews.as_view()),
    path('add_event/', stock_views.AddEvents.as_view()),
    path('handle_time_data/', stock_views.HandleTime.as_view()),
    path('forex_file_upload/', stock_views.ForexFileUpload.as_view()),
    path('market_summary/', stock_views.MarketSummary.as_view()),
    path('users/', stock_views.Users.as_view()),
    path('accounts/login/', stock_views.Login.as_view()),
    path('logout/', stock_views.Logout.as_view()),
    path('register/', stock_views.Register.as_view()),
    path('get_stocks_detail/', stock_views.StocksDetail.as_view()),
    path('add_stocks_data/', stock_views.StocksData.as_view()),
    path('reset_password/', auth_views.PasswordResetView.as_view(), name="reset_password"),
    path('reset_password_done/', auth_views.PasswordResetDoneView.as_view(), name="reset_password_done"),
    path('reset/<uidb64>/<token>/', auth_views.PasswordResetConfirmView.as_view(), name="reset_password_confirm"),
    path('password_reset_complete/', auth_views.PasswordResetCompleteView.as_view(), name="reset_password_complete"),
    path('activate/<uidb64>/<token>/', stock_views.activate, name='activate'),
]
