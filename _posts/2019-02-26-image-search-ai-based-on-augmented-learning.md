---
layout: post
title:  "심층학습 기반의 유사 이미지 검색"
author: ["이수련"]
date:   2019-02-26 05:00:01 -0600
abstract: "AIVORY는 너드팩토리에서 개발한 인공지능 추천 검색 솔루션입니다. 이 글에서는 AIVORY에 추가될 유사 이미지 검색 기능을 구현하기까지의 과정에 대해 다루고 있습니다."
tags: ["딥러닝", "CNN", "유사 이미지"]
image: https://cdn-images-1.medium.com/max/1200/1*ByrVJspW-TefwlH7OLxNkg.png
draft: "no"  
---

# Abstract

AIVORY는 너드팩토리에서 개발한 인공지능 추천 검색 솔루션입니다. 이 글에서는 AIVORY에 추가될 유사 이미지 검색 기능을 구현하기까지의 과정에 대해 다루고 있습니다.

## 유사 이미지 검색이 필요한 이유

유사 이미지를 검색할 수 있는 검색엔진들은 이미 많이 있습니다. 하지만 대부분의 경우에는 유사한 이미지를 포괄적으로 검색합니다. 저희는 사용자에게 특화된 유사 이미지를 검색할 수 있는 솔루션이 필요하다고 생각했고, 차기 AIVORY에 유사 이미지 검색 기능을 추가하기로 했습니다.

# 유사 이미지 검색 구현 과정

유사 이미지 검색 개발 환경은 아래와 같습니다.

- 데이터: ShutterStock의 회사 계정 라이센스 내역 중 일부(930여 장)
- 네트워크 모델: ImageNet으로 미리 학습된 ResNet
- 웹 프레임워크: Flask

## 네트워크 모델 정하기

저희는 유사 이미지 검색에 성능이 이미 확인된 네트워크 모델을 사용하고자 했습니다. 그래서 ImageNet이라는 이미지 데이터 셋을 분류하는 대회인 ILSVRC에서 우승한 모델들 중에서 정하기로 했습니다. 후보로 선정된 모델로는 GoogLeNet(2014년 우승 모델), ResNet(2015년 우승 모델), SENet(2017년 우승 모델)이 있었습니다.
위 모델들을 비교할 지표로 삼은 것은 accuracy(정확도)와 inference time이었습니다. 여기서 inference time은 이미지 하나가 입력으로 들어와서 판단되기까지 걸리는 시간을 말합니다. 쉽게 생각하면 이미지 하나를 분류하는 데 걸리는 시간이라 할 수 있습니다. 후보 모델 모두 epoch(횟수)와 learnig rate(학습률)를 동일하게 트레이닝한 결과 아래의 표와 같은 결과를 얻었습니다.

<center>
    <table>
    <tr>
            <th></th><th><center>GoogLeNet</center></th><th><center>ResNet</center></th><th><center>SENet</center></th>
        </tr>
        <tr>
            <th><center>accuracy(%)</center></th><td><center>93.8</center></td><td><center>94.8</center></td><td><center>94.3</center></td>
        </tr>
        <tr>
            <th><center>inference time(sec)</center></th><td><center>0.004</center></td><td><center>0.002</center></td><td><center>0.003</center></td>
        </tr>
    </tr>
    </table>
</center>

위 결과는 실행환경에 따라 차이가 있을 수 있습니다.

저희는 이 중에서 가장 정확도가 높고 inference time이 짧은 ResNet을 선택했습니다.

### ResNet

![ResNet](https://predictiveprogrammer.com/wp-content/uploads/2018/11/resnet.jpg)

저희가 선택한 네트워크 모델인 ResNet의 가장 큰 특징은 위 그림과 같이 곳곳에 지름길이 존재한다는 점입니다. 지름길이 존재하는 곳을 자세히 살펴보면, 

![residual block](https://cdn-images-1.medium.com/max/1200/1*ByrVJspW-TefwlH7OLxNkg.png)
{:.center}

위와 같은 Residual block을 볼 수 있습니다.
Residual block으로 ResNet은 하나의 모델이 수많은 모델들의 평균을 담을 수 있습니다. Residual block이 n 개 있으면 2^n 개 모델들의 평균이 만들어집니다.

## 같은 물체 찾기

ImageNet으로 학습시킨 ResNet이 잘 학습되었는지 확인하기 위해 유사 이미지 검색의 전단계로 같은 물체 찾기를 진행했습니다.

![테스트1](https://drive.google.com/uc?id=1JhHK80DuHIraDWowrRPXQA2niuI9en3R)

가방 사진을 넣으면 가방들이 나오고,

![테스트2](https://drive.google.com/uc?id=1CHbUkinf5GiUfR1o4LY_gYzsYOsNdA85)

핫도그 사진을 넣으면 핫도그들이 나왔습니다.

위 결과를 통해 ResNet이 잘 학습되었음을 알 수 있었습니다.

## Feature 추출하기

하지만 위의 ResNet을 유사 이미지 검색에 그대로 사용할 수는 없었습니다. ImageNet을 학습했기에 결과도 ImageNet에 존재하는 클래스들에 맞춰서 나오기 때문이었습니다. 그래서 저희는 각 이미지들이 ResNet에서 output에 도달하기 전 특정 지점에서 feature를 추출해내기로 했습니다. 여기서 feature는 이미지의 특징을 나타내는 벡터입니다. feature를 추출하는 위치는 벡터 연산량과 유사 이미지 정확도를 고려하여 선정했습니다.

## 벡터 저장 방식의 변화

feature로 추출한 벡터를 저장하기 위해 처음에는 ElasticSearch를 사용했습니다. 데이터로 쓸 이미지를 받아오는 일과 이미지의 feature를 추출하는 일을 병행하고 있었고, 초기에는 feature 추출까지 완료된 이미지 수가 적었습니다. 하지만 이미지 파일 수가 증가하면서 저장해야 하는 벡터가 늘어나자 ElasticSearch가 강제 종료되는 문제점이 발생했습니다. 그 후 안정적으로 벡터를 저장하고 불러오기 위해 파일 입출력 방식으로 저장 방식을 바꾸게 되었습니다.

# 초기 결과 및 문제 해결 과정

처음 시도한 유사 이미지 검색 결과는 아래와 같았습니다.

![셔터1](https://drive.google.com/uc?id=1kqU2voLeGz6dNhIK-_y6AdQ6RswHDj9y)

{:.center}
<center>90장 넣었을 때</center>

![셔터2](https://drive.google.com/uc?id=1YoYEhNfGwN_3ShCpNqIHiWmrT3w1jb2W)

<center>450장 넣었을 때</center>

![셔터3](https://drive.google.com/uc?id=1ez0RymxYU2a5OsxtUKiw1Ay2BeQ4WoWv)

<center>900장 넣었을 때</center>

업로드한 이미지와 유사한 이미지들을 잘 띄워줬지만, 여기에는 치명적인 문제점이 있었습니다.
바로 시간입니다. 아래의 표와 같이 파일 수가 늘어날수록 걸린 시간도 늘어났습니다.

<center>
    <table>
      <tr>
          <th><center>파일 수(개)</center></th><th><center>걸린 시간(sec)</center></th>
      </tr>
      <tr>
          <td><center>90</center></td><td><center>9</center></td>
      </tr>
      <tr>
          <td><center>450</center></td><td><center>200</center></td>
      </tr>
      <tr>
          <td><center>900</center></td><td><center>300</center></td>
      </tr>
    </table>
    
</center>

위 결과는 실행환경에 따라 차이가 있을 수 있습니다.

## 알고리즘

앞서 본 화면을 보여주기까지의 알고리즘은 이러합니다.

1. 데이터 셋의 이미지 파일 전체를 불러와 업로드한 이미지와의 벡터 거리를 각각 비교
2. 벡터 거리가 가까운 순서대로 상위 10%를 유사 이미지 후보로 선정
3. 후보들과 업로드한 이미지의 키워드를 비교
4. 키워드가 일치하는 수가 많은 순대로 5개가 최종적으로 유사 이미지

여기서 시간이 많이 걸리는 부분은, 벡터 거리 비교 부분이었습니다.
업로드한 이미지를 데이터베이스에 있는 모든 이미지와 벡터 거리를 비교하는 것이 걸린 시간의 대부분을 차지했습니다.

## 개선된 알고리즘

어떻게 하면 시간을 줄일 수 있을까 고민하던 중, 벡터 거리가 가깝다면 벡터를 모두 더한 값도 비슷하지 않을까 생각했습니다. 그래서 아래와 같은 알고리즘을 구현했습니다.

1. 각 이미지별로 벡터를 합산한 후 업로드한 이미지의 벡터 총합과 비교
2. 벡터 총합이 유사한 순서대로 상위 10%를 유사 이미지 1차 후보로 선정
3. 1차 후보들과 업로드한 이미지 간의 벡터 거리 비교
4. 벡터 거리가 가까운 순서대로 1차 후보의 2/3을 2차 후보로 선정
5. 2차 후보들과 업로드한 이미지의 키워드를 비교
6. 키워드가 일치하는 수가 많은 순서대로 6개가 최종적으로 유사 이미지

이 알고리즘을 적용한 결과, 이전에 비해 전체 이미지의 10%만 벡터 거리를 비교하여 시간이 대폭 절약되었습니다.

## Result

![before](https://drive.google.com/uc?id=1ez0RymxYU2a5OsxtUKiw1Ay2BeQ4WoWv)\
이랬던 것이

![after](https://drive.google.com/uc?id=1YWoDTcOP92OlWtyfdwHENPJL65Vf1rta)
이렇게 바뀌었습니다.

유사한 이미지 수로만 보면 더 안 좋아졌다고 느낄 수 있습니다. 하지만 여기서 중요한 건 **걸린 시간**이 300초에서 4초로 **대폭 감소**했다는 점입니다. 눈썰미가 좋은 분들은 위 결과 화면에서 걸린 시간을 발견하셨을 거라 생각합니다.

# Conclusion

이 글에서 소개한 유사 이미지 검색 기능은 아직 개발 단계이고, 계속 보완을 해나가는 중입니다. 구체적으로는 위의 결과 화면에서 보셨듯이 시간을 단축하면서 정확도가 다소 낮아졌다는 문제점이 남아있고 이를 해결하기 위한 방안을 지속적으로 찾고 있습니다.