from django.db import models
from django.contrib.auth.models import AbstractUser


# Create your models here.
# class User(AbstractUser):
#     C
#
#     class Meta:
#         db_table = "user"

class User(AbstractUser):
    CNIC = models.CharField(max_length=20, blank=True, null=True)
    phone_number = models.CharField(max_length=20, blank=True, null=True, unique=True)
    role = models.CharField(max_length=6, default='User', null=None, blank=False)

    @property
    def _history_user(self):
        return self.changed_by

    @_history_user.setter
    def _history_user(self, value):
        self.changed_by = value

    class Meta:
        db_table = "user"


class Stocks(models.Model):
    stock_id = models.AutoField(primary_key=True)
    script_name = models.CharField(max_length=250, null=False, blank=False)
    target_price = models.IntegerField(blank=False, default=0)
    stop_loss = models.IntegerField(blank=False, default=0)
    holding_period = models.IntegerField(blank=False, default=0)
    created_date = models.DateTimeField(blank=False)
    user_id = models.ForeignKey('User', on_delete=models.CASCADE, db_column='user_id')
    event_id = models.ForeignKey('Event', on_delete=models.CASCADE, db_column='event_id', null=True)

    class Meta:
        db_table = "Stocks"


class ForexData(models.Model):
    forex_id = models.AutoField(primary_key=True)
    currency_code = models.CharField(max_length=15, unique=True, null=None, blank=False)
    currency_value = models.CharField(blank=False, null=None, max_length=250)
    rate_diff = models.CharField(blank=False, null=None, max_length=250, default='0.0')
    currency_arrow = models.CharField(blank=False, max_length=10, default='DEFAULT')
    user_id = models.ForeignKey('User', on_delete=models.CASCADE, db_column='user_id')

    class Meta:
        db_table = "ForexData"


class Event(models.Model):
    event_id = models.AutoField(primary_key=True)
    event_title = models.CharField(max_length=5000, null=None, blank=False)
    start_date = models.DateTimeField(blank=False)
    end_date = models.DateTimeField(blank=False)

    class Meta:
        db_table = "Event"


class Notification(models.Model):
    notification_id = models.AutoField(primary_key=True)
    notification_message = models.TextField()

    class Meta:
        db_table = "Notification"


class UserNotification(models.Model):
    user_notification_id = models.AutoField(primary_key=True)
    user_id = models.ForeignKey('User', on_delete=models.CASCADE, db_column='user_id')
    status = models.CharField(max_length=25, default="Unread", blank=False)
    notification_id = models.ForeignKey('Notification', on_delete=models.CASCADE, db_column='notification_id')


class News(models.Model):
    news_id = models.AutoField(primary_key=True)
    news_title = models.TextField()
    news_link = models.TextField()

    class Meta:
        db_table = "News"
