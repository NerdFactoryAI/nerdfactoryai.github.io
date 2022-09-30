---
layout: post
title: "Gatsby를 어떻게 적용할 수 있을까? (+ gatsby에 typescript 적용하기)"
author: ["조현준"]
date: 2022-06-24
abstract: "이번 포스팅에서는 Gatsby.js에 대해서 간단히 소개하고 어떻게 적용할 수 있는지, 우리는 어떻게 적용했고 어떻게 사용하려 하는지에 대해서 소개하려고 합니다. 추가로 gatsby 프로젝트에 TypeScript을 사용하기 위한 환경을 구성하는 내용을 담고있습니다."
tags: ["React", "Typescript", "Gatsby"]
image: /assets/images/posts/2021-07-01-You-Only-Look-Once-YOLO/yolo.png
draft: "no"
---

# 들어가며

이번 포스팅에서는 Gatsby.js에 대해서 간단히 소개하고 어떻게 적용할 수 있는지, 우리는 어떻게 적용했고 어떻게 사용하려 하는지에 대해서 소개하려고 합니다. 추가로 gatsby 프로젝트에 TypeScript을 사용하기 위한 개발환경을 세팅하는 내용을 담고있습니다.

## Gatsby.js

![gatsby](/assets/images/posts/2022-09-30-setting-gatsby-with-typescript/gatsby-logo.png)
_정적 웹사이트 생성기_

Gatsby는 프론트엔드 라이브러리 React를 기반으로 하며 최근 프론트엔드 시장에서 자주 등장하며 빠르게 성장하고 있는 **JAM Stack** 기반의 **정적 사이트 생성 프레임워크** 입니다.

### JAM Stack과 동작원리

[JAM Stack 공식문서](https://jamstack.org/)에서는 아래와 같이 정의하고 있습니다.

> Fast and secure sites and apps delivered by pre-rendering files and serving them directly from a CDN, removing the requirement to manage or run web servers.
>
> 웹 애플리케이션에서 렌더링 할 화면을 pre-rendering 하고 이를 CDN에서 제공하여 빠르고 안전한 앱으로서, 웹 서버를 따로 관리하거나 실행할 필요가 없다.

일반적인 웹사이트는 프론트엔드의 시각화와 백엔드의 데이터를 통해서 웹페이지를 사용자에게 보여주게 됩니다. 위 방법은 페이지를 렌더링할때마다 해당 과정이 필요하기 때문에 페이지를 로딩하는데 시간이 오래걸립니다. **렌더링 + API 통신** 단계를 거치기 때문이죠

하지만 Jamstack은 모든 데이터를 서버에서 미리 불러와서 화면으로 만들어 놓은 다음, 사용자가 홈페이지에 접속하게 되면 만들어 놓은 화면을 그려줍니다. 그렇기 때문에 빠른 로딩 속도를 장점으로 가지고 갈 수 있습니다.

이와 같은 장점을 가지고 있는 Jam Stack을 기반으로 하는 대표적인 프레임워크로는 많이 다운로드 된 순으로 **Next, Gatsby, Jekyll, Nuxt** 등 \*\*\*\*이 있습니다.

## 우리는 왜 Gatsby를 사용하려고 하는가

### 1. React.js 기반 프레임워크이다

너드팩토리의 프론트엔드 챕터에서는 React + TypeScript를 가장 활발하게 사용하고 있습니다. 그렇기 때문에 react를 어느정도 다룰 수 있다면 큰 어려움 없이 개발 가능할 것이라 생각했습니다.

### 2. 성능이 좋다

JavaScript가 실행되면 빈 HTML 페이지 안에 마크업을 추가해주는 일반적인 React SPA(Single Page Application)과는 다르게, 페이지 개발 후 Build를 하는 과정에서 마크업이 생성되기 때문에 SPA 페이지보다 빠르게 페이지를 렌더링 할 수 있습니다.

### 3. SEO에 유리하다.

위 2번 단락과 이어서 build 과정에서 마크업이 생성됩니다. 그 결과로 페이지 내 모든 콘텐츠가 생성이 되어있게 되는 것이고, SPA과는 다르게 SEO(검색엔진최적화)에 유리합니다.

JAM Stack 프레임워크 다운로드 횟수를 보면 Next.js가 가장 많이 다운로드 되었지만, Next.js는 정적 사이트 생성의 기능도있지만 주로 SSR(Server Side Rendering)을 사용하는 프레임워크입니다. 즉, 서버와 통신을 하며 요청을 받을 때 마다 동적으로 웹사이트를 생성하기 때문에 SEO에 불리하다는 단점이 있습니다.

이와 같은 장점을 가지고 있는 Gatsby는 너드팩토리의 **웹사이트의 사용자 행동데이터 분석 도구 서비스 VODA**의 소개페이지에도 적용되어 있습니다.

![voda](/assets/images/posts/2022-09-30-setting-gatsby-with-typescript/voda-landing-page.png)
_VODA 서비스 소개페이지 ← 클릭_

## Gatsby 기술 스택을 어떻게 잘 사용할수 있을까

### 기술 블로그 마이그레이션

지금까지 설명한 gatsby의 장점을 통해서 우리는 gatsby를 통해 기술블로그를 마이그레이션 및 개편하려는 계획을 가지고 있습니다.

기존의 너드팩토리의 기술블로그는 github pages를 이용해 jekyll 기반의 정적 사이트를 배포하는 방식으로 구성되어 있습니다. 따라서 아래의 문제점으로 기술블로그에 대한 지속적인 관리와 커스터마이징이 어렵습니다.

- 너드팩토리 프론트엔드 챕터는 React 기술 스택을 주로 사용한다.
- 간단하고 쉽게 사용가능하지만, Ruby 기반인 jekyll의 구조와 Ruby에 익숙하지 않은 이상 커스터마이징에 어려움이 있습니다.
- Ruby에 대한 지식(Bundler, Gemfile)이 필요한 경우가 있기에 어려움이 발생할 수 있습니다.

# Gatsby에 TypeScript 적용하기

지금까지 설명한 gatsby에 typescript를 통해 개발을 할 수 있도록 개츠비 프로젝트에 typescript를 플러그인을 사용하여 적용해 봅시다.

해당 포스트에서는 아래 버전을 따릅니다.

- node version: 16.13.1
- Gatsby CLI version : 4.22.0

### Install

- gatsby-cli install

```bash
yarn global add gatsby-cli
```

- 프로젝트 생성

```bash
gatsby new [프로젝트 이름]
```

- 해당 프로젝트에서 typescript install

```bash
yarn add gatsby-plugin-typescript
```

이까지 설치가 완료되었다면 타입스크립트를 사용하기 위해 gatsby 프로젝트에 타입스크립트 플러그인을 추가해주는 작업이 필요합니다

```jsx
plugins: [
	...,
	`gatsby-plugin-typescript`,
	{
		...,
	},
],
```

gatsby는 많은 플러그인을 지원하여 확장성이 좋다는 장점을 가지고 있습니다. 만약 내가 필요한 기능이 있다면 플러그인을 추가하면 됩니다! (해당 포스트에서는 타입스크립트 플러그인을 적용하는 것 까지 진행합니다.)

플러그인 추가 후 tsconfig.json 파일을 생성하여 타입스크립트를 활성화 합니다. 해당 명령어를 입력했다면 루트 디렉터리에 tsconfig.json 파일이 생성되며, 주석 처리 되어있는 옵션을 직접 선택하여 변경할 수 있습니다. 해당 포스트에서는 다음과 같이 옵션을 수정하겠습니다

```bash
yarn tsc --init
```

tsconfig.json 파일을 사용하려는 환경에 맞춰 세팅해줍니다.

```json
{
  "compilerOptions": {
    /* Language and Environment */
    "target": "es2016",
    "jsx": "preserve",

    /* Modules */
    "module": "commonjs",
    "baseUrl": "./src",
    "paths": {
      "components/*": ["./components/*"],
      "utils/*": ["./utils/*"],
      "hooks/*": ["./hooks/*"],
      "icons/*": ["../static/icons/*"]
    },
    "resolveJsonModule": true,
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,

    /* Type Checking */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,

    /* Completeness */
    "skipLibCheck": true
  },
  "include": ["src"],
  "exclude": ["node_modules"]
}
```

gatsby-node.js 파일에서 webpack config를 추가합니다.

```jsx
const path = require(`path`)
const { createFilePath } = require(`gatsby-source-filesystem`)

exports.onCreateWebpackConfig = ({ getConfig, actions }) => {
  const output = getConfig().output || {}

  actions.setWebpackConfig({
    output,
    resolve: {
      alias: {
        components: path.resolve(__dirname, "src/components"),
        utils: path.resolve(__dirname, "src/utils"),
        hooks: path.resolve(__dirname, "src/hooks"),
      },
    },
  })
}
...
```

여기까지 진행했다면 문제없이 gatsby 프로젝트에 타입스크립트를 적용이 완료되었으며 타입스크립트로 개발이 가능한 상태입니다.

# 마치며

해당 포스팅을 작성하면서 얼른 너드팩토리 기술블로그 마이그레이션 및 개편을 완료하고 싶다는 생각이 듭니다. 더불어 기술블로그 뿐만 아니라 제품 소개페이지, 너드팩토리 소개페이지 까지 적용해보고 싶습니다.

다음 포스팅에는 Gatsby를 통해 기술블로그를 개편하는 과정을 가지고 돌아오도록 하겠습니다.
