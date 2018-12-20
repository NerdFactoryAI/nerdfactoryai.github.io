---
layout: post
title:  "Git 으로 운영중인 Jekyll Blog 에 포스트 작성자로 참여하기"
author: ["황종택"]
date:   2018-12-19 05:00:01 -0600
abstract: "다수의 인원으로 구성된 팀 혹은 조직에서 해당 집단을 대표하는 블로그를 운영하는 경우가 있습니다. 너드팩토리의 경우 특히 마크다운으로 작성되어야 하고 가벼워야 하며 블로그 운영에 필요한 최소한의 기능을 제공하는 프레임워크가 필요했습니다. 이를 만족하는 프레임워크로 github.io 에서 공식적으로 지원하는 Jekyll 을 도입하게 되었습니다. 이번 포스트에서는 Github Repository 로 운영중인 블로그에 포스트 작성자로서 참여하는 방법에 대해 이야기하겠습니다. 본 포스트는 비개발자를 대상으로 작성했습니다. "
tags: ["Jekyll", "blog", "post", "writers"]
image: /assets/images/posts/writing-post-on-jekyll-based-blog/jekyll-logo.png
draft: "no"
---

{:.center}
![concept.png](/assets/images/posts/writing-post-on-jekyll-based-blog/jekyll-logo.png)
*Static Blog Framework 인 Jekyll 의 로고*

# Abstract

다수의 인원으로 구성된 팀 혹은 조직에서 해당 집단을 대표하는 블로그를 운영하는 경우가 있습니다. 너드팩토리의 경우 특히 마크다운으로 작성되어야 하고 가벼워야 하며 블로그 운영에 필요한 최소한의 기능을 제공하는 프레임워크가 필요했습니다. 이를 만족하는 프레임워크로 [github.io](http://github.io) 에서 공식적으로 지원하는 Jekyll 을 도입하게 되었습니다. 이번 포스트에서는 Github Repository 로 운영중인 블로그에 포스트 작성자로서 참여하는 방법에 대해 이야기하겠습니다. 본 포스트는 비개발자를 대상으로 작성했습니다. 

# 마크다운

마크다운으로 글쓰기는 전통적인 워드프로세서를 이용한 글쓰기와 완전히 다릅니다. 정확히는 GUI 환경의 워드프로세서와 작성법이 명확히 구분됩니다. 몇가지 예를 통해 설명하겠습니다. 

```markdown
    #제목1
    ##제목2
    ###제목3

    1. 순서 리스트1
    2. 순서 리스트2
    3. 순서 리스트3

    - 비순서 리스트1
    - 비순서 리스트2

    첫째 문단

    두번째 문단

    > 인용구
```

위 예시와 같이 마크다운의 각 구성요소는 정해진 양식을 이용하여 작성됩니다. 제목, 부제목, 문단 등 글쓰기를 위한 대부분의 요소가 준비되어 있기 때문에 마크다운 문법을 모르더라도 글감만 있다면 Cheat sheet 를 참조하면서 충분히 마크다운 문서를 작성할 수 있습니다.

# 포스트 작성

비 개발자에게 마크다운 이라는 형식은 매우 생소합니다. 마크다운은 일반 텍스트를 편집하는 일종의 방법론이며 정해진 양식 내에서 빠른 글쓰기를 목표로 합니다. 마크다운 작성 방법은 [링크](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet)를 참고해주시기 바립니다. Git 이라는 형상관리 시스템을 이용한다는 특성을 고려하여 아래의 포스트 작성 프로세스를 만들어 보았습니다. 아래 이미지에 기재된 프로세스를 아래에 자세히 서술하겠습니다.

{:.center}
![concept.png](/assets/images/posts/writing-post-on-jekyll-based-blog/image-1.png)
*Jekyll 포스트 작성 프로세스*

아래의 서술은 두가지의 마크다운 에디터로 구분됩니다. Typora 로 포스트를 작성할 경우 작성된 포스트를 블로그 repository 관리자 (황종택) 에게 전달하면 포스트에 반영합니다. Visual Studio Code 를 이용할 경우 GIT 을 통해 직접 포스트를 등록할 수 있으며 이에 대한 자세한 설명을 아래에 서술했습니다.

## 마크다운 작성 환경 세팅

아래의 사항을 순서대로 진행하여 너드팩토리 블로그 포스트를 작성할 준비를 진행합니다. 마크다운 작성을 위한 에디터 설치/세팅을 진행하게 됩니다.

1. [http://github.com](https://github.com/) 계정 생성하기.
2. 너드팩토리 블로그 Repository 관리자(황종택)에게 Git Repository 에 멤버 신청하기
3. 내 PC 에 GIT 설치
    1. Windows
        ```text
        http://msysgit.github.com/
        ```
    1. Mac
        ```text
        http://sourceforge.net/projects/git-osx-installer/
        ```
4. 마크다운 에디터 설치
    1. Typora
        ```text
        https://typora.io/
        ```
    1. Visual Studio Code
        ```text
        https://code.visualstudio.com/
        ```
5. 마크다운 플러그인 설치
    1. Visual Studio Code
        - [https://marketplace.visualstudio.com/items?itemName=DavidAnson.vscode-markdownlint](https://marketplace.visualstudio.com/items?itemName=DavidAnson.vscode-markdownlint)
        - [https://marketplace.visualstudio.com/items?itemName=hbrok.markdown-preview-bitbucket](https://marketplace.visualstudio.com/items?itemName=hbrok.markdown-preview-bitbucket)

## Clone Git Repository

내 PC 의 일정 위치에 블로그 저장소를 Clone 합니다.

```shell
# git clone https://github.com/NerdFactoryAI/nerdfactoryai.github.io
```

블로그 폴더에 git repository가 클론 됩니다.

```shell
# cd nerdfactoryai.github.io
# ls -al
-rw-r--r--   1 jthwang  staff   176B 12  6 14:47 404.html
-rw-r--r--   1 jthwang  staff   577B 12  6 14:47 Gemfile
-rw-r--r--   1 jthwang  staff   6.6K 12  6 14:52 Gemfile.lock
-rw-r--r--   1 jthwang  staff   1.6K 12 18 17:21 _config.yml
drwxr-xr-x   3 jthwang  staff    96B 12 18 17:26 _data
drwxr-xr-x   5 jthwang  staff   160B 12  6 14:47 _includes
drwxr-xr-x   8 jthwang  staff   256B 12 12 11:43 _layouts
drwxr-xr-x   6 jthwang  staff   192B 12 20 11:17 _posts
drwxr-xr-x   8 jthwang  staff   256B 12 12 10:34 _sass
drwxr-xr-x  11 jthwang  staff   352B 12 20 11:11 _site
drwxr-xr-x   6 jthwang  staff   192B 12 18 14:53 assets
-rw-rw-rw-@  1 jthwang  staff   1.1K 12 19 01:28 favicon.ico
-rw-r--r--   1 jthwang  staff   1.1K 12 19 10:25 feed.xml
-rwxr-xr-x@  1 jthwang  staff   2.8K 12 18 16:51 index.md
-rwxr-xr-x   1 jthwang  staff   575B 12  6 14:47 update_bootstrap.sh
```

## Create Git Branch

GIT 은 형상관리를 위해 Branch 라는 개념을 사용합니다. Branch 는 나무의 줄기에서 뻗어나온 가지와 같이 부모 branch 에서 생성됩니다. Branch 생성 시 모든 모든 코드를 수정할 수 있으며, branch 생성/관리자는 필요한 부분만 수정 후 수정사항을 해당 branch 에 반영 (commit) 하고 온라인 repository에 적용 (push)하게 됩니다. 

- master : 실제 블로그에 적용되는 production branch 입니다.
- develop : production 에 적용 전, 모든 변경사항이 종합되는 branch 입니다.
- 작성자가 생성하는 branch : 포스트 작성을 위해 작성자가 직접 생성하는 branch 입니다. develop branch 를 부모로 생성합니다.

{:.center}
![concept.png](/assets/images/posts/writing-post-on-jekyll-based-blog/image-2.png)
*NerdFactory Blog Git 운영 정책*

브랜치 생성은 아래의 절차를 따릅니다.

- develop branch checkout 합니다.
    ```shell
    # git checkout devleop
    ```
- `git status` 명령어를 통해 branch 전환 여부를 확인 합니다.
    ```shell
    On branch develop
    Your branch is up to date with 'origin/develop'.
    
    nothing to commit, working tree clean
    ```
- 포스트 작성을 위한 branch 를 생성합니다. branch 명은 `post/david` `post/sam` 형태로 기술합니다.
    ```shell
    # git branch post/david
    ```
- 생성한 branch 를 origin repository (github repository) 에 push 합니다.
    ```shell
    # git push --set-upstream origin post/sam
    ```

## 포스트 생성 및 작성

Jekyll 에서는 `_posts` 폴더에 마크다운 파일을 추가하는 형태로 포스트를 등록합니다. 이때 마크다운 파일은 정해진 양식으로 이름이 지어져야 합니다. 아래는 마크다운 파일 명명 예시 입니다. 
```
2018-12-12-nerdfactory-documentation-history.md
```
포스트 마크다운 파일 역시 정해진 양식을 지켜서 작성되어야 합니다. 전체 포스트를 아래의 기준으로 나누어 설명합니다. 

- Header
  ```markdown
  ---
  # 수정하지 않습니다.
  layout: post 
  # 포스트 제목을 기재합니다.
  title:  "너드팩토리 개발문서의 변천사" 
  # 저자를 입력합니다. 리스트형태로 복수의 저자를 추가할 수 있습니다.
  author: ["황종택"] 
  # 포스트 공개일을 입력합니다. 파일명의 날짜와 일치해야 하며 미래의 날짜로 입력된 포스트는 공개되지 않습니다.
  date:   2018-12-12 05:00:01 -0600 
  # 블로그 메인페이지에 썸네일과 함께 노출될 텍스트를 입력합니다. 일정 길이를 초과하면 잘려서 표시됩니다.
  abstract: "공적이고 일반적인 소프트웨어 개발 프로젝트는 진행되는 과정에서 문서가 생산 됩니다. 서비스 기획서, 디자인 가이드, API 문서, 인터페이스 정의서 등 소프트웨어 개발의 거의 모든 단계에서 각자의 목적에 맞는 문서가 작성됩니다. 이들 문서는 종이 인쇄물 생산을 위해 워드프로세서로 작성되기도 하고, 프리젠테이션을 위해 프리젠테이션 소프트웨어로 생산되기도 합니다. 각 분야의 문서는 목적을 달성하기 위해 생산/활용 측면에서 발전되어 왔습니다."
  # 태그를 입력합니다.
  tags: ["너드팩토리", "문서화", "개발문서"]
  # 대표 이미지를 입력합니다. 이미지 업로드 위치는 아래에 기술합니다.
  image: /assets/images/posts/nerdfactory-documentation-history/main.jpg
  # 포스트의 초안 여부를 입력합니다. "no" 로 입력할 경우 공개됩니다.
  draft: "yes"
  ---
  # 이곳부터 마크다운 형태의 본문을 입력합니다.
  ```

- 이미지 업로드 : 아래의 경로에 마크다운 파일명과 동일하게 폴더를 생성 후 이미지를 입력합니다.
  ```shell
  # cd assets/images/posts
  # mkdir nerdfactory-documentation-history
  # cd nerdfactory-documentation-history
  # ls -al
  total 1944
  -rw-r--r--@ 1 jthwang  staff   9.7K 12 18 14:29 concept.png
  -rw-r--r--@ 1 jthwang  staff   896K 12 18 14:39 main.jpg
  ```

- 본문 이미지 첨부 방법 : 이미지 경로를 수정합니다. 하단의 `*`로 감싸진 텍스트는 이미지의 캡션 입니다.
  ```text
  {:.center}
  ![concept.png](/assets/images/posts/nerdfactory-documentation-history/concept.png)
  *너드팩토리 개발문서의 발전 과정*
  ```

## 작성된 포스트 commit & push

포스트 작성을 마치게 되면 수정사항을 편집중인 branch에 반영하기 위해 commit, push 를 진행합니다.  또한 branch 의 수정을 마무리 하고 부모 branch 인 develop 브랜치에 merge 해야 합니다. 

- 작성/수정된 post 마크다운 파일을 git으로 확인합니다.
  ```shell
  # git status
  On branch post/sam
  Your branch is up to date with 'origin/post/sam'.

  Changes not staged for commit:
    (use "git add <file>..." to update what will be committed)
    (use "git checkout -- <file>..." to discard changes in working directory)

    modified:   _posts/2018-12-12-nerdfactory-documentation-history.md
  ```

- 작성/수정된 post 마크다운 파일을 commit 대기열에 등록합니다.
  ```shell
  # git add _posts/2018-12-12-nerdfactory-documentation-history.md
  ```

- 대기열에 등록된 포스트를 commit message와 함께 commit 합니다.
  ```shell
  # git commit -m '2018-12-12-nerdfactory-documentation-history.md added'
  ```

- commit 을 push 합니다.
  ```shell
  # git push
  ```

## 완성된 branch 를 develop branch에 merge

post/sam branch 의 변경이 완료되면 해당 branch 를 상위 branch 인 develop 으로 merge 해서 변경사항을 반영해야 합니다. 

- merge 대상 branch 를 checkout 합니다.
  ```shell
  # git checkout develop
  ```

- develop branch 로 checkout 된것을 확인합니다.
  ```shell
  # git status
  On branch develop
  Your branch is up to date with 'origin/develop'.
  
  nothing to commit, working tree clean
  ```

- 변경된 branch 를 develop으로 merge 합니다.
  ```shell
  # git merge post/sam
  Updating 0f6cb6c..83f1eb8
  Fast-forward
  _posts/2018-12-12-nerdfactory-documentation-history.md  | 217 +++++++++++++++++++++++++++++++++++++++++-----------------------------------------------------------------------------
  ```

- 변경사항을 online repository 에 push 합니다.
  ```shell
  # git push
  Total 0 (delta 0), reused 0 (delta 0)
  To https://github.com/NerdFactoryAI/nerdfactoryai.github.io.git
      0f6cb6c..83f1eb8  develop -> develop
  ```

- 신규 포스트가 develop branch 에 적용 되었음을 branch 관리자(황종택) 에게 통보합니다.