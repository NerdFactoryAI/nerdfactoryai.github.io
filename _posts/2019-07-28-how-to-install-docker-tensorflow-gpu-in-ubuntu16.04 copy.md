---
layout: post
title:  "ubuntu 16.04에 도커로 tensorflow-gpu 사용하기"
author: ["차금강"]
date:   2019-07-31 00:00:01 -0600
abstract: "딥러닝을 공부할 때 누구나 처음 겪는 고통, 환경설정입니다. 도커를 이용하여 gpu 버전의 tensorflow를 사용하는 방법을 공유합니다."
tags: ["ubuntu16.04", "tensorflow-gpu", "딥러닝", "gpu", "docker", "nvidia-docker"]
image: /assets/images/posts/how-to-install-docker-tensorflow-gpu-in-ubuntu16.04/image1.png
draft: "no"
---

{:.center}
![image1.png](/assets/images/posts/how-to-install-docker-tensorflow-gpu-in-ubuntu16.04/image1.png)

# Background

딥러닝을 공부할 때 모든 분들이 겪는 첫 고통 환경설치입니다. 이전 포스팅은 일반적인 환경에 설치하는 방법입니다. 이 방법은 OS가 윈도우일 때, 리눅스일 때를 넘어 우분투 버전이 바뀐다던가, 조금이라도 환경이 달라지면 설치하는 방법이 완전히 달라지는 경우가 발생할 수 있습니다. 하지만 우리는 도커라는 컨테이너 기반의 좋은 가상환경을 이용하여 항상 같은 설치방법으로 딥러닝 연구/개발을 손쉽게 진행할 수 있습니다. 이 방법을 쉽게 풀어서 공유함으로써 여러분들이 환경설치에서 겪은 어려움을 해소하고 본업에 충실할 수 있도록 기원합니다.

* 저희가 보유한 워크스테이션은 `TITAN Xp` 2개를 보유하고 있으며 이를 개별적으로 사용하는 방법도 포함하고 있습니다.
* 보유한 워크스테이션은 `Ubuntu 16.04`입니다.

* 이 포스팅은 도커, 기존의 tensorflow-gpu 사용법을 알고 있음을 전제로 합니다.

# Make simple files to check gpu operation

먼저 간단하게 gpu를 사용하도록 하는 파이썬 파일을 작성합니다. 이 파일은 최대한 간단하게 작성하도록 권유하며 단순히 gpu가 정상적으로 구동되는지 확인하기 위해서만 사용됩니다.

```
import tensorflow as tf     # main.py

sess = tf.Session()

a = tf.constant(1)
b = tf.constant(2)
c = a * b
print(sess.run(c))
```

```
FROM nvidia/cuda:10.0-base-ubuntu16.04      # Dockerfile
FROM tensorflow/tensorflow:1.14.0-gpu-py3

COPY . /app
WORKDIR /app

CMD python main.py
```

# Install nvidia-driver

도커가 머신의 gpu를 사용할 수 있도록 하기 위해서 nvidia-driver를 설치합니다.

```
sudo apt-get install nvidia-418
```

위의 설치가 정상적으로 되었으면 아래와 같은 화면을 확인할 수 있습니다.

```
xxx@xxxx:~$ nvidia-smi
Tue Jul 30 23:54:30 2019       
+-----------------------------------------------------------------------------+
| NVIDIA-SMI 418.67       Driver Version: 418.67       CUDA Version: 10.1     |
|-------------------------------+----------------------+----------------------+
| GPU  Name        Persistence-M| Bus-Id        Disp.A | Volatile Uncorr. ECC |
| Fan  Temp  Perf  Pwr:Usage/Cap|         Memory-Usage | GPU-Util  Compute M. |
|===============================+======================+======================|
|   0  TITAN Xp            On   | 00000000:65:00.0 Off |                  N/A |
|  0%   40C    P5    26W / 250W |      1MiB / 12194MiB |     86%      Default |
+-------------------------------+----------------------+----------------------+
|   1  TITAN Xp            On   | 00000000:B3:00.0 Off |                  N/A |
|  0%   39C    P8     8W / 250W |      1MiB / 12196MiB |      0%      Default |
+-------------------------------+----------------------+----------------------+
                                                                               
+-----------------------------------------------------------------------------+
| Processes:                                                       GPU Memory |
|  GPU       PID   Type   Process name                             Usage      |
|=============================================================================|
|  No running processes found                                                 |
+-----------------------------------------------------------------------------+
```

# Install nvidia-docker

nvidia-docker는 도커에서 nvidia의 gpu를 사용할 수 있도록 만든 docker의 다른 버전이라고 생각하시면 됩니다. 이것에는 두가지 버전이 있으며 `nvidia-docker`, `nvidia-docker2`가 있습니다. `nvidia-docker2`의 경우에는 나온지가 얼마 되지 않아 에러가 발생할 수 있는 가능성이 높습니다. 그래서 언제나 그렇듯 안정적인 버전인 `nvidia-docker`를 설치합니다.

모든 설치과정은 [nvidia-docker github](https://github.com/NVIDIA/nvidia-docker)에서도 확인할 수 있습니다.

그 중 해당하는 OS인 `Ubuntu 16.04/18.04, Debian Jessie/Stretch`에 있는 스크립트를 이용하여 설치합니다.

```
# Add the package repositories
$ distribution=$(. /etc/os-release;echo $ID$VERSION_ID)
$ curl -s -L https://nvidia.github.io/nvidia-docker/gpgkey | sudo apt-key add -
$ curl -s -L https://nvidia.github.io/nvidia-docker/$distribution/nvidia-docker.list | sudo tee /etc/apt/sources.list.d/nvidia-docker.list

$ sudo apt-get update && sudo apt-get install -y nvidia-container-toolkit
$ sudo systemctl restart docker
```

정상적으로 설치가 되었다면 아래와 같은 커맨드로 같은 화면을 볼 수 있습니다.

```
xxx@xxxx:~/test$ nvidia-docker run nvidia/cuda:9.0-base-ubuntu16.04 nvidia-smi
Wed Jul 31 00:23:57 2019       
+-----------------------------------------------------------------------------+
| NVIDIA-SMI 418.67       Driver Version: 418.67       CUDA Version: 10.1     |
|-------------------------------+----------------------+----------------------+
| GPU  Name        Persistence-M| Bus-Id        Disp.A | Volatile Uncorr. ECC |
| Fan  Temp  Perf  Pwr:Usage/Cap|         Memory-Usage | GPU-Util  Compute M. |
|===============================+======================+======================|
|   0  TITAN Xp            On   | 00000000:65:00.0 Off |                  N/A |
|  0%   39C    P8    17W / 250W |    128MiB / 12194MiB |      0%      Default |
+-------------------------------+----------------------+----------------------+
|   1  TITAN Xp            On   | 00000000:B3:00.0 Off |                  N/A |
|  0%   39C    P8     8W / 250W |    158MiB / 12196MiB |      0%      Default |
+-------------------------------+----------------------+----------------------+
                                                                               
+-----------------------------------------------------------------------------+
| Processes:                                                       GPU Memory |
|  GPU       PID   Type   Process name                             Usage      |
|=============================================================================|
+-----------------------------------------------------------------------------+
```

# Build & Run docker image

앞에서 작성했었던 파이썬 파일과 도커파일을 빌드하고 실행시켜 정상적으로 작동하는지 확인합니다.

먼저 도커파일을 빌드합니다.

```
(tensorflow-gpu) nerdfactory@nerdfactory-workstation:~/test$ docker build -t test:latest .
free(): invalid pointer
SIGABRT: abort
PC=0x7f040204fe97 m=0 sigcode=18446744073709551610
signal arrived during cgo execution

goroutine 1 [syscall, locked to thread]:
runtime.cgocall(0x4afd50, 0xc42005bcc0, 0xc42005bce8)
	/usr/lib/go-1.8/src/runtime/cgocall.go:131 +0xe2 fp=0xc42005bc90 sp=0xc42005bc50
github.com/docker/docker-credential-helpers/secretservice._Cfunc_free(0xa6e270)
	github.com/docker/docker-credential-helpers/secretservice/_obj/_cgo_gotypes.go:111 +0x41 fp=0xc42005bcc0 sp=0xc42005bc90
github.com/docker/docker-credential-helpers/secretservice.Secretservice.List.func5(0xa6e270)
	/build/golang-github-docker-docker-credential-helpers-cMhSy1/golang-github-docker-docker-credential
...
11ebb08f1c0a: Pull complete 
Digest: sha256:7a99103c79a4df9fc3325608f73928e3e58388625b1c0dc645b676694eaf2c9d
Status: Downloaded newer image for nvidia/cuda:10.0-base-ubuntu16.04
 ---> 771d4f540bd4
Step 2/5 : FROM tensorflow/tensorflow:1.14.0-gpu-py3
 ---> a7a1861d2150
Step 3/5 : COPY . /app
 ---> 7882c3b4e963
Step 4/5 : WORKDIR /app
 ---> Running in 21b7caae855e
Removing intermediate container 21b7caae855e
 ---> 48e79569f9dc
Step 5/5 : CMD python main.py
 ---> Running in 5ac8c9cb9977
Removing intermediate container 5ac8c9cb9977
 ---> df0825d494fe
Successfully built df0825d494fe
Successfully tagged test:latest
```

정상적으로 빌드 되었는지 확인합니다.

```
xxx@xxxx:~/test$ docker images
REPOSITORY                                      TAG                     IMAGE ID            CREATED             SIZE
test                                            latest                  df0825d494fe        3 minutes ago       3.51GB
nvidia/cuda                                     10.0-base-ubuntu16.04   771d4f540bd4        18 hours ago        165MB
```

빌드된 이미지를 실행시킵니다.

여기서 명령어가 중요합니다

```
NV_GPU=1 nvidia-docker run test:latest
```

`NV_GPU=1`는 2개의 0번과 1번의 `GPU` 중 1번을 사용하겠다는 뜻입니다. 종합적으로 위의 커맨드는 `1번 GPU`를 사용하겠으며 test:latest의 이미지를 실행한다는 뜻입니다. 참고로 한번에 여러 개를 사용하기 위해서는 `NV_GPU=0,1`과 같이 입력하면 됩니다.

```
xxx@xxxx:~/test$ NV_GPU=1 nvidia-docker run test:latest
WARNING: Logging before flag parsing goes to stderr.
W0731 00:35:44.859123 140672818566976 deprecation_wrapper.py:119] From main.py:2: The name tf.Session is deprecated. Please use tf.compat.v1.Session instead.

2019-07-31 00:35:44.901409: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcuda.so.1
2019-07-31 00:35:44.914324: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1640] Found device 0 with properties: 
name: TITAN Xp major: 6 minor: 1 memoryClockRate(GHz): 1.582
pciBusID: 0000:b3:00.0
2019-07-31 00:35:45.225882: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcudnn.so.7
2019-07-31 00:35:45.232369: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1763] Adding visible gpu devices: 0
2019-07-31 00:35:45.233752: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcudart.so.10.0
2019-07-31 00:35:45.235729: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1181] Device interconnect StreamExecutor with strength 1 edge matrix:
2019-07-31 00:35:45.235966: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1187]      0 
2019-07-31 00:35:45.236027: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1200] 0:   N 
2019-07-31 00:35:45.242025: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1326] Created TensorFlow device (/job:localhost/replica:0/task:0/device:GPU:0 with 11297 MB memory) -> physical GPU (device: 0, name: TITAN Xp, pci bus id: 0000:b3:00.0, compute capability: 6.1)
2
```

결과를 보시면 중간 `libcudnn.so.10.0`을 참조했으며 GPU를 사용했다라고 출력됩니다. 그리고 마지막 연산에 대한 결과도 `print`되는 것을 확인할 수 있습니다. 마지막으로 `1번 GPU`를 사용하고 있는지 `nvidia-smi`를 통해 확인해보겠습니다.

```
Wed Jul 31 00:35:46 2019       
+-----------------------------------------------------------------------------+
| NVIDIA-SMI 418.67       Driver Version: 418.67       CUDA Version: 10.1     |
|-------------------------------+----------------------+----------------------+
| GPU  Name        Persistence-M| Bus-Id        Disp.A | Volatile Uncorr. ECC |
| Fan  Temp  Perf  Pwr:Usage/Cap|         Memory-Usage | GPU-Util  Compute M. |
|===============================+======================+======================|
|   0  TITAN Xp            On   | 00000000:65:00.0 Off |                  N/A |
|  0%   39C    P8    17W / 250W |    128MiB / 12194MiB |      0%      Default |
+-------------------------------+----------------------+----------------------+
|   1  TITAN Xp            On   | 00000000:B3:00.0 Off |                  N/A |
|  0%   39C    P2    59W / 250W |  11603MiB / 12196MiB |      0%      Default |
+-------------------------------+----------------------+----------------------+
                                                                               
+-----------------------------------------------------------------------------+
| Processes:                                                       GPU Memory |
|  GPU       PID   Type   Process name                             Usage      |
|=============================================================================|
|    0       739      C   python                                     11713MiB |
|    1       739      C   python                                       147MiB |
|    1     13534      C   -                                          11445MiB |
+-----------------------------------------------------------------------------+
```

정확히 `0번 GPU`는 사용하지 않으며 `1번 GPU`만 사용하는 것을 확인할 수 있습니다.
이를 통해 `main.py`에 여러분들의 학습 과정을 작성하여 연구/개발을 진행하시면 됩니다.