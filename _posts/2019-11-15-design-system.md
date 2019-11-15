---
layout: post
title:  "너드팩토리 디자인시스템 구축기"
author: ["백승빈"]
date:   2019-11-14 09:00:00 -0600
abstract: "너드팩토리의 구성원들이 보다 인간이 해야 하는 깊이 있는 고민에 집중하자는 의미에서 시작된 플랜아이 너드 디자인 시스템 구축기를 소개합니다."
tags: ["디자인시스템", "Design System", "Plani Nerd Design", "생산성 향상", "데이터 분석"]
image: /assets/images/posts/design-system/0.png
draft: "no"	

---

{:.center}
![img0](/assets/images/posts/design-system/0.png)

# 배경

플랜아이가 창업 10년이 되던 해인 2014년, 회사는 지속적인 창발성을 갖는 조직이 되기 위한 방법을 강구하고 조직 구조를 여러 회에 걸쳐 변경하는 등의 실험을 했었습니다. R&D조직이 처음 탄생하기도 했으며 여러 사람의 아이디어들을 비즈니스부터 기술까지 다방면에 걸쳐 검토하고 실행에 옮기는 조직이 별도로 만들어지기도 했습니다. 그리고 조직이 성장하면서 갖는 고정관념과 점차 떨어지는 속도감을 경계했으며 새로운 트렌드와 도전에 앞으로도 계속 민감해지길 원했습니다. 그리고 너드팩토리는 더 나은 미래 플랜아이라는 미션을 부여받고 지속적인 실험과 도전을 통해 우리의 경험담과 기술을 공유하고 협업하는 일에도 힘쓰고 있습니다.

회사의 모든 시스템을 최적화 하고자 한 너드팩토리는 본연의 연구 개발 외에 사이드 프로젝트로 '인공지능 디자인 평가 시스템 VOCZU'✌🏻, '스마트 근태관리 서비스 i-Checker'🤳🏻 등의 대규모 사업을 추진했습니다. 물론 이런 규모가 큰 도전 외에 우리의 경험과 성과를 공유하는 내부 컨퍼런스 및 지식 공유를 위한 발표회를 추진하기도 했습니다. 사실 우리의 도전이 빛에 바라는 것보다 두려운 것은 플랜아이의 구성원에게 아무런 영감도 주지 못하는 일이었기에 직접 업무 프로세스를 경험하며 우리가 먼저 경험하고 공유해줄 만한 일을 찾기 시작했습니다. 그러던 중 `기획 → 디자인 → 개발`로 이어지는 폭포수(Waterfall) 개발 방법론을 고수하던 플랜아이의 프로젝트 전주기에서 한 가지 단점을 발견하게 됩니다. 기획에서 디자인으로 넘어가고 개발로 연결되기까지 세분화된 과정 속에서 매번 다른 컬러🖍, 폰트✍🏻, 컴포넌트🧩를 사용 중이었습니다. 물론 같은 멤버가 다시 만나면 암묵적으로 같은 디자인 패턴을 쓰거나 약간 틀려도 괜찮다고 넘어갈 정도는 됐었지만 전혀 다른 멤버들이 팀으로 만났을 때는 규칙이 깨지는 현상을 경험해야 했습니다. 이는 당연히 생산성 저하로 이어지거나 조직 사기 저하📉로 이어짐을 쉽게 예측해볼 수 있었는데 이러한 단점은 애자일(Agile) 개발 방법론을 적용 중인 너드팩토리도 예외는 아니었습니다. 그래서 우리는 디자인 시스템을 구축하고 내부에서 실험을 거쳐 획일화된 디자인 시스템을 전사에 제공하는 것을 목표로 한 프로젝트를 진행하기로 했습니다. 물론 그 이면에는 `플랜아이에서 함께 하고 있는 모든 디자이너와 개발자의 업무 속도 향상과 함께 보다 더 발전적인 일에 집중할 수 있지 않을까?` 하는 막연한 기대감도 함께 했습니다.



# 디자인 요소 쪼개기

너드팩토리에서도 유사한 컬러임에도 다른 값으로 사용하는 경우가 빈번했는데 특히 스포이드를 활용하는 경우 스포이드를 찍는 영역에 따라 매번 달라지기도 했고 프론트엔드 개발자가 구현하며 이전에 썼던 코드를 복사하느라 제대로 색상이 반영되지 않는 경우도 있었습니다. 그래서 우리는 디자이너의 작업을 옆에서 지켜보며 세밀하게 나누고 각각의 요소를 모두 나누기 시작했습니다. 그리고 최종적으로 프로젝트에서 반복적으로 사용되는 요소들을 분리해서 나누니 아래의 6가지 요소로 나눌 수 있었습니다.



1. Color
2. Typography
3. Elevations
4. Labels
5. Grids & Spacing
6. UI Components



그리고 우리는 이 6가지를 기준으로 하나씩 우리만의 규칙을 정하면서 기존의 디자인 작업을 지속했습니다. 특히 디자이너의 성향에 따라 각자가 갖는 장점이 다르기 때문에 최초에는 Notion 페이지를 활용하여 의견을 취합하고 초안을 잡는 작업을 진행했습니다. 최초에는 구글의 머터리얼 디자인 가이드를 참고하며 진행했으나 구글 머터리얼 디자인만큼의 광범위한 접근은 우리 상황 상 진행이 불가능하다고 여겨 발표자료, 라이브러리 등에서 활용 중인 디자인 시스템들을 참고하기 시작했습니다.



{:.center}
![img1](/assets/images/posts/design-system/1.png)



그리고 우리는 우리가 이미 배포한 제품들의 디자인 요소들을 다시 훑어보며 반복적으로 많이 사용한 방식을 추려내기 시작했습니다. 이전에는 정리되지 않거나 제플린에 배포된 이력 밖에 없어 추적에 어려움을 겪었으나 대부분 디자인 스타일 가이드는 있었기 때문에 취합하고 정리하는 것은 금방 할 수 있었습니다. 다만 일부의 프로젝트는 과도하게 다양한 폰트와 Elevations가 사용되어 정상적인 반영이 어렵다고 판단했고 가장 최근에 수행했던 프로젝트들 기준으로 통일하기 시작했습니다.

{:.center}
![img2](/assets/images/posts/design-system/2.png)

너드팩토리의 업무 특성 상 디자인 시스템을 구축하기 위해 별도의 시간을 뺄 수 없고 집중하기 어려운 구조에 있어 우리는 현재 디자인 작업 중이거나 막 완료된 제품들을 기준으로 색상과 버튼, 그림자 등을 통일하기 시작했습니다. 다만 작업을 진행하며 디자인 시스템을 맞추다 보니 디자인 챕터에서 불필요하게 회의를 많이 하거나 이슈 공유를 하는 일이 생겨나기 시작했고 업데이트 빈도 수가 늘어나자 버전 관리가 정상적으로 되지 않았습니다. 그래서 우리는 노션을 통해 디자인 규칙과 이슈들을 정의하고 공유했으며 파일 공유 자체도 노션을 통해 함으로서 누락되지 않게끔 작업을 했습니다. 그렇게 생산성 관리 도구가 적극적으로 도입되자 보다 수월한 버전관리가 시작되었습니다. (사실 지금 현재 어도비 XD와 스케치를 병행하고 있어 다른 버전 관리 도구를 사용할 수 없기도 했습니다.)



# 개발자도 편한 시스템

점차 디자인 시스템이 업그레이드가 되고 컬러 셋이 완성되어가자 우리아이 iOS에 제일 먼저 Color manager를 세팅하고 다크모드에 대응해보면서 개발자에게 편하고 가독성 높은 디자인 시스템이 되기 위해 필요한 조건들을 다시 가늠하기 시작했습니다. 그리고 적극적으로 배포되고 관리될 수 있게끔 하기 위해 전역으로 관리되고 선언적으로 사용할 수 있도록 구성해야 했고 클래스를 따로 만들어서 우리가 정한 컬러가 복사+붙여넣기로도 관리가 가능하고 필요에 따라 쉽게 추가/삭제 등의 커스터마이징이 가능하도록 구성했습니다.

```swift

import UIKit

class PlaniNerdColor {
  
  // MARK: - DARK
  class func dark900Color() -> UIColor {
    return UIColor(hexString: "212121")
  }
  
  class func dark700Color() -> UIColor {
    return UIColor(hexString: "424242")
  }
  
  class func dark500Color() -> UIColor {
    return UIColor(hexString: "BDBDBD")
  }
  
  class func dark300Color() -> UIColor {
    return UIColor(hexString: "EEEEEE")
  }
  
  class func dark100Color() -> UIColor {
    return UIColor(hexString: "FAFAFA")
  }
  
  // MARK: - LIGHT
  class func light900Color() -> UIColor {
    return UIColor(hexString: "BDBDBD")
  }
  
  class func light700Color() -> UIColor {
    return UIColor(hexString: "D3D3D3")
  }
  
  class func light500Color() -> UIColor {
    return UIColor(hexString: "EEEEEE")
  }
  
  class func light300Color() -> UIColor {
    return UIColor(hexString: "F5F5F5")
  }
  
  class func light100Color() -> UIColor {
    return UIColor(hexString: "FAFAFA")
  }
  
  // MARK: - RED
  class func red900Color() -> UIColor {
    return UIColor(hexString: "E63535")
  }
  
  class func red700Color() -> UIColor {
    return UIColor(hexString: "FF3838")
  }
  
  class func red500Color() -> UIColor {
    return UIColor(hexString: "FF5C5C")
  }
  
  class func red300Color() -> UIColor {
    return UIColor(hexString: "FF8080")
  }
  
  class func red100Color() -> UIColor {
    return UIColor(hexString: "FFFE6E6")
  }
  
  // MARK: - GREEN
  class func green900Color() -> UIColor {
    return UIColor(hexString: "05A660")
  }
  
  class func green700Color() -> UIColor {
    return UIColor(hexString: "06C270")
  }
  
  class func green500Color() -> UIColor {
    return UIColor(hexString: "39D98A")
  }
  
  class func green300Color() -> UIColor {
    return UIColor(hexString: "57EBA1")
  }
  
  class func green100Color() -> UIColor {
    return UIColor(hexString: "E3FFF1")
  }
  
  // MARK: - BLUE
  class func blue900Color() -> UIColor {
    return UIColor(hexString: "0355AA")
  }
  
  class func blue700Color() -> UIColor {
    return UIColor(hexString: "0063F7")
  }
  
  class func blue500Color() -> UIColor {
    return UIColor(hexString: "588DEF")
  }
  
  class func blue300Color() -> UIColor {
    return UIColor(hexString: "ABCDEF")
  }
  
  class func blue100Color() -> UIColor {
    return UIColor(hexString: "DDEEFF")
  }
  
  // MARK: - YELLOW
  class func yellow900Color() -> UIColor {
    return UIColor(hexString: "E6BB00")
  }
  
  class func yellow700Color() -> UIColor {
    return UIColor(hexString: "FFCC00")
  }
  
  class func yellow500Color() -> UIColor {
    return UIColor(hexString: "FDDD48")
  }
  
  class func yellow300Color() -> UIColor {
    return UIColor(hexString: "FDED72")
  }
  
  class func yellow100Color() -> UIColor {
    return UIColor(hexString: "FFFEE6")
  }
  
  // MARK: - ORANGE
  class func orange900Color() -> UIColor {
    return UIColor(hexString: "E67A00")
  }
  
  class func orange700Color() -> UIColor {
    return UIColor(hexString: "FF8800")
  }
  
  class func orange500Color() -> UIColor {
    return UIColor(hexString: "FDAC42")
  }
  
  class func orange300Color() -> UIColor {
    return UIColor(hexString: "FCCC75")
  }
  
  class func orange100Color() -> UIColor {
    return UIColor(hexString: "FFF8E6")
  }
  
  // MARK: - TEAL
  class func teal900Color() -> UIColor {
    return UIColor(hexString: "00B7C4")
  }
  
  class func teal700Color() -> UIColor {
    return UIColor(hexString: "00CFDE")
  }
  
  class func teal500Color() -> UIColor {
    return UIColor(hexString: "73DFE7")
  }
  
  class func teal300Color() -> UIColor {
    return UIColor(hexString: "A9EFF2")
  }
  
  class func teal100Color() -> UIColor {
    return UIColor(hexString: "E6FFFF")
  }
  
  // MARK: - PURPLE
  class func purple900Color() -> UIColor {
    return UIColor(hexString: "4E0099")
  }
  
  class func purple700Color() -> UIColor {
    return UIColor(hexString: "6600CC")
  }
  
  class func purple500Color() -> UIColor {
    return UIColor(hexString: "AC5DD9")
  }
  
  class func purple300Color() -> UIColor {
    return UIColor(hexString: "DDA5E9")
  }
  
  class func purple100Color() -> UIColor {
    return UIColor(hexString: "FFE6FF")
  }
}


```

이렇게 구현을 하면서 보니 작은 화면 또는 높은 해상도 때문에 글씨가 작은 경우에는 B와 8, D와 0과 같은 숫자가 연속으로 표현된 Hex String은 큰 차이는 아니지만 휴먼 에러를 일으키기 좋아보였습니다. 이러한 이슈로 다시 5가지 정도 되는 색상을 다시 수정하고 오차 없게끔 구성을 마치게 됩니다.

사실 iOS에 가장 먼저 도입을 시도했던 이유는 디자인 챕터와 데브 챕터 양쪽에 모두 속해 있는 제가 iOS 앱 개발을 할 수 있어서이기도 했지만 다크모드에 대한 대응 때문에 컬러에 민감하고 보다 효율적으로 Theme을 관리할 수 있게 하려는 고민때문이기도 했습니다. 결과적으로 color를 클래스로 선언하고 디자인 스타일 가이드에 따라 다크모드에도 대응할 수 있는 제품에 맞는 theme manager를 만들게 됩니다. Rx를 주로 사용하고 있던 터라 RxTheme를 이용해 쉽게 구현할 수 있었습니다.

```swift
let themeService = ThemeType.service(initial: .light)
func themed<T>(_ mapper: @escaping ((Theme) -> T)) -> Observable<T> {
  return themeService.attrStream(mapper)
}

protocol Theme {
  var primary: Color { get }
  var secondary: Color { get }
  var secondaryDark: Color { get }
  var text: Color { get }
  var textGray: Color { get }
  var background: Color { get }
  var toolbarBackground: Color { get }
  var videoBackground: Color { get }
  var pickerLineBackground : Color { get }
  var cameraBackground: Color { get }
  var statusBarStyle: UIStatusBarStyle { get }
  var barStyle: UIBarStyle { get }
  var keyboardAppearance: UIKeyboardAppearance { get }
  var blurStyle: UIBlurEffect.Style { get }
  var borderColor: Color { get }
  var footerBorder: Color { get }
  var footerGuideColor: Color { get }
}
```

이렇게 프로토콜을 만들고 라이트모드와 다크모드에 따라 변화될 색상을 앞선 color manager에서 불러와 설정했더니 훨씬 간편하게 관리가 가능했습니다. 다만 설정을 하며 가독성을 해친다고 느껴지면서 몇가지 규칙을 마련하게 되었습니다. 물론 theme 자체도 전부 디자인 시스템을 따르게 구성하고 싶었지만 프로젝트에 따라 화면에 따라 커스텀으로 들어가는 색상들과 변수명이 과도하게 획일화되면 오히려 불편이 가중될 것 같다는 생각에 theme은 개발자 개인이 직접 관리하는 쪽으로 방향을 선회했습니다.

그리고 몇번의 반복적인 테스트와 개발을 진행하며 수차례의 업데이트가 계속되었고 지금도 다른 언어를 사용 중인 프로그래머도 함께 합류하여 테스트하고 manager를 만들며 우리만의 디자인 시스템을 만들기 위해 전직원이 여기에 조금씩 기여를 하고 있습니다.

# 후기

사실 디자인 시스템을 구축하는 결심을 하고 완성하기까지의 과정에서 제일 어려웠던 것은 plan과 do의 시작이지 않았나 돌이켜봅니다. 계획을 하고 다짐을 하기까지 사실 지금 이대로 해도 큰 사고가 없었는데 굳이 바꿀 필요가 있나 고민을 하곤 했고 몇번이나 뒤로 미루며 자기 합리화를 했었습니다. 하지만 개발을 하면 할 수록 불편함이 느껴지기 시작했고, 다른 회사와 같이 반복적인 업무에만 집중하는 것이 아닌 우리가 본연의 해야할 일, 해야만 하는 일에 집중하는게 더 좋다고 생각하기 시작했습니다.

그리고 디자인 시스템이 완성되고 iOS에 적용해본 결과 놀랍게도 단시간에 프로젝트를 설정하고 쉽게 값을 불러와 여기저기서 활용할 수 있었습니다. 이는 단순히 시간의 가치로 환산할 수 없을만큼 효과적이었습니다. 물론 디자인 시스템의 완성은 지속적인 활용과 업데이트라고 생각하기에 디자인 시스템 구축의 성공은 더 지켜봐야 하겠지만 디자이너와 개발자가 협업을 하며 하나의 프로젝트를 챕터별로 진행하며 서로가 어떤 일을 어떤 식으로 하는지 알아갈 수 있었던 좋은 기회였습니다. 

