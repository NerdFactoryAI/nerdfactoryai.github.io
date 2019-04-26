---
layout: post
title:  "구글 Colab을 이용한 BERT-Base Model 학습하기"
author: ["chris"]
date:   2019-04-25
abstract: "원활한 인공지능 공부와 연구를 위해 성능 좋은 GPU 사용은 필수입니다. 또한 많은 GPU 자원을 요구하는 딥러닝 모델(ResNet, Bert 등)들이 나오면서 고성능 GPU 사용은 더 중요해졌습니다. 현실적인 비용의 벽이 생겼고 개인이나 학생들은 자원의 한계에 좌절했습니다.  이러한 상황 속에 구글 Colab은 제한적이지만 무료로 성능 좋은 GPU와 심지어 TPU를 제공합니다. 이번 글에선 Colab에서 제공하는 GPU와 TPU를 이용해 많은 GPU 자원이 요구되는 BERT-Base model을 학습시키는 방법에 대해 소개합니다."
tags: ["colab", "구글드라이브", "TPU", "BERT", "KorQuad", "Google Cloud", "GPU"]
image: /assets/images/posts/learn-bert-with-colab/blog_logo.png
draft: "no"
---

# Abstract

원활한 인공지능 공부와 연구를 위해 성능 좋은 GPU 사용은 필수입니다. 또한 많은 GPU 자원을 요구하는 딥러닝 모델(ResNet, Bert 등)들이 나오면서 고성능 GPU 사용은 더 중요해졌습니다. 현실적인 비용의 벽이 생겼고 개인이나 학생들은 자원의 한계에 좌절했습니다.  이러한 상황 속에 구글 Colab은 제한적이지만 무료로 성능 좋은 GPU와 심지어 TPU를 제공합니다. 이번 글에선 Colab에서 제공하는 GPU와 TPU를 이용해 많은 GPU 자원이 요구되는 BERT-Base model을 학습시키는 방법에 대해 소개합니다.

# Colab

![Image result for google colab](/assets/images/posts/learn-bert-with-colab/colab_logo.png) 
Google Colab은 제한적이지만 무료로 GPU와 TPU를 제공해 기계학습 공부와 딥러닝 응용프로그램을 실행시킬 수 있는 IDE입니다. Tensorflow, Pytorch 등 많이 사용되는 프레임워크를 지원하며 와 Jupyter notebook과 비슷하게 되어 있어 기존 Jupyter notebook 이용자는 쉽게 사용할 수 있습니다. 기존에 Tesla K80 GPU를 제공했지만, 최근 Tesla T4 GPU로 변경되었으며, Google Cloud Platform의 TPU와 다르게 Colab의 TPU는 무료로 사용할 수 있다는 점이 가장 큰 강점입니다.
Colab은 현재 64비트 기반 우분투 18.04 버전을 사용하고 있으며, Python2,3을 모두 지원 합니다. 또한 딥러닝 라이브러리(keras, tensorflow, pytorch 등)과 데이터분석 패키지가 기본으로 설치되어 있습니다.
추가적인 Colab 환경 정보는 아래 링크를 참조해 주시기 바랍니다.

* [https://colab.research.google.com/drive/0B2Op0f7i-jUEem1NUWVaRDlwVVE#scrollTo=PYUoUDZlPvsN](https://colab.research.google.com/drive/0B2Op0f7i-jUEem1NUWVaRDlwVVE#scrollTo=PYUoUDZlPvsN)

# KorQuAD

![Image result for korquad](/assets/images/posts/learn-bert-with-colab/korquad_logo.jpg){: .center}

> "KorQuAD는 한국어 Machine Reading Comprehension을 위해 만든 데이터셋입니다. 모든 질의에 대한 답변은 해당 Wikipedia 아티클 문단의 일부 하위 영역으로 이루어집니다. Stanford Question Answering Dataset(SQuAD) v1.0과 동일한 방식으로 구성되었습니다."

인공지능 모델이 얼마나 독해를 잘 해내는 지 평가하기 위한 한국어 데이터 셋입니다. 이번 글에서는 BERT-Base 모델에 KorQuAD 데이터를 학습시켜 얼마나 잘 독해를 수행하는지 평가할 것입니다.
 
# 사전준비

시작하기에 앞서 아래 깃허브 주소에서 Bert Model과 Pre-trained Model을 다운받습니다. 필요한 Bert 파일은 modeling.py, optimization.py, run_squad.py, tokenization.py이며, Pre-trained Model은 BERT-Base Multilingual Cased로 여러 국가의 언어로 pre-train된 모델입니다. BERT는 학습 권장 GPU 메모리가 최소 12g를 요구하는 큰 모델입니다. 
추가적인 정보는 아래 BERT 깃 허브 페이지 SQuAD 1.1란을 확인하시기 바랍니다.

* BERT 모델: [https://github.com/google-research/bert](https://github.com/google-research/bert) **[`BERT-Base, Multilingual Cased (New, recommended)`](https://storage.googleapis.com/bert_models/2018_11_23/multi_cased_L-12_H-768_A-12.zip)**

이번에 사용할 Train, dev 데이터는 KorQuAD로 질의응답과 관련된 task입니다. 아무것도 하지 않은 기본 상태에서 학습 후 평가까지 진행해보도록 하겠습니다. 아래 주소에서 TRAINING SET(37MB), DEV SET(3.9MB), EVALUATION SCRIPT를 다운받습니다.

* KorQuAD 데이터셋: [https://korquad.github.io/](https://korquad.github.io/)  

# 학습

학습을 위한 파일 저장 공간으로 local이 아닌 [구글 클라우드 플랫폼 버킷]과 [구글 드라이브]를 같이 사용했습니다.

* 1. GPU 실습: 런타임 유형 GPU + 구글 드라이브
* 2. TPU 실습: 런타임 유형 TPU + 구글 클라우드 플랫폼 버킷 + 구글 드라이브

위 조합으로 각각 실습을 진행합니다.

**이 글에 작성된 모든 코드 및 명령어들은 Colab 노트에서 실행되는 것들입니다.**

## 1. GPU로 학습하기

Colab의 기본 설정은 None 상태입니다. GPU나 TPU 사용을 위해  설정을 변경해 줘야 합니다. 
* 좌측 상단 메뉴에서 런타임 -> 런타임 유형 변경 -> 하드웨어 가속기 -> GPU 선택 후 저장

Colab에선 첫 시작을 !로 시작하면 리눅스 명령어들을 사용할 수 있습니다.

```yml
!nvidia-smi
```

```text
Thu Apr 25 17:56:49 2019 
+-----------------------------------------------------------------------------+ 
| NVIDIA-SMI 418.56 Driver Version: 410.79 CUDA Version: 10.0 | 
|-------------------------------+----------------------+----------------------+ 
| GPU Name Persistence-M| Bus-Id Disp.A | Volatile Uncorr. ECC | 
| Fan Temp Perf Pwr:Usage/Cap| Memory-Usage | GPU-Util Compute M. | 
|===============================+======================+======================| 
| 0 Tesla T4 Off | 00000000:00:04.0 Off | 0 | 
| N/A 45C P8 16W / 70W | 0MiB / 15079MiB | 0% Default | 
+-------------------------------+----------------------+----------------------+ 
+-----------------------------------------------------------------------------+ 
| Processes: GPU Memory | | GPU PID Type Process name Usage | 
|=============================================================================| 
| No running processes found |
+-----------------------------------------------------------------------------+
```

를 입력하면, 현재 사용할 수 있는 GPU를 확인할 수 있습니다.


최근 변경된 Tesla T4 GPU가 인식되는 것을 볼 수 있습니다.

GPU 환경에서는 구글 드라이브와 연동해 학습을 진행했습니다. 먼저 구글 드라이브와 Colab을 연동 시켜야 합니다.

Colab과 구글 드라이브를 연동시키기 위해 아래 소스코드를 Colab에서 실행시킵니다.

```yml
!apt-get install -y -qq software-properties-common python-software-properties module-init-tools

!add-apt-repository -y ppa:alessandro-strada/ppa 2>&1 > /dev/null

!apt-get update -qq 2>&1 > /dev/null

!apt-get -y install -qq google-drive-ocamlfuse fuse

from google.colab import auth

auth.authenticate_user()

from oauth2client.client import GoogleCredentials

creds = GoogleCredentials.get_application_default()

import getpass
!google-drive-ocamlfuse -headless -id={creds.client_id} -secret={creds.client_secret} < /dev/null 2>&1 | grep URL

vcode = getpass.getpass()

!echo {vcode} | google-drive-ocamlfuse -headless -id={creds.client_id} -secret={creds.client_secret}
```

총 2번의 구글 계정 인증 과정이 있습니다. 아쉽게도 세션이 종료된다면, 다시 같은 과정을 거쳐야 합니다. 왼쪽 상단에 +코드를 눌러 계속해서 새로운 코드 셀에서 작성해 대비하시기 바랍니다.

```yml
!mkdir -p Gdrive
```

구글 드라이브와 연결할 폴더를 생성해 줍니다. 

```yml
!google-drive-ocamlfuse Gdrive
```

이제 생성한 drive 폴더에 인증한 구글 드라이브 계정과 연동 되었습니다.

```yml
!ls
```

```yml
!ls Gdrive
```

{:.center}
![Gdrive_folder_list](/assets/images/posts/learn-bert-with-colab/Gdrive_folder_image.png)

구글 드라이브에 있는 파일과 폴더 리스트가 똑같이 출력되는 것을 확인할 수 있습니다.
이제 구글 드라이브를 저장소로 자유롭게 접근하며 사용할 수 있습니다.

기본적인 세팅이 완료가 되었습니다. 미리 다운 받아뒀던 BERT 파일들과 KorQuAD 파일들을 구글 드라이브에 옮기도록 하겠습니다.

{:.center}
![Gdrive_folder_list](/assets/images/posts/learn-bert-with-colab/Gdrive_folder_image_in_gdrive.png)
*구글 드라이브에서 위 그림과 같이 3개의 폴더를 생성해 줍니다. bert_files, korquad_files, pretrained_files*


* bert_files
BERT 깃허브에서 다운 받은 modeling.py, optimization.py, run_squad.py, tokenization.py 파일들을 넣어 줍니다.

* korquad_files
KorQuad 페이지에서 다운 받은 evaluate-v1.0.py, KorQuAD_v1.0_dev.json, KorQuAD_v1.0_train.json 파일들을 넣어 줍니다. 

* pretrained_files
다운 받은 BERT-Base Multilingual Cased를 압축 해제 한 후 모든 파일들을 넣어 줍니다.

이제 마지막 단계만 남았습니다!
Colab으로 돌아가 보겠습니다.

```yml
python run_squad.py \
  --vocab_file=$BERT_BASE_DIR/vocab.txt \
  --bert_config_file=$BERT_BASE_DIR/bert_config.json \
  --init_checkpoint=$BERT_BASE_DIR/bert_model.ckpt \
  --do_train=True \
  --train_file=$SQUAD_DIR/train-v1.1.json \
  --do_predict=True \
  --predict_file=$SQUAD_DIR/dev-v1.1.json \
  --train_batch_size=12 \
  --learning_rate=3e-5 \
  --num_train_epochs=2.0 \
  --max_seq_length=384 \
  --doc_stride=128 \
  --output_dir=/tmp/squad_base/
```

위 형식에 맞게 File path를 설정하고 실행시켜 주면 학습이 시작됩니다. 우리는 저장소로 구글 드라이브를 연동해 이용하고 있으므로, 연동된 구글 드라이브 File path에 맞게 설정해주시면 됩니다.

```yml
!python Gdrive/bert_files/run_squad.py --vocab_file=Gdrive/pretrained_files/vocab.txt --bert_config_file=Gdrive/pretrained_files/bert_config.json --init_checkpoint=Gdrive/pretrained_files/bert_model.ckpt --do_train=True --train_file=Gdrive/korquad_files/KorQuAD_v1.0_train.json --do_predict=True --predict_file=Gdrive/korquad_files/KorQuAD_v1.0_dev.json --train_batch_size=16 --learning_rate=3e-5 --num_train_epochs=2.0 --max_seq_length=256 --doc_stride=128 --output_dir=Gdrive/temp --do_lower_case=False
```

이 글에 맞는 형식으로 작성하게 되면 위와 같이 완성됩니다. `output_dir`은 따로 구글 드라이브에서 폴더를 생성하지 않아도 코드를 실행하게 되면 `output_dir` 입력한 File path에 맞게 폴더가 자동으로 생성됩니다.
추가적으로 기본 명령어 항목에는 없지만, `--do_lower_case=False`를 입력하지 않으면 오류가 발생합니다. 잊지 말고 추가해주시기 바랍니다.

Kor_QuAD_dev 데이터로 평가를 해보도록 하겠습니다. 학습이 무사히 완료되었다면, 설정해둔 `output_dir`에 predictions.josn 파일이 생성됩니다. 평가는 Kor_QuAD에서 제공하는 evaluate-v1.0.py 파이썬 스크립트를 이용합니다.

```yml
!python Gdrive/korquad_files/evaluate-v1.0.py Gdrive/koquad_files/KorQuAD_v1.0_dev.json Gdrive/temp/predictions.json
```

```
{"exact_match": 70.21129199861448, "f1": 90.061932770213}
```

## 2. TPU로 학습하기

`주의 사항` : Colab의 TPU와 Google Cloud Platform의 TPU는 다릅니다. 이 글에서는 오로지 무료인 Colab의 TPU만 사용하기 때문에 **절대** Google Cloud Platform의 TPU 노드를 절대 생성하지 마세요! (TPU 노드 생성 후 인스턴스 활성화 상태만으로 크레딧이 지불됩니다.)

새 python3 노트를 만든 다음 Colab의 기본 설정을 TPU로 변경해 줍니다.

* 좌측 상단 메뉴에서 런타임 -> 런타임 유형 변경 -> 하드웨어 가속기 -> TPU 선택 후 저장

GPU 학습과 마찬가지로 구글 드라이브 또한 이용하기 때문에, **1. GPU로 학습하기**에서 구글 드라이브 연동 부분까지 그대로 따라 해주시기 바랍니다.

아쉽게도, BERT는 TPU 이용 시 구글 드라이브만을 저장소로 학습할 수 없습니다. 

 > "On Cloud TPUs, the pretrained model and the output directory will need to be on Google Cloud Storage."

* [https://github.com/google-research/bert](https://github.com/google-research/bert%20Fine-tuning%20with%20Cloud%20TPUs) Fine-tuning with Cloud TPUs 부분을 참조해 주시기 바랍니다.
 
 pretrained model 파일과 output 경로가 Google Cloud Storage에 있어야 합니다. 그래서 구글 드라이브와 구글 클라우드 스토리지 두 개를 혼합해 사용하겠습니다.

* Google Cloud Platform에 처음 가입하면, AWS 프리티어와 비슷하게 $300 크레딧과 1년의 무료 이용 기간을 제공 합니다.
* 버킷 사용만으로도 한 달을 기준으로 일정량의 크레딧이 소진되지만, 제공되는 크레딧으로 충분히 사용하실 수 있습니다.

Google Cloud Platform에 접속해주세요. 우리는 오로지 Storage만 사용할 것이기 때문에

* 메뉴 저장소 -> Storage -> 버킷 생성
 
로 가서 pretrained_files 폴더만 생성해 관련 파일들을 넣어줍니다. 추가로 temp 폴더를 만들어 output 경로로 잡아줘야 합니다. 나머지 bert_files, korquad_files는 그대로 구글 드라이브를 이용할 것입니다.
 
* pretrained_files
다운 받은 BERT-Base Multilingual Cased를 압축 해제한 후 모든 파일들을 넣어 줍니다.
* temp

위 2개의 폴더 생성과 파일을 다 업로드했다면, 이제 Colab으로 돌아갑니다.

Colab에서 제공하는 무료 TPU를 사용하기 위해 TPU 주소를 알아내야 합니다. 아래 코드를 Colab에서 실행시키기 바랍니다.

```yml
import datetime
import json
import os
import pprint
import random
import string
import sys
import tensorflow as tf

assert 'COLAB_TPU_ADDR' in os.environ, 'ERROR: Not connected to a TPU runtime; please see the first cell in this notebook for instructions!'
TPU_ADDRESS = 'grpc://' + os.environ['COLAB_TPU_ADDR']
print('TPU address is', TPU_ADDRESS)

from google.colab import auth
auth.authenticate_user()
with tf.Session(TPU_ADDRESS) as session:
  print('TPU devices:')
  pprint.pprint(session.list_devices())

  # Upload credentials to TPU.
  with open('/content/adc.json', 'r') as f:
    auth_info = json.load(f)
  tf.contrib.cloud.configure_gcs(session, credentials=auth_info)
  # Now credentials are set for all future sessions on this TPU.
```

```
TPU address is grpc://10.103.6.98:8470 TPU devices:
[_DeviceAttributes(/job:tpu_worker/replica:0/task:0/device:CPU:0, CPU, -1, 13708216498705781010),
_DeviceAttributes(/job:tpu_worker/replica:0/task:0/device:XLA_CPU:0, XLA_CPU, 17179869184, 1741396917812056919),
_DeviceAttributes(/job:tpu_worker/replica:0/task:0/device:TPU:0, TPU, 17179869184, 16210821529756056327),
_DeviceAttributes(/job:tpu_worker/replica:0/task:0/device:TPU:1, TPU, 17179869184, 16587277654339613920),
_DeviceAttributes(/job:tpu_worker/replica:0/task:0/device:TPU:2, TPU, 17179869184, 5996062272649429803),
_DeviceAttributes(/job:tpu_worker/replica:0/task:0/device:TPU:3, TPU, 17179869184, 4739026416197928203),
_DeviceAttributes(/job:tpu_worker/replica:0/task:0/device:TPU:4, TPU, 17179869184, 15544267298823555446),
_DeviceAttributes(/job:tpu_worker/replica:0/task:0/device:TPU:5, TPU, 17179869184, 16747027935628672938),
_DeviceAttributes(/job:tpu_worker/replica:0/task:0/device:TPU:6, TPU, 17179869184, 18228827306439742948),
_DeviceAttributes(/job:tpu_worker/replica:0/task:0/device:TPU:7, TPU, 17179869184, 4847856469810224037),
_DeviceAttributes(/job:tpu_worker/replica:0/task:0/device:TPU_SYSTEM:0, TPU_SYSTEM, 17179869184, 7999212022395210760)]
```

코드를 실행시키면 현재 연결되어있는 TPU 주소와 함께 TPU 정보가 결과로 나옵니다.
단순히 TPU 주소만 알고 싶다면, 아래 코드를 실행시키면 됩니다.

```yml
import tensorflow as tf
import numpy as np
import os

try:
  device_name = os.environ['COLAB_TPU_ADDR']
  TPU_ADDRESS = 'grpc://' + device_name
  print('Found TPU at: {}'.format(TPU_ADDRESS))

except KeyError:
  print('TPU not found')
```

```
Found TPU at: grpc://0.0.0.0:8470
```

이제 마지막으로 TPU 주소와 구글 클라우드 버킷 주소를 경로에 맞게 작성 후 실행시키면 학습이 시작됩니다.

```yml
python run_squad.py \
  --vocab_file=$BERT_BASE_DIR/vocab.txt \
  --bert_config_file=$BERT_BASE_DIR/bert_config.json \
  --init_checkpoint=$BERT_BASE_DIR/bert_model.ckpt \
  --do_train=True \
  --train_file=$SQUAD_DIR/train-v1.1.json \
  --do_predict=True \
  --predict_file=$SQUAD_DIR/dev-v1.1.json \
  --train_batch_size=16 \
  --learning_rate=3e-5 \
  --num_train_epochs=2.0 \
  --max_seq_length=384 \
  --doc_stride=128 \
  --output_dir=/tmp/squad_base/
  --use_tpu=True \
  --tpu_name=$TPU_NAME
```

다른 점이 보이시나요? ```--use_tpu=True```와 ```--tpu_name=$TPU_NAME```이 추가된 것을 볼 수 있습니다. 또한 GPU와는 다르게 TPU에선 8개의 TPU가 분산처리하기 때문에 반드시 train_batch_size를 8의 배수로 입력해야 합니다.

```yml
!python Gdrive/bert_files/run_squad.py --vocab_file=gs://{bucket_name}/pretrained_files/vocab.txt --bert_config_file=gs://{bucket_name}/pretrained_files/bert_config.json --init_checkpoint=gs://{bucket_name}/pretrained_files/bert_model.ckpt --do_train=True --train_file=Gdrive/korquad_files/KorQuAD_v1.0_train.json --do_predict=True --predict_file=Gdrive/korquad_files/KorQuAD_v1.0_dev.json --train_batch_size=16 --learning_rate=3e-5 --num_train_epochs=2.0 --max_seq_length=256 --doc_stride=128 --output_dir=gs://{bucket_name}/temp --use_tpu=True --tpu_name=grpc://10.103.6.98:8470 --do_lower_case=False
```

이 글을 기준으로 작성하면 위 코드와 같습니다. **1. GPU로 학습하기**에서 달라진 부분은 vocab_file, bert_config_file, init_checkpoint 즉, pretrained 관련 파일들을 구글 클라우드 스토리지 버킷 주소 **{bucket_name}** (각자 생성한 버킷 이름을 넣으시면 됩니다.)에 맞게 설정했으며, ```--use_tpu=True```, ```--tpu_name=grpc://10.103.6.98:8470```가 추가되었습니다. TPU_NAME은 위에서 얻은 TPU 주소입니다. 

**TPU 주소는 세션이 바뀔 때마다 매번 다른 주소가 생성됩니다. 이점을 염두에 두고 코드 셀 관리를 하시기 바랍니다.**

학습이 완료되었다면 평가를 위해 구글 클라우드 스토리지에서 ``temp/predictions.json``파일을 구글 드라이브로 옮겨 Colab에서 파일 접근이 가능하게 해야 합니다. Colab에서 아래의 코드를 실행시킵니다.

```yml
from google.colab import auth
auth.authenticate_user()
```

```
!gcloud config set project {project-name}
```

{progect-name}은 구글 클라우드 플랫폼을 보시면 현재 사용하고 있는 project의 이름을 알 수 있습니다. 각자 생성된 project 이름으로 대체하시면 됩니다.
구글 클라우드와 프로젝트의 연동이 완료되었다면, 버킷에 있는 파일을 구글 드라이브로 복사해 옮기도록 하겠습니다.
먼저 Gdrive 폴더로 이동해야 합니다. 아래 코드는 리눅스 cd 명령어랑 같이 작동한다고 보시면 됩니다.

```yml
import os

os.chdir("Gdrive")
```

Gdrive로 무사히 이동 되었다면 아래 코드를 실행해 Gdrive에 옮겨 줍니다.

```yml
!gsutil cp gs://{bucket_name}/temp/predictions.json /temp/predictions.json
```

Colab에서 위 명령어가 제대로 작동되었다면, 연결되어있는 구글 드라이브에 temp 폴더 생성과 함께 predicitons.json 파일이 옮겨진 것을 확인할 수 있습니다. 구글 드라이브에 temp 폴더가 미리 생성되어 있으면 작동하지 않습니다. 주의해 주시기 바랍니다.

마지막으로 Kor_QuAD_dev 데이터로 평가를 해보도록 하겠습니다.

```yml
!python korquad_files/evaluate-v1.0.py KorQuAD_v1.0_dev.json temp/predictions.json
```

```
{"exact_match": 69.74367855905784, "f1": 89.34266122624992}
```

## 3. GPU / TPU 학습 결과

* 실험 parameter는 이 글에 작성된 기본 설정으로 동일하게 맞춰져 있습니다.
batch_size = 16
learning_rate = 3e-5
num_train_epochs = 2.0
* 시간 측정 방식은 실행 버튼을 누른 순간부터 predictions.json 파일이 생성되고 종료된 시점까지입니다.

|  | GPU | TPU
------------ | ------------- | -------------
총 학습 시간(초) | 약 10341초 | 약 1681초
총 학습 시간(분) | 약 172분 |약 28분
총 학습 시간(시간) | 약 2시간 52분 | 약 28분

TPU와 GPU 간 학습 시간 차이가 무려 6배 이상 나는 것을 볼 수 있습니다. epoch가 증가할수록 학습 시간적 격차는 점점 더 커질 것으로 생각됩니다. Tesla K80 GPU가 300만 원 넘는 것을 생각한다면 TPU의 성능이 엄청나다는 것을 알 수 있습니다.
 
# Conclusion

* 아쉬운 점
Colab의 세션은 12시간이 최대입니다. 즉 12시간이 지난다면, 인증 절차나 학습을 다시 새로 진행해야 합니다. 또한 12시간이 지나지 않더라도, 이용자가 Colab에 머물러 있지 않다고 판단되면, TPU나 GPU를 사용해 학습하고 있더라도 대기 상태로 변하게 됩니다. 무료 서비스라는 점에서 이해는 되지만, 학습 중에 대기 상태로 변하는 것은 생각보다 불편한 부분이라고 생각됩니다.
TPU 사용을 위해서는 Google Cloud Storage를 이용해야 하며, 주어진 크레딧을 모두 소진한다면, 금액을 지불해야 합니다. TPU 사용에 있어서는 무료라는 점에서 좋지만, 제공된 크레딧 사용 후에는 완전히 무료로는 사용할 수 없을 것입니다.

* 좋은 점
GPU, TPU를 잘 이용한다면, 많은 시간을 아낄 수 있어 12시간의 제약이 크지 않을 수 있습니다. 조금의 불편함을 감수하고 Colab 사용에 익숙해진다면, 비싼 GPU를 구매하는 것이 부담스러운 개인이나 학생들에게 기계학습 공부를 할 수 있는 좋은 서비스가 될 것입니다. 

추가로, fine-tuning으로 성능을 높여 Kor_QuAD 리더보드 갱신에 도전해보시기 바랍니다.

# References
[1] [https://github.com/google-research/bert](https://github.com/google-research/bert) <br/>
[2] [https://korquad.github.io](https://korquad.github.io/) <br/>
[3] [https://zzsza.github.io/data/2018/08/30/google-colab/](https://zzsza.github.io/data/2018/08/30/google-colab/#%EA%B5%AC%EA%B8%80-%EB%93%9C%EB%9D%BC%EC%9D%B4%EB%B8%8C%EC%99%80-colab-%EC%97%B0%EB%8F%99)  <br/>
[4] [https://noanswercode.tistory.com/24](https://noanswercode.tistory.com/24)  <br/>
[5] [https://colab.research.google.com/drive/0B2Op0f7i-jUEem1NUWVaRDlwVVE](https://colab.research.google.com/drive/0B2Op0f7i-jUEem1NUWVaRDlwVVE)  <br/>