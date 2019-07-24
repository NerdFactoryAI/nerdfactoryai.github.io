---
layout: post
title:  "Sketch와 Photoshop의 Zeplin활용"
author: ["이지원"]
date:   2019-04-12 12:53:01 -0600
abstract: "너드팩토리에서 디자인된 화면을 가지고 다른 분들과 의견을 나눌때 사용되는 Zeplin에 대해 간단한 사용방법과 너드팩토리에서 이루어지는 협업방식에 대해 말씀드리겠습니다."
tags: ["Zeplin", "Sketch", "Photoshop"]
image: /assets/images/posts/sketch-photoshop-zeplin/img1.png
draft: "no"	
---

{:.center}
![img1](/assets/images/posts/sketch-photoshop-zeplin/img1.png)

# Abstract

너드팩토리에서 제작되는 대부분의 웹, 모바일의 화면은 Sketch라는 디자인 툴로 제작되고 있습니다. 그리고 함께 프로젝트에 참여하는 분들과 협업하는 도구로 Zeplin이라는 프로그램을 사용하여 디자인된 파일을 볼 수 있도록 공유하고 의견을 주고받고 있습니다. 해서 이번 포스트에서는 Photoshop과 Sketch로 제작된 파일을 Zeplin으로 업로드하는 부분과  Zeplin을 어떻게 활용하고 있는지를 다루겠습니다.

# Photoshop과 Sketch

보통 디자인을 했던 분들이거나 하는 분들에게는 Adobe에서 나온 Photoshop 프로그램에 더욱 친숙하고 많이 사용해오고 계실 것입니다. 마찬가지로 저도 디자인과 관련된 작업을 진행하면서 Photoshop이나 Illustrator를 가지고 작업을 많이 했었는데 사실 Photoshop은 사진 편집에 좀 더 특화된 프로그램이다 보니 UI를 작업하면서 약간은 답답한 부분이 있었습니다.

Photoshop을 가지고 화면을 디자인했을 때 하나의 프로젝트이지만 모든 화면을 모아서 한눈에 보기가 어려웠고 그만큼 많이 만들다 보면 컴퓨터 용량을 많이 차지하게 되고 컴퓨터도 계속 버벅거리는 일이 발생하게 되었습니다.(데스크탑이 아닌 노트북으로 작업해서 그럴수도 있겠죠..?)

{:.center}
![img2](/assets/images/posts/sketch-photoshop-zeplin/img2.png)
*Photoshop 사용화면*

하지만 Sketch를 활용하여 UI 작업을 할 경우 Photoshop에 비해 UI에 좀 더 특화되어 나온 툴이다 보니
모든 화면(artboard 혹은 대지로 표현되는 것들)을 한 파일에 깔아놓고 한눈에 볼 수 있어서 플로우를 잡는데 더욱 용이했고 
용량도 작은편이며 컴퓨터가 버거워하는 모습도 많이 보이지 않았습니다.
물론 좀 더 고급적인 편집기술이 필요한 작업이나 이미지 작업은 Adobe의 프로그램을 활용해야 했지만 그 정도의 작업은 Sketch를 사용하기에 큰 불편함을 주지 않았습니다. 

{:.center}
![img3](/assets/images/posts/sketch-photoshop-zeplin/img3.png)
*Sketch 사용화면*

# Zeplin

Zeplin은 하나의 커뮤니케이션 도구의 일종이라고 생각하시면 될 것 같습니다.
물론 카카오톡처럼 채팅과 같은 커뮤니케이션 도구는 아니고 디자인 화면을 하나의 프로젝트를 하는 모든 사람들과 공유가 가능하고 메모를 남겨 의견을 공유하는데 있어 커뮤니케이션 도구라고 생각하고 사용하고 있습니다.

또한 Zeplin은 디자이너들에게도 좋은 툴이지만 모바일이든 웹이든 퍼블리싱 작업하시는 분들에게도 자잘한 일을 하는데 시간을 절약해주는 도구라고 생각합니다.

{:.center}
![img8](/assets/images/posts/sketch-photoshop-zeplin/img8.png)
*Zeplin 사용화면*

주로 활용한 Zeplin의 특징을 간단히 정리해보았습니다.

- Zeplin은 1명의 관리자가 프로젝트를 생성 및 관련 디자인 파일(화면)을 업로드하고
이메일로 초대된 다른 사용자분들은 업로드된 화면을 함께 공유 받고 메모를 남길 수 있습니다.
- 무료 버전은 1개의 프로젝트까지만 생성이 가능하고 300개의 컴포넌트까지 업로드 가능합니다.
- 프로젝트를 처음 생성할 때 ios, android, web 3가지 중 1개를 선택해야 하는데
이는 앞으로 업로드되는 모든 디자인의 크기(pt, dip, px 등)를 결정짓고 수정이 불가능하니 주의해서 선택하시면 됩니다.
- 너드팩토리에서는 우선 web으로 프로젝트를 생성해서 제가 디자인 파일을 업로드하면 다른 분들은 메모를 남겨주는 방식으로 협업을 했고 진행되는 서비스마다 Zeplin상에서 그룹으로 묶어서 업무를 관리했습니다.

# Photoshop x Zeplin

우선 Photoshop으로 Zeplin에 업로드하는 방법을 간단하게 말씀드리겠습니다.

참고할 부분

- Photoshop과 Zeplin을 연동할 경우 Photohop cc 2015버전부터 가능합니다.  
- 먼저 Zeplin을 설치해주세요 [Zeplin Official Website](https://zeplin.io/){:target="_blank"}{:.markdown-link-body}

{:.center}
![img4](/assets/images/posts/sketch-photoshop-zeplin/img4.png)

Photoshop에 파일을 불러와서 이미지에 보이는 것처럼 대지를 설정해줍니다.

export할 아트 보드(대지)를 선택한 후 Window > Extentions > Zeplin (창 > 확장 > Zeplin)을 클릭하면 아래 이미지의 왼쪽과 같은 형태가 보일 것입니다. (Zeplin을 설치해야 extentions에서 Zeplin이 보입니다.) 
  - 해당 아트 보드(대지)를 클릭한 뒤 화면상에 따로 슬라이스를 해야 하는 아이콘, 이미지 레이어를 선택한 뒤 하단의 Mark as asset을 클릭해주면 선택했던 아이콘, 이미지의 레이어 이름 앞에 -e-가 붙게 되면 export로 따로 설정이 된 것입니다.
  - 그 후 아트 보드를 클릭하고 2번째 그림처럼 Export selected artboards를 해주면 마지막 그림처럼 업로드되는 위치를 선택하고 import 하면 됩니다. 

{:.center}
![img5](/assets/images/posts/sketch-photoshop-zeplin/img5.png)

Photoshop은 모든 UI를 한 번에 업로드하기가 어렵고 하나씩 대지를 선택하여 업로드를 해야 하는 약간의 불편함이 있습니다.
(대지를 하나의 프로젝트에 놓고 한번에 업로드하면되지만 컴퓨터사양에 따라 버벅거림이 심할수 있습니다.)

# Sketch  x  Zeplin

{:.center}
![img6](/assets/images/posts/sketch-photoshop-zeplin/img6.png)

Sketch에서도 마찬가지로 슬라이스해야 하는 아이콘, 이미지를 우선 선택하여 오른쪽 Shadows 아래 있는 MAKE EXPORTABLES를 선택하여 Presets을 생성해 줍니다. (Sketch에서 기본적으로 제공되는 presets은 ios, android, default을 선택할 수 있고 export 되는 포맷은 png, jpg, tiff, webp, eps, svg, pdf가 있어서 프리셋만 따로 추출도 가능합니다.)

모든 asset을 export 했다면 zeplin에 업로드해야 하는 모든 화면을 선택한 뒤 탭 바에 있는 Plugins > Zeplin > Export Selected를 선택합니다. 그러면 아래 이미지처럼 업로드되는 프로젝트 위치를 선택한 뒤 import 하면 됩니다.

{:.center}
![img7](/assets/images/posts/sketch-photoshop-zeplin/img7.png)

# Zeplin활용

Photoshop과 Sketch를 통해 export된 파일은 업로드한 프로젝트에 위치해있고 업로드한 파일을 그룹화하여 업무별로 UI를 구분해 놓을 수 있습니다. 

{:.center}
![img10](/assets/images/posts/sketch-photoshop-zeplin/img10.png)


Photoshop과 Sketch에서 미리 추출한 아이콘, 이미지를 클릭하면 아래 화면처럼 기본적인 css 코드와 html 코드를 제공해줍니다. 그리고 요소를 클릭하고 Mac에서 Command를 누르고 다른 곳에 마우스를 두면 그 해당 영역까지의 거리를 px로 보여주고 비율(%)까지 제공해줍니다. 이는 전체 화면상에서의 거리와 비율도 제공해주며 어떤 카드 안에 있다면 그 카드 안에서의 비율과 거리도 제공해줍니다.

중요한 것은 처음 Zeplin 사용 시 설정된 프로젝트의 형태, ios 인지 android 인지 web 인지에 따라서 거리를 나타내주는 단위가 pt, dpi, px로 보여줍니다.(처음 Zeplin을 설정할때 결정된 것으로 보여지며 추후 수정은 불가능합니다.)

그리고 아이콘과 이미지뿐 아니라 배경에 적용된 색상(그라데이션 포함), 폰트 정보(크기, 위치, 굵기, 높이, 자간, 행간)까지 모두 다 확인할 수 있습니다. (심지어 엄청 긴 글도 바로 복사가 가능해서 귀찮게 타이핑할 일을 없애줘서 좋습니다. good!)

업로드된 화면은 Zeplin의 프로젝트에 함께하는 모든 분들이 바로 확인할 수 있고 아래 이미지처럼 코멘트를 달아 좀 더 즉각적인 피드백이 가능합니다. 그리고 코멘트를 좀 더 실시간으로 하고 싶으신 분들은 [Slack](https://slack.com/)이라는 커뮤니케이션 도구(카카오톡, 라인과 같은 채팅 도구)를 활용하면 업로드되는 화면이나 코멘트를 자동 알림으로 하여 바로바로 확인과 작업이 가능합니다.

{:.center}
![img11](/assets/images/posts/sketch-photoshop-zeplin/img11.png)

Zeplin을 쓰면서 아쉬운 점도 몇 가지가 있었습니다.

- 코멘트가 달려있는 화면을 수정해서 재업로드를 할 경우 같은 이름이어도 덮어쓰기가 되지 않는 부분은 좋은 점이지만 삭제하면 모든 코멘트가 사라진다는 것(피드백을 해결하면 상관은 없겠죠?)
- 제플린에서도 업로드된 화면에 맞춰 디자인 가이드라인을 제공하긴 하지만 생성한 프로젝트의 모든 가이드가 섞여있어 보기에 불편합니다. 해서 업무 단위별로 디자인 가이드를 만들어서 함께 업로드하는 방식으로 하고있습니다.
- 1명의 관리자만 업로드가 가능합니다. (코멘트는 모두 사용 가능)
- 업로드된 화면을 pdf나 png, jpg 등 다른 형태의 파일로 저장을 할 수 없습니다.(혹시 있다면...)

# Result

처음 Zeplin을 사용할 때는 어떻게 export를 해야 하는지, 아이콘셋은 어떻게 전달해야 하는지 어려운 부분도 있었지만 한번 익숙해지면 어려운작업도 없고 게다가 Sketch뿐아니라 Figma, Photoshop과 Xd까지도 Zeplin과 연동이 가능하기 때문에 기존에 사용하고 계신 디자인 툴을 바꾸거나 하지 않고도 사용할 수 있습니다.(꼭 한번 체험이라도 해보시길 추천해드립니다!)