
## ১) What is the difference between null and undefined?

### 🔹 undefined:

* যখন কোনো ভ্যারিয়েবল declare করা হয় কিন্তু কোনো মান assign করা হয় না, তখন তার মান হয় `undefined`।
* এটি JavaScript নিজে থেকে সেট করে।

```js
let x;
console.log(x); // undefined
```

### 🔹 null:

* `null` একটি বিশেষ মান যা ইচ্ছাকৃতভাবে সেট করা হয়।
* এটি বোঝায় যে এখানে কোনো মান নেই (empty value)।

```js
let y = null;
console.log(y); // null
```

---

## ২) What is the use of the map() function in JavaScript? How is it different from forEach()?

### 🔹 map() এর ব্যবহার:

* একটি array এর প্রতিটি উপাদানের উপর কাজ করে।
* নতুন একটি array রিটার্ন করে।
* মূল array পরিবর্তন করে না।

```js
const numbers = [1, 2, 3];
const result = numbers.map(num => num * 2);
console.log(result); // [2, 4, 6]
```

### 🔹 forEach() এর ব্যবহার:

* array এর প্রতিটি উপাদানের উপর কাজ করে।
* কিছু return করে না (undefined দেয়)।
* সাধারণত side effect এর জন্য ব্যবহার করা হয়।

```js
numbers.forEach(num => {
  console.log(num);
});
```
|

---

## ৩) What is the difference between == and ===?

### 🔹 == (Loose Equality):

* শুধু মান (value) তুলনা করে।
* প্রয়োজনে টাইপ convert করে নেয়।

```js
console.log(5 == "5"); // true
```

### 🔹 === (Strict Equality):

* মান এবং টাইপ দুটোই তুলনা করে।
* টাইপ convert করে না।

```js
console.log(5 === "5"); // false
```

👉 সাধারণত `===` ব্যবহার করাই ভালো।

---

## ৪) What is the significance of async/await in fetching API data?

* `async/await` ব্যবহার করলে asynchronous কোড synchronous এর মতো লেখা যায়।
* কোড পড়তে সহজ হয়।
* Promise handle করা সহজ হয়।
* Error handle করা সহজ হয় (try...catch ব্যবহার করে)।

### উদাহরণ:

```js
async function getData() {
  try {
    const response = await fetch("https://api.example.com/data");
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.log("Error:", error);
  }
}
```

---

## ৫) Explain the concept of Scope in JavaScript (Global, Function, Block)

Scope মানে হলো কোনো ভ্যারিয়েবল কোথা থেকে access করা যাবে।

### 🔹 Global Scope:

* প্রোগ্রামের যেকোনো জায়গা থেকে access করা যায়।

```js
let name = "Tareq";
function show() {
  console.log(name);
}
```

### 🔹 Function Scope:

* function এর ভিতরে declare করা ভ্যারিয়েবল শুধু ওই function এর ভিতরেই ব্যবহার করা যায়।

```js
function test() {
  let age = 25;
  console.log(age);
}
```

### 🔹 Block Scope:

* `{ }` এর ভিতরে declare করা `let` এবং `const` ভ্যারিয়েবল শুধু ওই block এর ভিতরে কাজ করে।

```js
if (true) {
  let x = 10;
  console.log(x);
}
// console.log(x); // Error
```


---
