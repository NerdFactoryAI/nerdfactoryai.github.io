---
layout: post
title: "TDD 적용하기 (Python Django)"
author: ["김기강"]
date: 2022-09-20
abstract: "‘TDD(Test-Driven-Development) 개발을 적용하자’라는 의견이 제시됐고 팀에서는 동의했다. 하지만, 테스트 코드를 통해 테스트를 진행해본 경험도 적고 TDD가 무엇인지도 리서치가 필요했다. 길을 잃고 또 다시 TDD 적용이 무산되는 것을 지켜만 볼 수 없었기에 직접 적용해보고 공유하기 위해 이 글을 작성했다."
tags: ["TDD", "Django"]
image: /assets/images/posts/2022-10-04-apply-tdd-with-python-django/Untitled.png
draft: "no"
---

# 1. 개요

‘TDD(Test-Driven-Development) 개발을 적용하자’라는 의견이 제시됐고 팀에서는 동의했다.

하지만, 테스트 코드를 통해 테스트를 진행해본 경험도 적고 TDD가 무엇인지도 리서치가 필요했다.

길을 잃고 또 다시 TDD 적용이 무산되는 것을 지켜만 볼 수 없었기에

직접 적용해보고 공유하기 위해 이 글을 작성했다.

![tdd](/assets/images/posts/2022-10-04-apply-tdd-with-python-django/Untitled.png)
_출처: [https://wooaoe.tistory.com/33](https://wooaoe.tistory.com/33)_

# 2. 사전준비

추천 이름 변경 API 개발이 필요한 상황이다.

우선 API에 필요한 기능을 나열해보자.

어떤 테스트 코드를 작성해야하는지 감 잡는데 도움이 된다.

지도 없이 보물을 찾는건 쉽지 않은 일이다.

1. API를 호출할 수 있는 url이 있다.
2. header로 테넌트 값을 받는다.
   - 해당 테넌트가 있는지 확인한다.
3. 필수 argument인 ak(API 키)와 name(바꿀 이름)을 받는다.
4. 동일한 이름으로 존재하는 추천이 있는지 확인한다.
5. ak를 기반으로 추천 정보를 가져온다.
6. 이름을 수정한 뒤, 저장한다.

# 3. 개발

TestCase와 APITestCase로 나뉘어 작성되어 있다.

함수인지, API 호출과 관련된 기능인지에 따라 구분지었다.

## APITestCase

1. API를 호출할 수 있는 url이 있다.

   - API 호출을 테스트하기 때문에 APITestCase를 사용했다.
   - 모든 기능을 다 만든 뒤, 통합 테스트 단계에서 이 class를 수정할 예정이다.

   ### 1. 테스트 코드 작성

   ![testCode](</assets/images/posts/2022-10-04-apply-tdd-with-python-django/Untitled(1).png>)
   _API가 존재하지 않는 상태에서 실패하는 테스트 코드 작성_

   ![fail](</assets/images/posts/2022-10-04-apply-tdd-with-python-django/Untitled(2).png>)
   _결과는 당연히 실패_

   ### 2. 실제 코드 구현

   ![testcode2](</assets/images/posts/2022-10-04-apply-tdd-with-python-django/Untitled(3).png>)
   _테스트 코드를 통과하는 코드 구현_

   ![success](</assets/images/posts/2022-10-04-apply-tdd-with-python-django/Untitled(4).png>)
   _성공!_

   refactor 할 거리가 없는 매우 단순한 코드이기에 다시 `red`로 돌아간다.

   이렇게 `실패 테스트 코드 작성, 성공 실제 코드 구현, 리팩토링`을 반복하면 된다.

2. header로 Tenant 값을 받는다.

   ### 1. 테스트 코드 작성

   ![seantestcode](</assets/images/posts/2022-10-04-apply-tdd-with-python-django/Untitled(5).png>)

   _선 테스트 코드_

   ### 2. 실제 코드 구현

   ![realcode](</assets/images/posts/2022-10-04-apply-tdd-with-python-django/Untitled(6).png>)

   _후 구현_

3. 필수 argument를 받는다.

   ### 1. 테스트 코드 작성

   - 이전 작업으로 인해 header 값도 있어야한다.

   ![header](</assets/images/posts/2022-10-04-apply-tdd-with-python-django/Untitled(7).png>)

   ### 2. 실제 코드 구현

   - 중복이 있지만, 우선 만든다.

   ![untitle](</assets/images/posts/2022-10-04-apply-tdd-with-python-django/Untitled(8).png>)

   ### 3. Yellow

   - argument 검사로 인해 이전 테스트 코드가 실패하게 된다.
     - 동일한 내용이 포함된 테스트가 있기 때문에 없애준다.
   - 중복된 코드 및 코드 구조를 리팩토링한다.

   ![header 검사 코드에는 argument 확인 로직이 없어 실패한다.](</assets/images/posts/2022-10-04-apply-tdd-with-python-django/Untitled(9).png>)

   _header 검사 코드에는 argument 확인 로직이 없어 실패한다._

   ![중복을 없애고, 유효성 검사 로직을 추가했다.](</assets/images/posts/2022-10-04-apply-tdd-with-python-django/Untitled(10).png>)

   _중복을 없애고, 유효성 검사 로직을 추가했다._

   ![성공](</assets/images/posts/2022-10-04-apply-tdd-with-python-django/Untitled(11).png>)

   _성공_

## TestCase

1. 동일한 이름으로 존재하는 추천이 있는지 확인한다.

   ### 1. 테스트 코드 작성

   ![이미 있는 이름 → True, 없는 이름 → False](</assets/images/posts/2022-10-04-apply-tdd-with-python-django/Untitled(12).png>)

   _이미 있는 이름 → True, 없는 이름 → False_

   ### 2. 실제 코드 구현

   ![objects.get()은 값이 없으면 에러가 발생한다.](</assets/images/posts/2022-10-04-apply-tdd-with-python-django/Untitled(13).png>)

   _objects.get()은 값이 없으면 에러가 발생한다._

   ### 3. 리팩토링

   ![스크린샷 2022-09-16 오후 5.50.18.png](</assets/images/posts/2022-10-04-apply-tdd-with-python-django/Untitled(14).png>)

1. 해당 Tenant가 존재하는지 확인한다.

   - tenant_check() 함수는 기작성된 함수이므로, 테스트 코드만 작성해준다.

   ![스크린샷 2022-09-16 오후 6.07.26.png](</assets/images/posts/2022-10-04-apply-tdd-with-python-django/Untitled(15).png>)

1. ak를 기반으로 추천 정보를 가져온다.

   ### 1. 테스트 코드 작성

   ![스크린샷 2022-09-19 오후 2.11.23.png](</assets/images/posts/2022-10-04-apply-tdd-with-python-django/Untitled(16).png>)

   ### 2. 구현

   ![스크린샷 2022-09-19 오후 2.11.37.png](</assets/images/posts/2022-10-04-apply-tdd-with-python-django/Untitled(17).png>)

   ![테스트 통과](</assets/images/posts/2022-10-04-apply-tdd-with-python-django/Untitled(18).png>)

   _테스트 통과_

1. 이름을 수정한 뒤, 저장한다.

   ### 1. 테스트 코드 작성

   ![스크린샷 2022-09-19 오후 3.05.57.png](</assets/images/posts/2022-10-04-apply-tdd-with-python-django/Untitled(19).png>)

   ### 2. 구현

   ![스크린샷 2022-09-19 오후 2.43.56.png](</assets/images/posts/2022-10-04-apply-tdd-with-python-django/Untitled(20).png>)

   ![잘 된다.](</assets/images/posts/2022-10-04-apply-tdd-with-python-django/Untitled(21).png>)

   _잘 된다._

이후 API를 테스트하는 코드를 작성하고

기작성된 코드를 리팩토링해, 하나의 API로 구성해서 API 통합 테스트를 진행한다.

![API 호출과 결과 확인](</assets/images/posts/2022-10-04-apply-tdd-with-python-django/Untitled(22).png>)

_API 호출과 결과 확인_

![성공](</assets/images/posts/2022-10-04-apply-tdd-with-python-django/Untitled(23).png>)

_성공_

# 4. 회고

### 테스트 코드

TDD로 개발하는 것과 더불어 테스트 코드를 작성해서 테스트를 진행하는 것도 처음 해봤다.

개발중에 데이터 생성, 수정 등 확인하는데 귀찮거나 시간이 오래 걸리는 부분을 편하게 테스트 할 수 있었다.

### 적용 시기

TDD는 개발 초기나 아키텍처를 뒤엎는 경우에 적용하는게 좋아보인다.

테스트 코드가 없는 기작성 코드에 대해 TDD를 적용하는건 불편할 것 같다.

### 작업 시간

아직 익숙하지 않은 사이클로 개발을 했기 때문에 바로 코드를 구현하는 것보다 완성되는 시간은 늦었다.

하지만, 테스트 코드를 통해 리팩토링도 동시에 진행하면서,

추후 발생하는 이슈나 해당 코드를 이해하는데 걸리는 시간을 줄여줄 수 있다는 이점 덕분에 충분히 적용할 가치가 있다.

만약 TDD에 익숙해진다면, 전체적인 시간으로 봤을 때 많은 이점이 있을 것 같고,

팀에서 발생하는 휴먼 이슈와 불화 또한 줄일 수 있을 것 같다.

### 정답을 알려줘

TDD는 개발 방법론인 것이니 ‘무조건 이렇게 해야한다’는 정답은 없고 생각한다.

우리식으로 하는게 우리의 개발 문화다.

이상 개발 문화에 TDD를 적용하기 위한 첫 발걸음을 내딛었다.

나만 열심히 해서 이뤄지는게 아니고 모든 팀원이 노력해야 비로소 완성된다고 생각한다.

(1인 개발자인 조직이라면 가능할지도..)
