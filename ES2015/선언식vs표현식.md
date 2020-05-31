# 표현식 vs 선언식

## 선언식

```javascript
function F(string) {
  return `${string} test`;
}
console.log(F("string"));
```
우리가 흔히 아는 일반적인 함수 표현 

## 표현식

```javascript
const F = function (arg) {
  return arg*2;
}
console.log(F(3)); 
```

## 그래서 먼차이임??

선언식은 호이스팅에 영향을 받지만 표현식은 호이스티에 영향을 받지 않는다. </br>
선언식은 코드 구현 위치에 관계없이 자스의 특징인 호이스팅에 따라 브라우저가 자스를 해석할 때 </br>
맨 위로 올려진다. </br>

```javascript
F1(2);
F2("string");

const F1 = function (arg) {
  console.log(arg*2);
}

function F2(string) {
  console.log(`${string} func`);
}
```

요거 그대로 실행하면 F1함수가 이니셜라이저 되기전에 접근할 수 없다고 뜬다. 즉 표현식은 실행이 되지 않는다.!!!! </br>

> 가급적 함수와 변수 선언은 코드 상단부에 

