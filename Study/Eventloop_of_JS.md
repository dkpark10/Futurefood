# Js Eventloop of JS

## 개요

> 싱글스레드 기반 자바스크립트
> 이벤트 루프를 기반으로 하는 싱글스레드 

자바스크립트를 해석하는 자바스크립트 엔진과 웹에 화면을 뿌려주는 렌더링 엔진은 서로 다른 것이다. 
렌더링 엔진은 HTML과 CSS로 작성된 마크업 관련한 코드들을 콘텐츠로서 웹페이지에 렌더링 하는 역할을 한다.
자바스크립트 엔진이란 코드를 해석하고 실행하는 인터프리터이다.
주로 웹브라우저에 이용되지만 Node가 등장하면서 서버사이드에선 V8과 같은 엔진이 이용된다. </br>

![자바스크립트 엔진](https://user-images.githubusercontent.com/43857226/83752181-0b702380-a6a3-11ea-95a9-e49435648ab1.PNG)

자바스크립트의 엔진은 크게 다음 세가지 영역으로 나뉜다. 
</br>
1. Call Stack </br>
2. Task Queue </br>
3. Heap </br>
</br>
그리고 추가적으로 Event Loop 가 존재하며 Task Queue에 들어가는 Task를 관리한다.

## Call Stack

자바스크립트는 단 하나의 호출스택을 사용한다. 이는 하나의 함수가 싱행되면 이 함수의
실행이 끝나기 전까지 다른 어떤 Task도 수행할 수 없다는 의미다. 요청이 들어올 때 마다 
해당요청을 순차적으로 호출스택에 담는다. 메소드가 실행될 때 Call Stack에 새로운 프레임이 생기고 Push되고 실행이끝나면 Pop한다.

```javascript
function F1(value){
	return value *2;
}

function F2(value){
	return F1(value) + 10;
}
console.log(F2(4)); 
```

위 코드가 실행된다면 F2가 스택에 쌓이고 F2내부에는 F1을 호출한다. F2의 실행이 끝난것이
아니기 때문에 F1을 스택에 쌓고 실행이 끝나면 리턴 스택에서 Pop한다. 다시 F2는
F1의 리턴값을 받고 리턴하면서 실행을 끝내고 stack에서 Pop한다.

## Heap

동적으로 생성된 객체나 변수등 힙에 할당된다. 이건 뭐 그냥 기본

## Task Queue

자바스크립트의 런타임 환경에서는 처리해야할 Task들을 임시저장하는 대기 큐가 존재한다.
콜 스택이 비어졌을 때 먼저 대기열에 들어온 순서대로 수행된다. 

```javascript
setTimeout(function(){
	console.log(1111);
}, 0);
console.log(2222);
```

다음 코드는 2222 부터 1111로 실행이된다. setTimeout 인자로 0을 전달해줬는데 말이다.
자바스크립트에서 비동기 함수들은 Call Stack에 쌓이지 않고 Task Queue에 쌓인다. 
자바스크립트 엔진이 아닌 Web API 영역에 따로 정의되어 있는 함수들은 비동기로 실행된다.

```javascript
function F1(){
	console.log(111);
	F2();
}

function F2(){
	setTimeout(function() {
		console.log(222);
	},0);
	F3();
}

function F3(){
	console.log(333);
}
F1();
```

다음의 코드 실행순서를 추적해보자 </br>
</br>
1. F1() 실행 큐에쌓인다.</br>
2. F1() 내부에 있는 F2() 실행</br>
3. setTimeout 함수가 실행되고 콜스택에 들어간다음 바로 빠져나옴</br>
4. 내부 익명함수는 콜스택에 들어가지만 바로실행되지 않는다.</br>
5. 이 익명함수는 Event Queue영역으로 들어간다.</br>
4. F3() 실행 </br>
5. F3() 끝나고 Pop()</br>
6. 여전히 스택에 F1()이 남아있으므로 setTimeout 실행 x</br>
7. F2() 끝나고 Pop()</br>
8. F1() 끝나고 Pop()</br>
9. 이제 스택에 아무도 없다.</br>
10. 이 시점에 이벤트 큐 순서대로 이벤트(익명함수)를 가져와서 큐에 넣는다.</br>
11. setTimeout 실행</br>
12. 순서는 111 -> 333 -> 222</br>
</br>
이벤트 큐에 있었던 Task는 스택에 아무도 없을 때 한번에 하나씩 스택으로 호출되어 처리된다.

