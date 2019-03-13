---
layout: post
title:  "RxSwift를 실제 서비스에 적용하기"
author: ["백승빈"]
date:   2019-03-12 12:53:01 -0600
abstract: "요즘은 swift 컨퍼런스나 행사에서 Rx를 다루지 않는 세션을 찾는게 더 어려워지고 있는 것 같습니다. 이번엔 RxSwift의 확장 익스텐션인 RxCocoa를 활용해 실제 서비스에 사용하기까지의 일력의 과정을 함께 확인해보도록 하겠습니다."
tags: ["RxSwift", "RxCocoa", "아오스"]
image: /assets/images/posts/rxcocoa/img1.png
draft: "no"	

---

{:.center}
![img1](/assets/images/posts/rxcocoa/img1.png)

# Abstract

이전 저의 포스트인 [RxSwift를 활용한 iOS Reactive 네트워크 환경 구성](https://blog.nerdfactory.ai/2019/02/06/rx-swift.html) 에서 언급했듯이 이번에는 RxCocoa를 활용해 RxSwift를 UIView에도 적용하는 작업을 수행했습니다. 요즘은 swift와 관련된 컨퍼런스나 행사에서 ReactiveX를 다루지 않는 세션을 찾는게 더 어려워지고 있는 것 같습니다. 이러한 흐름에 따라 저희 서비스인 i-Checker에도 선별적으로 Rx를 적용하고 있으며 (저의 실력이 닿는데까지) 그 활용도를 점점 높여나갈 예정입니다. 물론 아직 그 수준이 높지는 않지만 RxCocoa를 활용해 간단한 TableView를 구현하고 데이터를 바인딩하는 부분까지 함께 해보도록 하겠습니다.



# RxCocoa 

RxCocoa는 UIKit 컴포넌트에 Rx로 랩핑된 확장 익스텐션으로 실질적으로 '좋다'고 느끼던 Rx를 본격적으로 view에서도 활용할 수 있게 도와주는 라이브러리입니다. 사실 이 Rx를 두고 여전히 논란이 되는 이유는 높은 러닝커브와 예제만 따라해서는 그 극적인 효과를 보기 어렵다는 것 때문입니다. 그래서 관련 커뮤니티에서도 갑론을박은 있으나 그럼에도 불구하고 '써보자'라는 추세이긴 합니다. 이미 Rx에 대해서는 앞선 [RxSwift를 활용한 iOS Reactive 네트워크 환경 구성](https://blog.nerdfactory.ai/2019/02/06/rx-swift.html) 에서도 다루었으니 참고 부탁드리며 더 자세한 내용은 곰튀김님의 [‘RxSwift 4시간 안에 끝내기’ 라는 유튜브 강의](https://youtu.be/w5Qmie-GbiA)를 꼭 한번 들어보시길 강력 추천합니다.



# RxCocoa 적용하기

우선 저희는 가장 심플한 영역에 먼저 적용하면서 사용 범위를 넓히고자 했습니다. 그래서 타겟으로 선정된 view는 오픈소스 라이센스를 표기해주는 view였습니다. 


{:.center}
![img2](/assets/images/posts/rxcocoa/img2.png)



우선 저희가 Rx를 만나기 전에는 아래와 같이 구현되어 있었습니다. openSource라는 Dictionary를 만들고 `[Key:[String:String]]` 구조로 조금 더 가시적으로 보면서 추가/삭제를 할 수 있게 구성했었습니다. 여담이지만 이렇게 바꾸기 전에는 podfile에서 markdown을 불러와서 라이센스 전체의 내용을 표기하게끔 구성했었으나 여러 컴퓨터에서 사용되는 것에 제한이 많아지고 있어 아래와 같은 형태로 변화를 주기로 했습니다.



```swift
import UIKit

class OSSLicenseViewController: UIViewController {

@IBOutlet weak var tableView: UITableView!
@IBOutlet weak var titleView: UITextView!

var openSourceLicenseDict =
    [0:["Name":"ReactiveX", "License": "MIT License", "URL": "http://reactivex.io"],
     1:["Name":"Moya", "License": "MIT License", "URL": "https://github.com/Moya/Moya"],
     2:["Name":"ObjectMapper", "License": "MIT License", "URL": "https://github.com/tristanhimmelman/ObjectMapper"],
     3:["Name":"RealmSwift", "License": "Apache 2.0 License", "URL": "https://realm.io"],
     4:["Name":"Kingfisher", "License": "MIT License", "URL": "https://github.com/onevcat/Kingfisher"],
     5:["Name":"BSImagePicker", "License": "MIT License", "URL": "https://github.com/mikaoj/BSImagePicker"]]

override func viewDidLoad() {
    self.tableView.delegate = self
    self.tableView.dataSource = self
}

@IBAction func tapCloseButton(_ sender: UIButton) {
    self.dismiss(animated: true, completion: nil)
}
}

extension OSSLicenseViewController: UITableViewDelegate {
    func tableView(_ tableView: UITableView, heightForRowAt indexPath: IndexPath) -> CGFloat {
        return 80
    }
}

extension OSSLicenseViewController: UITableViewDataSource {
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return openSourceLicenseDict.count
    }

    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell: OSSCell!
        
        cell = tableView.dequeueReusableCell(withIdentifier: "OSSCell", for: indexPath) as? OSSCell
        cell.backgroundColor = UIColor.clear
        cell.titleLabel.text = openSourceLicenseDict[indexPath.row]?["Name"]
        cell.licenseLabel.text = openSourceLicenseDict[indexPath.row]?["License"]
        cell.urlLabel.text = openSourceLicenseDict[indexPath.row]?["URL"]
        
        return cell
    }
}
```


사실 이 전체의 구조가 중요하다기 보다 tableView를 그리기 위한 작업들을 중점적으로 보시면 좋습니다. 여러가지 방법이 있지만 저희는 extension으로 tableview를 선언하고 따로 관리하는 것을 좋아해 저렇게 구현했었습니다. 딱히 지저분하다고 하기도 모호하지만 일단 Rx라면 더 간소화되지 않을까 라고 생각하며 하나씩 적용해보았습니다. (물론 Rx가 극적인 효과를 보이려면 더 복잡한 구조를 갖는 부분에서 활용했으면 좋았겠지만 저의 실력이 부족한 관계로…)



일단 줄여보고자 했던 부분은 tableView를 그리고 만드는 부분인 UITableViewDataSource와 UITableViewDelegate 부분이었습니다. RxCocoa의 예제를 찾아본 결과 특이하게도 delegate나 datasource를 연결시켜주는 게 필수가 아니었으며 extension으로 선언하지 않아도 사용할 수 있었습니다.



```swift
extension OSSLicenseViewController: UITableViewDataSource {
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return openSourceLicenseDict.count
    }

    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell: OSSCell!
        
        cell = tableView.dequeueReusableCell(withIdentifier: "OSSCell", for: indexPath) as? OSSCell
        cell.backgroundColor = UIColor.clear
        cell.titleLabel.text = openSourceLicenseDict[indexPath.row]?["Name"]
        cell.licenseLabel.text = openSourceLicenseDict[indexPath.row]?["License"]
        cell.urlLabel.text = openSourceLicenseDict[indexPath.row]?["URL"]
        
        return cell
    }
}
```



그래서 위의 원본 코드를 참고하며 아래와 같이 RxCocoa를 적용했습니다. 굳이 line이 짧아진 것 외에도 간결하게 선언되고 관리되고 있음을 알 수 있습니다.



```swift
fileprivate func setTableView() {
	let cellType = Observable.of(openSourceLicense)
		cellType
			.bind(to: tableView.rx.items(cellIdentifier: "OSSCell", cellType: OSSCell.self)) { (row, element, cell) in
			cell.backgroundColor = UIColor.clear
			cell.titleLabel.text = element["Name"]
			cell.licenseLabel.text = element["License"]
			cell.urlLabel.text = element["URL"]
		}.disposed(by: disposeBag)
}
```


사실 이 부분에서 고충이 조금 있었는데 첫번째로 굳이 [Int:[String:String]]의 구조가 아니어도 괜찮았는데 숫자가 있어야 더 보기 간결할 것이라고 생각했던 건지 오히려 Rx를 쓰며 더 복잡해졌다라는 생각이 들었습니다. 게다가 별 생각없이 다른 예제를 따라하며 아래와 같이 enum을 이용해서 굳이 타입을 구분해서 case를 생성하고는



```swift
fileprivate enum CellType {
    case licenseDict([Int:[String:String]])
}
```



아래처럼 데이터 타입을 정의해서 불러왔습니다. 그리고 이게 [CellType]으로 정의가 되버리고 element가 여러 개임을 인지하기 어려워지고 이걸 bind(to:)해버리니 전체의 element가 1회만 구독되어 가장 상단의 값만 테이블에 그려지는 초유의 사태가 벌어졌습니다.



```swift
let cellType: Observable<[CellType]> = Observable.of([.licenseDict(openSourceLicenseDict)])
```



특히 네트워크를 통해 넘어오는 데이터가 아니다 보니 모델이 존재하지도, 필요성도 전혀 없는 상태라 고민이 깊어지고 있었습니다. 그래서 모델을 사용하지 않으면서 심플하게 구성하려는 (무식한) 여러 시행 착오 끝에 아래와 같이 선언하는 것으로 마무리 했습니다.



```swift
let cellType = Observable.of(openSourceLicense)
```



그리고 테이블 뷰의 수를 결정짓던 아래의 코드를 viewDidLoad에 self.tableView.rowHeight = 80 한 줄을 추가함으로서 마무리를 했습니다. 당연히 viewDidLoad에는 RxCocoa를 사용하면 생략해도 되는  self.tableView.delegate = self와 self.tableView.dataSource = self 코드가 사라졌습니다.



```swift
extension OSSLicenseViewController: UITableViewDelegate {
    func tableView(_ tableView: UITableView, heightForRowAt indexPath: IndexPath) -> CGFloat {
        return 80
    }
}
```



그리고 기왕 RxCocoa에 손을 댄 김에 기존의 storyboard랑 연결되어 있던 아래의 버튼 액션에 대한 코드도 rx를 적용해보았습니다.



```swift
@IBAction func tapCloseButton(_ sender: UIButton) {
    self.dismiss(animated: true, completion: nil)
}
```

 

```swift
self.closeButton.rx.tap
            .subscribe() { event in
                self.dismiss(animated: true, completion: nil)
            }.disposed(by: disposeBag)
```



사실 이 부분은 아이러니하게도 더 길고 복잡해보이지만 실제로 storyboard를 많이 사용할 수록 발생 가능성이 높았던 휴먼 에러를 잡아주는 효과는 기대할 수 있는 것 같습니다. 그리고 뭔가 트렌드라 그런지 배움에 대한 보람인지 기분이 좋아집니다.(응?)



```swift
import UIKit
import RxSwift
import RxCocoa

class OSSLicenseViewController: UIViewController {
    @IBOutlet weak var tableView: UITableView!
    @IBOutlet weak var titleView: UITextView!
    @IBOutlet weak var closeButton: UIButton!
    
    fileprivate var disposeBag = DisposeBag()
    
    var openSourceLicense =
        [["Name":"ReactiveX", "License": "MIT License", "URL": "http://reactivex.io"],
         ["Name":"Moya", "License": "MIT License", "URL": "https://github.com/Moya/Moya"],
         ["Name":"ObjectMapper", "License": "MIT License", "URL": "https://github.com/tristanhimmelman/ObjectMapper"],
         ["Name":"RealmSwift", "License": "Apache 2.0 License", "URL": "https://realm.io"],
         ["Name":"Kingfisher", "License": "MIT License", "URL": "https://github.com/onevcat/Kingfisher"],
         ["Name":"BSImagePicker", "License": "MIT License", "URL": "https://github.com/mikaoj/BSImagePicker"]]
    
    override func viewDidLoad() {
        self.tableView.rowHeight = 80
        
        self.closeButton.rx.tap
            .subscribe() { event in
                self.dismiss(animated: true, completion: nil)
            }.disposed(by: disposeBag)
        
        setTableView()
    }
    
    fileprivate func setTableView() {
        let cellType = Observable.of(openSourceLicense)
        
        cellType
            .bind(to: tableView.rx.items(cellIdentifier: "OSSCell", cellType: OSSCell.self)) { (row, element, cell) in
                cell.backgroundColor = UIColor.clear
                cell.titleLabel.text = element["Name"]
                cell.licenseLabel.text = element["License"]
                cell.urlLabel.text = element["URL"]
            }.disposed(by: disposeBag)
    }
}

```



# Result

사실 글에서는 충분히 전달되지 않지만 나름대로 인고의 시간을 통해 RxCocoa를 겨우겨우 사용했습니다. 최종적으로 완성된 코드는 아래와 같이 훨씬 높은 가독성을 보여주고 있는데 물론 익숙함에서 오는 Swift의 가독성이 좋을 수도 있지만 이렇게 UIKit에 적용되어 활용되는 횟수가 늘어나면 자연스럽게 다른 플랫폼 개발자들과의 커뮤니케이션 효율성이 함께 증가할 것으로 기대됩니다.

{:.center}
![img3](/assets/images/posts/rxcocoa/img3.png)