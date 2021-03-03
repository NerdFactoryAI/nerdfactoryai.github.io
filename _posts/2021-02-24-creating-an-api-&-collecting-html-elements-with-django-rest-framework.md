---
layout: post
title: "Django REST Framework로 API 만들기 & HTML 요소 수집하기"
author: ["cnu_hobbs"]
date: 2021-02-24
abstract: "이 포스팅은 Django 설치부터, Django Rest Framework 를 활용한 API 개발 방법, 이를 응용한 웹페이지의 요소별 정보를 바탕으로 API 개발을 하는 과정에 대하여 소개합니다."
tags: ["Django", "DRF", "HTML Elements", "API"]
image: /assets/images/posts/2021-02-24-creating-an-api-&-collecting-html-elements-with-django-rest-framework/Untitled.png
draft: "no"
---

# 개요

이 포스팅은 Django 설치부터, Django Rest Framework 를 활용한 API 개발 방법, 이를 응용한 웹페이지의 요소별 정보를 바탕으로 API 개발을 하는 과정에 대하여 소개합니다.

Django 는 Django Software Foundation이 관리하는 Python 으로 작성된 오픈소스 웹 애플리케이션 프레임워크로, Model - View - Controller(MVC) 패턴을 따르고 있습니다.

고도의 데이터베이스 기반 웹 사이트를 작성하는 데에 있어서 수고를 더는것이 Django 의 주된 목표이자 철학입니다. 이에 따라 Django를 사용하면 데이터베이스 기반 웹 사이트를 개발하는데 굉장히 쉽고 빠르게 접근할 수 있습니다.

Instagram, NASA, Mozila 등 다양한 기업들이 서비스에 Django를 사용하는 것으로 알려져 있습니다.

# Django Rest Framework 를 사용한 restful API 개발

## Get Started

Django 는 Python 을 기반으로 하는 프레임워크입니다. Python(3.4버전 이상)이 설치되어 있어야 합니다.

Install Django

```bash
$ pip install Django
```

장고 설치가 완료되었다면, 장고의 프로젝트 관리 도구 `django-admin` 을 사용할 수 있습니다.

```bash
$ django-admin startproject djangoProject
```

`django-admin` 의 `startproject` 를 통하여 새로운 프로젝트를 생성할 수 있습니다.

```python
.
├── djangoProject
│  ├── __init__.py
│  ├── asgi.py
│  ├── settings.py
│  ├── urls.py
│  └── wsgi.py
├── manage.py
```

`startproject` 로 프로젝트를 생성한 뒤 디렉토리 모습입니다.

데이터베이스 파일인 `db.sqlite3` , Django 기능들을 관리하는 [`manage.py`](http://manage.py) 가 생성되었습니다.

```bash
$ python manage.py runserver
```

`runserver` 를 통하여 [http://localhost:8000](http://localhost:8000) 에 접속하면,

{:.center}
![Untitled](/assets/images/posts/2021-02-24-creating-an-api-&-collecting-html-elements-with-django-rest-framework/Untitled.png)

이러한 화면을 볼 수 있으면 문제없이 Django 설치가 완료된 것입니다.

## Model

장고는 Model-View-Template(MVT) 패턴으로 이루어져있는데, 먼저 Model 을 생성 후, 데이터베이스에 해당 Model을 생성할 것입니다.

`django-admin` 의 `startapp` 을 사용하여 새로운 product 를 생성합니다.

```bash
$ django-admin startapp product

$ tree

.
├── djangoProject
│  ├── __init__.py
│  ├── asgi.py
│  ├── settings.py
│  ├── urls.py
│  └── wsgi.py
├── manage.py
├── product
│  ├── __init__.py
│  ├── admin.py
│  ├── apps.py
│  ├── migrations
│  │  └── __init__.py
│  ├── models.py
│  ├── tests.py
│  └── views.py
```

새로운 app, product 를 생성하였습니다. 그 후 디렉토리 모습을 보면 product 디렉토리가 생성된 것을 볼 수 있습니다.

```bash
.
├── __init__.py
├── admin.py
├── apps.py
├── migrations
│   └── __init__.py
├── models.py
├── tests.py
└── views.py
```

product 디렉토리 내부의 모습입니다. 여기서 자신이 만든 app 의 Model, View 등을 작성하여 기능을 추가할 수 있습니다.

먼저, Model을 생성하겠습니다.

```python
#models.py
from django.db import models

class Product(models.Model):
    name = models.CharField(max_length=70)
		price = models.IntegerField()
		created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
```

Product 라는 Model 을 생성하였습니다.

Product Model 에는 name, price, created_at 3가지의 값이 있는데, 해당 값의 Type 에 맞게 model Field 를 설정해줍니다.

`djangoProject/settings.py` 에서 `INSTALLED_APPS` 에 자신이 생성한 app 을 추가합니다.

```python
#djangoProject/settings.py
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'product', #추가
]
```

변경 사항을 기반으로 새 마이그레션을 생성합니다

```python
(venv) Kimminjung@gimminjung-ui-MacBook-Air djangoProject % python manage.py makemigrations
Migrations for ‘product’:
  product/migrations/0001_initial.py
    - Create model Product
(venv) Kimminjung@gimminjung-ui-MacBook-Air djangoProject % python manage.py migrate
Operations to perform:
  Apply all migrations: admin, auth, contenttypes, product, sessions
Running migrations:
  Applying contenttypes.0001_initial... OK
  Applying auth.0001_initial... OK
  Applying admin.0001_initial... OK
  Applying product.0001_initial... OK
  Applying sessions.0001_initial... OK
```

이러한 메세지가 출력되면 정상적으로 새 마이그레이션이 생성됩니다.

## Django REST Framework

Django REST Framework 는 웹 API를 구축할 수 있는 툴킷입니다. 이 프레임워크를 통하여 생성한 Model 을 바탕으로 조건에 맞는 API를 개발할 수 있습니다.

Install Django REST Framework

```bash
$ pip install djangorestframework
$ pip install django-filter #Filtering support
```

```python
#/djangoProject/settings.py
INSTALLED_APPS = [
   ...
    'product',
		'rest_famework', #추가
]
```

`INSTALLED_APPS` 에 rest_framework 를 추가하면 Django REST Framework 의 기능들을 사용할 준비가 끝났습니다.

## Serializer

Serializer 는 queryset 과 model instance 같은 것들을 쉽게 `JSON` 또는 `XML` 의 데이터 형태로 렌더링 할 수 있게 해줍니다. 우리는 `Product` 모델을 serialize 해줘야 하기 때문에 `ModelSerializer`를 사용합니다.

`product` 디렉토리에 `[serializers.py](http://serializers.py)` 파일을 생성합니다.

```python
#product/serializers.py
from rest_framework import serializers
from .models import Product

class ProductSerializer(serializers.ModelSerializer) :
    class Meta :
        model = Product        # product 모델 사용
        fields = '__all__'            # 모든 필드 포함
```

[serializers.py](http://serializers.py) 의 코드입니다.

## View

View 에서는 생성한 Model 에 대하여 기능들을 추가할 수 있습니다. product app 은 생성한 Model 에 대하여 관련 API 개발이 목적이기 때문에 `product/view.py` 에서는 rest_framework 의 view 를 사용하여 API View 를 작성합니다.

rest_framework 의 API View 는 크게 두가지로 나뉘는데, CBV(Class Based View) 와 FBV(Function Based View) 로 구분 할 수 있습니다. product 모델의 API view 는 CBV 중 APIView 를 사용합니다.

CBV는 Class 의 장점을 모두 사용할 수 있어 코드의 효율을 극대화 할 수 있는 장점이 있고, 여러가지 조건들에 맞게 API 를 개발할 시, 중복되는 코드의 길이를 줄여 효율을 높일 수 있는 점 등으로 인하여 CBV 중 APIView 를 사용합니다.

```python
#view.py
from django.shortcuts import render
from rest_framework.response import Response
from .models import Product
from rest_framework.views import APIView
from .serializers import ProductSerializer
class ProductListAPI(APIView):
    def get(self, request):
        queryset = Product.objects.all()
        print(queryset)
        serializer = ProductSerializer(queryset, many=True)
        return Response(serializer.data)
```

[`view.py`](http://view.py) 의 코드 입니다.

Model을 생성하고 목적에 맞는 [`view.py`](http://view.py) 를 작성하였다면, `url`을 매핑 해 주어야 합니다.

```python
#/djangoProject/url.py
from django.contrib import admin
from django.urls import path
from product.views import ProductListAPI

urlpatterns = [
    path('admin/', admin.site.urls),
		path('api/product/', ProductListAPI.as_view())
]
```

product의 API 를 나타내는 json 이 있는 페이지 이므로 `'api/product/'` 로 `url`을 매핑 해 주었습니다.

이제 Django ORM 의 query 에 값들을 입력해 준다. `runserver` 를 통하여 [localhost:8000](http://localhost:8000)/admin 으로 접속하여 Django admin 페이지에서 `Product` Model에 맞는 값들을 입력합니다.

```python
#Django admin 페이지에 Product 모델을 등록하는 코드
#admin.py
from django.contrib import admin
from .models import Product

admin.site.register(Product)
```

{:.center}
![Untitled%201](/assets/images/posts/2021-02-24-creating-an-api-&-collecting-html-elements-with-django-rest-framework/Untitled%201.png)

`Product` 모델이 추가 되었습니다

{:.center}
![Untitled%202](/assets/images/posts/2021-02-24-creating-an-api-&-collecting-html-elements-with-django-rest-framework/Untitled%202.png)

Model 의 type 에 맞게 값들을 입력합니다.

빠른 방법으로 하기 위하여 `admin` 페이지에서 모델의 값들을.추가하였지만, `View` 에서 `get_queryset()` 함수를 사용하여 값들이 입력되게 할 수 있습니다.

`Product` 모델의 query 에 값들이 입력되었다면 매핑한 `/api/product/` 에 API 출력이 정상적으로 되는지 확인해봅니다.

{:.center}
![Untitled%203](/assets/images/posts/2021-02-24-creating-an-api-&-collecting-html-elements-with-django-rest-framework/Untitled%203.png)

이러한 `JSON` 파일 양식이 출력되었다면 정상적인 API 개발 코드를 완성한 것입니다.

# Django Rest Framework를 활용하여 웹페이지의 HTML 요소별 API 개발

## Preview

웹 페이지를 이루고 있는 HTML 소스를 사용하여 해당 소스의 모든 요소별 정보(요소 이름, 가로/세로 크기, 요소의 위치(좌표)) 등을 크롤링 하여 Django 데이터베이스에 정보를 입력한 후, 해당 정보를 바탕으로 API 개발을 하는 작업입니다. 요소별 정보를 갖고 있는 API 를 활용하는 개발이 이루어질 때, 필요한 API 를 개발하는것이 목적입니다.

## Model, View, Serializiers

HTML의 요소들은 많은 정보를 갖고 있는데, 이 중 요소의 크기(width / height), 요소의 위치(x 좌표, y좌표)를 크롤링 할 것입니다. 이들 4가지와 요소를 구별해 줄 수 있는 요소별 id 까지 총 5개의 정보로 이루어진 Model을 생성합니다.

```python
#models.py
from django.db import models
# Create your models here.
class Data(models.Model):
    specific_id = models.CharField('specific_id', max_length=156)
    horizon_width = models.CharField('horizon_width', max_length=100)
    vertical_width = models.CharField('vertical_width', max_length=100)
    x_location = models.CharField('x_location', max_length=100)
    y_location = models.CharField('y_location', max_length=100)
    def __str__(self):
        return str(self.specific_id)
```

해당 Model 생성 후 migrate를 진행합니다.

Data Model 을 serialize 하는 [`serialziers.py`](http://serialziers.py) 를 작성합니다.

```python
#serializers.py
from rest_framework import serializers
from .models import Data
class DataSerializer(serializers.ModelSerializer):
    class Meta:
        model = Data
        fields = '__all__'
```

Django REST Framework 에서 API 를 만들어주도록 `[views.py](http://views.py)` 를 작성합니다.

```python
#views.py
from django.shortcuts import render
from rest_framework.response import Response
from .models import Data
from rest_framework.views import APIView
from .models import Data
from .serializers import DataSerializer
class DataListAPI(APIView):
    def get(self, request):
        queryset = Data.objects.all()
        print(queryset)
        serializer = DataSerializer(queryset, many=True)
        return Response(serializer.data)
```

url을 매핑 해 줍니다.

```python
#urls.py
from django.urls import path
from .views import DataListAPI

urlpatterns = [
			path('api/', DataListAPI.as_view()),
]
```

Django 에서 API 개발에 관련한 작업을 마쳤습니다.

## parser.py

웹페이지를 크롤링 할 수 있는 `python` 실행파일을 만듭니다. `DjangoProject` 디렉토리와 같은 레벨에 `parser.py` 파일을 생성합니다.

### Web Crawler

웹페이지를 크롤링하여 HTML 소스를 얻을 수 있는 라이브러리는 여러 가지가 있는데, 대표적으로 Beautifulsoup4, Selenium 이 사용되고 있습니다. 우리는 요소별 크기, 좌표값을 얻어야 하므로, 이에 더 용이한 라이브러리를 제공하는 Selnium 을 사용합니다.

```python
#parser.py
import selenium
from selenium import webdriver

#driver 선언을 통하여 webdriver.Chrome을 사용할 수 있다.
driver = webdriver.Chrome('/Users/Kimminjung/Desktop/hobbes/aivory-django-bootstrap/chromedriver')
driver.get(url='https://d-startup.kr/index.es?sid=a1')
page = driver.page_source
```

Selenium 으로 웹 페이지 크롤링을 진행하는 코드 입니다. Selenium 은 웹 드라이버를 사용하여 크롤링을 진행하는데, 우리는 Chrome 을 사용하기 때문에 Chrome web driver를 설치하여 `driver` 선언 시 설치된 경로를 명시하여 줍니다.

```html
#print(page)
<html lang="ko">
  <head>
    ...
    <meta
      content="http://dstartup.kr/images/kor/main/logo.png"
      property="og:image"
    />
    <title>대전창업온라인</title>
    ...
  </head>
</html>
```

위 코드의 `page` 를 print 한 결과입니다. 페이지의 HTML 소스가 크롤링 되는 것을 확인할 수 있습니다.

```python
#parser.py
import selenium
from selenium import webdriver

#driver 선언을 통하여 webdriver.Chrome을 사용할 수 있다.
driver = webdriver.Chrome('/Users/Kimminjung/Desktop/hobbes/aivory-django-bootstrap/chromedriver')
driver.get(url='https://d-startup.kr/index.es?sid=a1')
page = driver.page_source

e = driver.find_element_by_xpath("//xpath")
location = e.location #e 의 좌표가 딕셔너리 타입으로 출력된다.
size = e.size #e의 크기가 딕셔너리 타입으로 출력된다.
```

Selenium 은 많은 기능을 갖고 있는데, 이 중 `find_element_by_xpath` 를 사용합니다. 이 함수는 요소들의 `xpath` 를 기준으로 찾는 기능을 갖고있는 함수입니다. [`parser.py`](http://parser.py) 는 모든 웹페이지를 대상으로 작동해야 하기 때문에 웹페이지 별로 다른 값을 가지는 `id`, `class`, `name` 등을 기준으로 크롤링을 진행하는 것은 목적에서 벗어납니다.

이에 따라 트리 구조를 갖고 있는 `xpath` 를 기준으로 크롤링을 진행합니다.

```python
{'x': 51, 'y': 18}
{'height': 39, 'width': 148}
```

위의 코드에서 `location` 과 `size` 를 print 한 결과입니다. Selenium 을 사용하여 이렇게 요소의 좌표 및 크기 값을 얻을 수 있습니다.

### lxml.etree

모든 요소를 크롤링 하는것이 목적입니다. 이를 위하여 `lxml`의 `etree` 라이브러리의 `getpath()` 를 사용하여 모든 요소의 XPath 를 얻어 올 수 있습니다.

```python
parser = etree.HTMLParser()
tree = etree.parse(StringIO(page), parser)
root = tree.getroot()
htmlTree = etree.ElementTree(root)
```

먼저, `etree.HTMLParser()` 를 사용하여 전체 HTML 소스를 파싱 하여 줍니다. 이는 `getpath()` 를 사용하기 위함인데, `getpath()` 는 파싱된 트리의 최상위 노드인 `root` 를 사용하여 하위 트리의 모든 요소의 XPath 를 얻어오는 함수이기 때문입니다. 위 코드를 사용하여 전체 HTML 소스의 `root` 를 얻어옵니다.

```python
for e in root.iter():
	  x_path = htmlTree.getpath(e)
```

`iter()` 는 `root` 요소에 대한 iterator를 만든 뒤, 문서 순서대로 모든 요소를 반복하하며 순회하는 기능을 가진 함수입. 위의 `for` 문을 통하여 모든 요소의 XPath를 가져올 수 있습니다.

```python
/html
/html/head
/html/head/meta[1]
/html/head/meta[2]
...
```

위의 `for` 문을 출력한 값입니다. 이 방법을 통하여 모든 요소의 XPath를 가져왔습니다.

## [parser.py](http://parser.py) with Django

이제 [`parser.py`](http://parser.py) 로 크롤링 한 데이터들을 Django ORM을 통해서 DB에 넣어주어야 합니다.

```python
from io import StringIO
import selenium
from selenium import webdriver
from lxml import html, etree

import os
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "djangoProject.settings")
import django
django.setup()
from minjung.models import Data
```

`os`를 `import` 하면 `parser.py` 가 실행될 때 `"DJANGO_SETTINGS_MODULE"`이라는 환경 변수에 현재 프로젝트의 `settings.py`파일 경로가 등록됩니다.
그리고, `Django`를 사용하기 위하여 `Django`를 `import` 하고 `django.setup()`을 통하여 프로젝트를 사용할 수 있도록 환경을 세팅한 뒤, 우리의 Model, `Data` 를 `import` 합니다.

```python
from io import StringIO
import selenium
from selenium import webdriver
from lxml import html, etree

import os
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "djangoProject.settings")
import django
django.setup()
from minjung.models import Data
# 옵션 생성
options = webdriver.ChromeOptions()
# 창 숨기는 옵션 추가
options.add_argument("headless")
#driver 선언을 통하여 webdriver.Chrome을 사용할 수 있다.
driver = webdriver.Chrome('/Users/Kimminjung/Desktop/hobbes/aivory-django-bootstrap/chromedriver')
if __name__ == '__main__':

    driver.get(url='https://d-startup.kr/index.es?sid=a1')
    page = driver.page_source
    parser = etree.HTMLParser()
    tree = etree.parse(StringIO(page), parser)
    root = tree.getroot()
    htmlTree = etree.ElementTree(root)
    for e in root.iter():
        try:
            x_path = htmlTree.getpath(e)
            e = driver.find_element_by_xpath(x_path)
            location = e.location
            size = e.size
            Data(
                specific_id = x_path,
                horizon_width = size['width'],
                vertical_width = size['height'],
                x_location = location['x'],
                y_location = location['y'],
            ).save()
        except Exception as e:
            print(e)
            pass
```

[`parser.py`](http://parser.py) 의 전체 코드 입니다. `specific_id` 는 요소들의 고유한 값인 XPath로 설정해 줍니다. `Data().save` 코드를 통하여 Django에 크롤링한 정보를 연동시킬 수 있습니다.

자, 이제 runserver 를 통하여 API 가 정상적으로 개발되었는지 확인하겠습니다.

{:.center}
![Untitled%204](/assets/images/posts/2021-02-24-creating-an-api-&-collecting-html-elements-with-django-rest-framework/Untitled%204.png)

JSON이 정상적으로 출력되는 것을 확인할 수 있습니다.
