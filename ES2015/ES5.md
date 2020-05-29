# es2015

## const let var

```javascript
if(true){
  var x = 100;
}
console.log(x);

if(true){
  const y = 12;
}
console.log(y); // error
```

**var**는 전역변수 **const , let**은 지역변수 개념 </br>
const 는 변하지 않는 값 c++ 생각하자 선언과 동시에 초기화 </br>
let은 일반 지역변수 </br>

## 문자열 템플릿

```javascript
let a = 20;
let b = 40;
let str3 = `${a} + ${b} = ${a+b}`;
console.log(str3);

```

** 백틱 을 사용하여** (따옴표 아님!!!) 변수넣어주면서 사용 </br>
기존 코드라면 </br>

> let str4 = a + "+" + b + "=" + (a+b);

가독성이 구리다 </br>

## 화살표함수

```javascript
const add = (a,b) => (a+b);  // (a,b) 는 매개변수 => ()화살표 다음 괄호는 								 함수바디
let result = add(4,5);
console.log(result);
```

다음과 같이 화살표로 함수 작성 가능 </br>

```javascript
const player = {
  name : 'jack',
  record : [['bench' , 220], ['dead' , 2540], ['bench' , 453]],
  printrecord : function () {
    this.record.forEach((item , i) => { // 화살표함수
        console.log(`${this.name}s ${item[0]} record is ${item[1]}`); // 템플릿 문자열 사용하여 츌력
    });
  }
};
console.log(player.printrecord());
```

## 비구조화 할당

```javascript
const array = ['node jjang', 123, {}, true];
let [v1, v2, v3, v4] = array;
```
