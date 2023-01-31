import React from "react";
import "./taskModal.scss";
import "../BoardModal/boardModal.scss";
import { nanoid } from "@reduxjs/toolkit";

import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { editTask } from "../../../features/boards/boardSlice";
import { useState } from "react";
import Backdrop from "../Backdrop/Backdrop";
import { ReactComponent as Cross } from "../../../assets/Icons/icon-cross.svg";
import { dropIn } from "../../../utils/framer-animations";
import { closeAllModals } from "../../../features/global/modalSlice";

const EditTaskModal = () => {
  const dispatch = useDispatch();
  const [openDropdown, setOpenDropdown] = useState(false);
  const editTaskModal = useSelector((state) => state.modal.editTaskModal);
  const task = editTaskModal.task;
  const activeBoard = useSelector((state) =>
    state.boards.boards.find((board) => board.active === true)
  );
  // Task has columnID
  const column = activeBoard.columns.find(
    (column) => column.id === task.columnID
  );
  const [taskName, setTaskName] = useState(task.name);
  const [taskDescription, setTaskDescription] = useState(task.description);
  const [columnID, setColumnID] = useState(task.columnID);
  const [columnName, setColumnName] = useState(column.name);
  const [priority, setPriority] = useState(task.priority);
  const [deadline, setDeadline] = useState(task.deadline);


  // Error
  const [errorName, setErrorName] = useState(false);
  const [errorDescription, setErrorDescription] = useState(false);
  const [errorPriority, setErrorPriority] = useState(false);
  const [errorDeadline, setErrorDeadline] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    let error = false;
    setErrorName(false);
    setErrorDescription(false);

    if (taskName === "") {
      setErrorName(true);
      error = true;
    } else {
      setErrorName(false);
    }

    if (priority === "") {
      setErrorPriority(true);
      error = true;
    } else {
      setErrorName(false);
    }

    if (deadline === "") {
      setErrorDeadline(true);
      error = true;
    } else {
      setErrorDeadline(false);
    }

    if (taskDescription === "") {
      setErrorDescription(true);
      error = true;
    } else {
      setErrorDescription(false);
    }

    if (!error) {
      dispatch(
        editTask({
          boardID: activeBoard.id,
          columnID: columnID,
          oldColumnID: task.columnID,
          task: task,
          taskName: taskName,
          taskDescription: taskDescription,
          priority,
          deadline
        })
      );
      dispatch(closeAllModals());
    }
  };

  return (
    <Backdrop onClick={() => dispatch(closeAllModals())} mobile={false}>
      <form onClick={handleSubmit}>
        <motion.div
          className="edit-task-modal"
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          variants={dropIn}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <h2>Edit Task</h2>
          <div className="modal__input-container">
            <h3 className="modal-label">Title</h3>
            <input
              type="text"
              value={taskName}
              onChange={(e) => {
                setTaskName(e.target.value);
                // Name can't be empty
                if (e.target.value === "") {
                  setErrorName(true);
                } else {
                  setErrorName(false);
                }
              }}
              className={`modal-input ${errorName && "modal-input__error"}`}
            />
            {errorName && (
              <p className="modal-input__error__message">Can't be empty</p>
            )}
          </div>
          <div className="modal__input-container">
            <h3 className="modal-label">Description</h3>
            <textarea
              type="text"
              value={taskDescription}
              onChange={(e) => {
                setTaskDescription(e.target.value);
              }}
              className={`modal-input input-area ${
                errorDescription && "modal-input__error"
              }`}
            />
          </div>

          <div
            className={`modal__input-container "
            }`}
          >
            <h3 className="modal-label">Priority {priority}</h3>
            <div
              style={{ display: "flex", justifyContent: "space-around" }}
              onChange={(e) => setPriority(e.target.value)}
            >
              <input
                checked={priority === "High"}
                type="radio"
                id="high"
                value="High"
                name="priority"
                onChange={(e) => setPriority(e.target.value)}
              />{" "}
              <label htmlFor="high">High</label>
              <input
                checked={priority === "Medium"}
                type="radio"
                id="medium"
                value="Medium"
                name="priority"
                onChange={(e) => setPriority(e.target.value)}
              />{" "}
              <label htmlFor="medium">Medium</label>
              <input
                checked={priority === "Low"}
                type="radio"
                id="low"
                value="Low"
                name="priority"
                onChange={(e) => setPriority(e.target.value)}
              />{" "}
              <label htmlFor="low">Low</label>
            </div>
          </div>

          {errorPriority && (
            <p
              className="modal-input__error__message--name"
              style={{ top: "120%" }}
            >
              Please select priority
            </p>
          )}

<div
            className={`modal__input-container "
            }`}
          >
            <h3 className="modal-label">Task Deadline</h3>
        
              <input type="date" id="deadline" value={deadline} onChange={(e)=>setDeadline(e.target.value)} name="deadline" /> 

            {errorDeadline && (
              <p
                className="modal-input__error__message--name"
                style={{ top: "120%" }}
              >
                Please select Deadline
              </p>
            )}
          </div>

          <div className="task__status">
            <p className="status">Status</p>
            <div className="dropdown-wrapper">
              <div
                className={`dropdown__selected dropdown__selected-right`}
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  setOpenDropdown(!openDropdown);
                }}
              >
                <p>{columnName || "Select Column"}</p>
              </div>
              {openDropdown && (
                <div className="dropdown__options">
                  {activeBoard.columns.map((col, index) => (
                    <div
                      key={index}
                      className={`dropdown__option ${
                        columnID === col.id && "dropdown__option--selected"
                      }`}
                      onClick={() => {
                        setColumnID(col.id);
                        setColumnName(col.name);
                        setOpenDropdown(false);
                      }}
                    >
                      {col.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <button className="btn-modal-submit" onClick={(e) => handleSubmit(e)}>
            Save Changes
          </button>
        </motion.div>
      </form>
    </Backdrop>
  );
};

export default EditTaskModal;
