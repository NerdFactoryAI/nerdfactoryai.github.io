---
layout: post
title:  "ubuntu 16.04에 nvidia-driver, cuda, cudnn, tensorflow-gpu 설치"
author: ["차금강"]
date:   2019-07-25 00:00:01 -0600
abstract: "딥러닝을 공부할 때 누구나 처음 겪는 고통, 환경설정입니다. 가장 흔히 쓰이는 OS인 ubuntu16.04에 nvidia-driver, cuda, cudnn, tensorflow-gpu를 설치하는 법을 소개합니다."
tags: ["ubuntu16.04", "cuda", "cudnn", "tensorflow-gpu", "환경설치", "딥러닝"]
image: /assets/images/posts/how-to-install-tensorflow-gpu-in-ubuntu16.04/image3.png
draft: "no"
---

{:.center}
![image1.png](/assets/images/posts/how-to-install-tensorflow-gpu-in-ubuntu16.04/image3.png)

# Background

딥러닝을 공부할 때 모든 분들이 겪는 첫 고통 환경설치입니다. 수시로 변하는 cuda 버전, cudnn 버전 그리고 많은 종류의 gpu 들에 따라서 설치를 하는데에 많은 분들이 고통을 받고 있습니다. 물론 저도 환경을 구성하는데 있어 매번 블로그를 찾아가며 잊었던 기억을 더듬으면서 설치를 하고 있습니다. 매번 설치할 때마다 파편적으로 흩어져 있는 글을 찾아가며 설치하기 때문에 자료를 찾는 시간이 설치하는 시간보다 훨씬 많이 차지합니다. 이를 정리하는 용도도 있으며 이런 고충은 저만 느끼는 것이 아닌 다른 분들도 똑같이 느낄 것으로 생각되어 글을 공유하게 되었습니다. 저희가 사용하는 워크스테이션의 사양은 `TITAN Xp` 2개 이며 모두 12G의 용량을 가지고 있습니다. 보통 nvidia-driver는 최신 버전일수록 대부분의 gpu를 구동할 수 있도록 되어있지만 gpu의 종류에 맞게 드라이버를 설치해야한다는 점 주의하셔야 합니다. 이 글을 통해서 많은 분들이 설치에 쏟는 시간을 절약하여 딥러닝 공부하는데 사용했으면 좋겠습니다.

# Install nvidia-driver on Ubuntu 16.04

가장 흔히 사용되는 OS인 `Ubuntu16.04`에 nvidia-driver를 설치합니다. 추후 nvidia-docker에도 사용될 nvidia-driver이니 2019.07.25 시점으로 가장 최신 버전인 418을 설치합니다.

```
sudo apt-get install nvidia-418
```

위의 설치가 정상적으로 되었다면 아래의 결과를 볼 수 있습니다.
```
xxxx@xxxxx:~$ nvidia-smi
Fri Jul 26 01:17:36 2019       
+-----------------------------------------------------------------------------+
| NVIDIA-SMI 418.67       Driver Version: 418.67       CUDA Version: 10.1     |
|-------------------------------+----------------------+----------------------+
| GPU  Name        Persistence-M| Bus-Id        Disp.A | Volatile Uncorr. ECC |
| Fan  Temp  Perf  Pwr:Usage/Cap|         Memory-Usage | GPU-Util  Compute M. |
|===============================+======================+======================|
|   0  TITAN Xp            On   | 00000000:65:00.0 Off |                  N/A |
|  0%   30C    P8    16W / 250W |      1MiB / 12194MiB |      0%      Default |
+-------------------------------+----------------------+----------------------+
|   1  TITAN Xp            On   | 00000000:B3:00.0 Off |                  N/A |
|  0%   29C    P8     7W / 250W |      1MiB / 12196MiB |      0%      Default |
+-------------------------------+----------------------+----------------------+
                                                                               
+-----------------------------------------------------------------------------+
| Processes:                                                       GPU Memory |
|  GPU       PID   Type   Process name                             Usage      |
|=============================================================================|
|  No running processes found                                                 |
+-----------------------------------------------------------------------------+
```

# Install CUDA 10.0

nvidia-driver를 설치한 후 CUDA를 설치하여야 합니다. 이 또한 nvidia-docker에 사용될 예정이니 nvidia-docker와 호환되는 버전인 10.0을 설치합니다.

먼저 nvidia 홈페이지에서 ubuntu16.04, cuda10.0에 맞는 설치파일을 다운로드합니다.

{:.center}
![image1.png](/assets/images/posts/how-to-install-tensorflow-gpu-in-ubuntu16.04/image1.png)

다음 해당 파일 `cuda-repo-ubuntu1604-10-0-local-10.0.130-410.48_1.0-1_amd64.deb`를 설치한 경로에서 아래의 커맨트를 입력하여 `cuda`를 설치합니다.

```
sudo dpkg -i cuda-repo-ubuntu1604-10-0-local-10.0.130-410.48_1.0-1_amd64.deb
sudo apt-key add /var/cuda-repo-10-0-local-10.0.130-410.48/7fa2af80.pub
sudo apt-get update
sudo apt-get install cuda
```

설치하는 도중 아래의 화면이 보입니다.

```
*****************************************************************************
*** Reboot your computer and verify that the NVIDIA graphics driver can   ***
*** be loaded.                                                            ***
*****************************************************************************
```

서버를 reboot 하라고 하니 reboot합니다.

다음 아래의 커맨으로 정상적으로 설치가 되었는지 확인할 수 있습니다.

```
xxx@xxxx:~$ nvcc --version
nvcc: NVIDIA (R) Cuda compiler driver
Copyright (c) 2005-2019 NVIDIA Corporation
Built on Wed_Apr_24_19:10:27_PDT_2019
Cuda compilation tools, release 10.1, V10.1.168
```

또한 아래의 두 디렉토리가 정상적으로 생성된 것으로도 확인할 수 있습니다.

```
/usr/local/cuda
/usr/local/cuda10.1
```

# Install CUDNN

CUDNN 설치파일을 다운받을 때에는 주의할 점이 있습니다.

* 자신이 어떤 버전의 CUDA를 설치하였나
* OS가 무엇인가

우리는 `cuda 10.0`을 설치하였고 OS는 `ubuntu 16.04`입니다. 그렇기 때문에 아래의 그림처럼 다운로드를 합니다.

{:.center}
![image2.png](/assets/images/posts/how-to-install-tensorflow-gpu-in-ubuntu16.04/image2.png)

압축파일이 생성되며 이 압축을 풀어줍니다.

```
sudo tar -xzvf cudnn-9.0-linux-x64-v7.0.tgz
```

압축을 풀면 cuda라는 폴더가 생성되며 그 안의 파일들을 cuda 설치하면서 생긴 폴더인 `/usr/local/cuda`로 이동합니다.

```
sudo cp include/cudnn.h /usr/local/cuda/include
sudo cp lib64/libcudnn* /usr/local/cuda/lib64
sudo chmod a+r /usr/local/cuda/lib64/libcudnn*
```

아래의 커맨드를 입력했을 때 아래와 같이 출력 되면 정상적으로 이동이 되었다고 할 수 있습니다.
```
xxx@xxxx:~$ cat /usr/local/cuda/include/cudnn.h | grep CUDNN_MAJOR -A 2
#define CUDNN_MAJOR 7
#define CUDNN_MINOR 6
#define CUDNN_PATCHLEVEL 1
--
#define CUDNN_VERSION (CUDNN_MAJOR * 1000 + CUDNN_MINOR * 100 + CUDNN_PATCHLEVEL)
```

# Install tensorflow-gpu 1.14.0

현재 가장 안정적인 버전이라고 볼 수 있는 1.14.0 gpu 버전을 설치합니다.

```
pip install tensorflow-gpu==1.14.0
```

다음 tensorflow를 실행하기 전의 `nvidia-smi`의 모습입니다.

```
Thu Jul 25 21:50:40 2019       
+-----------------------------------------------------------------------------+
| NVIDIA-SMI 418.67       Driver Version: 418.67       CUDA Version: 10.1     |
|-------------------------------+----------------------+----------------------+
| GPU  Name        Persistence-M| Bus-Id        Disp.A | Volatile Uncorr. ECC |
| Fan  Temp  Perf  Pwr:Usage/Cap|         Memory-Usage | GPU-Util  Compute M. |
|===============================+======================+======================|
|   0  Tesla V100-PCIE...  Off  | 00000000:18:00.0 Off |                    0 |
| N/A   23C    P0    22W / 250W |     11MiB / 16130MiB |      0%      Default |
+-------------------------------+----------------------+----------------------+
|   1  Tesla V100-PCIE...  Off  | 00000000:AF:00.0 Off |                    0 |
| N/A   21C    P0    22W / 250W |     11MiB / 16130MiB |      0%      Default |
+-------------------------------+----------------------+----------------------+
                                                                               
+-----------------------------------------------------------------------------+
| Processes:                                                       GPU Memory |
|  GPU       PID   Type   Process name                             Usage      |
|=============================================================================|
|  No running processes found                                                 |
+-----------------------------------------------------------------------------+
```

저희는 2개의 gpu를 사용하고 있으며 두 개의 gpu 모두에 아무 프로세스가 할당 되지 않은 것을 볼 수 있습니다.

하지만 아래의 파이썬을 실행 시키면
```
>>> import tensorflow as tf
>>> sess = tf.Session()
2019-07-25 21:47:09.531988: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcuda.so.1
2019-07-25 21:47:09.566605: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1640] Found device 0 with properties: 
...
StreamExecutor device (1): Tesla V100-PCIE-16GB, Compute Capability 7.0
2019-07-25 21:47:10.031416: I tensorflow/core/platform/profile_utils/cpu_utils.cc:94] CPU Frequency: 2294590000 Hz
2019-07-25 21:47:10.038987: I tensorflow/compiler/xla/service/service.cc:168] XLA service 0x5586eb2981d0 executing computations on platform Host. Devices:
2019-07-25 21:47:10.039032: I tensorflow/compiler/xla/service/service.cc:175]   StreamExecutor device (0): <undefined>, <undefined>
2019-07-25 21:47:10.039262: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1181] Device interconnect StreamExecutor with strength 1 edge matrix:
2019-07-25 21:47:10.039282: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1187]
```

```
Thu Jul 25 21:53:01 2019       
+-----------------------------------------------------------------------------+
| NVIDIA-SMI 418.67       Driver Version: 418.67       CUDA Version: 10.1     |
|-------------------------------+----------------------+----------------------+
| GPU  Name        Persistence-M| Bus-Id        Disp.A | Volatile Uncorr. ECC |
| Fan  Temp  Perf  Pwr:Usage/Cap|         Memory-Usage | GPU-Util  Compute M. |
|===============================+======================+======================|
|   0  Tesla V100-PCIE...  Off  | 00000000:18:00.0 Off |                    0 |
| N/A   24C    P0    35W / 250W |    316MiB / 16130MiB |      0%      Default |
+-------------------------------+----------------------+----------------------+
|   1  Tesla V100-PCIE...  Off  | 00000000:AF:00.0 Off |                    0 |
| N/A   22C    P0    34W / 250W |    316MiB / 16130MiB |      0%      Default |
+-------------------------------+----------------------+----------------------+
                                                                               
+-----------------------------------------------------------------------------+
| Processes:                                                       GPU Memory |
|  GPU       PID   Type   Process name                             Usage      |
|=============================================================================|
|    0      3668      C   python                                       305MiB |
|    1      3668      C   python                                       305MiB |
+-----------------------------------------------------------------------------+
```

프로세스가 할당되는 것을 볼 수 있습니다.

이와 같이 설치를 완료하고 gpu가 가속시켜주는 tensorflow를 사용하시면 됩니다.