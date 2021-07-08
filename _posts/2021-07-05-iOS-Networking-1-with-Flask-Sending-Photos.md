---
layout: post
title: "Flask를 활용한 iOS Networking 1 - 사진 전송하기"
author: ["유예지"]
date: 2021-07-05
abstract: "와이파이나 데이터가 터지지 않는 환경에서는 어떤 앱을 쓸 수 있을까요? 유튜브, 카카오톡 등 우리가 즐겨 쓰는 대부분의 앱은 제 기능을 하지 못할 것입니다. 모바일 앱 사용에 있어서 서버와의 통신은 빼놓을 수 없는 관계입니다. 서버와의 통신은 우리가 정보를 검색해서 읽고 글, 사진을 업로드 또는 수정을 하기 위해 사용합니다. 이러한 모바일과 서버 간의 네트워킹을 어떻게 구현하는지 알아보기 위해 예시로 iOS용 사진 전송 앱을 만들어 보며 데이터를 주고받는 기능을 구현해보겠습니다!"
tags: ["API", "Flask", "Swift5", "iOS"]
image: /assets/images/posts/2021-07-05-iOS-Networking-1-with-Flask-Sending-Photos/0.png
draft: "no"
---

{:.center}
![0.png](/assets/images/posts/2021-07-05-iOS-Networking-1-with-Flask-Sending-Photos/main.png)

# 시작

---

와이파이나 데이터가 터지지 않는 환경에서는 어떤 앱을 쓸 수 있을까요? 유튜브, 카카오톡 등 우리가 즐겨 쓰는 대부분의 앱은 제 기능을 하지 못할 것입니다. 모바일 앱 사용에 있어서 서버와의 통신은 빼놓을 수 없는 관계입니다.

서버와의 통신은 우리가 정보를 검색해서 읽고 글, 사진을 업로드 또는 수정을 하기 위해 사용합니다. 이러한 모바일과 서버 간의 네트워킹을 어떻게 구현하는지 알아보기 위해 예시로 iOS용 사진 전송 앱을 만들어 보며 데이터를 주고받는 기능을 구현해보겠습니다!

![2.png](/assets/images/posts/2021-07-05-iOS-Networking-1-with-Flask-Sending-Photos/2.png)

위 그림과 같이 앱에서 원하는 사진을 서버에 보내고, 처리 값(이미지 크기)을 받아와 출력하는 기능을 통해 네트워킹 과정을 살펴봅시다.

# [iOS] 앨범 or 카메라로 사진 선택

---

우선 앱에서 원하는 사진을 서버로 보내기 위해서는 앨범이나 카메라를 실행해야 합니다.

UIImagePickerController를 사용하면 사진 촬영, 동영상 녹화, 앨범에서 항목 선택을 위한 시스템 인터페이스를 관리할 수 있습니다.

UIImagePickerController를 실행하기 전, Info.plist에서 권한을 설정해 줍시다.

![3.png](/assets/images/posts/2021-07-05-iOS-Networking-1-with-Flask-Sending-Photos/3.png)

현재 필요한 기능은 앨범에서 사진 선택(photoLibrary), 카메라 촬영(camera)이므로 다음과 같이 코드를 작성해 줍니다.

```swift
// 앨범 사용 가능 여부 확인
if(UIImagePickerController.isSourceTypeAvailable(.photoLibrary)){
    // 이미지 피커의 델리케이트 self로 설정
    imagePicker.delegate = self
    // 이미지 피커의 소스 타입을 PhotoLibrary로 설정
    imagePicker.sourceType = .PhotoLibrary
    // 미디어 타입 kUTTypeImage로 설정
    imagePicker.mediaTypes = [kUTTypeImage as String]
    // 편집을 허용
    imagePicker.allowsEditing = True
    // 현재 뷰 컨트롤러를 imagePicker로 대체. 즉 뷰에 imagePicker가 보이게 함
    present(imagePicker, animated: true, completion: nil)
}

// 카메라 사용 가능 여부 확인
if(UIImagePickerController.isSourceTypeAvailable(.camera)){
    // 이미지 피커의 델리케이트 self로 설정
    imagePicker.delegate = self
    // 이미지 피커의 소스 타입을 camera로 설정
    imagePicker.sourceType = .camera
    // 미디어 타입 kUTTypeImage로 설정
    imagePicker.mediaTypes = [kUTTypeImage as String]
    // 편집을 허용하지 않음
    imagePicker.allowsEditing = false
    // 현재 뷰 컨트롤러를 imagePicker로 대체. 즉 뷰에 imagePicker가 보이게 함
    present(imagePicker, animated: true, completion: nil)
}
```

앨범, 카메라 각각 사용 가능 여부를 확인해 주고 원하는 동작 및 예외 처리를 작성해 주면 다음 사진들과 같이 각 기능들이 실행되는 것을 볼 수 있습니다.

{:.center}
![4.png](/assets/images/posts/2021-07-05-iOS-Networking-1-with-Flask-Sending-Photos/4.png)  
_[photoLibrary] 앨범 실행 화면_

{:.center}
![5.png](/assets/images/posts/2021-07-05-iOS-Networking-1-with-Flask-Sending-Photos/5.png)  
_[camera] 카메라 실행 화면_

# [iOS] 서버 통신 코드 작성

---

사진 선택을 완료했다면, 선택한 사진을 서버에 보내는 기능이 필요합니다.

![/assets/images/posts/2021-07-05-iOS-Networking-1-with-Flask-Sending-Photos/6.png](/assets/images/posts/2021-07-05-iOS-Networking-1-with-Flask-Sending-Photos/6.png)

iOS 네트워킹에는 Alamofire, Moya 등 여러 가지 방법들이 있는데, 그중 가장 기본이 되는 URLSession을 사용해서 진행하겠습니다. URLSession은 애플에서 HTTP/HTTPS를 통해 콘텐츠를 다운로드, 업로드하기 위해 제공된 완성된 네트워킹 API입니다. 위 Task 중 어플에서 웹 서버로 Data 객체 또는 파일 데이터를 업로드할 수 있는 URLSessionUploadTask를 사용합니다.

여기서 HTTP Method를 설정해 주어야 합니다! URLSessionUploadTask는 POST 혹은 PUT 메소드를 이용합니다. 하지만 자주 사용되는 메소드인 POST와 GET 비교를 통해 HTTP Method를 살펴보겠습니다.

![7.png](/assets/images/posts/2021-07-05-iOS-Networking-1-with-Flask-Sending-Photos/7.png)

**GET과 POST 차이**

| 구분                   | GET              | POST   |
| ---------------------- | ---------------- | ------ |
| 사용                   | Read or Retrieve | Create |
| URL에 데이터 노출 여부 | O                | X      |
| 데이터 위치            | Header           | Body   |
| 캐싱 가능 여부         | O                | X      |

이처럼 HTTP Method의 메소드는 용도와 필요성에 맞게 사용할 수 있습니다. 저는 POST 방식이 가장 적절하다고 판단했습니다. 그렇다면 코드를 작성해보겠습니다!

```swift
func uploadImg(uiImg: UIImage) {
     let semaphore = DispatchSemaphore(value: 0) // 세마포어 선언
     let req = NSMutableURLRequest(url: NSURL(string:"http://0.0.0.0:8080/api/test")! as URL)
     let ses = URLSession.shared
     req.httpMethod="POST"
     req.setValue("application/octet-stream", forHTTPHeaderField: "Content-Type")
     req.setValue("img", forHTTPHeaderField: "X-FileName")
     let pngData = uiImg.pngData()
	   let task = ses.uploadTask(with: req as URLRequest, from: pngData, completionHandler: { (responseData, response, error) in
         if let httpResponse = response as? HTTPURLResponse {
            switch httpResponse.statusCode {
                 // statusCode 처리
             }
         }

				 if let
            responseData = responseData,
            let responseString = String(data: responseData, encoding: String.Encoding.utf8) {
                // 응답 처리
            }

         if let error = error {
            // 에러 처리
         }

         // 네트워킹이 끝나면 신호 보내기
         semaphore.signal()
     })
     task.resume()

	   // 네트워킹이 끝날때까지 대기
	   semaphore.wait()
}
```

코드를 살펴보면, 세마포어(Semaphore)를 사용한 것을 볼 수 있습니다. 세마포어의 사전적 의미는 수기 신호입니다. 즉, 두 개 이상의 프로세스가 동시에 공유 메모리와 같은 공유 자원을 접근할 때 동기화를 걸어주는 역할을 합니다.

현재 어플에서 "서버에 사진 전송 → 서버에서 처리 → 결과 화면에 출력" 순서로 진행이 되어야 하는데, 서버에서 처리하는 동안 결과 화면으로 넘어가는 등 시간적인 차이 같은 문제로 인해 의도하지 않은 결과가 나올 수 도 있습니다. 따라서 공유 자원의 독점을 보장할 수 있도록 임계 영역(Critical Section)을 만들어줌으로써 문제를 해결할 수 있습니다.

마지막으로 서버 쪽에서 결과를 확인해보면 통신이 잘 이루어진 것을 볼 수 있습니다!!

![8.png](/assets/images/posts/2021-07-05-iOS-Networking-1-with-Flask-Sending-Photos/8.png)

# The End

---

여기까지는 앱에서 사진을 전송하는 기능을 구현해봤습니다! 다음 2장에서는 사진을 받아서 원하는 작업을 해주는 API를 만들어 서버에 올리고, 결과를 받아와서 처리하는 방법을 다루겠습니다.
