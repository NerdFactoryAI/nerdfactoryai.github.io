---
layout: post
title:  "PyCon Korea 2019 1일차 참관기"
author: ["이지훈"]
date:   2019-08-17
abstract: "너드팩토리에서 백엔드 개발을 맡고 있는 앨런입니다. 이번 해 열린 PyCon Korea 2019 행사에서 8월 17일부터 18일까지 총 2일간 컨퍼런스를 참관했습니다. 지금부터 PyCon 행사에서 느끼고 배웠던 것들에 대해서 얘기해볼까 합니다."
tags: ["PyCon", "PyCon2019", "Python", "async", "dsl", "logging", "test-technique"]
image: /assets/images/posts/pycon-korea-2019-first-day/0.png
draft: "no"	
---

{:.center}
![img0](/assets/images/posts/pycon-korea-2019-first-day/0.png)
*PyCon 홈페이지에서 발췌*

너드팩토리에서 백엔드 개발을 맡고 있는 앨런입니다. 이번 해 열린 PyCon Korea 2019 행사에서 8월 17일부터 18일까지 총 2일간 컨퍼런스를 참관했습니다. 지금부터 PyCon 행사에서 느끼고 배웠던 것들에 대해서 얘기해볼까 합니다.

# 왜?

너드팩토리는 주요 기술 스택중에 Python&Django를 가지고 있고 이를 통해서 웹 서버 구축을 하고 있습니다.  모든 개발자가 그러하듯이 저도 현재 짜는 코드보다 더욱 견고하고 지금보다는 고차원의 코드를 짜고 싶은 욕망이 있었는데 우연히 이번에 Pycon 행사에 열린다는 걸 알게 되었습니다. 사실 평소 이렇게 큰 행사에 참여하는 걸 좋아하지 않아서 컨퍼런스에 참여해본 적이 없었는데요. 제가 Python을 좋아하기도 하고 이런 좋은 기회를 통해서 새로운 지식을 얻거나 혹은 새로운 자극을 받을 수 있을 것 같아서 행사에 참여하게 되었는데 굉장히 유익하고 자극을 많이 받았던 것 같습니다.

# 행사분위기

{:.center}
![img1](/assets/images/posts/pycon-korea-2019-first-day/1.jpg)
*굿즈를 받으러 가는 길*

{:.center}
![img2](/assets/images/posts/pycon-korea-2019-first-day/2.jpg)
*2층에서 찍어본 행사장 모습*

주말인데도 불구하고 정말 많은 사람들이 와 있었습니다. 오히려 평일에는 이런 행사에 참여하기 어려우니 주말에 더 붐비는 걸지도 모르겠네요. 많은 기업들이 와서 행사장을 채우고 있었고 각 부스마다 경품을 걸고 행사를 진행하는 모습도 볼 수 있었습니다. 뱅크샐러드는 이번 메인 스폰서인만큼 가장 큰 부스를 차지하고 있었구요. 부스앞에 사람들도 압도적으로 많았던 거 같았습니다. 뱅크샐러드에서 주최하는 게임이 있었는데(사람이 너무 많아서 못갔어요. 무슨 게임인지도 모르겠네요..) 줄이 너무 길어서 할 엄두도 못냈네요.

{:.center}
![img3](/assets/images/posts/pycon-korea-2019-first-day/3.jpg)
*다들 게임하려고 서 계시는겁니다..*

# Session

8월 17일부터 18일 오전까지 총 이틀 간 참관을 했습니다. 첫 날 세션 4개, 둘째날 세션 3개  총 7개의 세션을 들었고, Speaker 분들 모두 대단하고 멋진 분들이셨고 발표 내용 또한 너무 유익했습니다.

## 8월 17일 (코엑스 표류 1일차)

- 정적 타입 검사로 더 나은 Python 코드 작성하기 (이창희)
- 하나의 Django 코드로 여러 사이트 운영하기 (박종현)
- Python에서 DSL제작하기 (Las)
- 테스트에 걸리는 시간을 *92%* 줄이기 (구영민)

### 정적 타입 검사로 더 나은 Python 코드 작성하기

`이창희`님이 발표해주신 세션입니다. python에서의 동적타입의 변수에서 일어날 수 있는 오류를 방지하기 위해 mypy, typing을 사용해서 타입힌팅을 하는 방법에 대해 소개해주셨구요. 

기본적으로 python의 동적타입의 변수가 가질 수 있는 장점을 왜 버려야하지? 라는 생각이 들었었지만 뒤에서 소개해드릴 `Las` 님의 발표자료를 빌려 얘기를 하자면 '한 수준에서의 제약은 다른 수준에서의 자유와 힘으로 이어진다'.라고 했고 어찌보면 적재적소에 타입힌팅을 사용해서 코드를 짠다면 굉장히 견고한 코드를 짤 수 있지 않을까 하는 생각이 들었습니다.

[Python Type Hinting and Static Type Checking](https://speakerdeck.com/blur/python-type-hinting-and-static-type-checking){:target="_blank"}{:.markdown-link-body}

### 하나의 Django 코드로 여러 사이트 운영하기

박종현님이 발표해주신 세션입니다. Django에서 제공하는 site 프레임워크를 통해 하나의 어플리케이션에서의 코드로 여러개의 사이트를 구현 및 운영할 수 있는지에 대해서 설명해주셨구요. 제 미약한 지식으로 이해하기로는 미들웨어를 커스텀으로 작성하고 사이트별로 따로 설정값을 줘서 템플릿을 분기할 수 있는 기술이라고 이해를 했습니다. 여러모로 현업에 굉장히 도움이 될 만한 정보들을 공유해주셨고 너드팩토리에서도 추후 활용할 수 있을만한 기술이라고 생각이 들었습니다.

[Run multiple sites from one Django source](https://speakerdeck.com/adrysn/run-multiple-sites-from-one-django-source){:target="_blank"}{:.markdown-link-body}

### Python에서 DSL제작하기

`Las`님이 발표해주신 세션입니다. 제가 아는 DSL은 ES를 사용할 때 썼던 쿼리DSL뿐이라서 Python에서 DSL이라는 걸 어떻게 구현하는지 너무 궁금했었습니다. 제 예상대로 내용자체가 저에게 있어서 굉장히 어려웠었던 것 같구요. 그리고 또 한 번 놀랐던 건 `Las`님은 고등학생이라는 사실이 너무.. 충격적이었습니다.

exec, eval 또는 Builtins 등을 통해 DSL형태의 코드를 만들어 낼 수 있는 스킬에 대해서 배울 수 있어 굉장히 신선하고 나중에 꼭 혼자라도 도전해봐야겠다 라는 생각이 들었습니다.

[발표자료](https://docs.google.com/presentation/d/16chVkm8aHFck0dY_E9y5Ji3NzI_QcDsKxClaJE8oKQY/edit?usp=sharing){:target="_blank"}{:.markdown-link-body}

### 테스트에 걸리는 시간을 *92%* 줄이기

구영민님이 발표해주신 세션입니다. 전체적으로 테스트를 어떻게하면 효율적이고 빠르게 할 수 있는지에 대해서 말씀해주셨구요. 이 기술들에 대해서 말씀하실 때 'trick이다' 라고 종종 말씀하셨는데 제가 생각하기엔 수많은 테스트 경험에서 나오는 노하우들이 아닌가 라는 생각이 많이 들었구요. TestCase와 TransactionTestCase의 차이에 대해서 자세히 알려주셔서 많은 도움이 되었습니다.

[[PyCon KR 2019] 테스트에 걸리는 시간을 *92%* 줄이기](https://speakerdeck.com/youngminkoo/PyCon-kr-2019-teseuteue-geolrineun-siganeul-star-92-percent-star-juligi){:target="_blank"}{:.markdown-link-body}

## 8월 18일 (코엑스 표류 2일차)

- 파이썬으로 서버를 극한까지 끌어다 쓰기: Async I/O의 밑바닥 (한섬기)
- 하이퍼커넥트 Azar WebView Logging (이준영/용현택)
- Advanced Python testing techniques (안재만)

### 파이썬으로 서버를 극한까지 끌어다 쓰기: Async I/O의 밑바닥

한섬기님이 발표해주신 세션입니다. 비동기 방식을 채택하고 있는 여러 프레임워크들을 소개해주셨고 상황에 따라 프레임워크간 성능차이가 어떻게 나는지에 대해서 공유해주셨습니다. 전체적으로 비동기방식의 프레임워크에 대한 이해를 하는데 도움이 많이 되었던 세션이었습니다.

[파이콘 한국 2019 - 파이썬으로 서버를 극한까지 끌어다 쓰기: Async I/O의 밑바닥](https://www.slideshare.net/iandmyhand/2019-async-io-164773025){:target="_blank"}{:.markdown-link-body}

### 하이퍼커넥트 Azar WebView Logging

`이준영`님과 `용현택`님이 발표해주신 세션입니다. 저에게 있어서 굉장히 필요했던 세션이었습니다. 평소 로깅의 중요성에 대해서 알고있었지만 어떻게 효율적으로 로깅을 해야할 지에 대한 길을 열어준 세션이었던 것 같습니다. logging infra는 프로젝트 초기에 해야한다고 강조하셨었는데요. 곧 들어갈 프로젝트의 logging infra는 초기에 잘 설계해서 구축할 예정이고 공유해주셨던 내용을 바탕으로 infra를 구성해볼 생각입니다.

### Advanced Python testing techniques

`안재만`님이 발표해주신 세션입니다. 전체적으로 높은 수준의 테스트 노하우를 공유해주셨구요. library 혹은 개발 혹은 테스트 방법론을 통해 어떻게 더 효율적이고 쉽게 테스트를 할 수 있는지에 대해서 자세히 설명해주셨습니다. TDD에서는 Sure라는 라이브러리로 직관적인 테스트코드를 작성하는 방법에 대해서 알 수 있었구요. BDD는 저에게 있어서 조금 생소했지만 코드로 시나리오를 짠다는 방식이 굉장히 흥미로웠습니다. 나중에 테스트케이스를 작성을 할 때 BDD방식을 도입해서 작성해도 괜찮겠다라는 생각이 들었구요. 이후 좀 더 자세히 방법론이나 라이브러리 활용하는 방법에 대해 더 공부해서 대비를 해야 할 것 같습니다.

[Advanced Python Testing Techniques (PyCon KR 2019) [Korean Ver.]](https://www.slideshare.net/ajmbell/advanced-python-testing-techniques-PyCon-kr-2019-korean-ver){:target="_blank"}{:.markdown-link-body}

# 마치며

개발자로서 처음으로 컨퍼런스에 참여해서 여러 세션들을 들어봤습니다. 천성이 귀차니즘이라 이런 행사에 참여하는 걸 싫어했었는데 한 번 PyCon에 참여를 해보니 '이런 경험들은 얼마든지 해도 나쁘지 않다' 라는 생각이 들었구요. 혹시 개발자로서 매너리즘을 느끼고 계신 분이라면 더더욱 이런 큰 행사에 참여해서 나와 같은 개발자들도 만나서 신선한 자극도 받고 좋은 정보도 얻어가면 좋을 것 같다는 생각이 듭니다. 내년에도 꼭 PyCon 참석할 예정이구요. 이번 PyCon에서는 컨퍼런스 참여 인원들에 비해 부스나 기업의 수가 너무 적어서 부스에서 진행하는 행사들을 참여하기 어려웠습니다. 내년에 열린 PyCon Korea 2020에서는 더 많은 기업이 참여해서 올해보다 더 규모있는 행사로 발전했으면 좋겠구요. 내년에는 세션참여외에 개발자들간 커뮤니케이션을 할 수 있는 프로그램에도 참여해볼 예정입니다. 

각 세션을 발표하신 분들 모두 준비하느라 고생많으셨고 굉장히 도움이 많이 됐습니다. 내년에 있을 PyCon Korea 2020을 기약하며 이만 글을 마치도록 하겠습니다. 감사합니다.