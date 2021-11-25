from django import template
from django.contrib.humanize.templatetags.humanize import intcomma

register = template.Library()


@register.filter
def convert(value):
    return "{:,.2f}".format(value)
