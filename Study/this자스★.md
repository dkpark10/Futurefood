# 자스에서 this

보통 this는 C계열이나 자바에서 인스턴스 자신을 가리키는데 자스에서는 이게 상황에 따라 </br>
달라진다. 나도 처음 알았다.... 역시 10일만에 설계한거라 언어가 근본이 없다. </br>

#### 단독으로 쓴 this

this를 콘솔에다 그냥 입력해보자 </br>

```javascript
this
Window {0:global, window:Window, self:Window, document:document, name:"", location:Location,...}

var t = this;
console.log(t) //Window
```

#### 함수내 this

함수의 주인인 Window가 리턴 ~</br>

```javascript
function Test(){
	return this;
}
console.log(Test()); 	// Window

var name = 'queen';
function King{
	this.name = 'king';
	console.log(name)					// king
	console.log(name === window.name);	// true
}
```

king 메소드안에 name은 window객체를 가리킨다.</br>
하지만 엄격모드에서 좀 다르다. 엄격모드에서는 함수내 this에</br>
디폴트 바인딩이 없다. </br>

```javascript
`use strict`;
function Test(){
	return this;
}
console.log(Test()); 	// undefined

function King(){
	this.name = 'king';
	console.log(name)	// Error! Cannot set property 'name' of undefined
}
```

#### 객체 내 함수 this

객체내 함수 this는 우리가 흔히 알고있는 자기 자신을 호출한다. </br>

```javascript
const SamDae = {
	deadlift:11,
	benchpress:22,
	squart:33,
	getWeight:function(){
		return this.deadlift + this.benchpress + this.squart;
	}
};
SamDae.getWeight();		// 66
```

```javascript
var income = 23;
function getIncome(){
	return this.income;
}

getIncome();

const person = {
	income:78955632560,
	getinc: getIncome
};
person.getinc(); 	// 78955632560
```

#### 이벤트핸들러 안에서 this

이건 HTML을 가리킨다. </br>

```javascript
const btn = document.querySelector('#send');
btn.addEventListener('click', () =>{
	console.log(btn);		// #send
});
```

#### 생성자 안에서 this

```javascript
function Love(arg){
	this.name = arg;
}

const Lee = new Love('lee');
const Park = new Love('park');
console.log(Lee.name);		// lee
console.log(Park.name);		// park
```

하지만 new 키워드를 빼면 일반 메소드 호출과 같기 때문에 this는 window객체!!! </br>

#### 명시적 바인딩을 한 this

apply(), call() 함수는 Function Object에 기본적으로 정의된 메소드인데 파라미터를 this로 만들어 준다. 코드를 보자 </br>

```javascript
function Test(){
	console.log(this);
}
Test();			// window
const obj = {
	n:23315
}
Test.call(obj)	// {n:23315}
```
apply()에서 파라미터로 받은 첫값은 함수 내부에서 사용되는 this에 바인딩되고</br>
두번쨰 값인 배열은 자신을 호출한 함수의 파라미터로 사용한다.</br>

```javascript
function person(name, age){
	this.name = name;
	this.age = age;
}

function player(name, age, tier){
	Person.apply(this, [name, age]);
	this.tier = tier;
}
const red = new Player('park', 324, 'diamond');
```

#### 화살표 함수 this

화살표 함수는 전역컨텍스트에서 실행되더라도 this를 새로 정의하지 않고 바깥 함수나 </br>
클래스의 this를 사용한다. 코드를 봐보자 </br>

```javascript
const Person = function(name,age){
	this.name = name;
	this.age  = age;
	this.print = function(){
		console.log(this)		// Person {name:'king', age:2}
		setTimeout(function(){
			console.log(this)	// window
			console.log(`name = ${this.name}, age = ${this.age}`);
		}, 100);
	};
};
const king = new Person('king', 2);
Person.print();
```

내부 함수에서 this가 전역객체를 가리키는 바람에 결과가 다르게 나온다. </br>

```javascript
const Person = function(name,age){
	this.name = name;
	this.age  = age;
	this.print = function(){
		console.log(this)		// Person {name:'king', age:2}
		setTimeout(() => {
			console.log(this)	// window
			console.log(`name = ${this.name}, age = ${this.age}`);
		}, 100);
	};
};
const king = new Person('king', 2);
Person.print();		//  name = king, age = 2
```

