---
layout: post
title: "딥러닝 모델 Trainer 개발을 위한 Tutorial-1 (with Pytorch)"
author: ["조은성"]
date: 2020-10-08
abstract: "인공지능(딥러닝) 모델을 활용해 원하는 문제를 해결하기 위해선, 작성된 모델이 원하는 기능을 수행 할 수 있도록 구성된 학습기의 개발이 필요합니다. 이번 포스팅에선 인공지능 학습기. 특히 지도학습을 위한 학습기가 동작하기 위해 필요한 구성 요소에 대해 알아보고, Pytorch 프레임워크를 활용하여 간단한 코드를 작성해보고자 합니다."
tags: ["DNN", "Pytorch", "Supervised Learning"]
image:
draft: "no"
---

# 개요

인공지능(딥러닝) 모델을 활용해 원하는 문제를 해결하기 위해선, 작성된 모델이 원하는 기능을 수행 할 수 있도록 구성된 학습기의 개발이 필요합니다.

이번 포스팅에선 인공지능 학습기. 특히 지도학습을 위한 학습기가 동작하기 위해 필요한 구성 요소에 대해 알아보고, Pytorch 프레임워크를 활용하여 간단한 코드를 작성해보고자 합니다.

```python
개발 환경 :
python 3.6 이상, pytorch 1.2.0 이상, torchvision 0.4.0 이상을 권장합니다
```

# Model-Trainer 의 필수 구성 요소

지도학습은 입력된 데이터를 기반으로 모델에게 정답을 추론시키고, 그 결과와 실제 정답을 비교해 추출한 loss 를 역전파 하여, 최종적으로 모델이 정답을 추론 할 수 있도록 학습합니다.

이러한 일련의 과정을 위해서 필요한 필수 요소들은 다음과 같습니다.

1. DataSet - 학습 & 평가를 위한 (입력, 정답) 쌍으로 구성된 학습용 데이터 셋
2. Model - 추론을 위한 딥러닝 모델
3. Criterion - loss 연산을 위한 함수
4. Optimizer - 학습을 위한 Optimizer
5. Train Iterator - 학습을 위한 Train Step
6. Evaluation Logic - 모델이 얼마나 잘 학습되었는지 확인하기 위한 평가

( 위의 요소들 중 하나라도 부족하면 지도학습을 진행 할 수 없게 됩니다. )

# Basic-Trainer 개발

학습기의 기본적인 요소들을 포함하여 최소 기능을 하는 학습기를 작성해 봅시다.

먼저 Pytorch 프레임워크와 필요 모듈들을 import 합니다

```python
import os
import torch
import torch.nn as nn
import torchvision
import torchvision.transforms as transforms
```

---

1. Dataset 과 Dataloader 세팅

   ```python
   BASE_DIR = os.path.dirname(os.path.abspath(__file__))

   # MNIST dataset
   train_dataset = torchvision.datasets.MNIST(root=f'{BASE_DIR}/datasets',
                                              train=True,
                                              transform=transforms.ToTensor(),
                                              download=True)
   eval_dataset = torchvision.datasets.MNIST(root=f'{BASE_DIR}/datasets',
                                             train=False,
                                             transform=transforms.ToTensor())

   # Data loader
   train_loader = torch.utils.data.DataLoader(dataset=train_dataset,
                                              batch_size=64,  # 임의 지정 batch
                                              shuffle=True)
   eval_loader = torch.utils.data.DataLoader(dataset=test_dataset,
                                             batch_size=64,   # 임의 지정 batch
                                             shuffle=False)
   ```

   필수 요소 중 1번. 학습 & 평가를 위한 (입력, 정답) 쌍으로 구성된 학습용 데이터 셋을 불러옵니다.

   연습용 데이터로 MNIST 학습 데이터를 불러왔습니다

   (처음 실행시키는 경우, Pytorch 아카이브로부터 데이터셋을 다운받아 코드를 실행하는 경로의 /data 하위에 MNIST 학습 데이터를 저장합니다)

   - dataset

     (입력, 정답) 쌍을 활용해 학습용 데이터를 구축할 수 있도록 해주는 class 입니다. (입력, 정답) 각각의 tensor 형은 모델의 입력과 출력 tensor 모양과 동일해야 합니다.

     MNIST 데이터셋은 28\*28 사이즈의 흑백 이미지므로, 입력 tensor 의 포멧은 (batch, 28, 28) 이 되고, 정답은 10개의 class 중 하나의 인덱스를 갖게 됩니다.

     (입력, 정답) 쌍은 `train_dataset[0]` 과 같이 숫자형 인덱스로 호출 가능합니다.

   - dataloader

     dataset 을 받아서 dataset 내부의 학습 & 평가 데이터를 학습 batch 로 만들어 출력합니다.

     순서를 무작위로 섞는 옵션도 가능하며 (shuffle=True), for loop 의 요소로 `input_batch` & `output_batch` 를 출력합니다

     위 예시의 경우 임의로 64개 batch 를 할당하였으며, 1번의 step 동안 64개 데이터를 한번에 본 뒤 64개의 추론 결과를 동시에 출력하도록 함을 의미합니다.

     batch 에 대한 확인을 해보고 싶다면 아래와 같은 간단한 스크립트로 확인이 가능합니다 (tensor 사이즈의 1차원 요소값이 batch 입니다)

     ```python
     for input_batch, output_batch in train_loader:
         print(input_batch.shape[0], output_batch.shape[0])
     ```

   이렇게 학습을 위한 입력 & 정답 쌍을 준비했습니다

2. Model 의 준비

   ```python
   model = nn.Sequential(
       nn.Linear(784, 1024),  # 28 * 28 = 784
       nn.Linear(1024, 10),
   )
   ```

   28 \* 28 개의 노드로부터 입력을 받고(MNIST format), 1024 차원의 히든 벡터를 갖는 2개 층의 간단한 DNN 모델을 생성하였습니다.

   이 모델은 `(batch, 784)` 모양의 tensor 입력을 받아, `(batch, 10)` 모양의 tensor 를 추론 결과로 출력하도록 구성되어 있습니다.

   (모델은 필요에 따라 VggNet, ResNet, DenseNet 등 다양한 모델을 활용 할 수 있습니다. 입력과 출력 tensor 의 형태에만 주의를 바랍니다)

3. loss 함수의 준비

   ```python
   criterion = nn.CrossEntropyLoss()
   ```

   class 를 분류하는데 많이 사용하는 CrossEntropyLoss 를 loss 함수로 지정하였습니다.

   여러 class 중 가장 높은 값을 갖는 class 가 정답이 되도록 추론 할 수 있습니다.

   CrossEntropyLoss 에 대한 보다 자세한 이해를 원하시면 아래 Pytorch 공식 문서를 참고해주세요.

   [https://pytorch.org/docs/stable/generated/torch.nn.CrossEntropyLoss.html](https://pytorch.org/docs/stable/generated/torch.nn.CrossEntropyLoss.html)

   CrossEntropyLoss 는 추론 결과로 생성된 (batch, classes) 텐서와 (batch) 정답 텐서를 비교해 Loss 를 연산합니다.

   위의 MNIST 데이터를 연산하는 모델의 경우, 모델에서 (batch, classes=10) 의 텐서가 출력되고, 정답은 tensor([0, 2, 1, 6, 4, .... (정답 class 의 index 값이 batch 만큼 존재)]) 형태의 텐서가 됩니다.

   pytorch 는 loss.backward() 명령어를 활용하여 loss 의 역전파를 진행할 수 있습니다.

4. Optimizer

   ```python
   optimizer = torch.optim.SGD(
       model.parameters(),    # 역전파 연산을 할 모델의 파라미터
       lr=0.003               # 임의의 learning_rate
   )
   ```

   위에서 계산한 loss 값을 역전파 한 뒤, 해당 역전파의 gradient 결과를 활용하여 모델을 학습하도록 하는 Optimizer 입니다.

   예시에서는 확률적 경사 하강법이 적용된 SGD(Stochastic Gradient Descent)을 활용하였습니다.

   학습하고자 하는 모델의 파라미터(`model.parameters()`)와 학습률(`learning_rate`) 를 지정해주면, 해당 파라미터를 학습률 만큼 변형하며 모델을 학습합니다

   optimizer.step() 명령어를 활용하여 모델의 파라미터를 학습합니다.

5. Train Iterator

   ```python
   # Model 학습
   epochs = 10  # 전체 데이터를 모두 학습하는 epoch 를 몇번 반복할 것인지. 임의 값
   total_step = len(train_loader)
   model.train()  # 모델의 AutoGradient 연산을 활성화하는 학습 모드로 설정

   # epoch 루프
   for epoch in range(epochs):

       # step 루프
       for i, (inputs, targets) in enumerate(train_loader):
           # MNIST 텐서는 (batch, 28, 28) 의 형태이므로,
           # 테스트 모델에 적합하도록 (batch, 768) 의 형태로 Reshape 합니다
           inputs = inputs.reshape(-1, 28 * 28)  # 28 * 28 = 784

           # 순전파 - 모델의 추론 및 결과의 loss 연산
           outputs = model(inputs)
           loss = criterion(outputs, targets)

           # Backward and optimize
           optimizer.zero_grad()  # optimizer 초기화 (과거 학습 step 의 gradient 영향을 받지 않기 위해 필요)
           loss.backward()  # loss 의 역전파
           optimizer.step()  # 모델의 학습

           # 학습 상태 정보 출력
           print('Epoch [{}/{}], Step [{}/{}], Loss: {:.4f}'
                 .format(epoch + 1, epochs, i + 1, total_step, loss.item()))
   ```

   전체 학습 Dataset 에 대해, Dataloader 로 생성된 iteration 을 돌면서 step 마다 학습을 진행 합니다.

   1 step 마다 batch 사이즈 만큼의 데이터를 학습하며, epoch 횟수 만큼 전체 데이터셋을 반복해서 학습하게 됩니다.

   학습을 위해 `loss` 를 계산하고, `optimizer` 를 초기화 한 뒤, `loss` 를 역전파 하고, 역전파된 정보에 따라 모델의 파라미터를 수정하는 일련의 과정이 코드에 작성되어 있습니다.

6. Evaluation Logic

   ```python
   model.eval()  # 모델의 AutoGradient 연산을 비활성화하고 평가 연산 모드로 설정 (메모리 사용 및 연산 효율화를 위해)
   correct_cnt = 0
   total_cnt = 0
   for (inputs, targets) in eval_loader:
       # 학습 step 과 동일하게 추론 및 결과의 loss 연산을 진행
       inputs = inputs.reshape(-1, 28 * 28)  # 28 * 28 = 784
       outputs = model(inputs)
       loss = criterion(outputs, targets)

       _, predicted = torch.max(outputs.data, 1)  # 가장 큰 값을 갖는 class index 가 모델이 추론한 정답
       total_cnt += targets.size(0)
       correct_cnt += (predicted == targets).sum()  # 정답과 추론 값이 일치하는 경우 정답으로 count

   print('Model Accuracy: {:.2f} %'.format(100 * correct_cnt / total_cnt))
   model.train()  # 평가가 모두 완료되었으므로 다시 학습 모드로 전환
   ```

   일정 step 만큼 학습이 되면, 실제 학습된 모델의 정확도가 어느정도인지 평가가 필요합니다.

   이를 위한 Evaluation Logic 으로, 1번 단계에서 선언한 `eval_dataset` 과 `eval_loader` 를 활용합니다.

   `model.eval()` 은 모델의 AutoGradient 연산을 비활성화하고, DropOut 및 Batch Normalize 같은 학습용 파라미터를 스킾하여, 모델이 평가모드로 동작할 수 있도록 합니다.

---

위의 단계를 토대로 전체 학습기 코드를 작성하면 아래와 같습니다

```python
# Trainer-Tutorial-1 의 MNIST 기초 학습기 입니다

import os
import torch
import torch.nn as nn
import torchvision
import torchvision.transforms as transforms

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# MNIST dataset
train_dataset = torchvision.datasets.MNIST(root=f'{BASE_DIR}/datasets',
                                           train=True,
                                           transform=transforms.ToTensor(),
                                           download=True)
eval_dataset = torchvision.datasets.MNIST(root=f'{BASE_DIR}/datasets',
                                          train=False,
                                          transform=transforms.ToTensor())

# Data loader
train_loader = torch.utils.data.DataLoader(dataset=train_dataset,
                                           batch_size=64,  # 임의 지정 batch
                                           shuffle=True)
eval_loader = torch.utils.data.DataLoader(dataset=eval_dataset,
                                          batch_size=64,  # 임의 지정 batch
                                          shuffle=False)

# model
model = nn.Sequential(
    nn.Linear(784, 1024),  # 28 * 28 = 784
    nn.Linear(1024, 10),
)

# Loss Function & Optimizer
criterion = nn.CrossEntropyLoss()  # loss function
optimizer = torch.optim.SGD(
    model.parameters(),  # 역전파 연산을 할 모델의 파라미터
    lr=0.003  # 임의의 learning_rate
)

# Model 학습
epochs = 10  # 전체 데이터를 모두 학습하는 epoch 를 몇번 반복할 것인지. 임의 값
total_step = len(train_loader)
model.train()  # 모델의 AutoGradient 연산을 활성화하는 학습 모드로 설정

# epoch 루프
for epoch in range(epochs):

    # step 루프
    for i, (inputs, targets) in enumerate(train_loader):
        # MNIST 텐서는 (batch, 28, 28) 의 형태이므로,
        # 테스트 모델에 적합하도록 (batch, 768) 의 형태로 Reshape 합니다
        inputs = inputs.reshape(-1, 28 * 28)  # 28 * 28 = 784

        # 순전파 - 모델의 추론 및 결과의 loss 연산
        outputs = model(inputs)
        loss = criterion(outputs, targets)

        # Backward and optimize
        optimizer.zero_grad()  # optimizer 초기화 (과거 학습 step 의 gradient 영향을 받지 않기 위해 필요)
        loss.backward()  # loss 의 역전파
        optimizer.step()  # 모델의 학습

        # 학습 상태 정보 출력
        print('Epoch [{}/{}], Step [{}/{}], Loss: {:.4f}'
              .format(epoch + 1, epochs, i + 1, total_step, loss.item()))

    # 한 epoch 가 모두 돈 뒤, Model 평가
    model.eval()  # 모델의 AutoGradient 연산을 비활성화하고 평가 연산 모드로 설정 (메모리 사용 및 연산 효율화를 위해)
    correct_cnt = 0
    total_cnt = 0
    for (inputs, targets) in eval_loader:
        # 학습 step 과 동일하게 추론 및 결과의 loss 연산을 진행
        inputs = inputs.reshape(-1, 28 * 28)  # 28 * 28 = 784
        outputs = model(inputs)
        loss = criterion(outputs, targets)

        _, predicted = torch.max(outputs.data, 1)  # 가장 큰 값을 갖는 class index 가 모델이 추론한 정답
        total_cnt += targets.size(0)
        correct_cnt += (predicted == targets).sum()  # 정답과 추론 값이 일치하는 경우 정답으로 count

    print('Model Accuracy: {:.2f} %'.format(100 * correct_cnt / total_cnt))
    model.train()  # 평가가 모두 완료되었으므로 다시 학습 모드로 전환

# Model Checkpoint 저장
torch.save(model.state_dict(), 'mnist_dnn_model.pth')
```

# 결론

이번 포스팅에선 지도학습을 위한 최소한의 학습기 구성 요소를 활용해, 간단한 Basic-Trainer 를 작성하였습니다.

아무리 복잡해보이는 Trainer 라도 지도학습을 위한 학습기는 기본적으로 위와 같은 요소들로 구성되어있기 때문에, 전체 학습기의 구조를 이해하고 코드를 해석하는것이 이에 대한 이해 없이 바로 코드부터 들여다 보는것보다 효율적일 것으로 생각됩니다.

다음 포스팅에선 위의 Basic-Trainer 를 바탕으로 학습 및 평가의 편의성을 향상시킨 학습기를 작성해보도록 하겠습니다.

# Reference

- [https://github.com/yunjey/pytorch-tutorial](https://github.com/yunjey/pytorch-tutorial)
- [https://pytorch.org/docs/stable/generated/torch.nn.CrossEntropyLoss.html](https://pytorch.org/docs/stable/generated/torch.nn.CrossEntropyLoss.html)
