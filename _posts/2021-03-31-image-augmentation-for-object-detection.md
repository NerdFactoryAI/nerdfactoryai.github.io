---
layout: post
title: "Object-Detection 을 위한 Image Augmentation"
author: ["조은성"]
date: 2020-09-10
abstract: "인공지능의 학습을 위한 데이터가 부족할 때, 우리는 적절한 전처리를 통해 학습 데이터를 증가하곤 합니다. 이러한 과정을 Data Augmentation 이라고 하며, 사진(Image) 데이터의 경우 Augmentation 을 위한 많은 방법들이 알려져 있습니다."
tags: ["Data-Augmentation", "Object-Detection"]
image: /assets/images/posts/2021-03-31-image-augmentation-for-object-detection/image.png
draft: "no"
---

# 개요

인공지능의 학습을 위한 데이터가 부족할 때, 우리는 적절한 전처리를 통해 학습 데이터를 증가하곤 합니다. 이러한 과정을 Data Augmentation 이라고 하며, 사진(Image) 데이터의 경우 Augmentation 을 위한 많은 방법들이 알려져 있습니다.

하지만 객체 인식(Object-Detection)을 위한 Image Augmentation 의 경우, 단순히 알려진 방법으로 이미지 데이터만을 증가시킬 경우, 증가된 이미지에 해당되는 객체 영역(Bounding Box)에 대한 정보를 다시 잡아줘야 하는 문제가 발생합니다. 이는 굉장히 수고스러운 일이기에, 이미지에 포함된 객체 정보 역시 함께 증가를 할 필요가 있습니다.

이번 포스팅에서는 일반적인 Image Augmentation 방법들에 따른 Bounding Box 값의 연산에 대해 알아보고자 합니다.

# Image Augmentation

Bounding Box 를 포함한 Augmentation 을 하려면 이미지 좌표에 대해 먼저 정의를 할 필요가 있습니다. 객체인식 학습 데이터를 위한 이미지 라벨링 툴 LabelImg 의 픽셀 좌표 연산 방식을 따라 좌표계를 정의하도록 하겠습니다.

이미지의 경우 좌상단의 꼭지점을 원점(0, 0)으로 보고 오른쪽 가로 축으로 `+x`, 아래쪽 세로 축으로 `+y` 를 잡습니다. 따라서 가로×세로 = 400×300 픽셀인 이미지라면, 이미지의 좌상단이 `(0,0)`, 우상단은 `(400,0)`, 좌하단 `(0,300)`, 우하단 `(400,300)` 으로 좌표가 세팅 됩니다.

Bounding Box 의 좌표 역시 위와 같은 좌표 표기법을 사용하며 Box 의 좌상단과 우하단 좌표를 기록해 Box 의 위치를 특정합니다.

(y_min, x_min) = (a, b), (y_max, x_max) = (c, d)

![image](/assets/images/posts/2021-03-31-image-augmentation-for-object-detection/image.png)

이러한 좌표 연산을 통해 Image 와 Bounding Box 를 함께 증가해 보겠습니다.

(이미지의 밝기, 대비, 색 필터를 변환하는 방식은 Box의 좌표가 변하지 않아 기존의 Augmentation 만을 활용해도 무방하므로 이번 포스팅에서는 다루지 않겠습니다 )

## 1. Resize

가장 일반적인 Augmentation 방법으로 이미지의 크기를 변환하는 방식입니다. 이미지 사이즈의 증감 비율을 R 이라고 했을 때,

```python
resize_height = original_height * R
resize_width = original_width * R
```

로 계산 가능하고, Bounding Box 역시

```python
resize_x_min = original_x_min * R
resize_y_min = original_y_min * R
resize_x_max = original_x_max * R
resize_y_max = original_y_max * R
```

로 계산 가능합니다.

## 2. 좌우반전

반전의 경우, 이미지의 크기는 변화하지 않기 때문에 이미지의 height & width 는 동일하게 유지 됩니다.

Bounding Box 의 좌표는

```python
# 상하 좌표에는 영향을 주지 않으므로 y_min, y_max 는 동일
fliped_x_min = width - original_x_min
fliped_x_max = width - original_x_max
```

가 됩니다. (상하 반전은 x가 고정되고, y 좌표에 대해 `fliped_y = height - original_y`)

## 3. 이미지 회전

Object-Detection 용 이미지 증가에 가장 복잡한 계산을 필요로 하는 Augmentation 방법입니다. 이 포스팅을 작성하기로 생각한 핵심 이유이기도 합니다.

이미지를 회전하는경우, 레터박스 같은 영역이 생기며 이미지 전체 사이즈가 커지게 됩니다. 이에 의해 전체 좌표 역시 바뀌게 됩니다.

{:.center}
![re_wgle1](/assets/images/posts/2021-03-31-image-augmentation-for-object-detection/re_wgle1.png)  
_회전된 모서리마다 빈 영역이 생김_

원본 이미지 크기 = _(w, h)_ 에서,

이러한 좌표 변환에 대응하기 위해 이미지의 중앙(기존 ($\frac{w}{2}$, $\frac{h}{2}$) 지점)을 원점 (0, 0)으로 하고 좌표를 다시 쓰면,

→ 좌상단($-\frac{w}{2}$, $\frac{h}{2}$), 우상단($\frac{w}{2}$, $\frac{h}{2}$), 좌하단($-\frac{w}{2}$, $-\frac{h}{2}$), 우하단($\frac{w}{2}$, $-\frac{h}{2}$)

또한 Bounding Box의 각 모서리 좌표를 _P1_ ~ _P4_ 로 아래 그림과 같이 할당하면, 이미지 중앙을 기준으로 좌표를 다시 쓸 수 있습니다.

{:.center}
![image2](/assets/images/posts/2021-03-31-image-augmentation-for-object-detection/image2.png)

_P1_ = ($b-\frac{w}{2}$, $\frac{h}{2}-a$)

_P2_ = ($b-\frac{w}{2}$, $\frac{h}{2}-c$)

_P3_ = ($d-\frac{w}{2}$, $\frac{h}{2}-a$)

_P4_ = ($d-\frac{w}{2}$, $\frac{h}{2}-c$)

이제 회전된 이미지에 대한 좌표를 계산해보도록 하겠습니다. (너무 큰 각도의 회전은 학습에 방해가 되므로 ±5 도 이내의 각도로만 회전하는것을 상정합니다)

2차원 좌표 평면에서 점 *(X , Y)*를 원점(0, 0)을 중심으로 _θ_ 만큼 회전 하였을 때, 변경된 좌표는

_(Xcosθ - Ysinθ , Xsinθ + Ycosθ)_ 로 표기됩니다.

따라서, 회전된 이미지의 크기 _(rw, rh)_ = _(w×cosθ - h×sinθ , w×sinθ + h×cosθ)_ 이고,

마찬가지로 회전된 Bounding Box 의 좌표 _P1' , P2' , P3' , P4'_ 역시 구할 수 있습니다.

이제 변환된 Box의 좌표로부터 다시 이미지의 좌상단을 원점으로 하는 박스의 x_min, y_min, x_max, y_max 를 구할 차례입니다. 이때, 회전한 각도의 ± 부호에 따라 min, max 값을 추출하는 좌표가 달라집니다.

{:.center}
![image3](/assets/images/posts/2021-03-31-image-augmentation-for-object-detection/image3.png)  
_반시계 방향의 경우 (-) 각도, 시계 방향의 경우 (+) 각도로 회전_

이러한 일련의 과정을 Python 코드로 나타내면 다음과 같습니다.

```python
import random
import numpy as np

def rotate_xyminmax(width, height, xmin, ymin, xmax, ymax):
    # (width/2, height/2)를 중심으로 degree 회전
    # ±5도 이내의 각도에서 랜덤하게 degree 지정
    degree = (random.random() - 0.5) * 10
    radian = degree / 180 * np.pi  # radian 으로 변환

    # 회전하여 확장된 이미지 영역 re_width, re_height
    # 픽셀 좌표는 정수형만 가능하므로 int로 자료형을 변환
    re_width = int(width * np.cos(radian) - height * np.sin(radian))
    re_height = int(height * np.cos(radian) + width * np.sin(radian))

    # Bounding Box 좌상단을 첫번째 점으로 두고, 반시계방향으로 Box Point 4개를 지정
    point = [(xmin - width / 2, height / 2 - ymin),  # P1
             (xmin - width / 2, height / 2 - ymax),  # P2
             (xmax - width / 2, height / 2 - ymax),  # P3
             (xmax - width / 2, height / 2 - ymin)]  # P4

    # 회전된 Box 의 좌표(P1', P2', P3', P4') 연산
    rotation_point = []
    for p in point:
        x, y = p
        rx = x * np.cos(radian) - y * np.sin(radian)
        ry = y * np.cos(radian) + x * np.sin(radian)
        rotation_point.append((rx, ry))

    # 좌표 변환 후, Image Range를 벗어나지 않도록 if 문으로 예외처리
    if degree >= 0:  # 시계방향 회전
        # Image Range를 벗어나지 않도록 if 문으로 예외처리
        re_xmin = int(rotation_point[0][0] + re_width / 2)  # P1'의 x좌표
        if re_xmin <= 0:
            re_xmin = 0
        re_ymin = int(re_height / 2 - rotation_point[3][1])  # P4'의 y좌표
        if re_ymin <= 0:
            re_ymin = 0
        re_xmax = int(rotation_point[2][0] + re_width / 2)  # P3'의 x좌표
        if re_xmax >= re_width:
            re_xmax = re_width
        re_ymax = int(re_height / 2 - rotation_point[1][1])  # P2'의 y좌표
        if re_ymax >= re_height:
            re_ymax = re_height

    else:  # 반시계방향 회전
        # Image Range를 벗어나지 않도록 if 문으로 예외처리
        re_xmin = int(rotation_point[1][0] + re_width / 2)  # P2'의 x좌표
        if re_xmin <= 0:
            re_xmin = 0
        re_ymin = int(re_height / 2 - rotation_point[0][1])  # P1'의 y좌표
        if re_ymin <= 0:
            re_ymin = 0
        re_xmax = int(rotation_point[3][0] + re_width / 2)  # P4'의 x좌표
        if re_xmax >= re_width:
            re_xmax = re_width
        re_ymax = int(re_height / 2 - rotation_point[2][1])  # P3'의 y좌표
        if re_ymax >= re_height:
            re_ymax = re_height

    return degree, re_xmin, re_ymin, re_xmax, re_ymax
```

# 마무리

지금까지 Object-Detection 을 위한 Image Augmentation 방법에 대해 알아보았습니다. 포스팅의 주요 전달 내용이 Bounding Box 정보를 포함한 Data Augmentation 이라서 이미지의 밝기, 대비, 색 필터를 변환하는 방식의 Augmentation 은 다루지 않았지만, 해당 방법들과 위의 방법들을 조합해 다양한 방식의 Data Augmentation 을 시도 해 볼 수 있습니다. 적절한 데이터 증가 방법을 활용하여 적은 데이터로도 인공지능 학습 정확도를 향상 시키는데 도움이 되길 기대합니다.
