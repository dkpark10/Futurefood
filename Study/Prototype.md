# Prototype

프로토타입을 알아보자 정의는 이렇다

>  객체의 원형인 프로토타입을 이용해 새로운 객체를 만들어내는 기법. 이렇게 만들어진 객체 역시 자기 자신의 프로토타입을 갖는다. 이런 구조로 객체를 확장해나가는 방식을 프로토타입 기반 프로그래밍이라 한다. 

```javascript
 const Person = function(name,age){

    this.name = name;
    this.age = age;
}

let King = new Person('king',222);
console.log(King);
```

```javascript
const Person = function(){}

Person.prototype.age = 222;
const king = new Person();
const knight = new Person();

console.log(king.age);
console.log(knight.age); 
```

위 두코드를 보자
Person.prototype이라는 빈 오브젝트가 어딘가 존재하고 Person함수로부터 생성된 객체는 어딘가 존재하는 오브젝트에 들어있는 값을 모두 쓸 수 있다.
즉 age를 어딘가에 넣고 king과 knight가 공유해서 사용 가능 

## Prototype Link, Prototype Object

자바스크립트에는 Prototype Link, Prototype Object두가지가 존재한다.

### Prototype Object

객체는 함수로 생성할 수 있다. 
```javascript
function Person (){}
const king = new Person()
```

king객체는 Person()함수로 생성된 객체이다. 

```javascript
const obj = {};
const obj = new Object();
```

다음 위코드에 {}는 new Object()와 같다.
함수가 정의될 때는 2가지일이 동시에 발생한다. 

1. 해당함수에 생성자 자격을 부여한다.
2. 해당 함수의 Prototype Object 생성 및 연결

생성자 자격이 부여되면 new연산자를 통해 객체를 생성할 수 있다. 

![image](https://miro.medium.com/max/1200/1*PZe_YnLftVZwT1dNs1Iu0A.png)

함수를 정의하면 함수만 생성되는 것이 아니라 Prototype Object도 같이 생성된다.
생성된 함수는 prototype이라는 속성을 통해 prototype object에 접근할 수 있다. 
prototype object는 일반객체와 같으며 기본메소드로 constructor와 &#95;&#95;proto&#95;&#95;를 가지고 있다.
constructor는 prototype object와 같이 생성되었던 함수를 가리키고 있다. 
&#95;&#95;proto&#95;&#95;는 prototype link이다.

![image](https://miro.medium.com/max/588/1*PLRkoBdVZv9vZW1Z4FlLJw.png)

prototype object는 일반적인 객체이므로 멤버변수를 맘대로 추가삭제가 가능하다.

### Prototype Link

prototype 속성은 함수만 가지고 있던것과 달리 __proto__는 객체가 생성될 때 조상이었던 함수의 
Prototype Object를 가리킨다. __proto__를 까보면 Person함수의 오브젝트를 가리키고 있다.

![image](https://miro.medium.com/max/1400/1*jMTxqTYDZGhykJQoimmb0A.png)

위 코드 kim 객체는 eyes를 직접 가지고 있지 않기 때문에 eyes속성을 찾을 때 까지 상위 프로토타입을 탐색한다. 최상위 object의 prototype object에 도달해서 못찾았을 경우 undefined 리턴
이렇게 &#95;&#95;proto&#95;&#95; 속성을 통해 상위 프로토타입과 연결되있는 형태를 프로토타입체인이라한다.

![image](https://miro.medium.com/max/1400/1*mwPfPuTeiQiGoPmcAXB-Kg.png)

이런 체인구조 때문에 모든 객체는 Object의 자식이라 불리고 prototype object에 있는 모든 속성을 사용할 수 있다.


