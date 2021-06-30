---
layout: post
title: "VODA 디자인 시스템 2"
author: ["유보람"]
date: 2021-03-05
abstract: "안녕하세요, 너드팩토리 프로덕트 디자이너 Allison입니다. 지난번에는 디자인 시스템을 구축한 계기, 필요한 이유와 구축 기준(타이포그래피와 그리드와 간격)을 알아봤습니다. 이번 편에는 브랜드 컬러를 정한 기준과 UI 컴포넌트 구성에 대해 말할게요. 하단 링크를 통해 먼저 1편을 보고 오는 것을 권장합니다."
tags: ["VODA", "Design System", "Adobe Xd"]
image: /assets/images/posts/2021-04-01-voda-design-system-1/thumbnail.svg
draft: "no"
---

안녕하세요, 너드팩토리 프로덕트 디자이너 Allison입니다.

지난번에는 디자인 시스템을 구축한 계기, 필요한 이유와 구축 기준(타이포그래피와 그리드와 간격)을 알아봤습니다. 이번 편에는 브랜드 컬러를 정한 기준과 UI 컴포넌트 구성에 대해 말할게요. 하단 링크를 통해 먼저 1편을 보고 오는 것을 권장합니다.

[https://blog.nerdfactory.ai/2021/01/11/voda-design-system-1.html](https://blog.nerdfactory.ai/2021/01/11/voda-design-system-1.html)

---

## 3) Colors

컬러는 서비스를 대표하고 브랜드의 성격을 말해주는 요소입니다. 너무 많은 컬러를 사용할 경우 브랜드 아이덴티티가 약해져 일관된 사용자 경험을 제공하기 어렵습니다. 그러나 너무 적은 컬러로는 디자인할 때 한계에 부딪힐 수 밖에 없어요. 그래서 명암에 따라 10단계로 나누고 이것을 기반으로 브랜드 아이덴티티를 지키며 유연한 디자인을 합니다.

### 3-1) Gray Scale Colors

GUI 디자인 작업을 하기 전 정보의 계층구조를 나타낼 때 사용합니다. 그 외에 텍스트, 정보를 나누기 위한 구분선 요소에 사용해요. Grey 컬러가 필요할 때마다 마법사처럼 혹은 그 날의 기분에 따라 매번 다른 그레이 컬러를 사용할 수 없으니 Grey50, 100, 200, 300, 400, 500, 600, 700, 800 ,900까지 총 10단계로 나눕니다. 필요에 따라 더 세분화하거나 간소화할 수 있으며 브랜드 분위기에 따라 Cool Tone/Warm Tone으로 바꿀 수 있어요.

{:.center}
![Gray_scale](/assets/images/posts/2021-07-01-voda-design-system-2/Gray_scale.svg)

### 3-2) Brand Colors

### Primary

VODA의 브랜드 컬러를 지정할 때 두 가지 요소를 고려했습니다.

- 첫 번째, 유사 서비스와 다른 컬러를 사용하여 브랜드 컬러만으로 시각적 인지도를 얻자
- 두 번째, 기존 운영 중인 AIVORY와 다른 서비스를 제공하므로 컬러 자산을 계승하지 않고 독자적인 컬러를 갖자.

그래서 결정한 Primary Color는 #7851e7입니다.

### Secondary

Primary Color와 조화와 전체적인 브랜드 방향성을 고려해 결정합니다. VODA에서 Secondary Colors는 대부분 그래프에서 요소 구분을 위해 사용하므로 이 또한 고려해야 합니다.

- 퍼플 계열(Primary Color)과 사용했을 때 구분이 확실 해야 하므로 난색 계열로 갈 것
- 함께 사용했을 때 Primary Color와 조화로울 것

그래서 결정한 컬러는 오렌지 계열인 #ff9931와 난색에 가까운 올리브 그린 컬러 #b0b900로 결정했어요.

VODA는 데이터를 시각화할 일이 많고 그에 따라 더 많은 컬러 팔레트가 필요해요. 그래서 이 컬러들을 중심으로 바리에이션 하여 더 다양한 팔레트를 만들어 상황에 따라 사용합니다.

{:.center}
![Palette](/assets/images/posts/2021-07-01-voda-design-system-2/Palette.svg)

Eva 디자인 시스템에서 Color Generator를 사용하면 더 쉽게 팔레트를 만들 수 있습니다.
: [https://colors.eva.design/](https://colors.eva.design/)

[Eva Design System: Deep learning color generator](https://colors.eva.design)

### 3-3) System Colors

브랜드 컬러와는 별개로 사용자에게 직관적으로 시스템의 상태를 전달하기 위해 사용하는 컬러입니다. Danger(Error), Warning, Success, Info로 구분하여 순서대로 Red, Yellow, Green, Blue 계열로 설정합니다. 시스템의 상태를 효과적으로 전달하기 위해 아이콘, 텍스트와 함께 디자인할 것을 권장해요. (UI 컴포넌트-Input 섹션 참고)

![System_Colors](/assets/images/posts/2021-07-01-voda-design-system-2/System_Colors.svg)

또한 VODA에서는 Heatmap에서 사용할 그라데이션 컬러가 필요했습니다. 이때부터 컬러 지옥에 빠졌어요..:( 슬프지만 침착하게 일러스트레이터를 켭니다. 컬러 변경의 기점이 되는 시스템 컬러들을 적당한 간격을 두고 일직선에 배치한 후 블랜딩 툴(W)을 이용하여 그라데이션을 줍니다. 어도비 선생님께 감사한 순간이에요.

(블랜딩 툴 사용법: [https://www.youtube.com/watch?v=tQdWx_PbawU](https://www.youtube.com/watch?v=tQdWx_PbawU))

[#08 블렌드툴 I 일러스트레이터 왕초보 기초강좌 I 블렌드 툴에 대해서 알아보아요I 디자이너깜짝의 친절한 그래픽](https://www.youtube.com/watch?v=tQdWx_PbawU)

블랜딩해서 나온 컬러들을 복사, Xd나 Figma으로 가져옵니다. 일러스트레이터에 출력 된 컬러를 모두 사용하면 너무 많으니 이 중에서 10~15개 정도 추려 정리합니다.

![Heatmap_gradation_Colors](/assets/images/posts/2021-07-01-voda-design-system-2/Heatmap_gradation_Colors.svg)

---

### 4) UI Components

서비스 안에서 공통으로 사용하는 UI 컴포넌트로 Icons, Input, Button, Modal, Table 등이 여기에 해당합니다. 현재 VODA는 Web 서비스만 제공하므로 Web UI 컴포넌트를 기준으로 했어요. 전체 서비스에서 두 개 이상 들어갈 시 컴포넌트로 등록하고 구성요소에서 불러와 사용하는 것이 수정에 용이하고 디자이너 정신건강에 이롭습니다. UI 컴포넌트에서 중요한 사항은 단순한 디자인 리소스를 만드는 것이 아니라는 점입니다. 팀원 간의 약속을 만드는 작업으로 컴포넌트 쓰임에 대한 이해를 기반으로 명확한 규칙을 세워 팀원 모두가 보고 이해할 수 있어야 합니다.

VODA 디자인 시스템의 UI 컴포넌트 중 일부만 공개합니다.

![input](/assets/images/posts/2021-07-01-voda-design-system-2/input.svg)

아이콘은 4의 배수로 결정하고(원형 제외) 비율에 맞게 Keyline 내에서 작업하여 전체적인 아이콘 크기를 맞춰 일관성을 유지합니다.

![ICONS_(1)](</assets/images/posts/2021-07-01-voda-design-system-2/ICONS_(1).svg>)

이 외에도 로고 가이드 디자인, UI 텍스트 가이드라인(UX Writings) 등 프로젝트 상황 또는 필요에 맞게 추가할 수 있습니다.

---

## 5. 지속가능한 디자인 시스템

디자인 시스템에서 중요한 것은 단순히 좋아 보이게 만드는 것이 아닌 팀원 모두가 디자인 시스템에 대해 이해할 수 있도록 만드는 것입니다. 이러한 디자인 시스템은 디자인에 대한 의사결정을 하는 데 있어 도움을 주고 커뮤니케이션 비용을 줄여 업무의 효율성을 높여줍니다. 그러나 디자인 시스템은 효율적인 도구일 뿐 절대적인 가이드라인이 될 수 없어요. 그러니 프로젝트 상황에 맞게 수정하고 유연히 적용하길 바랍니다. VODA 디자인 시스템 또한 서비스의 지속적인 운영과 더 나은 사용자 경험을 제공하기 위해 수정을 거듭하며 발전할게요!

끝 🙌

---

Reference:

[https://ridi.design/](https://ridi.design/)

[RIDI Design System](https://ridi.design/)
