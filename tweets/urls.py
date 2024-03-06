from django.urls import path
from .views import *
from twitter import settings
url_patterns = [
    path('tweet_api/', GetTweets.as_view(), name='get_tweets'),
]

if settings.DEBUG:
    urlpatterns = url_patterns