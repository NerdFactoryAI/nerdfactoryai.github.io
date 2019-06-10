---
layout: post
title:  "spring MVC에서 JSTL 사용하기"
author: ["luke"]
date:   2019-05-05 09:56:00 -0600
abstract: "JSTL과 EL에 대한 설명과 spring에서 활용하는 방법을 알아보기 위해 검색기능과 검색어 유지, 검색내용 출력 등의 검색페이지에서 사용 가능한 기능을 구현해보도록 하겠습니다."
tags: ["spring", "JSP", "JSTL", "EL","검색페이지"]
image: /assets/images/posts/spring-mvc-jstl/spring_logo.png
draft: "no"	
---

{:.center}
![img1](/assets/images/posts/spring-mvc-jstl/spring_logo.png)

# Intro 

 spring MVC로 검색 페이지를 제작하는 프로젝트를 진행하면서 어려웠던 부분이 view와 controller 간의 데이터 전달과 사용이었습니다. MVC의 개념을 이해하더라도 구체적으로 controller는 model에게 어떻게 값을 지정해주고 view는 model로부터 어떻게 값을 받는지 알기 어려웠기 때문입니다.  또한 프론트엔드 작업을 해본 경험이 별로 없기 때문에 view에서 작동하는 코드를 만드는 데 어려움을 겪었습니다. 

 JSTL과 EL에 대한 설명과 spring에서 활용하는 방법을 알아보기 위해 검색기능과 검색어 유지, 검색내용 출력 등의 검색페이지에서 사용 가능한 기능을 구현해보도록 하겠습니다.

 다음 개발환경에서 작성되었습니다.
 - IDE : STS 3.9.7
 - JSTL : standard1.2.5
 - Servlet : 2.5
 - WAS : Tomcat 8.5

# EL
EL은 Expression language의 약자로 JSP 2.0에 추가된 스크립트 언어입니다. 기존의 <%= %> 같은 스크립트 요소와 자바코드를 \${...}형식으로  보완하는 표현 언어로  JSP처럼 내장 객체를 지원합니다. 내장 객체란 변수선언과 초기화 작업이 내부에서 자동적으로 지원되는 객체로서 참조변수에 바로 접근하는게 가능하게 도와줍니다.

EL에서는 다음과 같은 11개의 객체를 제공합니다.



| 내장객체         | 설명                                     |
| ---------------- | ---------------------------------------- |
| pageScope        | page영역에 존재하는 객체를 참조          |
| requestScope     | request 영역에 존재하는 객체의 참조      |
| sessionScope     | session 영역에 존재하는 객체의 참조      |
| applicationScope | application 영역에 존재하는 객체의 참조  |
| param            | 요청 파라메타 값을 단일 값으로 반환      |
| paramValues      | 요청 파라메타의 값을 배열로 반환         |
| header           | 요청 헤더명의 정보를 단일 값으로 반환    |
| headerValues     | 요청 헤더명의 정보를 배열로 반환         |
| cookie           | 쿠키명의 값을 반환                       |
| initParam        | 컨텍스트의 초기화 매개변수명의 값을 반환 |
| pageContext      | PageContext 객체를 참조할 때             |



 - EL 사용예제 
	  request.getParameter("name");
	   ->  \${param.name} 
	
 - EL  객체 접근 예제
	 - \${member.name} 
	 도트연산자를 통해 member 객체에서 name이라는 속성의 값을 가진 key의 value를 가져올 수 있습니다.
	 - \${member["name"]}
	문자열로 표현 할 수도 있으면 []를 이용하여 사용합니다. 이때는 해당 문자열과 일치하는 키의 값을 가져옵니다.
	
 -	JSP 내부객체 접근 순서
	 **page -> request -> session -> application**
	
	애트리뷰트의 이름이 같은 경우 위와 같은 순서로 검색하여 접근합니다.
	
	또는 다른 영역에 중복된 이름이 있다면 ${requestScope.member.name} 와 같이 명시적 접근이 가능합니다.
	
 - null 
	EL은 null값을 문자열로 출력하지 하지 않습니다.
	
 - 연산자 사용
	 삼항연산,사칙연산,논리연산등의 기본적인 자바 연산자를 사용 가능합니다. 
	

# JSTL
JSP Standard Tag Library는 태그를 통해 JSP 코드를 관리하는 라이브러리입니다. 라이브러리는 공통적으로 사용되는 코드를 모아놓은 코드의 집합입니다. JSTL은 JSP페이지 안에서 사용가능한 커스텀 태그와 함수를 제공합니다. Scriptlet에 비해 간결하고 가독성이 좋은 특징이 있습니다. JSTL을 사용하기 위해서는 프로젝트에 라이브러리를 추가해주고 JSP 페이지 상단에 선언이 필요합니다.

- JSTL 태그의 종류

	JSTL에는 아래와 같은 태그들이 있습니다.
	- Core  (prefix : c)
		- 변수 지원, 제어문, 페이지 관련 처리
	- Formatting  (prefix : fmt) 
		- 포맷 처리, 국제화 지원
	- DataBase (prefix : sql)
		- DB관련 CRUD 처리
	- XML (prefix : x)
		- XML관련 처리 
	- Function (prefix : fn)
		- collection 처리, String 처리

 아래 예시에서는 제가 주로사용 했던 c와 fn의 사용법에 대해 알아보겠습니다.


# 사전 설정
1 . http://tomcat.apache.org/taglibs/standard/
위 링크에 접속하여 원하는 JSTL의 버전을 확인 후 download 버튼을 클릭합니다.

{:.center}
![img1](/assets/images/posts/spring-mvc-jstl/jstlInstall1.jpg)

binaries/를 클릭합니다.

{:.center}
![img1](/assets/images/posts/spring-mvc-jstl/jstlInstall2.jpg)



원하는 버전을 zip형식의 파일로 받습니다.

{:.center}
![img1](/assets/images/posts/spring-mvc-jstl/jstlInstall3.jpg)

압축 해제 후 lib 폴더 내부의 jstl.jar 파일과 standard.jar 파일을 추출합니다. 

{:.center}
![img1](/assets/images/posts/spring-mvc-jstl/jstlInstall4.jpg)

WEB-INF/lib 경로에 위의 두 파일을 넣어줍니다.

{:.center}
![img1](/assets/images/posts/spring-mvc-jstl/jstlInstall5.jpg)

2 .  1번에서 라이브러리를 추가 해줬다면 이제 JSTL 사용을 위해 선언을 해줘야합니다.
제가 주로 사용하는 두가지 태그를 선언 해보겠습니다.
```
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
```
prefix에 값과 uri를 변경하여 선언하면 다른 태그도 사용 가능하며 사용할 때는
< c:if > 와 같이 사용 가능합니다.

3 . web.xml 파일 내부 web-app 태그 안에 서블릿 버전이 2.3 이하로 표시 될 경우에는 web.xml을 2.5버전 이상으로 수정해주거나 페이지 인코딩 선언부에 isELIgnored="false"를 추가 해야 EL 사용이 가능합니다.
```
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" isELIgnored="false" %>

```

# EL을 이용한 값 전달

```
@RequestMapping(value = "/el")
	public String elExample(HttpServletRequest request, Model model) {	
		String printingText="JSP 페이지에 값 전달하기";
		model.addAttribute("TEXT", printingText);
		return "el";
	}

```
컨트롤러에서 model에 printingText의 값을 가지는 "TEXT"라는 속성을 추가 해줍니다. 

```
<body>
출력 내용<br>
${TEXT}
</body>
</html>
```
JSP 페이지에서 EL 문법으로 TEXT를 출력하도록 작성합니다.

{:.center}
![img1](/assets/images/posts/spring-mvc-jstl/el_result1.JPG)

위 와 같은 결과를 얻을 수 있습니다.

이 방법을 조금 더 활용하여 검색창에 페이지가 바뀌어도 검색어를 유지 하는 방법을 알아보겠습니다.

```
<body>
<form method="GET" action="${pageContext.request.contextPath}/el">

<input type="text" name="keyword" value="${searchKeyword}" />
<input type="submit" value="Search">
</form>

검색어 -> ${searchKeyword}
</body>
```

{:.center}
![img1](/assets/images/posts/spring-mvc-jstl/el_result2.JPG)

text타입의 검색창을 생성하여 value에 EL로 검색어를 지정해주면 EL의 null을 표시하지 않는 특성 때문에 검색 전에는 검색창이 비어 있고 검색 결과와 함께 검색어가 유지되는 기능을 만들 수 있습니다.

다음은 클릭 이벤트가 발생할 경우 GET방식으로 값을 전송할 때의 사용 법입니다.
게시글의 제목이 클릭되어 상세보기 페이지로 이동하거나 특정 링크를 클릭하였을 경우 GET 방식으로  form 태그 없이 전송이 가능합니다. 

```
<a href="Detail?searchId=${jarr[i].ID}&sessionId=${sessionId}">
${jarr[i].MAIN_TITLE}</a>
```

```
@RequestMapping(value = "/Detail")
	public String detailPage(HttpServletRequest request, Model model, HttpSession session) throws Exception {
		String ID = request.getParameter("searchId");
		sessionIdID = request.getParameter("sessionId");
		return "selected";
	}
```


위 코드의 경우 jason array 를 jstl의 반복문을 이용해  출력할때 특정 게시글[i번째]의 제목[MAIN_TITLE]이 클릭되면 해당 게시글의 고유 ID 와 접속자의 세션아이디를 컨트롤러의 Detail이라는  Annotation으로 넘겨주는 방식입니다. 


```
<body>
<form method="GET" action="${pageContext.request.contextPath}/el">
<input type="text" name="keyword" value="${searchKeyword}" />
<input type="submit" value="Search">
</form>
검색어     -> ${searchKeyword}<br>
더하기 3 -> ${searchKeyword + 3}<br>
나누기 2 -> ${searchKeyword/2}<br>
</body>
```

{:.center}
![img1](/assets/images/posts/spring-mvc-jstl/el_result3.JPG)


EL은 숫자는 숫자로 인식하기 때문에 연산 기능을 추가하여 위와 같은 사용도 가능합니다. 


```
${!empty str ? true : false}
```
삼항 연산을 통해 ${str}이 비어있는 지 체크 하여 true,false를 반환 할 수 있고 이것을 이용하여 JSTL에서 if문에 활용이 가능합니다.

# JSTL 적용 방법

- 반복문
	```
	<c:forEach begin="0" end="10" var="i" step="1">
	<a href="#">${relatedward[i]}</a>
	</c:forEach>
	```
	core태그는 자바에서 사용하던 제어문과 비슷한 역할을 하는 기능들을 제공합니다.
	위  코드의 forEach태그는 자바의
	
	```
	for(int i=0;i<10;i++)
	{
		System.out.println(relatedward[i]);
	}
	```
	처럼 작동합니다. 

- 조건문
	```
	<c:if test="${empty searchKeyword ? true : false}">
		검색어가 없습니다.
	</c:if>
	<c:if test="${!empty searchKeyword ? true : false}">
		검색어는 ${searchKeyword}입니다.
	</c:if>
	```

{:.center}
![img1](/assets/images/posts/spring-mvc-jstl/el_result1.JPG)

{:.center}
![img1](/assets/images/posts/spring-mvc-jstl/el_result2.JPG)
	
	JSTL 코어태그에서 지원하는 if은 EL의 삼항 연산자와 같이 쓰면 유용하게 쓸 수 있습니다. 검색어가 없을 경우 참이나 거짓을 반환하는 역할을 합니다.
위 기능을 이용해 다음과 같이 검색어의 변화에 따라 결과창에 원하는 정보를 띄울 수 있습니다.

- 출력 및 변수

  ```
  <c:out value="${name}" default="검색 결과가 없습니다." escapeXml="true" />
  ```

   c:out 태그를 통해 출력이 가능합니다. value에는 출력될 값을 넣어주고 default를 설정해줄 경우 value의 값이 null일 때 default 값이 출력됩니다. 또한 본문 내용에 XML 문자를 이스케이프 하여 페이지가 깨지거나 의도하지 않은 기능이 작동하는 것을 방지할 수도 있습니다.

  ```
  <c:set var="name" value="Nerd" scope="request" />
  ```

  변수를 설정 하고 싶을때는 c:set 태그를 합니다. var에 변수명, value에 초기화 값, scope에 사용 영역을 지정합니다. 설정된 변수는 c:remove태그를 통해 삭제할 수 있습니다. 


- 문자열 자르기
	Function 태그의 Fn:substring을 이용하면 문자열을 자를 수 있습니다.
	
	```
	<c:out value="${fn:substring(stripText,0,200)}"								/>
	```
	 만약 검색 결과로 출력될 내용이 너무 길어질 경우  fn:substring(자를 내용, 시작 위치, 끝날 위치)를 지정해주면 원하는 만큼 출력이 가능 합니다. 
	

# Result

검색 페이지를 제작할 때 유용하게 쓸 수 있었던 JSTL 과 EL기능에 대해 소개해드렸습니다. 앞서 설명한 기능들은 JavaScript에서도 구현이 가능하고  기존에 JSTL을 사용하지 않았다면 어색하고 사용이 어려울 수도 있지만 JSTL의 특징에서 설명한 장점이나 tag lib를 생성하여 사용하는 기능 등 다 설명하지 못한 장점이 있으니 사용해보시는 걸 추천합니다.

## 출처
[1] https://www.tutorialspoint.com/jsp
[2] https://hunit.tistory.com
[3] http://www.devkuma.com/books/23