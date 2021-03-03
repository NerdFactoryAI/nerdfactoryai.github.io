---
layout: post
title: "솔루션 납품 자동화하기 - Docker편"
author: ["김기강"]
date: 2021-02-02
abstract: "aivory 검색엔진은 docker를 통해 간단하게 서버에 올려 사용이 가능합니다. 이를 위해 당연히 검색엔진이 납품될 서버에 도커를 설치해야합니다."
tags: ["Docker"]
image: /assets/images/posts/2021-02-02-automating-solution-delivery-docker/0.png
draft: "no"
---

{:.center}
![img0](/assets/images/posts/2021-02-02-automating-solution-delivery-docker/0.png)

aivory 검색엔진은 docker를 통해 간단하게 서버에 올려 사용이 가능합니다.

이를 위해 당연히 검색엔진이 납품될 서버에 도커를 설치해야합니다.

# 기존 설치 방법 - 매뉴얼 따라가기

도커를 설치하는 것은 어렵지 않습니다.

만능 구글에 'docker install'이라고만 쳐도 공식 문서가 나오며
간단한 영어 실력을 발휘해(혹은 마우스 우클릭과 번역 😉), 몇 줄의 코드만 복사 붙여넣기를 하면 도커 설치는 끝납니다.

[Get Docker](https://docs.docker.com/get-docker/)

# 폐쇄망의 경우

솔루션 납품을 위해 서버에 도커를 깔려니, 폐쇄망이라 네트워크를 사용하지 못한다는 충격적인 소식을 전달 받았습니다.

다행스럽게도 폐쇄망에서 도커를 사용할 수 있는 방법은 있습니다.
폐쇄망을 위한 방식은 도커를 실행할 수 있는 파일들을 미리 설치해서 옮기면 됩니다.

- Docker

  [Index of linux/static/stable/x86_64/](https://download.docker.com/linux/static/stable/x86_64/)

- Docker Compose

  [Releases · docker/compose](https://github.com/docker/compose/releases)

# 귀찮고 복잡한 설치 방법 → 시간 낭비

폐쇄망이 아니더라도 코드 한줄한줄을 복붙해서 설치하는 방법도 결국 납품건이 많아질수록 시간 낭비의 주범이 될 것입니다.

또한, 이번 방법을 문서로 정리해 남겨둬야하는 귀찮은 일을 해야하고, 추후 폐쇄망 납품을 위해 해당 문서를 찾고 따라하며 시간을 낭비하게 될 것입니다.

이에 자동화를 위해 스크립트를 작성하는 것을 결심하게 되었습니다.

# 개선 - 설치 스크립트 제작

귀찮은 코드 복붙을 한번에 실행 시킬 방법은 매우 간단합니다.
쉘 스크립트로 설치 명령 코드들을 모아둔 뒤, 해당 스크립트를 실행하면 됩니다.

- 일반망

  우선 솔루션이 납품될 서버의 os는 centos와 ubuntu로 두가지 경우가 있습니다.

  도커를 설치하는 코드가 위 두가지 os에서 다르기 때문에 os를 구별해서 명령 코드를 실행시켜야합니다.

  os를 확인하는 것은 여러 방법이 있지만 두가지 os 모두에서 사용할 수 있어야 합니다.
  따라서 os를 확인하기 위한 명령어는 'cat /proc/version'을 사용했습니다.

  ```bash
  OS_CHECK=`cat /proc/version`
  ```

  이때, os가 정확하게 'CentOS 7' 혹은 'Ubuntu' 문자열로 나오는 것이 아니기 때문에

  결과 문자열에서 =~ 를 통해 'centos'나 'ubuntu'가 포함되는지 검사해서 os를 구분했습니다.

  ```bash
  if [[ "$OS_CHECK" =~ "ubuntu" ]] || [[ "$OS_CHECK" =~ "Ubuntu" ]]; then
          sudo apt-get update
          sudo apt-get install apt-transport-https ca-certificates curl gnupg-agent software-properties-common
          curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
          sudo apt-key fingerprint 0EBFCD88 # 안해도 됨
          sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
          sudo apt-get update
          sudo apt-get install docker-ce docker-ce-cli containerd.io
          sudo usermod -aG docker $USER
          sudo service docker restart
          echo "Docker for Ubuntu download complete!"
  elif [[ "$OS_CHECK" =~ "centos" ]]; then
          sudo yum install -y yum-utils
          sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
          sudo yum install docker-ce docker-ce-cli containerd.io
          sudo systemctl start docker
          sudo usermod -aG docker $USER
          sudo service docker restart
          echo "Docker for CentOS download complete!"
  else
          echo "check OS version is ubuntu or centos"
  fi
  ```

  도커 컴포즈는 파일이 경로에 존재만 하면 되기에 비교적 간단합니다.

  ```bash
  echo "Download docker-compose..."
  sudo curl -L "https://github.com/docker/compose/releases/download/1.27.4/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
  sudo chmod +x /usr/local/bin/docker-compose
  sudo ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose
  docker-compose --version
  echo "docker-compose download complete!"
  ```

- 폐쇄망

  폐쇄망의 경우엔 완전 '무'의 상태에서 도커와 컴포즈를 만들어 내는 것은 불가능하기 때문에
  솔루션 패키지 내부에 도커와 도커 컴포즈 파일을 미리 준비했습니다. ('폐쇄망의 경우'의 링크 참고)
  도커를 설치하는 명령어가 os마다 다를 뿐이지 설치하게 되는 파일은 동일합니다. 따라서 폐쇄망에선 os 체크가 필요 없습니다.

  솔루션 패키지의 상위 디렉토리에서 도커를 설치해야하기 때문에 HOME을 설정했습니다.

  ```bash
  HOME=`pwd`
  ```

  도커 파일이 이미 존재하기에 파일을 옮기고 도커를 실행하는 명령어를 이용했습니다.

  ```bash
  echo "Setting docker without internet..."
  cp docker-18.09.0.tgz $HOME/../
  cd ../
  tar -xzf docker-18.09.0.tgz
  sudo cp docker/* /usr/bin/
  sudo dockerd &
  echo "Docker setting complete!"
  ```

  폐쇄망에서 도커를 실행하기 위해서는 기존에 사용하던 service나 systemctl 명령어 대신 'dockerd &' 명령어를 사용해 도커를 실행시켜야합니다.

  이어서 도커 컴포즈 또한 파일이 있기 때문에 일반망 명령어에서 curl을 cp로 바꿔줍니다.

  ```bash
  echo "Setting docker-compose..."
  cd $HOME
  cp docker-compose-Linux-x86_64 /usr/local/bin/docker-compose
  sudo chmod +x /usr/local/bin/docker-compose
  sudo ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose
  docker-compose --version
  echo "docker-compose download complete!"
  ```

  이렇게 일반망과 폐쇄망에서의 도커와 도커 컴포즈를 자동으로 설치, 실행하는 스크립트를 완성하게 되었습니다.

# 마치며

납품에 소요되는 시간을 줄이는 것은 매우 중요합니다.

그를 위한 나의 첫 걸음은 성공적으로 마쳤습니다.

다음 걸음은 색인에 필요한 쿼리를 전달 받으면 따로 다듬어줘야하는 추가 작업이 필요한 경우가 있습니다. 이를 방지하기 위한 확실한 가이드라인을 제작할 예정입니다.

그럼 다음 시간에 또 봅시다 ✋
