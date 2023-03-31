const express = require("express"); // node.js의 express 모듈 불러와서
const app = express(); // app 이라는 express 객체 인스턴스를 생성
// CORS : Cross Origin Resource Sharing [교차 출처 정책]
const logger = require("morgan"); // 서버 로그,디버깅용 모듈
const cors = require("cors");
// 미들웨어(middleware) : client - server 사이에 위치
app.use(logger("dev")); // 개발용 메세지 로그
app.use(express.json()); // json데이터 해석
app.use(express.urlencoded({ extended: true })); // 문자열 인코딩
app.use(cors()); // CORS 에러 해결
// 서버에서 클라이언트로 보낼 데이터 (실제로는 DB에서 추출해야 함)
let id = 1; // 변수 let, 상수 const
const todos = []; // 메모리로 DB대신(속도)
// node.js - express의 ROUTING : 데이터 요청하면 관련 페이지나 데이터를 제공 (=라우팅)
app.get("/", (req, res) => {
  res.send("Hello World!");
  console.log(req); // 요청값 출력
});

app.get("/todos/list", (req, res) => {
  // response 응답 : res
  //res.send("todos를 보내드릴게요");
  res.json(todos);
});

app.post("/todos/add", (req, res) => {
  console.log("추가된 후 : "+todos)
  // request 요청 : req,
  // 수신된 데이터를 확인
  // console.log(req.body);
  // res.json(todos);
  const { text, isDone } = req.body;
  todos.push({
    id: id++,
    text,
    isDone,
  });

  return res.json(todos);
});

app.delete("/todos/delete/:id", (req, res) => {
  const delTodoId = req.body.id;
  console.log(delTodoId);
  console.log("삭제한 이후 : " + todos);
  // .splice() 메소드로 실제 todos 배열의 데이터를 조작
  return res.json(todos.filter((todo) => todo.id !== delTodoId)); // 실제 data 반영x []
});

app.listen(4000, () => {
  console.log("server is running on port 4000");
});
