---
layout: post
title:  "Flask 서버에 UnitTest 적용하기"
author: ["차금강"]
date:   2019-04-05 08:31:00 -0600
abstract: "백엔드 서버를 잘 구성하였는지 확인하기 위해서 많은 분들이 사용하는 방법에는 print()를 이용하여 IDE에서 제공하는 디버깅 툴을 이용하여 변수들의 흐름을 확인합니다. 하지만 이 방법은 효율적이지 않으며 함수나 api를 직접 구성한 사람이 아니고서는 정확히 어떠한 부분에서 변수의 흐름을 체크하여야하는지, 어떠한 기능을 체크하고 있는지를 알 수 없습니다. 이러한 문제점을 극복하기 위해 Python에서 제공하는 기본적인 기능인 UnitTest를 이용하여 백엔드 서버를 구성하고 있는 함수와 api를 효율적으로 검사하는 방법에 대해서 논의하고자 합니다."
tags: ["Flask", "UnitTest"]
image: /assets/images/posts/flask-unittest/img1.png
draft: "no"	

---

{:.center}
![img1](/assets/images/posts/flask-unittest/img1.png)

# Abstract

일반적으로 백엔드 서버를 구성할 경우 수많은 함수들과 api들로 구성됩니다. 일반적으로 각 기능들이 정상적으로 확인하는 방법에는 대부분 각 변수들이 어떻게 구성이 되고 있는지를 함수단위로 `print()`구문을 이용하여 실제 눈으로 확인하거나 다양한 IDE에서 제공하는 디버깅 툴을 이용하여 변수의 변화를 확인합니다. 그리고 api가 정상적으로 작동하는지를 확인하기 위해 실제로 백엔드 서버를 구성하여 포트에 할당한 후 약속에 맞게 api를 여러번 날려보고 의도에 맞게 응답 하는지를 확인합니다.

하지만 이 방법은 사용자가 `print()` 구문을 일일이 확인하려는 부분에 타이핑을 해야합니다. 또한 디버깅 툴을 이용해서 확인을 하려면 정확히 어떠한 부분에서 변수가 체크 되어야 하는지 `breakpoint`를 만들어주어야 합니다. 이러한 방법은 직접 api와 함수를 구성한 작업자가 아니면 하기 어려운 방법입니다.

위의 문제점을 해결하기 위해서 기능(api 혹은 함수)을 End-to-End로 Test할 수 있게 합니다. 내부의 정확한 기능, 사정을 몰라도 의도한 값을 출력하는가만 몇가지 케이스에 대해서 확인을 할 수 있으면 될 것입니다.

End-to-End 기법, 기능별로 테스트할 수 있는 Unit Test라는 framework를 Python에서 기본적으로 제공하고 있습니다. 이 방법을 이용해서 Flask 백엔드 서버와 그 내부의 함수들이 의도적으로 응답, 동작하는지를 확인하는 방법을 공유합니다.

# 간단한 Flask 백엔드 서버 구성하기

먼저 Flask를 이용하여 간단하게 백엔드 서버를 구성하고 몇가지 테스트할 api를 만들어 보겠습니다. Flask를 이용해서 백엔드 서버를 구성할 것이기에 `Flask`와 Flask를 restful하게 구성할 수 있도록 도와주는 `flask_restful`을 설치합니다.

```python
pip install flask
pip install flask_restful
```

그리고 백엔드 서버를 만들기 위해 `backend.py`를 만듭니다. 그리고 2개의 변수를 파라미터를 받아 그 둘을 곱하고 결과를 응답으로 보내는 기능을 만들 것입니다.

``` python
import flask_restful
import flask
from flask_restful import reqparse

app = flask.Flask(__name__)
api = flask_restful.Api(app)

def multiply(x, y):
    return x * y

class HelloWorld(flask_restful.Resource):

    def get(self):
        parser = reqparse.RequestParser()
        
        # parameter1 과 parameter2를 parsing
        parser.add_argument('parameter1')
        parser.add_argument('parameter2')
        args = parser.parse_args()
        
        #해당 변수에 parameter1과 parameter2를 할당
        parameter1 = args['parameter1']
        parameter2 = args['parameter2']
        
        #해당 변수 중 하나라도 None일 경우 아래를 return
        if (not parameter1) or (not parameter2):
            return {
                'state': 0,
                'response': None
            }
        
        parameter1 = int(parameter1)
        parameter2 = int(parameter2)

        #두 변수 모두를 곱하여 아래를 return
        result = multiply(parameter1, parameter2)
        return {
            'state': 1,
            'response': result
        }

api.add_resource(HelloWorld, '/api/multiply')

if __name__ == '__main__':
    app.run()
```

위의 파이썬 파일을 실행하면 `5000`포트에 해당 Flask 서버가 동작하며 간단한 Python Script로 확인할 수 있습니다.

```
(flaskunittest) chageumgang-ui-MacBookPro:~ chageumgang$ python
Python 3.6.8 |Anaconda, Inc.| (default, Dec 29 2018, 19:04:46) 
[GCC 4.2.1 Compatible Clang 4.0.1 (tags/RELEASE_401/final)] on darwin
Type "help", "copyright", "credits" or "license" for more information.
>>> import requests
>>> data = {'parameter1': 3, 'parameter2':6}
>>> res = requests.get('http://localhost:5000/api/multiply', data=data)
>>> print(res)
<Response [200]>
>>> print(res.text)
{"state": 1, "response": 18}
```

# Unit Test시 주의해야할 사항

먼저 UnitTest를 하기 위해서는 기본적으로 갖추어야할 형식이 필요합니다. unittest framework 내부의 TestCase라는 클래스를 사용하기 때문에 원하는 테스트를 포함하고 있는 클래스를 TestCase에 오버래핑합니다. 내부의 `setUp(self)`는 해당 클래스 내부에서 사용할 변수들을 지정합니다. `setUp(self)`는 일반적으로 Python에서 클래스 내부의 `__init__(self)`와 같은 기능을 한다고 보시면 됩니다.

다음 아래에 테스트하고 싶은 기능들을 `test_mul(self)`와 같은 형식으로 선언한 후 함수 내부에 원하는 기능을 넣으면 됩니다. 여기서 중요한 점은 모든 함수들은 `test_`로 시작하여야 한다는 점입니다.

```python
### 1번 테스트 코드
class UnitTest(unittest.TestCase):
    def setUp(self):
        self.domain = 'http://localhost:5000/api/multiply'

    def test_mul(self):
        self.assertEqual(18, backend.multiply(3, 6))
```

```python
### 2번 테스트 코드
class UnitTest(unittest.TestCase):
    def setUp(self):
        self.domain = 'http://localhost:5000/api/multiply'

    def mul(self):
        self.assertEqual(18, backend.multiply(3, 6))
```

위 두 Unit Test 코드를 실행하면 아래와 같이 두가지 결과가 나옵니다.

```python
### 1번 테스트 코드에 대한 결과
(flaskunittest) chageumgang-ui-MacBookPro:flask-unittest chageumgang$ python test_case.py 
.
----------------------------------------------------------------------
Ran 1 test in 0.000s

OK
```

```python
### 2번 테스트 코드에 대한 결과
(flaskunittest) chageumgang-ui-MacBookPro:flask-unittest chageumgang$ python test_case.py 

----------------------------------------------------------------------
Ran 0 tests in 0.000s

OK
```

1번 테스트에 대한 결과를 보았을 때 `Ran 1 tests in 0.000s`를 보실 수 있습니다. 이는 1개의 테스트 코드를 돌렸으며 모든 테스트를 통과하였다는 점입니다. 2번 테스트에 대한 결과를 보면 `Ran 0 tests in 0.000s`를 보실 수 있으며 `mul(self)`의 함수가 `test_`로 시작하지 않았기 때문에 코드 테스트가 진행되지 않음을 볼 수 있습니다.



# Flask 백엔드 서버를 Unit Test하기

Flask 백엔드 서버를 Unit Test하는 방법에는 2가지가 있으며 함수를 Unit Test하는 방법에는 1가지가 있어 총 3가지의 방법으로 Unit Test하는 방법을 소개합니다.

## 1. 다른 Python 파일 내부의 함수를 테스트 하기

```python
import unittest
import backend
import requests

class UnitTest(unittest.TestCase):
    
    def test_wrong(self):
        self.assertEqual(10, backend.multiply(10, 3))

    def test_right(self):
        self.assertEqual(18, backend.multiply(3, 6))
    

if __name__ == '__main__':
    unittest.main()
```

`backend.py` 내부의 `multiply`함수를 테스트하는 코드입니다. 먼저 `backend.py`를 import한 후 그 내부의 backend.multiply(3, 6)을 실행합니다.

저는 두 개의 인자를 받아 그 둘을 곱한 결과를 출력하는 함수를 만들었습니다. 그렇기 때문에 10과 3을 인자로 받았을 때는 30을, 3과 6을 인자로 받으면 18이라는 결과를 받을 것으로 예상합니다.

위의 테스트 코드를 실행하면 아래와 같은 결과를 얻습니다.

```
(flaskunittest) chageumgang-ui-MacBookPro:flask-unittest chageumgang$ python test_case.py 
.F
======================================================================
FAIL: test_wrong (__main__.UnitTest)
----------------------------------------------------------------------
Traceback (most recent call last):
  File "test_case.py", line 8, in test_wrong
    self.assertEqual(10, backend.multiply(10, 3))
AssertionError: 10 != 30

----------------------------------------------------------------------
Ran 2 tests in 0.001s

FAILED (failures=1)
```

위의 결과 중 `.F`를 해석하면 2개의 테스트를 진행하였으며 1개는 테스트를 통과하여 `.`을 출력하고 1개는 테스트를 통과하지 못하여 `F`를 출력한 것입니다.

아래의 내용을 해석하면 `test_wrong`이라는 테스트에서 실패하였으며 8번째 line에서 함수의 출력은 30을 내었지만 사용자가 입력한 값은 10이기에 둘의 값이 다르다는 것입니다.

## 2. Flask 백엔드 api를 서버 업로드 하지 않고 테스트하기

`backend.py`내부의 `app`변수를 받아 아래와 같이 테스트 코드를 구성합니다.

```python
import unittest
import backend
import requests
import json

class UnitTest(unittest.TestCase):
    def setUp(self):
        self.app = backend.app.test_client()
        self.right_parameter = {
            'parameter1': 3,
            'parameter2': 6
        }
        self.wrong_parameter = {
            'parameter1': 3
        }

    def test_wrong_parameter(self):
        response = self.app.get('/api/multiply', data=self.wrong_parameter)
        data = json.loads(response.get_data())
        self.assertEqual(18, data['response'])
        self.assertEqual(1, data['state'])

    def test_wrong_result(self):
        response = self.app.get('/api/multiply', data=self.right_parameter)
        data = json.loads(response.get_data())
        self.assertEqual(10, data['response'])
        self.assertEqual(1, data['state'])

    def test_multiply_right(self):
        response = self.app.get('/api/multiply', data=self.right_parameter)
        data = json.loads(response.get_data())
        self.assertEqual(18, data['response'])
        self.assertEqual(1, data['state'])

if __name__ == '__main__':
    unittest.main()
```

3가지 케이스에 대해서 테스트 해보겠습니다. `test_wrong_parameter`는 파라미터를 잘못 받았을 때, `test_wrong_result`는 예상한 응답이 넘어오지 않았을 때, `test_multiply_right`는 정상적으로 작동할때 입니다.

위의 테스트 코드를 실행하면 아래와 같은 결과를 얻을 수 있습니다.
```
(flaskunittest) chageumgang-ui-MacBookPro:flask-unittest chageumgang$ python test_case.py 
.FF
======================================================================
FAIL: test_wrong_parameter (__main__.UnitTest)
----------------------------------------------------------------------
Traceback (most recent call last):
  File "test_case.py", line 20, in test_wrong_parameter
    self.assertEqual(18, data['response'])
AssertionError: 18 != None

======================================================================
FAIL: test_wrong_result (__main__.UnitTest)
----------------------------------------------------------------------
Traceback (most recent call last):
  File "test_case.py", line 26, in test_wrong_result
    self.assertEqual(10, data['response'])
AssertionError: 10 != 18

----------------------------------------------------------------------
Ran 3 tests in 0.006s

FAILED (failures=2)
```

위의 결과를 해석하면 다음과 같습니다.

`test_wrong_parameter`에서 잘못된 파라미터를 넘겼기 때문에 `backend.py`를 보았을 때 아래의 결과를 받게 됩니다.

```
{
    'state': 0,
    'response': None
}
```

실제로는 `None`을 응답했지만 정상적으로 작동할 때 `18`이라는 값을 기대하여 비교하라고 명령했기 때문에 기대한 값과 실제 응답한 값이 달라 테스트를 통과하지 못한 것입니다.

`test_wrong_result`의 경우는 정상적으로 파라미터를 넘겼지만 기대한 결과와 달라 테스트를 통과하지 못했습니다. 실제로는 `18`의 결과를 내지만 사용자는 `10`의 결과를 기대하여 비교하도록 명령하였습니다. 두 값이 달라 테스트를 통과하지 못한 것입니다.

`test_multiply_right`의 경우에는 정상적으로 api가 동작하고 사용자가 기대한 값과 정확히 일치하였기 때문에 테스트를 통과하였습니다.

## 3. Flask 백엔드 api를 서버 업로드 하여 실제 상황과 같은 테스트 진행하기

먼저 실제로 백엔드 서버를 업로드하기 위해 다음과 같이 Python 파일을 실행합니다.

```
(flaskunittest) chageumgang-ui-MacBookPro:flask-unittest chageumgang$ python backend.py 
 * Serving Flask app "backend" (lazy loading)
 * Environment: production
   WARNING: Do not use the development server in a production environment.
   Use a production WSGI server instead.
 * Debug mode: off
 * Running on http://127.0.0.1:5000/ (Press CTRL+C to quit)
```

5000 포트에 Flask 서버가 업로드 되었습니다.

```python
import unittest
import backend
import requests
import json

class UnitTest(unittest.TestCase):
    def setUp(self):
        self.host = 'http://localhost:5000'
        self.right_parameter = {
            'parameter1': 3,
            'parameter2': 6
        }
        self.wrong_parameter = {
            'parameter1': 3
        }

    def test_wrong_parameter(self):
        response = requests.get(self.host+'/api/multiply', data=self.wrong_parameter)
        data = json.loads(response.text)
        self.assertEqual(1, data['state'])
        self.assertEqual(18, data['response'])

    def test_wrong_result(self):
        response = requests.get(self.host+'/api/multiply', data=self.right_parameter)
        data = json.loads(response.text)
        self.assertEqual(1, data['state'])
        self.assertEqual(10, data['response'])

    def test_right_multiply(self):
        response = requests.get(self.host+'/api/multiply', data=self.right_parameter)
        data = json.loads(response.text)
        self.assertEqual(1, data['state'])
        self.assertEqual(18, data['response'])

if __name__ == '__main__':
    unittest.main()
```

위의 테스트 코드를 작성하여 실행하면 아래와 같은 결과를 출력합니다.

```
(flaskunittest) chageumgang-ui-MacBookPro:flask-unittest chageumgang$ python test_case.py 
.FF
======================================================================
FAIL: test_wrong_parameter (__main__.UnitTest)
----------------------------------------------------------------------
Traceback (most recent call last):
  File "test_case.py", line 20, in test_wrong_parameter
    self.assertEqual(1, data['state'])
AssertionError: 1 != 0

======================================================================
FAIL: test_wrong_result (__main__.UnitTest)
----------------------------------------------------------------------
Traceback (most recent call last):
  File "test_case.py", line 27, in test_wrong_result
    self.assertEqual(10, data['response'])
AssertionError: 10 != 18

----------------------------------------------------------------------
Ran 3 tests in 0.017s

FAILED (failures=2)
```

위의 결과를 해석하면 다음과 같습니다.

`test_wrong_parameter`에서 잘못된 파라미터를 넘겼기 때문에 실제로는 `state`가 `0`을 응답했지만 정상적으로 작동할 때 `1`이라는 값을 기대하여 비교하라고 명령했기 때문에 기대한 값과 실제 응답한 값이 달라 테스트를 통과하지 못한 것입니다.

`test_wrong_result`의 경우는 정상적으로 파라미터를 넘겼지만 기대한 결과와 달라 테스트를 통과하지 못했습니다. 실제로는 `18`의 결과를 내지만 사용자는 `10`의 결과를 기대하여 비교하도록 명령하였습니다. 두 값이 달라 테스트를 통과하지 못한 것입니다.

`test_multiply_right`의 경우에는 정상적으로 api가 동작하고 사용자가 기대한 값과 정확히 일치하였기 때문에 테스트를 통과하였습니다.

# Result

기존에는 이 글의 작성자도 일일이 `print()`를 사용해가며 디버깅을 하였으며 백엔드 서버를 직접 업로드하여 api를 `postman`을 통해 테스트해왔습니다. 그리고 `print()`와 `postman`을 사용한 테스트는 매번 테스트를 진행할 때 마다 직접 사용자가 어떠한 테스트 케이스가 있었는지에 대해 기억하여 하나하나 진행해야 되는 번거로움이 있었습니다. 하지만 위의 Unit Test를 이용한 테스트를 이용하면 일일이 기억할 필요도 없을 뿐더러 테스트 케이스가 작성된 Python 파일만 있으면 명령어 한 줄로 작성했었던 테스트를 모두 진행할 수 있는 점에 대해서 간편합니다. 그리고 백엔드 개발자의 입장에서 다른 개발자와 협업을 해야할 경우 `나의 백엔드 서버는 잘 작동하니 다른 곳의 문제가 있을 것이다`라는 것을 입증하기에도 편리합니다. 아 글을 통해 많은 백엔드 개발자들이 Unit Test를 이용하여 편리한 테스트를 진행할 수 있었으면 좋겠습니다.