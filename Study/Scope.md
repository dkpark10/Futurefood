# 스코프

var는 전역변수 즉 **window** 객체에 변수를 만드는 것이라 볼 수 있다. </br>

```javascript
var s = 'global';
function Test() {
  var s = 'local';
  s = 'change';
}
Test(); 
console.log(s);				// global
```
같은 변수명이지만 Test() 함수의 바깥 s는 전역변수이고 함수안에 s는 지역변수이다</br>
당연한 기본 개념!! 위 코드 지역변수는 뭘 해도 전역변수에 영향을 끼칠 수 없다.</br>

```javascript
var s = 'global';
function Test() {
  s = 'local';
}
Test(); 
console.log(s);				// local
```

아까와 달리 함수 안에 var를 선언하지 않았다. 이제 값이 바뀐다.</br>
자스는 변수의 범위를 호출한 함수의 지역스코프로부터 전역 변수들이 있는 전역 스코프까지 점차 넓혀가며 찾는다.</br>
함수안 s의 선언이 없기 때문에 더 넓은 범위인 전역스코프에서 찾는다. </br>

## 스코프체인

전역변수와 지역변수 관계에서 스코프체인이란 개념이 나온다. 내부함수에서는 외부에 접근할 수 있지만 </br>
외부에선 내부 함수의 변수에 접근할 수 없다. 그리고 모든 함수들은 전역객체에 접근할 수 있다.</br>

```javascript
var outvar = 'test';
function Out(){
	console.log('외부', outvar);
  function In(){
		var invar = 'nnn';
		console.log('내부', outvar);
	}
	In();
}
Out();
console.log(invar); 			// undefined
```

In()함수는 test변수를 찾기 위해 먼저 자기 자신 스코프에서 찾고 없으면 한단계 상위 Out()함수에서 찾는다.</br>
또 없으면 결국 최종으로 전역스코프에서 찾는다. 전역스코프에서 test를 찾아서 'test' 라는 값을 얻는다.</br>
만약 전역스코프에도 변수를 찾지 못한다면 에러가 발생 이렇게 계속 상위 범위로 넓혀 찾는것을 스코프체인이라고 한다. </br>
그리고 invar변수는 Out() -> In()이렇게 꼭꼭 스코프에 감싸져 있기때문에 **함수 외부에서 찾을 수 없어 undefiend가 뜨게 된다.**</br>

## 렉시컬 스코핑

스코프는 함수를 호출할 때가 아니라 선언할 때 생긴다. 다음을 보자

```javascript
var test = 'test';
function F1(){
	console.log(test);
}
function F2(){
	test = 'scope test';
	F1();
}
F2();			// scope test 
```

예상이 가능하다. 다음을 보자

```javascript
var test = 'test';
function F1(){
	console.log(test);
}
function F2(){
	var test = 'scope test';
	F1();
}
F2();			// test
```

흠... scope test가 뜰줄 알았는데 그냥 test만 뜬다 왜그럴까??? 스코프는 함수를 선언할 때 마다 생긴다. </br>
F1()함수 안에 test는 F2()안에 test를 가리키고 있는게 아니라 전역변수 test를 가리키고 있다. </br>
렉시컬스코프는 함수를 처음 선언하는 순간 함수 내부의 변수는 자기 스코프로부터 가장 가까운 곳에 있는</br>
변수를 계속 참조하게 된다. 위 코드에서 F1()함수 안에 test는 선언 시 가장 가까운 전역변수 test를 참조하게 된다.</br>
그래서 F2()안에서 test를 호출한다 하여도 지역변수를 참조하는게 아니라 전역변수를 참조하게 된다.</br>
</br>
전역변수를 만드는 것은 지양해야 한다.(역시........) </br>



