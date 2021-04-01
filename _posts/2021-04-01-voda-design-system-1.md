---
layout: post
title: "VODA 디자인 시스템 1"
author: ["유보람"]
date: 2021-01-11
abstract: "안녕하세요, 너드팩토리 프로덕트 디자이너 Allison 입니다. 이번 글은 VODA 서비스 구축 프로젝트를 시작하기 전 진행한 VODA 디자인 시스템 제작기를 들려 드리고자 합니다. 디자인 시스템을 설명하는 글은 다른 곳에서도 쉽게 찾을 수 있으니 여기서는 어떤 기준으로 디자인 시스템을 구축하는 지에 대해 이야기를 할게요."
tags: ["VODA", "Design System", "Adobe Xd"]
image: /assets/images/posts/2021-04-01-voda-design-system-1/thumbnail.svg
draft: "no"
---

{:.center}
![thumbnail](/assets/images/posts/2021-04-01-voda-design-system-1/thumbnail.svg)

## 0. 들어가기 전에

안녕하세요, 너드팩토리 프로덕트 디자이너 Allison 입니다.

너드팩토리에서는 현재 신규 서비스 VODA를 준비하고 있습니다.

이번 글은 VODA 서비스 구축 프로젝트를 시작하기 전 진행한 VODA 디자인 시스템 제작기를 들려 드리고자 합니다. 디자인 시스템을 설명하는 글은 다른 곳에서도 쉽게 찾을 수 있으니 여기서는 어떤 기준으로 디자인 시스템을 구축하는 지에 대해 이야기를 할게요.

---

## 1. 계기

VODA 프로젝트는 프로덕트 오너, 프로덕트 디자이너, 프론트엔드 개발자, 백엔드 개발자 그리고 AI 개발자가 함께 만들고 있습니다. 최종 목표는 모두 같지만 VODA 브랜드에 대한 생각은 완전히 같을 수 없어요. 그래서 일관성 있는 프로젝트를 구축하고 사용자에게 일관된 서비스를 제공하기 위해 디자인 시스템을 구축하기로 했습니다.

---

## 2. 디자인시스템을 왜 사용할까?

매번 다른 폰트, 간격, 색상을 사용한다면 디자이너의 퇴근은 자연스레 늦어집니다. 따라서 하나의 서비스 전반에 공통으로 쓰이는 타이포그래피, 그리드, 간격, 색상 그리고 UI 구성요소를 체계적으로 정리하여 디자인 시간을 단축 시키고 불필요한 소통과 수정을 최소화합니다. 프로젝트 도중 디자인팀 인원이 늘어나거나 담당 프로덕트 디자이너가 바뀌어도 체계화된 디자인 시스템으로 사용자에게 일관성 있는 디자인을 제공할 수 있습니다.

---

## 3. 디자인 시스템에는 어떤 요소가 들어가야할까?

- Typography
- Grids and Space
- Colors
- UI Components: Buttons, Forms, icons, Modals, Picker 등

---

## 4. 어떤 기준으로 만들까?

### 1) Typography

타이포그래피에서 고려해야 할 사항은 다음과 같습니다.

1. pt는 디스플레이 장치에서 ppi에 따라 각각 크기가 달라지니 웹 개발에서 단위는 px를 사용합니다.
2. 웹 페이지 트래픽과 로딩 시간을 고려해 될 수 있으면 웹 폰트 사용을 권장합니다.
3. 일반 웹 사이트의 본문 텍스트 크기는 14~16px이므로 사용자 층과 가독성을 고려하여 본문 텍스트 크기를 결정합니다.

VODA는 웹 폰트인 Noto Sans Kr(국문)와 Robot(영문)을 사용하고 본문 텍스트 크기는 14px로 결정했습니다. 이 기준을 바탕으로 하단 이미지와 같이 일정한 규칙을 가지고 정보의 위계에 따라 Header는 4가지, text는 5가지로 구성합니다.

여기까지 왔다면 디자인 시스템을 거의 다 구축한 거나 다름없습니다.

{:.center}
![typo](/assets/images/posts/2021-04-01-voda-design-system-1/typo.svg)

{:.center}
![header](/assets/images/posts/2021-04-01-voda-design-system-1/header.png)

{:.center}
![text](/assets/images/posts/2021-04-01-voda-design-system-1/text.svg)

행간값은 텍스트의 양과 폰트 크기에 따라 달라지지만, 일반적으로 행간값은 폰트 크기 X 1.7~1.75 사이 값으로 설정합니다. 위와 같이 사용할 타이포그래피를 정리한 후에 반드시 Asset에 등록하여 사용하는 것이 디자이너 정신 건강에 이롭습니다.

### 2) Grids and Space

_[StatCounter Global Stats - Browser, OS, Search Engine including Mobile Usage Share](https://gs.statcounter.com/)_

위의 사이트에서 데이터를 보며 최소 화면 크기를 결정합니다. VODA는 노트북에서도 불편함 없이 서비스를 이용할 수 있도록 1280px까지 지원하기로 했습니다.

{:.center}
![breakpoint](/assets/images/posts/2021-04-01-voda-design-system-1/breakpoint.svg)

{:.center}
![gridsystem](/assets/images/posts/2021-04-01-voda-design-system-1/gridsystem.svg)

그리드를 효율적으로 활용하기 좋은 12 Grid System(Max width:1600px, Gutter:24px, Margin:62px)을 사용하기로 했어요. 하단 사이트에서 그리드를 계산하면 편리합니다.

_[Grid Calculator by Nicolaj Kirkgaard Nielsen](http://gridcalculator.dk/#/1920/12/16/62)_

그리드 시스템은 UI를 배치할 때 기준을 제시할 뿐이니 반드시 그리드에 맞출 필요 없고 상황에 따라 유연하게 사용하면 됩니다.

{:.center}
![space](/assets/images/posts/2021-04-01-voda-design-system-1/space.svg)

간격을 1px 단위씩 움직이면 디자이너는 또 퇴근할 수 없습니다. 그래서 간격에도 일정한 규칙을 정합니다. VODA는 4의 배수를 기반으로 총 6가지 간격 크기를 두고 이를 조합하여 사용했어요.

🙋🏻‍♀️ Colors, UI Components 부분은 VODA 디자인 시스템 2에 이어집니다.

---

### Reference

스포카 디자인 가이드라인:

_[Spoqa Design Guidelines](https://bi.spoqa.com/)_

리메인 스타일 가이드:

_[리메인 스타일가이드](http://styleguide.co.kr/index.php)_

1편 끝 🔚
