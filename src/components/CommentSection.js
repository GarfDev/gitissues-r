import React, { useState, useEffect, Component } from "react";
import { Card, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "./CommentSection.css";

function CommentsSection(props) {
  const getComments = async () => {
    const url =
      "https://api.github.com/repos/stevenkeezer/gitissues-r/issues/6/comments";
    const result = await fetch(url);
    const data = await result.json();
    setTasks(data);
    console.log(data);
  };

  useEffect(() => getComments(), []);

  const postComment = async comment => {
    console.log("props.accessToken", props.accessToken)
    const url =
      "https://api.github.com/repos/stevenkeezer/gitissues-r/issues/6/comments";
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `token ${props.accessToken}`,
        Accept: "application/vnd.github.golden-comet-preview+json"
      },
      body: JSON.stringify({ body: `${comment}` })
    });
  };

  const AddTaskForm = ({ addTask }) => {
    const [value, setValue] = useState("");

    const handleSubmit = e => {
      e.preventDefault();
      value && addTask(value);
      setValue("");
    };

    return (
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={value}
          placeholder="Enter a comment…"
          onChange={e => setValue(e.target.value)}
        />
        <button type="submit">Enter</button>
      </form>
    );
  };

  const [tasks, setTasks] = useState([]);

  const addTask = text => setTasks([...tasks, { text }], postComment(text));

  const toggleTask = index => {
    const newTasks = [...tasks];
    newTasks[index].isCompleted = !newTasks[index].isCompleted;
    setTasks(newTasks);
  };

  const removeTask = index => {
    const newTasks = [...tasks];
    newTasks.splice(index, 1);
    setTasks(newTasks);
  };
  return (
    <div className="todo-list mx-auto">
      {tasks.map((task, index) => (
        <div className="todo">
          <Card>
          {// <Card.Header>{task.user.login}</Card.Header>
          }
            <Card.Body>
              <Card.Title></Card.Title>
              <Card.Text>{task.body}</Card.Text>
            </Card.Body>
          </Card>
          <button onClick={() => removeTask(index)}>Remove</button>
        </div>
      ))}
      <AddTaskForm addTask={addTask} />
    </div>
  );
}

export default CommentsSection;

// <span
//   onClick={() => toggleTask(index)}
//   className={task.isCompleted ? "todo-text todo-completed" : "todo-text"}
// >
//   {task.text}
// </span>;
