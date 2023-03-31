import React, { useState, useEffect } from "react";
import axios from "axios"; // type: module vs commonJS
// state 상태 Hook(=함수)
// effect Hook : 데이터를 서버로부터 받아올때, state를 추적해서 이벤트를 발생
function App() {
  const SERVER_URL = "http://localhost:4000/todos"
  // 할일 입력용 state
  const [todo, setTodo] = useState("");
  // 할일 완료여부를 기록할 state
  const [done, setDone] = useState(false);

  // 서버에서 수신한 할일들 state
  const [todos, setTodos] = useState([]);
  const fetchTodos = async () => {
    const receivedTodo = await axios.get(`${SERVER_URL}/list`);
    setTodos(receivedTodo.data);    
  }
  useEffect(() => {
    fetchTodos();
  }, []); // 빈 배열은 데이터 fetching 한번만 하려고
  const onChange = (e) => {
    setTodo(e.target.value);
  };
  const onClick = () => {
    setDone((prevState) => !prevState);
    console.log("클릭한 done : "+done)
  };
  const clearForm = () => {
    setTodo("");
    setDone(!done); 
  }
  const onSubmit = async (e) => {
    e.preventDefault(); // 데이터 전송하고 페이지 새로고침 금지
    if(todo.length ===0 && todo === "") {
      alert("할일을 입력하세요!!")
    } else {
      await axios({
        method: "post",
        url: `${SERVER_URL}/add`,
        headers: {
          "Content-Type": "application/json"
        },
        data: {
          text: todo,
          isDone: done,
        },
      });
    }
    clearForm();      
    fetchTodos();
  };
  const delTodo = async (id) => {
    await axios({
      method: "delete",
      url: `${SERVER_URL}/delete/:id`,
      headers: {
        "Content-Type": "application/json"
      },
      data: {
        id
      },
    });
    fetchTodos(); // 삭제이후 목록을 다시 재렌더링
  }
  return (
    <div className='App'>
      <h1>todos ({todos.length})</h1>
      <form onSubmit={onSubmit}>
        <ul>
          <li>
            <label htmlFor=''>할일 제목</label>
            <input type='text' value={todo} onChange={onChange} />
          </li>
          <li>
            <label htmlFor=''>완료여부</label>
            <input type='checkbox' value={done} onClick={onClick} />
          </li>
          <li>
            <button type='submit'>등록</button>
          </li>
        </ul>
      </form>
      {todos.map((todo) => (
        <div key={todo.id}>
          <span
            style={{
              display: "inline-block",
              color: "white",
              backgroundColor: "dodgerblue",
              width: "20px",
              height: "20px",
              borderRadius: "50%",
              textAlign: "center",
              fontSize: ".750rem",
              margin: "0 10px 0 0",
            }}
          >
            {todo.id}
          </span>
          {todo.text} {todo.isDone ? "완료" : "미완료"} <button onClick={() => delTodo(todo.id)}>삭제</button>{" "}
        </div>
      ))}
    </div>
  );
}

export default App;
