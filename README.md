# 너드팩토리 기술 블로그

본 저장소는 너드팩토리의 기술블로그 입니다.

# Stack

- Jekyll

# Build

`master` 브랜치에 Merge 시 자동으로 github 을 통해 빌드 및 배포됩니다.

# Development Env

링크 [http://jekyllrb-ko.github.io/docs/] 를 통해 Ruby 와 Jekyll 을 설치합니다.

아래 명령어를 통해 개발서버를 실행합니다.

```
bundle exec jekyll server
```

# Posts

포스트가 작성되는 위치와 작명 규칙은 아래와 같습니다.

```
/_posts/YYYY-MM-DD-post-name.md
```

# Data

저자 명 등 참조 데이터는 아래 위치에 존재합니다.

```
/_data/
```

# Assets

포스트 이미지는 아래 위치에 저장합니다. 특히 포스트 마크다운 파일 명과 동일한 이름으로 폴더를 생성하여 이미지를 저장합니다.


```
/_posts/YYYY-MM-DD-post-name.md
/assets/images/posts/post-name/0.png
```

