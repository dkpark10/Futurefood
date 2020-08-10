# 자바스크립트 객체 및 함수

어려운 개념은 아니나 완전히 익힐 것

```javascript
const mul = (arg) =>{
    return arg*2;
}

const add = (arg) =>{
    return arg + 2;
}

const obj = {
    "name" :"master king",
    mu : mul,   		// 함수도 값으로서 할당 가능 함수포인터개념
    ad : add			// 함수도 값으로서 할당 가능 함수포인터개념
}

const arr = [mul, add];			// 함수도 값이기에 배열에 넣을 수 있다.
console.log(arr[0](23));		// 0번 배열 함수 인자전달해서 출력 코드
console.log(obj.mu(123));		// 객체로 출력
console.log(obj['name']);

for(const member in obj){		// 객체 반복문으로 출력하고 싶을 때
    console.log(`key == ${member}, value == ${obj[member]} `);
}								// for in을 쓰게되면 key값을 출력 
								// value를 출력하고 싶을 때 (객체['키값'])
```