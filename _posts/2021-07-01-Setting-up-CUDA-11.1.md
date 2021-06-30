---
layout: post
title: "Ubuntu 20.04 LTS (CLI-Server)에 CUDA 11.1 GPU 가속 연산 환경 세팅 하기"
author: ["조은성"]
date: 2021-04-30
abstract: "딥러닝 개발 환경 설정은 GPU 장비의 모델명이나 Nvidia-Driver 의 호환성, CUDA 지원 정보 및 Pytorch/TensorFlow 버전 등등... 파편적으로 흩어져 있는 글을 찾아가며 상호 호환성 확인을 하고 설치하기 때문에 자료를 찾는 시간이 실제 환경 설정하는 시간보다 훨씬 길어지게 됩니다."
tags: ["CUDA", "Nvidia-Driver", "Pytorch", "TensorFlow", "Ubuntu 20.04 LTS"]
image: /assets/images/posts/2021-07-01-Setting-up-CUDA-11.1/0.png
draft: "no"
---

# 개요

GPU 가속을 활용한 딥러닝 연산 및 학습을 위해선, 적절한 환경 설정이 필요합니다.

딥러닝 개발 환경 설정은 GPU 장비의 모델명이나 Nvidia-Driver 의 호환성, CUDA 지원 정보 및 Pytorch/TensorFlow 버전 등등... 파편적으로 흩어져 있는 글을 찾아가며 상호 호환성 확인을 하고 설치하기 때문에 자료를 찾는 시간이 실제 환경 설정하는 시간보다 훨씬 길어지게 됩니다.

이러한 시간 낭비를 줄이고, 저희와 유사한 환경에 계신 다른 분들의 유연한 환경 설정을 돕고자 내용을 작성하게 되었습니다.

특히 일반적으로 개인이 많이 쓰는 GUI 버전의 Ubuntu 가 아닌 CLI(Server 용) Ubuntu 의 경우, GUI 출력에 사용되는 불필요한 패키지를 배제하고 설치하여 패키지 최적화를 할 수 있습니다.

참고 : 너드팩토리의 딥러닝 연구 장비 환경

```yaml
# 기본 장비 환경
OS: Ubuntu 20.04 LTS CLI-Server
GPU-Model: RTX 2080 Ti * 6

# 설치 할 CUDA 환경
Nvidia-Driver: 450.119.03 # nvidia-headless-450-server
CUDA-Driver: 11.1 # cuda-toolkit-11-1
cudnn: 8.2.0 # cuda-toolkit-11-1
```

# 1. 전체 시스템 호환성 확인

딥러닝에 GPU 가속을 활용하기 위해선
아래 명시된 4가지 항목 사이의 상호 버전 호환성이 모두 성립되어야 합니다

- GPU Device
- Nvidia-Driver
- CUDA + cudnn
- AI FrameWork ( Pytorch / TensorFlow )

따라서 이에 대한 시스템 호환 버전을 먼저 파악 해둔 뒤, 정해진 버전을 설치하는게 필요합니다

---

1.  GPU 확인

    먼저 설치된 GPU 장치가 어떤 모델인지 확인합니다

    ```bash
    lspci -k                # 전체 장치 정보 열람
      or
    lspci -k | grep NVIDIA  # 장치 정보가 너무 많아서 파악하기 어려운 경우 NVIDIA 키워드로 필터
    ```

2.  호환성 체크

    - 설치된 GPU 와 OS 버전에 맞는 그래픽 드라이버를 검색하여 적합한 Nvidia-Driver 를 확인
      - [**NVIDIA-Driver 고급 검색**](https://www.nvidia.co.kr/Download/Find.aspx?lang=kr)
    - Nvidia-Driver 와 호환 가능한 CUDA 버전을 확인

      - **Nvidia-Driver & CUDA Check**

      ![0](/assets/images/posts/2021-07-01-Setting-up-CUDA-11.1/0.png)

            ex) CUDA 11.1 을 설치하려면, 450.80.02 보다 최신 버전의 Nvidia-Driver 설치가 필요
            출처  -  [https://docs.nvidia.com/deploy/cuda-compatibility/index.html](https://docs.nvidia.com/deploy/cuda-compatibility/index.html)

    - 설치된 GPU 의 연산 성능에 따른 지원 CUDA 버전을 확인합니다

      - [**GPU Support**](https://en.wikipedia.org/wiki/CUDA#GPUs_supported)

        - 버전 확인 예시

          GeForce RTX 2080 Ti 의 경우, 위 링크의 Compute capability 값이 7.5 이고,

          ```bash
          CUDA SDK 10.0 – 10.2 support for compute capability 3.0 – 7.5
          CUDA SDK 11.0 support for compute capability 3.5 – 8.0
          CUDA SDK 11.1 – 11.3 support for compute capability 3.5 – 8.6
          ```

          로 확인 되므로, 해당 GPU 장비는 CUDA `10.0 – 10.2` , `11.0 – 11.3` 를 설치할 수 있습니다

    - AI FrameWork 의 CUDA 지원 확인

      - **Pytorch**

        [https://download.pytorch.org/whl/torch_stable.html](https://download.pytorch.org/whl/torch_stable.html)

        위 torch_stable 아카이브 링크를 통해 사용하려는 torch 버전과 이를 지원하는 CUDA 버전이 있는지 확인합니다

        ```bash
        예시 )
        cu111/torch-1.8.0%2Bcu111-cp36-cp36m-linux_x86_64.whl 와 같은 경우,
        cuda-11.1 과 torch-1.8.0 을 호환하는 python3.6 버전 용 linux 기반 라이브러리를 지원한다는 의미
        ```

        지원하는 버전 확인 후, 구체적인 설치 명령어는 아래 링크를 통해 확인 가능합니다
        [https://pytorch.org/get-started/previous-versions/](https://pytorch.org/get-started/previous-versions/)

      - **TensorFlow**

![1](/assets/images/posts/2021-07-01-Setting-up-CUDA-11.1/Untitled.png)

# 2. Nvidia-Driver 세팅 for CLI Server

1. Nvidia-Driver 설치 확인

   ```bash
   cat /proc/driver/nvidia/version
     or
   nvidia-smi

   >>>
   # 드라이버 미 설치시 응답
   cat: /proc/driver/nvidia/version: No such file or directory

   # 드라이버가 설치 되어 있는 경우 응답
   NVRM version: NVIDIA UNIX x86_64 Kernel Module  450.119.03  Mon Mar 29 17:51:27 UTC 2021
   GCC version:  gcc version 9.3.0 (Ubuntu 9.3.0-17ubuntu1~20.04)
   # 이미 드라이버가 설치 되어 있는 경우,
   # 호환성 체크 후, 필요에 따라 드라이버 제거 후 맞는 버전으로 재설치 진행합니다
   ```

2. Nvidia-Driver 설치를 위한 패키지 리스트 수집

   ```bash
   # Ubuntu 버전을 "release" 변수 에 저장
   $ release="ubuntu"$(lsb_release -sr | sed -e "s/\.//g")
   $ echo $release
   >>> ubuntu2004

   # Nvidia 아카이브로부터 드라이버 리스트 수집
   $ sudo apt install sudo gnupg
   $ sudo apt-key adv --fetch-keys "http://developer.download.nvidia.com/compute/cuda/repos/"$release"/x86_64/7fa2af80.pub"
   $ sudo sh -c 'echo "deb http://developer.download.nvidia.com/compute/cuda/repos/'$release'/x86_64 /" > /etc/apt/sources.list.d/nvidia-cuda.list'
   $ sudo sh -c 'echo "deb http://developer.download.nvidia.com/compute/machine-learning/repos/'$release'/x86_64 /" > /etc/apt/sources.list.d/nvidia-machine-learning.list'
   $ sudo apt update
   ```

3. 설치하려는 드라이버 확인

   ```bash
   apt-cache search nvidia-driver

   >>>
   nvidia-driver-418 - Transitional package for nvidia-driver-430
   nvidia-driver-435 - Transitional package for nvidia-driver-455
   nvidia-driver-440 - Transitional package for nvidia-driver-450
   nvidia-driver-450 - NVIDIA driver metapackage
   nvidia-driver-450-server - NVIDIA Server Driver metapackage
   nvidia-driver-455 - Transitional package for nvidia-driver-460
   nvidia-driver-460 - NVIDIA driver metapackage
   nvidia-headless-450 - NVIDIA headless metapackage
   nvidia-headless-450-server - NVIDIA headless metapackage
   nvidia-headless-460 - NVIDIA headless metapackage
   nvidia-headless-no-dkms-450 - NVIDIA headless metapackage - no DKMS
   nvidia-headless-no-dkms-450-server - NVIDIA headless metapackage - no DKMS
   nvidia-headless-no-dkms-460 - NVIDIA headless metapackage - no DKMS
   nvidia-driver-418-server - NVIDIA Server Driver metapackage
   nvidia-driver-440-server - Transitional package for nvidia-driver-450-server
   nvidia-driver-460-server - NVIDIA Server Driver metapackage
   nvidia-headless-418-server - NVIDIA headless metapackage
   nvidia-headless-460-server - NVIDIA headless metapackage
   nvidia-headless-no-dkms-418-server - NVIDIA headless metapackage - no DKMS
   nvidia-headless-no-dkms-460-server - NVIDIA headless metapackage - no DKMS
   nvidia-driver-430 - Transitional package for nvidia-driver-465
   nvidia-driver-465 - NVIDIA driver metapackage
   nvidia-headless-465 - NVIDIA headless metapackage
   nvidia-headless-no-dkms-465 - NVIDIA headless metapackage - no DKMS
     ...... (중략)
   ```

   나타난 리스트 중, 우리는 GUI 출력을 전혀 사용하지 않는 서버용 CLI 버전을 설치
   → headless 드라이버를 설치 ( ex. `nvidia-headless-450-server` )

   - 참고

     GUI 가 포함된 일반 데스크탑 버전을 설치하려면 `nvidia-driver-450` 을 설치하면 됩니다
     `nvidia-driver-450` 와 `nvidia-driver-450-server` 는 저장 경로상의 차이만 있을 뿐 패키지 구성은 동일해서 `nvidia-driver-450-server` 를 설치해도 GUI 출력 모듈이 같이 설치되므로 GPU 메모리 자원을 아끼려면 꼭! `nvidia-headless-450-server` 를 설치해야 됩니다

   Ref : [https://linustechtips.com/topic/1263727-installing-nvidia-drivers-on-ubuntu-also-installs-gui-environment/](https://linustechtips.com/topic/1263727-installing-nvidia-drivers-on-ubuntu-also-installs-gui-environment/)

4. 드라이버 설치 후 Reboot

   ```bash
   sudo apt-get install nvidia-headless-450-server
   sudo apt-get install nvidia-utils-450
   sudo apt-get install dkms nvidia-modprobe

   sudo reboot now
   ```

5. 최종 설치 확인

   ```bash
   sudo cat /proc/driver/nvidia/version
     or
   nvidia-smi

   >>>
   NVRM version: NVIDIA UNIX x86_64 Kernel Module  450.119.03  Mon Mar 29 17:51:27 UTC 2021
   GCC version:  gcc version 9.3.0 (Ubuntu 9.3.0-17ubuntu1~20.04)
   ```

Ref : [https://hiseon.me/linux/ubuntu/install_nvidia_driver/](https://hiseon.me/linux/ubuntu/install_nvidia_driver/)

# 3. CUDA & cudnn 세팅 for CLI Server

- 호환성 확인 된 Nvidia-Driver 가 이미 설치 되어 있는것을 전제로 합니다. Nvidia-Driver 가 아직 준비되지 않았다면 해당 드라이버를 먼저 설치 후 진행해주세요

1. CUDA 설치 확인

   ```bash
   ls -l /usr/local | grep cuda

   >>>
   # CUDA 미 설치시 응답
   (응답 내용 없음)

   # CUDA 가 설치 되어 있는 경우 응답
   lrwxrwxrwx  1 root root   22 May  6 10:59 cuda -> /etc/alternatives/cuda
   lrwxrwxrwx  1 root root   25 May  6 10:59 cuda-11 -> /etc/alternatives/cuda-11
   drwxr-xr-x 14 root root 4096 May  6 10:59 cuda-11.1
   ```

2. 설치를 위한 패키지 리스트 수집

   ```bash
   # Ubuntu 버전을 "release" 변수 에 저장
   $ release="ubuntu"$(lsb_release -sr | sed -e "s/\.//g")
   $ echo $release
   >>> ubuntu2004

   # Nvidia 아카이브로부터 드라이버 리스트 수집
   $ sudo apt install sudo gnupg
   $ sudo apt-key adv --fetch-keys "http://developer.download.nvidia.com/compute/cuda/repos/"$release"/x86_64/7fa2af80.pub"
   $ sudo sh -c 'echo "deb http://developer.download.nvidia.com/compute/cuda/repos/'$release'/x86_64 /" > /etc/apt/sources.list.d/nvidia-cuda.list'
   $ sudo sh -c 'echo "deb http://developer.download.nvidia.com/compute/machine-learning/repos/'$release'/x86_64 /" > /etc/apt/sources.list.d/nvidia-machine-learning.list'
   $ sudo apt update
   ```

3. 설치하려는 CUDA 드라이버 확인 및 설치

   ```bash
   apt-cache search cuda

   >>>
   cuda-11-0 - CUDA 11.0 meta-package
   cuda-11-1 - CUDA 11.1 meta-package
   cuda-11-2 - CUDA 11.2 meta-package
   cuda-11-3 - CUDA 11.3 meta-package
     ......
   cuda-toolkit-11-0 - CUDA Toolkit 11.0 meta-package
   cuda-toolkit-11-1 - CUDA Toolkit 11.1 meta-package
   cuda-toolkit-11-2 - CUDA Toolkit 11.2 meta-package
   cuda-toolkit-11-3 - CUDA Toolkit 11.3 meta-package
     ...... (중략)
   ```

   나타난 리스트 중, 우리는 GUI 출력을 전혀 사용하지 않는 서버용 CLI 버전 CUDA 를 설치

   ```bash
   sudo apt install --no-install-recommends cuda-toolkit-11-1
   # --no-install-recommends 옵션을 추가해 GUI 용 패키지는 설치 제외
   ```

   GUI 출력 모듈 배제 및 nvidia-driver 패키지가 업데이트 되어 섞이는 일이 발생하지 않기 위해선,
   꼭! `--no-install-recommends` 옵션이 추가된 `cuda-toolkit-11-1` 을 설치해야 됩니다
   ( GUI 가 포함된 일반 데스크탑 버전을 설치하려면 `cuda-11-1` 을 설치하면 됩니다 )

4. cudnn 드라이버 확인 및 설치

   ```bash
   apt-cache search cudnn

   >>>
   libcudnn7 - cuDNN runtime libraries
   libcudnn7-dev - cuDNN development libraries and headers
   libcudnn8 - cuDNN runtime libraries
   libcudnn8-dev - cuDNN development libraries and headers
     ...... (중략)
   ```

   적합한 cudnn 라이브러리 설치

   ```bash
   sudo apt install libcudnn8-dev
   ```

5. 최종 설치 버전 확인

   - CUDA 확인

     1. 설치된 시스템 경로를 통한 확인

        ```bash
        ls -l /usr/local | grep cuda

        >>>
        # CUDA 미 설치시 응답
        (응답 내용 없음)

        # CUDA 가 설치 되어 있는 경우 응답
        lrwxrwxrwx  1 root root   22 May  6 10:59 cuda -> /etc/alternatives/cuda
        lrwxrwxrwx  1 root root   25 May  6 10:59 cuda-11 -> /etc/alternatives/cuda-11
        drwxr-xr-x 14 root root 4096 May  6 10:59 cuda-11.1
        ```

     2. `nvcc --version` 으로 확인

        해당 명령은 cuda 전체 패키지 - GUI 출력 모듈 포함 - 을 설치 할 때, 자동으로 설정되는 시스템 변수를 통해 cuda version 을 출력하는 명령입니다. 현재 시스템은 CLI Only 이므로 수동으로 시스템 변수를 설정해 줘야, nvcc 를 통한 버전 확인이 가능합니다

        - nvcc 시스템 변수 설정 방법
          1. `$ sudo vi ~/.profile`
          2. 해당 파일의 가장 밑 단락에 아래 내용 추가
             `export PATH=/usr/local/cuda-11.1/bin:$PATH`
             `export LD_LIBRARY_PATH=/usr/local/cuda-11.1/lib64:$LD_LIBRARY_PATH`
          3. `$ source ~/.profile`

        ```bash
        nvcc --version

        >>>
        # 시스템 변수 설정 전, 혹은 CUDA 미 설치시 응답
        Command 'nvcc' not found ~

        # CUDA 가 설치 및 시스템 변수 설정 완료 후 응답
        nvcc: NVIDIA (R) Cuda compiler driver
        Copyright (c) 2005-2020 NVIDIA Corporation
        Built on Mon_Oct_12_20:09:46_PDT_2020
        Cuda compilation tools, release 11.1, V11.1.105
        Build cuda_11.1.TC455_06.29190527_0
        ```

   - cudnn 확인

   ```bash
   whereis cudnn
   >>>
   cudnn: /usr/include/cudnn.h
   # OS에 따라 위치가 다를 수 있음

   # 위에서 검색한 cudnn.h 경로와 동일한 곳의 cudnn_verion.h 에서 탐색
   cat /usr/include/cudnn_version.h | grep CUDNN_MAJOR -A 2
   >>>
   #define CUDNN_MAJOR 8
   #define CUDNN_MINOR 2
   #define CUDNN_PATCHLEVEL 0
     ...... (중략)
   → ( cudnn 8.2.0 ver )
   ```

※ nvidia-smi 를 입력해서 나오는 CUDA 버전은 해당 nvidia-driver 가 지원하는 CUDA 버전을 나타내는 것이지, 실제 서버에 설치된 CUDA 버전을 나타내는것이 아닙니다 ※

# 마무리

지금까지 RTX 2080 Ti 가 탑재된 Ubuntu 20.04 LTS CLI-Server 에 CUDA 환경 설정을 진행해보았습니다.

이후에는 각자 필요한 딥러닝 프레임워크 (Pytorch/TensorFlow) 의 GPU 가속 버전을 설치한 뒤, 실제 GPU 가속이 가능한지 확인해보면 됩니다 (확인 방법은 아래와 같습니다)

이번 포스팅을 통해 환경 설정 때문에 생기는 불필요한 시간 낭비를 줄이고, 빠르게 CUDA 작업 환경을 설정하는데 도움이 되길 기대합니다

### GPU 가속 확인

Pytorch : Pytorch-GPU 버전이 설치된 Python 환경에서 다음 실행

```python
import torch

torch.cuda.is_available()
>>> True  # False 로 출력된다면 GPU 가속 사용이 불가능

torch.version.cuda
>>> '11.1'  # Pytorch 가 인식하고 있는 CUDA 버전

torch.cuda.device_count()      # 사용 가능한 GPU 개수 반환
torch.cuda.get_device_name(0)  # 0번 GPU 장치 모델 > 숫자를 바꿔서 다른 장치 확인 가능
```

TensorFlow : TensorFlow-GPU 버전이 설치된 Python 환경에서 다음 실행

```python
from tensorflow.python.client import device_lib
device_lib.list_local_devices()

# GPU 가속이 가능하다면 사용 가능한 GPU device 가 출력
```

# Reference

- [https://www.nvidia.co.kr/Download/Find.aspx?lang=kr](https://www.nvidia.co.kr/Download/Find.aspx?lang=kr)
- [https://docs.nvidia.com/deploy/cuda-compatibility/index.html](https://docs.nvidia.com/deploy/cuda-compatibility/index.html)
- [https://en.wikipedia.org/wiki/CUDA#GPUs_supported](https://en.wikipedia.org/wiki/CUDA#GPUs_supported)
- [https://linustechtips.com/topic/1263727-installing-nvidia-drivers-on-ubuntu-also-installs-gui-environment/](https://linustechtips.com/topic/1263727-installing-nvidia-drivers-on-ubuntu-also-installs-gui-environment/)
- [https://hiseon.me/linux/ubuntu/install_nvidia_driver/](https://hiseon.me/linux/ubuntu/install_nvidia_driver/)
