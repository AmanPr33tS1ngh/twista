from django.http import JsonResponse
from rest_framework.views import APIView
from .models import *
from user.models import User, Connection
from .serializers import *
from user.serializers import UserLabelValueSerializer
from twitter.utils import paginate
from django.db.models import Case, Value, When
from django.db.models.functions import Mod

# Views

class GetHomeTweets(APIView):
    def post(self, request, *args, **kwargs):
        try:
            user = request.user
            if user.is_anonymous:
                return JsonResponse({'success': False, 'tweets': list(), 'msg': 'Authenticate!'})

            view_type = request.data.get('type')
            
            if view_type == 'Following':
                
                connections = list(Connection.objects.filter(sender=user).values_list('receiver'))
                
                tweets = Tweet.objects.filter(user__in=connections)
            else:
                tweets = Tweet.objects.filter(parent__isnull=True)
                
            page_num = request.data.get('page')
            has_next, next_page_no, tweets = paginate(page_num, tweets, 5)
            
            return JsonResponse({'success': True, 'has_next': has_next, 'page': next_page_no, 'tweets': TweetSerializer(tweets, many=True,context={'user':user} ).data})
        except Exception as e:
            return JsonResponse({'success': False, "msg": str(e)})


class GetTweets(APIView):
    def post(self, request, *args, **kwargs):
        try:
            file = None
            user = request.user
            if user.is_anonymous:
                return JsonResponse({'success': False, 'msg': 'Authenticate!'})

            content = request.data.get('content')
            if not content:
                return JsonResponse({'success': False, 'msg': 'Please add content!'})
            parent_id = request.data.get('id')
            parent_username = request.data.get("parent_username")

            
            if parent_id == 'null' or parent_id == 'undefined':
                parent_id = None

            parent = Tweet.objects.filter(id=parent_id, user__username=parent_username).first()
            if 'file' in request.FILES:
                file = request.FILES.get('file')
                if file.size > 4194304:
                    return JsonResponse({'success': False, 'msg': 'File Size Too Big. Please upload an image with '
                                                                  'size less than 4MB.'})
            
            tweet = Tweet.objects.create(
                user=user,
                content=content,
                parent=parent,
                file=file,
            )

            return JsonResponse({'success': True, 'msg': 'new tweet', 'tweet': TweetSerializer(tweet).data})
        except Exception as e:
            return JsonResponse({'success': False, "msg": str(e)})


class GetMatchingTweets(APIView):
    def post(self, request, *args, **kwargs):
        try:
            user = request.user
            if user.is_anonymous:
                return JsonResponse({'success': False, 'msg': 'You need to authenticate first to search!'})
            input_val = request.data.get('input_val')
            if not input_val:
                return JsonResponse({'success': True, 'results': list()})

            tweets = Tweet.objects.filter(content__icontains=input_val)[:5]
            result = TweetLabelValueSerializer(tweets, many=True).data

            users = User.objects.filter(username__icontains=input_val)[:5]
            matching_users = UserLabelValueSerializer(users, many=True).data
            return JsonResponse({'success': True, 'msg': 'new tweet', 'results': result, "users": matching_users})
        except Exception as e:
            return JsonResponse({'success': False, "msg": str(e)})


class GetTweet(APIView):
    def post(self, request, *args, **kwargs):
        try:
            user = request.user
            if user.is_anonymous:
                return JsonResponse({'success': False, 'tweets': list(), 'msg': 'Authenticate!'})

            tweet_id = request.data.get('tweet_id')
            if not tweet_id:
                return JsonResponse({'success': False, 'msg': 'Wrong url'})
            # if user.is_anonymous:
                # return JsonResponse({'success': False, 'msg': 'You need to authenticate first to search!'})
            tweet = Tweet.objects.filter(id=tweet_id).first()
            replies = Tweet.objects.filter(parent=tweet).order_by('timestamp')
            return JsonResponse({'success': True, 'msg': 'new tweet', "replies":TweetSerializer(replies, many=True, context={'user': user}).data,
                                 'tweet': TweetSerializer(tweet, context={'user': user}).data})

        except Exception as e:
            return JsonResponse({'success': False, "msg": str(e)})



class TakeAction(APIView):

    def post(self, request, *args, **kwargs):
        try:
            user = request.user
            
            if user.is_anonymous:
                return JsonResponse({'success': False, 'msg': 'Please login to bookmark tweets'})

            tweet_id = request.data.get("tweet_id")

            if not tweet_id:
                return JsonResponse({'success': False, 'msg': 'There was an issue while saving this bookmark. Please try again later'})
            tweet = Tweet.objects.filter(id=tweet_id).first()
            if not tweet:
                return JsonResponse({'success': False, 'msg': 'There was an error while saving this bookmark. Please try again later'})

            interaction_type = request.data.get("action_type")

            interactions = Interaction.objects.filter(user=user, interaction_type=interaction_type).first()

            if not interactions:
                interactions = Interaction.objects.create(
                    user=user,
                    interaction_type=interaction_type,
                )

            if interactions.tweets.filter(id=tweet_id).exists():
                interactions.tweets.remove(tweet)
            else:
                interactions.tweets.add(tweet)

            return JsonResponse({'success': True, 'msg': "Got profile!",})

        except Exception as e:
            return JsonResponse({'success': False, 'msg': "err: " + str(e)})


class GetBookmarks(APIView):
    def post(self, request,  *args, **kwargs):
        try:
            user = User.objects.filter(username=request.data.get("username")).first()
            if not user:
                return JsonResponse({'success': False, 'msg': "User not found"})
            bookmark = Interaction.objects.filter(user=user, interaction_type="bookmark", ).first()
            if not bookmark:
                return JsonResponse({'success': False, 'msg': "No bookmarks found"})
            return JsonResponse({'success': True, 'bookmarks': TweetSerializer(bookmark.tweets.all(), many=True).data})
        except Exception as e:
            return JsonResponse({'success': False, 'msg': str(e)})


class GetFeed(APIView):
    def post(self, request,  *args, **kwargs):
        try:
            
            user = request.user
            if not user:
                return JsonResponse({'success': False, 'msg': "User not found"})

            posts = Tweet.objects.filter(file__isnull=False).annotate(
                    file_type_order=Case(
                        When(file__endswith='.mp4', then=Value(1)),
                        default=Value(2),
                        output_field=models.IntegerField(),
                    ),
                    sequence_order=Mod(models.F('id'), 5),
                ).order_by('file_type_order', 'sequence_order', 'id')

            page = request.data.get('page')
            has_next, next_page_no, posts = paginate(page, posts, 18)
            return JsonResponse({'success': True, 'has_next': has_next, 'next_page': next_page_no,
                                 'posts': TweetSerializer(posts, many=True).data})
        except Exception as e:
            return JsonResponse({'success': False, 'msg': str(e)})
