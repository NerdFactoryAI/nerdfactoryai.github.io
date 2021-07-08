---
layout: post
title: "딥러닝 모델 Trainer 개발을 위한 Tutorial-2 (with Pytorch)"
author: ["조은성"]
date: 2020-11-04
abstract: "인공지능(딥러닝) 모델을 활용해 원하는 문제를 해결하기 위해선, 작성된 모델이 원하는 기능을 수행 할 수 있도록 구성된 학습기의 개발이 필요합니다. 지난 튜토리얼에 이어 이번 포스팅에선 Basic-Trainer 를 토대로 학습 및 평가의 편의성을 향상시킨, Image-Classification-Trainer 를 만들어보려고 합니다. 수집된 이미지 데이터로부터 이미지 분류를 파악하고, 분류에 적합한 모델을 생성하여 학습까지 이루어지도록 구성 할 예정입니다."
tags: ["DNN", "Pytorch", "Supervised Learning"]
image:
draft: "no"
---

# 개요

인공지능(딥러닝) 모델을 활용해 원하는 문제를 해결하기 위해선, 작성된 모델이 원하는 기능을 수행 할 수 있도록 구성된 학습기의 개발이 필요합니다.

지난 튜토리얼에 이어 이번 포스팅에선 Basic-Trainer 를 토대로 학습 및 평가의 편의성을 향상시킨, Image-Classification-Trainer 를 만들어보려고 합니다.

수집된 이미지 데이터로부터 이미지 분류를 파악하고, 분류에 적합한 모델을 생성하여 학습까지 이루어지도록 구성 할 예정입니다.

지난 포스팅을 아직 보지 않으셨다면 아래 링크에서 보실 수 있습니다.

( [지난 포스팅 링크](https://blog.nerdfactory.ai/2020/10/08/Tutorial-1-for-Deep-Learning-Model-Trainer-Development.html) )

```python
개발 환경 :
python 3.6 이상, pytorch 1.2.0 이상, torchvision 0.4.0 이상을 권장합니다
```

# Image-Classification

지난 포스팅에서 언급한, 학습기의 필수 구성 요소를 하나씩 되 짚으며 고도화 해 보겠습니다.

## 1. DataSet & DataLoader

이전 포스팅에서는 연습용으로 MNIST 데이터 셋을 불러왔지만, 이번에는 내가 학습하려고 하는 이미지들로 구성된 커스텀 데이터셋을 만들어 보려고 합니다.

먼저 `dataset.py` 라는 이름의 파일을 생성하고, 동일한 stage 에 `/datasets` 폴더를 만듭니다.

그리고 그 하위에 `/train` , `/evaluation` 폴더를 만든 뒤, 내부에 각 **class** 별로 이름을 가진 이미지 폴더들을 구성합니다.

예시로 개(dog), 고양이(cat), 새(bird) 이미지를 구분하고자 한다면 프로젝트 폴더 내부는 아래와 같을 것입니다.

```
PROJECT-BASE-DIRECTORY
    ├── /datasets
    │   ├── /train       # train_dataset
    │   │   ├── /bird
    │   │   ├── /cat
    │   │   └── /dog
    │   │
    │   └── /evaluation  # eval_dataset
    │       ├── /bird
    │       ├── /cat
    │       └── /dog
    │
    └── dataset.py
```

이제 `dataset.py` 내부에 내용을 작성 할 차례입니다.

`/datasets` 폴더 하위의 내용을 수집해 자동으로 클래스에 따른 index 를 생성하고, 학습용 이미지 데이터셋을 구성하도록 합니다.

```python
# dataset.py

# 필요한 패키지 import
import json

from torchvision import transforms
from torchvision import datasets
from torch.utils.data import DataLoader

def image_folder_dataset(train_img_dir, eval_img_dir, batch_size=16):
    """
    Make Train & Evaluation Image-Dataset from Image-Folder
    :param train_img_dir: Train Image data directory (str)
    :param eval_img_dir: Evaluation Image data directory (str)
    :return: dict{
                      train_dataloader (torch.utils.data.DataLoader),
                      eval_dataloader (torch.utils.data.DataLoader),
                      class_index (dict)
                  }
    """

    # 이미지 전처리
    preprocess = transforms.Compose([
        transforms.Resize(256),                             # 이미지의 크기를 256 으로 Resize
        transforms.CenterCrop(224),                         # 256 사이즈의 이미지 중앙에 정사각형 영역 (224 * 224 사이즈) 을 Crop
        transforms.ToTensor(),                              # RGB 3 채널에 대해 픽셀별로 0~1 사이의 값을 갖는 Float 형 Tensor 로 변환
        transforms.Normalize(mean=[0.485, 0.456, 0.406],    # 입력된 mean, std 로 정규화 → 연산 효율을 올리기 위함 입니다. 정규화를 거치지 않아도 학습 가능
                             std=[0.229, 0.224, 0.225])     # 작성된 mean, std 는 ImageNet 으로부터 추출된 일반적인 이미지의 평균/표준편차 값
    ])
    # 하나의 이미지는 주어진 mean, std 값으로 정규화 된 (3, 224, 224) 사이즈의 Float 텐서로 변환
    # Tensor 차원 해석 : (RGB-Channel, Image-Height, Image-Width)

    # 이미지 폴더로부터 데이터 생성
    train_dataset = datasets.ImageFolder(root=train_img_dir,
                                         transform=preprocess)
    eval_dataset = datasets.ImageFolder(root=eval_img_dir,
                                        transform=preprocess)

    # train_dataset.classes 로 생성된 이미지 dataset 의 class 를 확인 가능
    # class 와 index 매칭을 위해 dict 형식으로 작성 및 json 파일로 저장
    class_index = {i: string for i, string in enumerate(train_dataset.classes)}
    with open("datasets/class_index.json", "w") as i:
        json.dump(class_index, i)
    with open("datasets/class_index.json", "r") as i:    # 저장 확인
        class_index = json.load(i)

    if not train_dataset.classes == eval_dataset.classes:    # 두 dataset 의 class 가 다른지 확인
        print("train & validation classes are not same")
        print(f"train.classes = {train_dataset.classes}")
        print(f"evaluation.classes = {eval_dataset.classes}")
        return None

    # DataLoader 생성
    train_dataloader = DataLoader(dataset=train_dataset,
                                  batch_size=batch_size,    # 임의의 batch_size
                                  shuffle=True)             # 학습 데이터를 랜덤하게 호출
    eval_dataloader = DataLoader(dataset=eval_dataset,
                                 batch_size=batch_size,    # 임의의 batch_size
                                 shuffle=False)            # 평가시엔 랜덤하게 데이터를 호출할 필요가 없으므로 False

    image_dataset = {
        "train_dataloader": train_dataloader,
        "eval_dataloader": eval_dataloader,
        "class_index": class_index
    }
    return image_dataset

if __name__ == "__main__":
    train_img_dir = "datasets/train"
    eval_img_dir = "datasets/evaluation"

    image_dataset = image_folder_dataset(train_img_dir, eval_img_dir)

    # 생성된 dataset 확인
    for batch in image_dataset['train_dataloader']:
        input, target = batch
        print(f"input batch shape = {input.shape}")
        print(f"target batch = {target}")
        break    # 1 iter 만 확인하도록 break
    # >>> input batch shape = torch.Size([16, 3, 224, 224])
    # >>> target batch = tensor([0, 1, 1, 0, 1, 1, 2, 0, 0, 2, 2, 0, 1, 0, 1, 2])
    # dataloader 에서 배치 사이즈를 지정한 뒤, iterator 로 호출하면 input: torch.Size([batch, 3, 224, 224]), target: torch.Size([batch]) 로 batch tensor 출력

    print(f"class_index : {image_dataset['class_index']}")
    # >>> class_index : {'0': 'bird', '1': 'cat', '2': 'dog'}
```

`if __name__ == "__main__"` 이하에 작성되어 있는 내용을 참고해, 이후 작성할 trainer 파일에서 완성된 `dataloader` 를 호출 할 수 있습니다.

## 2. Model 구성

이번 포스팅에선 Convolution 레이어를 활용한 딥러닝 모델을 활용해 보도록 하겠습니다.

VGGNet 모델 구조를 활용하기 위해 vgg_model.py 파일에 모델을 작성해 줍니다.

VGGNet 에 대한 자세한 내용은 논문을 참고 부탁드립니다. ( [https://arxiv.org/abs/1409.1556v6](https://arxiv.org/abs/1409.1556v6) )

```python
# vgg_model.py

# 작성된 모델은 VGG11 의 구조를 뼈대로 classifier layer 와 default class 를 줄인 소형 모델입니다.
# 필요한 패키지 import
import torch
import torch.nn as nn

class VGG(nn.Module):
    def __init__(self, config, num_classes=10, init_weights=True):
        super(VGG, self).__init__()
        self.features = self._make_layers(config)    # VGG 모델의 구조 정보(cfg) 로부터, Feature 추출기 작성
        self.avgpool = nn.AdaptiveAvgPool2d((7, 7))
        self.classifier = nn.Sequential(             # 이미지에서 추출된 특징(Feature)으로부터 class 를 추측하는 분류기 작성
            nn.Linear(512 * 7 * 7, 1024),
            nn.ReLU(inplace=True),
            nn.Dropout(p=0.3),
            nn.Linear(1024, num_classes),
        )
        if init_weights:                             # 가중치 초기화 로직
            self._initialize_weights()

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        x = self.features(x)
        x = self.avgpool(x)
        x = torch.flatten(x, 1)
        x = self.classifier(x)
        return x

    def _make_layers(self, cfg):
        layers = []
        in_channels = 3
        for v in cfg:
            if v == 'M':
                layers += [nn.MaxPool2d(kernel_size=2, stride=2)]
            else:
                conv2d = nn.Conv2d(in_channels, v, kernel_size=3, padding=1)
                layers += [conv2d, nn.ReLU(inplace=True)]
                in_channels = v
        return nn.Sequential(*layers)

    def _initialize_weights(self):
        for m in self.modules():
            if isinstance(m, nn.Conv2d):
                nn.init.kaiming_normal_(m.weight, mode='fan_out', nonlinearity='relu')
                if m.bias is not None:
                    nn.init.constant_(m.bias, 0)
            elif isinstance(m, nn.BatchNorm2d):
                nn.init.constant_(m.weight, 1)
                nn.init.constant_(m.bias, 0)
            elif isinstance(m, nn.Linear):
                nn.init.normal_(m.weight, 0, 0.01)
                nn.init.constant_(m.bias, 0)

if __name__ == "__main__":
    vgg11_cfg = [64, 'M', 128, 'M', 256, 256, 'M', 512, 512, 'M', 512, 512, 'M']    # VGG 모델의 구조 정보
    model = VGG(vgg11_cfg, num_classes=10, init_weights=True)    # model 빌드

    # 테스트 데이터 입력 후 출력 확인
    test_input = torch.randn(1, 3, 224, 224)
    out = model(test_input)
    print(f"{out.shape} \n {out}")

    print("Model is Ready")
```

VGG 모델의 구조 정보로부터 CNN 기반의 모델을 빌드하고, 테스트 텐서를 넣어서 출력이 나오는 것 까지 확인을 해보는 코드 입니다.

마찬가지로 `if __name__ == "__main__"` 이하에 작성되어 있는 내용을 참고해, 이후 작성할 trainer 파일에서 완성된 `model` 을 호출 할 수 있습니다.

## 3. Criterion (loss_function)

```python
criterion = nn.CrossEntropyLoss()
```

`Loss_Function` 의 경우, 지난번과 동일하게 class 분류에 많이 사용하는 `CrossEntropyLoss` 를 지정하였습니다.

CrossEntropyLoss 에 대한 보다 자세한 이해를 원하시면 아래 Pytorch 공식 문서를 참고해주세요.

[https://pytorch.org/docs/stable/generated/torch.nn.CrossEntropyLoss.html](https://pytorch.org/docs/stable/generated/torch.nn.CrossEntropyLoss.html)

## 4. Optimizer 의 구성 (with Scheduler)

```python
optimizer = torch.optim.Adam(
    model.parameters(),    # 역전파 연산을 할 모델의 파라미터
    lr=0.003               # 임의의 learning_rate
)
# 주어진 step 이 지날때마다 학습률(Learning Rate)을 선형으로 변환해주는 스케줄러
scheduler = lr_scheduler.StepLR(
    optimizer,             # 학습률을 조절할 optimizer
    step_size=100          # 학습률을 변환할 주기 (step)
    gamma=0.9              # 변환할 학습률 (상대값)
)
```

역전파 된 loss 의 gradient 결과를 활용하여 모델을 학습하도록 하는 Optimizer 입니다.

이번에는 Adam(Adaptive Moment Estimation) Optimizer 를 적용해보도록 하겠습니다.

지난번과 마찬가지로, 학습하고자 하는 모델의 파라미터(`model.parameters()`)와 학습률(`learning_rate`) 를 지정해주면, 해당 파라미터를 학습률 만큼 변형하며 모델을 학습합니다

optimizer.step() 명령어를 활용하여 모델의 파라미터를 수정합니다.

거기에 더해 이번에는 step 에 따라 학습률(Learning Rate)을 선형으로 변환해주는 스케줄러를 함께 활용해보도록 하겠습니다.

초기에 너무 작은 값의 학습률을 지정하면, 모델이 수렴하기까지 긴 시간이 걸리게 되지만, 충분한 학습이 이루어진 이후에 적절히 학습률을 감소 시키면 학습에 필요한 시간도 단축하면서, 작은 보폭으로 보다 정확하게 수렴하는 파라미터를 찾을 수 있게 됩니다.

여기서는 간단한 적용을 위해, 주어진 step 이 지나면 주어진 값만큼 학습률을 변환하는 선형 스케줄러를 구성하였습니다.

( 필요에 따라 다양한 형태의 스케줄러 사용이 가능하고, 커스텀 할 수도 있습니다 )

## 5. Train Iterator

Train Iterator 부분은 기존과 큰 차이가 없습니다.

앞서 구성해 놓은 dataloader 와 model, optimizer, scheduler 들을 한데 모아 train step 을 진행하면 됩니다.

다만 이번에는 추가로 GPU 가속을 활용할 수 있도록 Device 세팅을 포함하고, 학습의 상태를 확인할 수 있도록 tqdm 을 활용해 학습 상태를 시각화하는 코드를 작성 해보겠습니다.

trainer.py 파일에 내용을 작성될 내용을 간단히 요약하면 아래와 같습니다.

( Loss Function & Optimizer & Scheduler 등의 요소가 작성되어있지 않아서 실제 바로 동작하진 않습니다. Train 에 직접적인 영향을 주는 구성 요소들만 추려놓은 것으로 이해바랍니다 )

```python
# 필요한 패키지 import
import os
from tqdm import tqdm, trange
import torch
from torch import nn

# CUDA 를 활용한 GPU 가속 여부에 따라, 장치를 할당 할 수 있도록 변수로 선언
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# Prepare Custom Model
model = VGG(parameters['vgg11_cfg'], num_classes=len(class_index), init_weights=True)  # model 빌드
model.to(device)     # 모델의 장치를 device 에 할당
model.zero_grad()    # 모델 gradient 초기화
model.train()        # Train 모드로 모델 설정

# Train Start
train_iterator = trange(int(parameters['epoch']), desc="Epoch")  # 학습 상태 출력을 위한 tqdm.trange 초기 세팅
global_step = 0

# Epoch 루프
for epoch in train_iterator:
    epoch_iterator = tqdm(
        train_dataloader, desc='epoch: X/X, global: XXX/XXX, tr_loss: XXX'  # Description 양식 지정
    )
    epoch = epoch + 1

    # Step(batch) 루프
    for step, batch in enumerate(epoch_iterator):
        # 모델이 할당된 device 와 동일한 device 에 연산용 텐서 역시 할당 되어 있어야 함
        image_tensor, tags = map(lambda elm: elm.to(device), batch)  # device 에 연산용 텐서 할당
        out = model(image_tensor)      # Calculate
        loss = criterion(out, tags)    # loss 연산

        # Backward and optimize
        loss.backward()
        optimizer.step()
        optimizer.zero_grad()
        scheduler.step()  # Update learning rate schedule
        global_step += 1
        # One train step Done

        # Step Description
        epoch_iterator.set_description(
            'epoch: {}/{}, global: {}/{}, tr_loss: {:.3f}'.format(
                epoch, parameters['epoch'],
                global_step, train_steps * parameters['epoch'],
                loss.item()
            )
        )
```

전체 학습 Dataset 에 대해, Dataloader 로 생성된 iteration 을 돌면서 step 마다 학습을 진행 합니다.

기존과 동일하게 1 step 마다 `loss` 를 계산하고, `optimizer` 를 초기화 한 뒤, `loss` 를 역전파 하고, 역전파된 정보에 따라 모델의 파라미터를 수정하는 일련의 과정이 코드에 작성되어 있습니다.

## 6. Evaluation Logic

기존에 구성된 학습기과 마찬가지로 학습된 모델의 정확도 평가를 위한 로직 입니다.

```python
# Evaluation
model.eval()    # 모델의 AutoGradient 연산을 비활성화하고 평가 연산 모드로 설정 (메모리 사용 및 연산 효율화를 위해)
sum_eval_acc, sum_eval_loss = 0, 0
eval_result = {"mean_loss": 0, "mean_acc": 0}

eval_iterator = tqdm(    # Description 양식 지정
    eval_dataloader, desc='Evaluating - mean_loss: XXX, mean_acc: XXX'
)

# Evaluate
for e_step, e_batch in enumerate(eval_iterator):
    image_tensor, tags = map(lambda elm: elm.to(device), e_batch)  # device 에 연산용 텐서 할당
    out = model(image_tensor)  # Calculate
    loss = criterion(out, tags)

    # Calculate acc & loss
    sum_eval_acc += (out.max(dim=1)[1] == tags).float().mean().item()    # 정답과 추론 값이 일치하는 경우 정답으로 count
    sum_eval_loss += loss.item()

    # 평가 결과 업데이트
    eval_result.update({"mean_loss": sum_eval_acc / (e_step + 1),
                        "mean_acc": sum_eval_loss / (e_step + 1)})

    # Step Description
    eval_iterator.set_description(
        'Evaluating - mean_loss: {:.3f}, mean_acc: {:.3f}'.format(
            eval_result['mean_loss'], eval_result['mean_acc'])
    )
model.train()  # 평가 과정이 모두 종료 된 뒤, 다시 모델을 train 모드로 변경
```

Evaluation 로직은 함수로 분리하여, 각 Epoch 이 종료되는 시점마다 평가를 진행할 수 있도록 구성할 수 있습니다

# 전체 학습기 구성

지금까지의 단계를 토대로 trainer.py 파일을 완성하면 다음과 같습니다

```python
# trainer.py

# 필요한 패키지 import
import os
from tqdm import tqdm, trange

import torch
from torch import nn
from torch.optim import Adam, lr_scheduler

from dataset import image_folder_dataset
from vgg_model import VGG

# CUDA 를 활용한 GPU 가속 여부에 따라, 장치를 할당 할 수 있도록 변수로 선언
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

def train(parameters):
    # Prepare Image DataSets
    train_image_dir = parameters['datasets'][0]
    eval_img_dir = parameters['datasets'][1]
    image_dataset = image_folder_dataset(train_image_dir, eval_img_dir,
                                         batch_size=parameters['batch_size'])

    # Train & Eval Dataloader
    train_dataloader = image_dataset['train_dataloader']
    eval_dataloader = image_dataset['eval_dataloader']
    class_index = image_dataset['class_index']
    train_steps = len(train_dataloader)
    eval_steps = len(eval_dataloader)

    # Prepare Custom Model
    model = VGG(parameters['vgg11_cfg'], num_classes=len(class_index), init_weights=True)  # model 빌드
    model.to(device)   # 모델의 장치를 device 에 할당
    model.zero_grad()  # 모델 gradient 초기화
    model.train()      # Train 모드로 모델 설정

    # Loss Function
    criterion = nn.CrossEntropyLoss()  # loss function

    # Optimizer & LR_Scheduler setting
    optimizer = Adam(model.parameters(),  # Adam 옵티마이저 세팅
                     lr=parameters['learning_rate'])
    scheduler = lr_scheduler.StepLR(optimizer,  # 선형 스케줄러 세팅 - 학습률 조정용 스케줄러
                                    parameters['scheduler_step'],
                                    parameters['scheduler_gamma'])

    # Train Start
    train_iterator = trange(int(parameters['epoch']), desc="Epoch")  # 학습 상태 출력을 위한 tqdm.trange 초기 세팅
    global_step = 0

    # Epoch 루프
    for epoch in train_iterator:
        epoch_iterator = tqdm(
            train_dataloader, desc='epoch: X/X, global: XXX/XXX, tr_loss: XXX'  # Description 양식 지정
        )
        epoch = epoch + 1

        # Step(batch) 루프
        for step, batch in enumerate(epoch_iterator):
            # 모델이 할당된 device 와 동일한 device 에 연산용 텐서 역시 할당 되어 있어야 함
            image_tensor, tags = map(lambda elm: elm.to(device), batch)  # device 에 연산용 텐서 할당
            out = model(image_tensor)      # Calculate
            loss = criterion(out, tags)    # loss 연산

            # Backward and optimize
            loss.backward()
            optimizer.step()
            optimizer.zero_grad()
            scheduler.step()  # Update learning rate schedule
            global_step += 1
            # One train step Done

            # Step Description
            epoch_iterator.set_description(
                'epoch: {}/{}, global: {}/{}, tr_loss: {:.3f}'.format(
                    epoch, parameters['epoch'],
                    global_step, train_steps * parameters['epoch'],
                    loss.item()
                )
            )

        # -- Evaluate & Save model result -- #
        # 한 Epoch 종료 시 평가, 평가 결과 정보를 포함한 이름으로 학습된 모델을 지정된 경로에 저장
        eval_result = evaluate(model, criterion, eval_dataloader)
        # Set Save Path
        os.makedirs(parameters['train_output'], exist_ok=True)
        save_path = parameters['train_output'] + \
                    f"/epoch-{epoch}-acc-{eval_result['mean_acc']}-loss-{eval_result['mean_loss']}"
        # Save
        torch.save(model.state_dict(), save_path + "-model.pth")

def evaluate(model, criterion, eval_dataloader):
    # Evaluation
    model.eval()  # 모델의 AutoGradient 연산을 비활성화하고 평가 연산 모드로 설정 (메모리 사용 및 연산 효율화를 위해)
    sum_eval_acc, sum_eval_loss = 0, 0
    eval_result = {"mean_loss": 0, "mean_acc": 0}

    eval_iterator = tqdm(  # Description 양식 지정
        eval_dataloader, desc='Evaluating - mean_loss: XXX, mean_acc: XXX'
    )

    # Evaluate
    for e_step, e_batch in enumerate(eval_iterator):
        image_tensor, tags = map(lambda elm: elm.to(device), e_batch)  # device 에 연산용 텐서 할당
        out = model(image_tensor)  # Calculate
        loss = criterion(out, tags)

        # Calculate acc & loss
        sum_eval_acc += (out.max(dim=1)[1] == tags).float().mean().item()  # 정답과 추론 값이 일치하는 경우 정답으로 count
        sum_eval_loss += loss.item()

        # 평가 결과 업데이트
        eval_result.update({"mean_loss": sum_eval_acc / (e_step + 1),
                            "mean_acc": sum_eval_loss / (e_step + 1)})

        # Step Description
        eval_iterator.set_description(
            'Evaluating - mean_loss: {:.3f}, mean_acc: {:.3f}'.format(
                eval_result['mean_loss'], eval_result['mean_acc'])
        )
    model.train()  # 평가 과정이 모두 종료 된 뒤, 다시 모델을 train 모드로 변경

    return eval_result

if __name__ == "__main__":
    # Train Parameter
    parameters = {
        "datasets": ["datasets/train", "datasets/evaluation"],                            # 학습용 데이터 경로
        "vgg11_cfg": [64, 'M', 128, 'M', 256, 256, 'M', 512, 512, 'M', 512, 512, 'M'],    # VGG 모델의 구조 정보
        "class_info_file": "datasets/class_index.json",                                   # 학습용 데이터의 class_info_file
        "epoch": 10,                # 전체 학습 Epoch
        "batch_size": 16,           # Batch Size
        "learning_rate": 0.003,     # 학습률
        "scheduler_step": 100,      # 어느정도 step 주기로 학습률을 감소할지 지정
        "scheduler_gamma": 0.9,     # 학습률의 감소 비율
        "train_output": "output"    # 학습된 모델의 저장 경로
    }
    train(parameters)  # train

    print("Train Complete")
```

초기 parameters 를 받아 학습을 진행합니다. (개인의 선호에 따라 파라미터는 수정하시면 됩니다)

앞서 구성한대로, 미리 Custom Dataset & DataLoader 를 만들고, Class 정보에 따라 자동으로 Custom 모델을 빌드 한 후, 학습을 진행합니다.

1 Epoch 이 완료되면 모델을 평가하고, 평가 결과 정보를 포함한 이름으로 모델을 저장합니다.

## Project Skeleton

전체 학습기가 구성된 프로젝트의 스켈레톤은 다음과 같습니다.

```
PROJECT-BASE-DIRECTORY
    ├── /datasets
    │   ├── /train         # train_dataset
    │   │   ├── /bird
    │   │   ├── /cat
    │   │   └── /dog
    │   │
    │   ├── /evaluation    # eval_dataset
    │   │   ├── /bird
    │   │   ├── /cat
    │   │   └── /dog
    │   │
    │   └── class_index.json  - # dataset & dataloader 구성 시 자동 생성
    │
    ├── /output               - # 학습된 모델 저장시 자동으로 생성 (이하 경로에 학습된 모델 저장)
    │
    ├── dataset.py
    ├── trainer.py
    └── vgg_model.py
```

( 예시 데이터로 예시로 개(dog), 고양이(cat), 새(bird) 를 구성하였지만, 필요에 따라 적절한 학습 데이터를 구성하시길 바랍니다 )

## Repository

최종적으로 완성된 전체 프로젝트의 저장소 입니다.

( 지난번 튜토리얼-1 의 학습기도 `basic-trainer.py` 파일에 작성되어있습니다 )

[https://github.com/NerdFactoryAI/Trainer-Tutorial](https://github.com/NerdFactoryAI/Trainer-Tutorial)

## 학습

적절한 가상환경을 구성한 뒤, `python trainer.py` 명령어를 통해 학습을 진행하면 됩니다.

tqdm 을 활용해 학습 과정을 시각화 하여, 어느정도 학습이 진행되고 있는지 파악할 수 있습니다.

{:.center}
![0.png](/assets/images/posts/2021-07-08-Tutorial-2-for-Deep-Learning-Model-Trainer-Development/0.png)  
_학습 중간 캡쳐_

# 결론

이것으로 Pytorch 기반의 딥러닝 학습기 Tutorial 을 마무리 하였습니다. 부족한 내용이지만 여러분들의 딥러닝 학습기에 대한 이해를 높이는데 도움이 되었길 기대합니다.

여기에 작성되어있는 학습기는 이해를 돕기 위해 가독성을 우선하여 작성되었습니다.

따라서 개개인의 필요에 따라 더욱 최적화, 자동화가 이루어진 발전된 학습기를 작성할 여지가 충분히 있습니다.

커스텀된 데이터셋과 모델, 적절한 스케줄러와 옵티마이저를 활용해 여러분만의 Task 를 수행할 수 있는 모델을 학습해보시길 바랍니다.

# Reference

- [Pytorch](https://github.com/pytorch/pytorch)
- [Pytorch torchvision](https://github.com/pytorch/vision)
- [Pytorch Tutorial](https://github.com/yunjey/pytorch-tutorial)
- [딥러닝 모델 Trainer 개발을 위한 Tutorial-1 (with Pytorch)](https://blog.nerdfactory.ai/2020/10/08/Tutorial-1-for-Deep-Learning-Model-Trainer-Development.html)
