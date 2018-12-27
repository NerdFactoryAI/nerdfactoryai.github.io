---
layout: post
title:  "React 에서 pdf 문서 생성 및 편집 하기"
author: ["황종택"]
date:   2018-12-26 05:00:01 -0600
abstract: "pdf 활용 on React.pdf 활용 on React.pdf 활용 on React.pdf 활용 on React.pdf 활용 on React.pdf 활용 on React.pdf 활용 on React.pdf 활용 on React.pdf 활용 on React.pdf 활용 on React.pdf 활용 on React.pdf 활용 on React.pdf 활용 on React.pdf 활용 on React.pdf 활용 on React.pdf 활용 on React.pdf 활용 on React.pdf 활용 on React.pdf 활용 on React.pdf 활용 on React.pdf 활용 on React.pdf 활용 on React.pdf 활용 on React.pdf 활용 on React.pdf 활용 on React.pdf 활용 on React.pdf 활용 on React.pdf 활용 on React.pdf 활용 on React.pdf 활용 on React.pdf 활용 on React.pdf 활용 on React.pdf 활용 on React."
tags: ["blog", "post", "github.io", "Jekyll"]
image: /assets/images/posts/writing-post-on-jekyll-based-blog/jekyll-logo.png
draft: "no"
---

{:.center}
![concept.png](/assets/images/posts/writing-post-on-jekyll-based-blog/jekyll-logo.png)
*Static Blog Framework 인 Jekyll 의 로고*

# Abstract

pdf 활용 on React.pdf 활용 on React.pdf 활용 on React.pdf 활용 on React.pdf 활용 on React.pdf 활용 on React.pdf 활용 on React.pdf 활용 on React.pdf 활용 on React.pdf 활용 on React.pdf 활용 on React.pdf 활용 on React.pdf 활용 on React.pdf 활용 on React.pdf 활용 on React.pdf 활용 on React.pdf 활용 on React.pdf 활용 on React.pdf 활용 on React.pdf 활용 on React.pdf 활용 on React.pdf 활용 on React.pdf 활용 on React.pdf 활용 on React.pdf 활용 on React.pdf 활용 on React.pdf 활용 on React.pdf 활용 on React.pdf 활용 on React.pdf 활용 on React.pdf 활용 on React.pdf 활용 on React.pdf 활용 on React.

# 마크다운

마크다운으로 글을 작성하는 것은 GUI(그래픽 사용자 인터페이스)가 제공되는 워드프로세서와 같은 전문 작성 도구를 이용하는 것과는 완전히 다른 경험을 하게 됩니다.

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

상기의 예시처럼 마크다운의 각 구성요소는 정해진 양식을 이용하여 작성되며 작성된 글은 각각의 요소 형식(마크다운 문법)에 따라 자동으로 양식에 맞춰 출력되게 됩니다. 이는 굳이 GUI가 없더라도 손 쉽게 글을 작성할 수 있게 도와줍니다.

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
- ~~생성한 branch 를 origin repository (github repository) 에 push 합니다.~~ (포스트 작성, 페이지 수정 등을 위한 branch 는 origin 에 push 할 필요가 없어 삭제함.)

## 포스트 생성 및 작성

Jekyll 에서는 `_drafts` 폴더에 마크다운 파일을 추가하는 형태로 포스트를 등록합니다. `_drafts` 폴더에 등록된 포스트는 초안 작성을 위한 파일이며 실제 오픈 시 `_posts` 폴더로 이동하게 됩니다. 이때 마크다운 파일은 정해진 양식으로 이름이 지어져야 합니다. 아래는 마크다운 파일 명명 예시 입니다. 
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

- ~~commit 을 push 합니다.~~ (포스트 작성, 페이지 수정 등을 위한 branch 는 origin 에 push 할 필요가 없어 삭제함.)

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

## merge 된 develop branch 에서 작성한 포스트 테스트 하기

현재까지 진행을 마쳤다면 git branch 는 develop 으로 checkout 된 상태 입니다. develop branch 를 master bramch 에 merge 하여 production 에 적용하기 이전에 post가 정상적으로 작성되었는지 테스트를 진행하게 됩니다.

- 개발 환경에서 Jekyll 을 구동하기 위해 Ruby 버전을 확인합니다.

```shell
# ruby --version
ruby 2.3.7p456 (2018-03-28 revision 63024) [universal.x86_64-darwin18]
```

- ruby가 설치되어 있지 않다면 ruby website의 안내를 통해 ruby를 설치합니다. [Ruby Installation Page Link](https://www.ruby-lang.org/en/documentation/installation/)

- nerdfactory.github.io 가 clone 된 디렉토리로 이동하여 gem bundler 를 설치합니다.

```shell
# cd nerdfactory.github.io
# gem install bundler
```

- bundle 을 설치합니다.

```shell
# bundle install
Fetching gem metadata from https://rubygems.org/............
Fetching version metadata from https://rubygems.org/...
Fetching dependency metadata from https://rubygems.org/..
Resolving dependencies...
```

- --drafts 옵션과 함께 jekyll 개발서버를 실행합니다.

```shell
# bundle exec jekyll serve --drafts
Configuration file: /Users/jthwang/JekyllProjects/nerdfactoryai.github.io/_config.yml
            Source: /Users/jthwang/JekyllProjects/nerdfactoryai.github.io
       Destination: /Users/jthwang/JekyllProjects/nerdfactoryai.github.io/_site
 Incremental build: disabled. Enable with --incremental
      Generating...
       Jekyll Feed: Generating feed for posts
```

- 작성한 포스트를 확인 합니다.

# Conclusion

본 포스트는 서두에서도 언급 햇듯이 Jekyll + Git Repository based Blog 에서의 Post 작성을 비개발자도 쉽게 접근할 수 있도록 설명하고자 했습니다. GIT 의 개념을 익혀야 하고 CLI (Command Line Interface) 를 사용해야 하며 독자의 개발환경에 따라 오류가 발생할 수도 있습니다. 또한 위 방법 외에도 Post 를 작성할 수 있는 다른 방법도 존재합니다. 하지만 본문에서 설명한 내용이 Jekyll 로 작성되어 Github 에서 hosting 되는 수많은 Blog 들의 작동원리를 이해하는데 도움이 되리라 생각합니다. 오류, 문의사항, 토론은 언제든지 환영합니다. 감사합니다.