---
layout: post
title: "Styled-Components를 이용한 React 컴포넌트 스타일링"
author: ["ict_june"]
date: 2019-10-25
abstract: "'우리아이' 소개페이지를 개발하면서 경험했던 컴포넌트 스타일링 방법과 그 중 React 기반의 'CSS-in-JS'방식 중 하나인 Styled-Components 라이브러리를 소개하려고 합니다."
tags: ["React", "CSS", "Styled-Components"]
image: /assets/images/posts/react-styled-components/0.png
draft: "no"
---

{:.center}
![img0](/assets/images/posts/react-styled-components/0.png)

# Overview

'우리아이' 소개페이지를 개발하면서 경험했던 **컴포넌트 스타일링** 방법과 그 중 React 기반의 **'CSS-in-JS'** 방식 중 하나인 **Styled-Components** 라이브러리를 소개하려고 합니다. 그중 조건부 스타일링을 하는 방법으로 기존의 순수 CSS가 어떤 문제를 가졌는지 파악하고 개선하려는 방법으로 **Styled-Components** 라이브러리는 어떠한 방식으로 작동하는지 코드를 통해서 알아보겠습니다. **개발은 React 환경에서 진행되었습니다.**

# 순수 CSS의 조건부 스타일링

{:.center}
![img1](/assets/images/posts/react-styled-components/1.png)

다음은 Dropdown 버튼을 눌렀을 때 하단으로 Link 메뉴가 등장하는 화면입니다.

## 인라인 형식

```js
const DropdownContent = ({ show }) => (
  <div
    className={
      show ? "dropdown-content  dropdown-content-visible" : "dropdown-content"
    }
  >
    <a href="#">Link 1</a>
    <a href="#">Link 2</a>
    <a href="#">Link 3</a>
  </div>
);

const App = () => {
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };
  return (
    <>
      <div className="dropdown">
        <button className="dropbtn" onClick={toggleDropdown}>
          Dropdown
        </button>
        <DropdownContent show={dropdownVisible} />
      </div>
    </>
  );
};
```

## CSS 클래스 명을 활용한 조건부 스타일링

```js
const App = () => {
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };
  return (
    <>
      <div className="dropdown">
        <button className="dropbtn" onClick={toggleDropdown}>
          Dropdown
        </button>
        <div
          className="dropdown-content"
          style=\{\{ display: dropdownVisible ? "block" : "none" \}\}
        >
          <a href="#">Link 1</a>
          <a href="#">Link 2</a>
          <a href="#">Link 3</a>
        </div>
      </div>
    </>
  );
};
```

## 문제점

가장 대표적인 방법 두 가지를 이용하여 순수 CSS에서 **state 변화에 따른 조건부 스타일링**은 어떤 방식으로 하는지 보았습니다. 여기서 생기는 문제점은 다음과 같습니다.

1. state 값에 따라 스타일을 바인딩 해야 하는 경우
2. props가 많아지고 그에 따른 조건부 스타일링도 많아질 때
3. 거의 같은 형태의 스타일링을 가지고 있으나 일부분만 변경하여 새로운 컴포넌트를 만들어야 할 때
4. 같은 스타일을 가지고 있는 다른 선택자의 경우
5. 색상 값과 같은 반복되는 키워드가 존재할 때

이러한 고질적인 CSS의 문제점 때문에 CSS 클래스가 많아 질 수도 있고 인라인 스타일링 길이가 길어질 수도 있습니다.

# CSS 전처리기 - Sass

CSS의 언어적 특성과 위의 불편함을 해결하기 위해 **중첩, 변수, 믹스인, 확장 및 로직**을 스타일시트에 구현한 전처리 엔진 형태의 Sass, Less와 같은 CSS 전처리기가 등장했습니다.

## Sass의 효율적인 CSS 구조 설계

사실 순수 CSS에서 <link/> 태그 혹은 @import 를 사용해서 CSS 파일을 구조화 할 수는 있습니다. 다만 각 CSS 파일 호출이 매번 새로운 HTTP 요청을 발생시키고 성능저하의 원인이 될 수도 있습니다. 그러나 Sass의 @import는 개발 환경에서 많은 CSS 파일이 복잡하게 얽혀있더라도 하나의 스타일시트로 컴파일이 됩니다. 즉 HTTP 요청에 의한 성능 이슈를 해결하였습니다.

결과적으로 CSS의 구조화가 가능해짐에 따라 스타일시트를 한눈에 파악하기 쉬워졌습니다. 협업 관계에서도 스타일시트 구조를 논리적으로 파악할 수 있게 도와줄 수 있습니다.

다음은 Sass를 이용한 스타일시트 구조 트리의 일부분입니다.

```
│  _bootstrap.scss
│  _custom.scss
│  _reset.scss
│  __core.scss
│  __pages.scss
│  __variables.scss
│
├─core
│  │  _animations.scss
│  │  _components.scss
│  │  _forms.scss
│  │  _mixins.scss
│  │  _utilities.scss
│  │
│  ├─animations
│  │      _animations.scss
│  │      _base.scss
│  │      _bubbles.scss
│  │      _floating.scss
│  │
│  ├─components
│  │      _collapse.scss
│  │      _lists.scss
│  │      _nav.scss
│  │      _navbar.scss
│  │
│  ├─forms
│  │      _buttons.scss
│  │      _checkbox.scss
│  │      _form.scss
│  │      _inputs.scss
│  │
│  ├─mixins
│  │      _animations.scss
│  │      _arrow-variant.scss
│  │      _buttons-variant.scss
│  │      _devices.scss
│  │      _font-awesome.scss
│  │      _icons-variant.scss
│  │      _keyframes.scss
│  │      _patterns.scss
│  │      _position.scss
│  │      _sections.scss
│  │      _shapes.scss
│  │
│  └─utilities
│          _background.scss
│          _border.scss
│          _brands.scss
│          _curve-svg-background.scss
│          _devices.scss
│          _gradients.scss
│          _icons.scss
│          _links.scss
│          _misc.scss
│          _mockup.scss
│          _overlay.scss
│          _position.scss
│          _responsive.scss
│          _shapes.scss
│          _spacing.scss
│          _speech-bubble.scss
│          _text.scss
│          _type.scss
```

기타 기능적인 부분은 Styled-Components에서도 지원하기 때문에 Sass를 사용했을 때 문제점만 언급하고 넘어가겠습니다.

## 문제점

그렇다 하더라도 다음과 같은 문제가 있습니다.

1. 정해진 가이드가 없으면 구조가 복잡해진다.
2. CSS 클래스 명에 대한 고민은 여전하다.
3. 스크롤 지옥도 여전하다
4. 여전히 CSS 클래스로 조건부 스타일링을 하고 있다.

실제로 CSS 전처리기를 사용하더라도 CSS의 난해함을 정리하기에는 부족합니다.
이것은 CSS 자체의 문제이기도 합니다. CSS는 변수도 없고, 루프문과 함수사용이 불가합니다. 그런데 요소를 쓰던, 클래스나 id를 쓰던 아니면 그 어떤 선택자를 쓰던 다 받아주는 관대함도 있습니다.

물론 BEM과 같은 CSS 클래스 명을 정의하는 방법론 등이 있지만, 언어 레벨에서 느끼는 불편함은 사라지지 않습니다.

# Styled-Components

Styled-Components는 위의 문제를 해결하려는 방법들 중 하나이며 Tagged 템플릿 리터럴을 이용해 스타일 정보를 실제 CSS 코드를 사용하여 **자바스크립트 파일 안에 스타일을 선언하는 'CSS-in-JS' 방식 중 하나입니다.** (인라인 방식과는 다릅니다.) **컴포넌트와 스타일 간의 매핑을 제거**하고 SASS나 LESS와 같은 전처리기가 제공하는 **프로그래밍적 동작 방식도 제공합니다**.

### 라이브러리 설치

- yarn add styled-components

## Basic

더 이상 HTML 요소에 스타일을 입힐 필요도, 클래스 명과 HTML 요소를 기반으로 컴포넌트를 만들 필요가 없습니다.

### 순수 CSS

![img2](/assets/images/posts/react-styled-components/2.png)

### Styled-Components

![img3](/assets/images/posts/react-styled-components/3.png)

위의 두 방식을 비교해 보면 그다지 차이가 없다고 느낄 수도 있지만 일단 Styled-Components를 사용했을 때 CSS 클래스를 사용하지 않는다는 것을 중요시 봐야합니다.

우선 CSS는 구조와 스타일을 분리하려는 방법입니다.
그 구조와 연결고리를 하는 역할인 클래스 계층을 없애 버리는 방식은 처음 접하는 입장에서는 직관적인 방법이 아니라고 생각이 들 수 있습니다. 그렇지만 스타일과 구조의 분리가 오히려 복잡도의 증가를 일으킬 수 있습니다. 그러나 Styled-Components는 이러한 문제를 자바스크립트의 기능을 이용하여 해결하였습니다.

## Code samples

### Props를 통한 조건부 스타일링

- styled-components를 import해서. js에서 스타일링 할 수 있습니다.
- 여러 개의 CSS 클래스를 사용하여 스타일을 적용하는 것처럼 props를 사용하여 특정 스타일을 부여해줄 수 있습니다.
- & 문자를 사용하여 Sass처럼 자기 자신 선택이 가능합니다.

```javascript
import React from "react";
import styled from "styled-components";

const Container = styled.div`
  background-color: lightgray;
  width: 100%;
  height: 100vh;
`;

const Button = styled.button`
  color: white;
  min-width: 120px;

  /* props로 넣어 준 값을 직접 전달해 줄 수 있습니다. */
  background-color: ${props => props.color || "blue"};

  /* & 문자를 사용하여 Sass 처럼 자기 자신 선택이 가능합니다. */
  &:hover {
    background-color: white;
    color: black;
  }
  & + button {
    margin-left: 1rem;
  }
`;

const App = () => {
  return (
    <Container>
      <Button>버튼1</Button>
      <Button color="red">버튼2</Button>
    </Container>
  );
};

export default App;
```

{:.center}
![img4](/assets/images/posts/react-styled-components/4.png)

### Global Style

- body를 위해서 컴포넌트를 만들 필요가 없습니다.

```javascript
    import React from "react";
    import styled, { createGlobalStyle } from "styled-components";

    const GlobalStyle = createGlobalStyle`
      body {
        margin: 50px;
        padding: 50px;
        background-color: black;
      }
    `;
    ...
    const App = () => {
      return (
        <Container>
          <GlobalStyle />
          <Button>버튼1</Button>
          <Button color="red">버튼2</Button>
        </Container>
      );
    };
    ...
```

{:.center}
![img5](/assets/images/posts/react-styled-components/5.png)

혹은 전역으로 font-family를 다음과 같이 설정할수도 있습니다.

```javascript
const GlobalStyles = createGlobalStyle`
      body {
        @import url('https://fonts.googleapis.com/earlyaccess/notosanskr.css');
        font-family: "Noto Sans KR", sans-serif !important;
      }
    `;
```

### Extension

- 컴포넌트를 재활용하면서 추가 html 태그를 부여하고 싶을 때 기존 컴포넌트를 확장해서 새로운 태그를 만들 수 있습니다.
  ex) 버튼을 앵커, 링크로 사용하고 싶을 때

```javascript
    import React from "react";
    import styled, { createGlobalStyle } from "styled-components";
    ...
    const Button = styled.button`
      color: white;
      min-width: 120px;

      /* props로 넣어 준 값을 직접 전달해 줄 수 있습니다. */
      background-color: ${props => props.color || "blue"};

      /* & 문자를 사용하여 Sass 처럼 자기 자신 선택이 가능합니다. */
      &:hover {
        background-color: white;
        color: black;
      }
      & + button {
        margin-left: 1rem;
      }
    `;
    const Anchor = Button.withComponent("a");
    ...
    const App = () => {
      return (
        <Container>
          <GlobalStyle />
          <Button>버튼1</Button>
          <Button color="red">버튼2</Button>
    			<Anchor href="http://google.com">google</Anchor>
        </Container>
      );
    };
    ...
```

추가로 확장된 태그에 스타일링이 가능합니다.

```javascript
const Anchor = styled(Button.withComponent("a"))`
  color: black;
`;
```

### Animation

- keyframes를 import 합니다. CSS3의 keyframes와 같은 기능입니다. 각 프레임의 스타일을 정의하는 것과 동일합니다.
- props를 통해 rotateAni일 경우 animation CSS가 작동하도록 하였습니다.
- 역시 props를 통해 duration과 같은 속성값을 넘겨줄 수 있습니다.

```javascript
    import React from "react";
    import styled, { createGlobalStyle, keyframes, css } from "styled-components";
    ...
    const rotation = keyframes`
      from{
        transform: rotate(0deg);
      }
      to{
        transform: rotate(360deg);
      }
    `;
    ...
    const Button = styled.button`
      color: white;
      min-width: 120px;

      /* props로 넣어 준 값을 직접 전달해 줄 수 있습니다. */
      background-color: ${props => props.color || "blue"};

      /* & 문자를 사용하여 Sass 처럼 자기 자신 선택이 가능합니다. */
      &:hover {
        background-color: white;
        color: black;
      }
      & + button {
        margin-left: 1rem;
      }

      ${props => {
        if (props.rotateAni) {
          return css`
            animation: ${rotation} ${props.duration}s linear infinite;
          `;
        }
      }}
    `;
    ...
    const App = () => {
      return (
        <Container>
          <GlobalStyle />
          <Button>버튼1</Button>
          <Button color="red" rotateAni duration={2}>
            버튼2
          </Button>
          <Anchor href="http://google.com">google</Anchor>
        </Container>
      );
    };
```

{:.center}
![img6](/assets/images/posts/react-styled-components/6.png)

### Extra Attributes

- custom attribute를 부여하고 싶을 때 attrs 메소드를 사용합니다.

```javascript
    import React from "react";
    import styled, { createGlobalStyle} from "styled-components";
    import resticon from '../../img2/common/restLeft.png';
    ...
    const RestIcon = styled.img.attrs({
      src: resticon,
    })`
      color: white;
      position: absolute;
      top: 37%;
      left: -7%;
      width: 41px;
      height: 33px;
    `;

    const App2 = () => {
      return (
        <Container>
          <GlobalStyle />
          <RestIcon />
        </Container>
      );
    };
```

### Nesting

- 특정 부모 컴포넌트에서 자식 컴포넌트는 스타일 속성을 특정하게 부여받을 수 있습니다.

```javascript
    const Card = styled.div`
      background-color:white;
    `
    ...
    const Container = styled.div`
      height: 100%;
      width: 100vh;
      background-color: yellow;
      ${Card}{
        background-color: blue;
      }
    `
```

### Mixin and Group

- CSS 그룹을 의미합니다.
- 다중 상속이 가능하므로 재사용 가능한 스타일들을 유연하게 사용할 수 있습니다.
- CSS 키워드로 CSS 블록을 만들고 사용할 컨테이너에서 적용 가능하며 재사용 가능합니다.

```javascript
const Sticky = css`
  position: fixed !important;
  background-color: white;
  border-bottom: 1px solid rgba(0, 0, 0, 0.11);
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.11);
  transition: all 0.6s ease-in-out;
  color: black;
`;
const Navigation = styled.nav`
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  z-index: 1030;
  background-color: transparent;
  min-height: 70px;
  transition: all 0.3s ease 0s;
  display: flex;
  align-content: center;
  padding: 0;
  flex-flow: row nowrap;
  justify-content: flex-start;
  ${Sticky}
`;
```

아래와 같이 Mixin을 만들 수도 있습니다.

파라미터를 설정할 수 있고 실제 사용하는 컴포넌트에 따라 파라미터를 변경하면서 스타일을 간단하게 변경할 수 있습니다.

실제로 디자이너가 10개의 모양과 색상이 다른 원 모양의 디자인을 주문할 때 순수 CSS라면 많은 CSS 클래스를 만들어야 하지만 Mixin을 이용하면 간단하고 직관적으로 스타일을 할 수가 있습니다.

{:.center}
![img7](/assets/images/posts/react-styled-components/7.png)

```javascript
const RingVariant = (radius, stroke = "10") => css`
  position: absolute;
  border-radius: 50%;
  height: ${radius * 2}px;
  width: ${radius * 2}px;
  border: ${stroke}px solid rgba(0, 0, 0, 0.5);
`;
```

```javascript
const ShapeRing1 = styled.div`
  ${RingVariant(40, 15)};
  top: 30%;
  left: 0;
  transform: translateX(-50%);
`;

const ShapeRing2 = styled.div`
  ${RingVariant(60, 15)};
  top: 15%;
  left: 0;
  transform: translateX(50%);
`;
```

또한 Mixin을 만들때 디폴트값을 주어 파라미터가 없어도 디폴트한 디자인을 생성할 수 있습니다.

### 컴포넌트의 재활용

소개페이지 특성상 원페이지로 작성되고 폼마다 좌우 마진이 일정하고 반복되는 스타일이 많기 때문에 재활용에 가장 큰 이점을 가집니다. 더는 CSS 코드를 컴포넌트별로 불필요하게 생산할 필요가 없습니다.

{:.center}
![img8](/assets/images/posts/react-styled-components/8.png)

{:.center}
![img9](/assets/images/posts/react-styled-components/9.png)

아래 형식으로 스타일된 컴포넌트를 구성하고 랜더링을 하는 컴포넌트들에서 import 하여 사용할수있습니다.

```javascript
export const ContentLayout = styled.div`
      display: block;
      height: 100%;
      max-width: 1220px;
      margin-left: auto;
      margin-right: auto;
`;

export const FeatureTitle = styled.div`
      font-family: Handon3gyeopsal600g;
      font-size: 58px;
      letter-spacing: -2.07px;
`;

export const FeatureDesc = styled.div`
  font-family: Handon3gyeopsal300g;
   color: #454f5d;
   font-size: 38px;
   line-height: 1.39;
   letter-spacing: -1.35px;
`;
```

각 폼마다 좌우가 대칭되어야 하거나 디자인 가이드에 제공되는 스타일 이외의 것이 필요할 때 폼에 맞게 컴포넌트를 수정할 수 있으며 당연히 그렇게 변경된 스타일은 폼 내부에만 적용됩니다.

아래 코드는 스크롤 위치에 따라 bool 값이 props로 넘어오며 그에 따라 애니메이션을 작동시키는 로직입니다.

{:.center}
![img10](/assets/images/posts/react-styled-components/10.png)

### Theme

- 색상 혹은 색상 팔레트를 이용한 글로벌 작업 혹은 글로벌한 정의가 필요한 스타일이 있으면 Redux처럼 사용이 가능합니다.
- ThemeProvider를 import 합니다.
- 모든 컴포넌트를 ThemeProvider에 연결해야합니다.
- 컴포넌트에 props로 글로벌 정의한 스타일을 가져옵니다.

```javascript
theme.js;

const theme = {
  Secondary01: "#323b45",
  Secondary02: "#6d747b",
  Soft_Pink: "#ffa1a3",
  Inactive_Button: "#f5f5f5",
  Placeholder_Text: "#b6b9bd",
  Cancle_Text: "#8a8c8f",
  Status_Critical: "#ff3b30",
  White: "#ffffff",
  Black: "#000000"
};

export default theme;
```

```javascript
import React from "react";
import styled, { createGlobalStyle, ThemeProvider } from "styled-components";
import theme from "./theme";

const GlobalStyle = createGlobalStyle`
      body {
        margin: 0px;
        padding: 0px;
      }
    `;
const Container = styled.div`
  height: 100%;
  width: 100vh;
`;

const Button = styled.button`
  border-radius: 30px;
  padding: 25px 15px;
  background-color: ${props => props.theme.Soft_Pink};
`;

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <Container>
        <GlobalStyle />
        <Button>hello</Button>
      </Container>
    </ThemeProvider>
  );
};

export default App;
```

### Styled-theming

theme을 보다 쉽게 관리할수있는 Styled-Components의 확장 tool입니다.

예를 들어 요소를 같이 전달 해줄 수 있기 때문에 Light vs Dark mode에 대한 솔루션이 될 수 있습니다.

각 모드의 색상을 미리 정의하고 props값 단 하나의 변화로 전역으로 설정된 모든 컴포넌트의 색상이 해당 모드에 맞게 변경됩니다.

{:.center}
![img11](/assets/images/posts/react-styled-components/11.png)

# Result

결과적으로 본문에서 언급한 Sass나 Less를 이용한 CSS 구조 설계와 같은 방식들이 유용하기는 하지만 조건부 스타일링의 방법 등 여전히 제한적인 문제가 있었습니다. 그러나 Styled-Components 라이브러리는 위의 문제들을 해결할 수 있는 방법을 제시하고 있습니다.

다음과 같은 고민을 하고 있는 리액트 개발자라면 Styled-Components를 사용해 볼 것을 추천합니다.

- CSS 작업 시 SASS, LESS 혹은 Webpack을 이용한 구조화 작업에서 시간을 엄청나게 소비한 적이 있을 때
- CSS 파일 새로 만들고, 클래스명 만들고, 컴포넌트에서 CSS 파일을 왔다 갔다 하면서 시간을 소비한 적이 있을 때
- Sass를 좋아하고 Nesting, variable, Mixin을 사용하고 싶을 때

마지막으로 CSS의 계속되는 진화로 인해 개발 방법 또한 바뀌고 있습니다. 순수 CSS, Sass, CSS 모듈, Styled-Components 등으로 발전되는 형태에서 무조건 최신의 기술을 사용해야 하는 법은 없습니다. **개발자의 코드에 최적으로 정의된 스타일링 방법을 따라갈 수는 없다고 생각합니다.** 그럼에도 불구하고 개발자라면 최신의 기술을 알고 추구하는 것이 더 나은 개발자가 되는 길이라고 생각합니다.
