# Generated by Django 3.2.9 on 2021-11-06 10:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('stock_app', '0008_alter_forexdata_currency_value'),
    ]

    operations = [
        migrations.CreateModel(
            name='Event',
            fields=[
                ('event_id', models.AutoField(primary_key=True, serialize=False)),
                ('event_title', models.CharField(max_length=5000, null=None)),
                ('start_date', models.DateTimeField()),
                ('end_date', models.DateTimeField()),
            ],
            options={
                'db_table': 'Event',
            },
        ),
    ]
