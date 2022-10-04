---
layout: post
title: "추천시스템 평가 지표 - 1 (Precision@K / Recall@K)"
author: ["안정현"]
date: 2021-09-23
abstract: "머신러닝 분야는 모델 구축만큼 성능평가가 중요함. 추천시스템 또한 머신러닝의 비지도학습에 속하기 때문에, 성능평가가 중요. 추천시스템에서는 Precision/Recall@K, MAP, NDCG@K 등 다양한 성능 평가지표가 존재함. 본 포스트에서는 추천 시스템에서 일반적으로 많이 사용되는 Precision@k / Recall@k에 대한 개념과 구현 코드에 대해 설명하고자 함"
tags: ["recommend-system"]
image: /assets/images/posts/2022-09-30-recommend-system-classification-metric/example.png
draft: "no"
---

## 개요

- 머신러닝 분야는 모델 구축만큼 성능평가가 중요함
- 추천시스템 또한 머신러닝의 비지도학습에 속하기 때문에, 성능평가가 중요
- 추천시스템에서는 Precision/Recall@K, MAP, NDCG@K 등 다양한 성능 평가지표가 존재함
- 본 포스트에서는 추천 시스템에서 일반적으로 많이 사용되는 **Precision@k / Recall@k**에 대한 개념과 구현 코드에 대해 설명하고자 함

## **Precision@k / Recall@k 개념**

### **1. Precision@k 정의**

- Precision은 예측값 중 옳게 예측한 비율을 의미

  ![precision](/assets/images/posts/2022-09-30-recommend-system-classification-metric/define-precision.png)

- 추천 시스템에서 Precision은 모델이 추천한 아이템 중에 사용자가 관심있는 아이템의 비율을 의미
- Precision@k는 k개 추천 결과에 대한 Precision을 계산한 것으로, 모델이 추천한 아이템 k개 중에 실제 사용자가 관심있는 아이템의 비율을 의미
- Average of Precision@k는 Precision@k의 평균으로 AP@K와 다름
  - 아래 논문에 따르면, Average of Precision@k는 각 추천에 대한 Precision@k에 대한 평균을 의미하고, AP@K는 서로 다른 k에 대한 Precision의 평균을 의미
    ![paper](/assets/images/posts/2022-09-30-recommend-system-classification-metric/paper-precision.png)

### 2. **Recall@k 정의**

- Recall은 실제 옳은 것 중에서 옳다고 예측한 것의 비율을 의미
  ![recall1](/assets/images/posts/2022-09-30-recommend-system-classification-metric/define-recall.png)

- 추천 시스템에서 Recall은 사용자가 실제로 관심있는 아이템 중에 모델이 추천한 아이템의 비율을 의미
- Recall@k는 k개 추천 결과에 대한 Recall을 계산한 것으로, 사용자가 관심있는 모든 아이템 중에서 모델의 추천한 아이템 k개가 얼마나 포함되는지 비율을 의미
  ![recall2](/assets/images/posts/2022-09-30-recommend-system-classification-metric/define-recall-2.png)

### 3. **Precision@K / Recall@K 예시**

- k=5이고, 사용자가 관심있는 아이템 수가 6개일 때,

  - Precision@5=0.6 (사용자가 관심있는 추천 아이템 수(=3) / 추천한 아이템 수(=5))
  - Recall@5 =0.5 (사용자가 관심있는 추천 아이템 수(=3) / 사용자가 실제로 관심있는 모든 아이템 수(=6))

    ![example](/assets/images/posts/2022-09-30-recommend-system-classification-metric/example.png)

## **Precision@k / Recall@k 구현 코드 예시**

- 성능 지표 정의 코드

  - 위에서 설명한 Precision@k / Recall@k를 다음과 같이 코드로 구현할 수 있음

    1. 모델을 통해 사용자가 어떤 아이템에 관심이 있을지 예측한 데이터인 `predictions`과 예측한 값이 실제로 사용자가 관심있는 아이템인지 확인하기 위한 `targets`, 추천 수 `k`를 파라미터로 받음
    2. 최종적으로 k개만 추천할 것이기 때문에, 예측 데이터 `predictions` 에 대해 k만큼 슬라이싱
    3. Top-k 예측값(`pred`)과 사용자가 실제 관심있는 아이템 리스트(`targets`)의 교집합을 통해 hit 수(`num_hit`)를 구함

       → hit는 k개 추천 아이템 중에 사용자가 실제로 관심 있는 상품이 존재하는 경우를 의미하며, 위 수식에서 TP에 해당함

    4. 구한 `num_hit` , `targets` , `pred`를 활용하여 Precision@k, Recall@k 값을 계산하여 반환

  ```python
  def _compute_precision_recall(targets, predictions, k):
  		"""
  		targets : 테스트 데이터 중, 사용자의 피드백이 있는 item 인덱스 리스트
  		predictions : 학습 데이터에 피드백이 존재하는 item을 제외한 예측 데이터
  		k : 추천 수
      """
      pred = predictions[:k]
      num_hit = len(set(pred).intersection(set(targets)))
      precision = float(num_hit) / len(pred)
      recall = float(num_hit) / len(targets)
      return precision, recall
  ```

- 성능 측정 코드

  - 위에서 정의한 성능 지표를 활용하여 Average of Precision@k / Recall@k 값 측정
    1. 학습 모델 객체 `model`, train / test 데이터셋, 추천 수 k를 파라미터로 받음
    2. 각 사용자 별 성능 측정을 하기 위해 반복문 실행
    3. 학습 모델을 활용하여 해당 사용자에 대한 예측값(`predictions`) 구함
    4. 학습 데이터셋에서 해당 `user_id`의 피드백이 있는 아이템 리스트(`rated`)를 구한 다음, 예측값 중 `rated`에 존재하지 않는(=학습 데이터에 피드백이 없는) 아이템만 예측값으로 할당
    5. 테스트 데이터 중, 사용자의 피드백이 있는 item 인덱스 리스트(`targets`)를 구함
    6. 위에서 정의한 `_compute_precision_recall` 함수를 실행하여 해당 사용자에 대한 Precision@k, Recall@k 값을 구함
    7. c~f번 까지 반복하여 전체 사용자에 대한 Average of Precision@k / Recall@k 값 구함

  ```python
  def evaluate_ranking(model, test, train=None, k=10):
      """
  		model : 학습 모델 객체
  		test : test 데이터셋, csr형식의 피벗테이블 (m*n1)
  		train : train 데이터셋, csr형식의 피벗테이블 (m*n2)
  		k : 추천 수
      """

      test = test.tocsr()

      if train is not None:
          train = train.tocsr()

      # ks : 서로 다른 k의 리스트
      if not isinstance(k, list):
          ks = [k]
      else:
          ks = k

      precisions = [list() for _ in range(len(ks))]
      recalls = [list() for _ in range(len(ks))]

      for user_id, row in enumerate(test):
          '''
          user_id : 고유 사용자 ID (0~m-1)
          row : 각 user에 대한 피드백이 있는 열(상품) 인덱스(튜플)
          '''

          if not len(row.indices):
              continue

          predictions = model.predict(user_id)
          predictions = predictions.argsort()

          # rated : train 피벗테이블에서 해당 user_id의 피드백이 있는 열(상품) 인덱스 리스트
          if train is not None:
              rated = set(train[user_id].indices)
          else:
              rated = []

          # 예측값(추천 상품ID=열 인덱스) 중 구매 이력(rated) 없는 예측값만 필터링
          predictions = [p for p in predictions if p not in rated]

          # test 피벗테이블에서 해당 user_id의 피드백이 있는 열(상품) 인덱스 리스트
          targets = row.indices

          # 여러 개의 k에 대한 테스트를 위해 반복문 실행
          for i, _k in enumerate(ks):
              precision, recall = _compute_precision_recall(targets, predictions, _k)
              precisions[i].append(precision) # precisions : k별 각 사용자의 precision@k 측정 리스트
              recalls[i].append(recall)   # recalls : k별 각 사용자의 recalln@k 측정 리스트

      precisions = [np.mean(np.array(i)) for i in precisions]
      recalls = [np.mean(np.array(i)) for i in recalls]

      return precisions, recalls
  ```

## 참고자료

- [Twitter User Modeling Based on Indirect Explicit Relationships for Personalized Recommendations](https://www.researchgate.net/publication/335439095_Twitter_User_Modeling_Based_on_Indirect_Explicit_Relationships_for_Personalized_Recommendations)
- [[추천시스템] 성능 평가 방법 - Precision, Recall, NDCG, Hit Rate, MAE, RMSE](https://sungkee-book.tistory.com/11)
- [https://github.com/graytowne/caser_pytorch](https://github.com/graytowne/caser_pytorch)
