import React, { useState } from "react";
import "./taskModal.scss";

import Backdrop from "../Backdrop/Backdrop";

import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { closeAllModals } from "../../../features/global/modalSlice";
import { addTask } from "../../../features/boards/boardSlice";

import { ReactComponent as Cross } from "../../../assets/Icons/icon-cross.svg";

import { dropIn } from "../../../utils/framer-animations";

const AddTaskModal = () => {
  const dispatch = useDispatch();
  const [openDropdown, setOpenDropdown] = useState(false);
  const [taskName, setTaskName] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [columnID, setColumnID] = useState(0);
  const [columnName, setColumnName] = useState("");
  const [priority, setPriority] = useState('')
  const [deadline, setDeadline] = useState('')

  const [errorName, setErrorName] = useState(false);
  const [errorDescription, setErrorDescription] = useState(false);
  const [noColumnSelected, setNoColumnSelected] = useState(false);
  const [errorPriority, setErrorPriority] = useState(false);
  const [errorDeadline, setErrorDeadline] = useState(false);
  // First column on this board
  const boards = useSelector((state) => state.boards.boards);
  const activeBoard = useSelector((state) =>
    boards.find((board) => board.active)
  );
  const activeBoardColumns = activeBoard.columns;

  const handleAddTask = () => {
    let dontSubmit = false;
    setErrorName(false);
    setErrorDescription(false);
    setNoColumnSelected(false);
    setErrorPriority(false);
    setErrorDeadline(false);
    if (taskName === "") {
      setErrorName(true);
      dontSubmit = true;
    }
    if(priority === ''){
      setErrorPriority(true);
      dontSubmit = true;
    }
    if(deadline === ''){
      setErrorDeadline(true);
      dontSubmit = true;
    }

    if (columnID === 0) {
      setNoColumnSelected(true);
      dontSubmit = true;
    }

    if (dontSubmit) return;

    dispatch(
      addTask({
        boardID: activeBoard.id,
        columnID,
        taskName,
        taskDescription,
        priority,
        deadline
      })
    );
    dispatch(closeAllModals());

  };
  return (
    <Backdrop onClick={() => dispatch(closeAllModals())} mobile={false}>
      <form onSubmit={handleAddTask}>
        <motion.div
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          className="addtask-modal"
          variants={dropIn}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          <h2>Add New Task</h2>
          <div
            className={`modal__input-container "
            }`}
          >
            <h3 className="modal-label">Title</h3>
            <input
              type="text"
              className={`modal-input ${errorName && "modal-input__error"}`}
              placeholder="e.g. Start learning Things"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
            />
            {errorName && (
              <p
                className="modal-input__error__message--name"
                style={{ top: "54%" }}
              >
                Please enter a name
              </p>
            )}
          </div>
          <div className="modal__input-container">
            <h3 className="modal-label">Description (optional)</h3>
            <textarea
              className={`modal-input input-area ${
                errorDescription && "modal-input__error"
              }`}
              placeholder="e.g. Start learning Things"
              value={taskDescription}
              onChange={(e) => {
                setTaskDescription(e.target.value);
                if (errorDescription && e.target.value !== "")
                  setErrorDescription(false);
              }}
            />
          </div>
         
          <div
            className={`modal__input-container "
            }`}
          >
            <h3 className="modal-label">Priority</h3>
        
            <div style={{display:'flex', justifyContent:'space-around'}} onChange={(e) => setPriority(e.target.value)}>
              <input type="radio" id="high" value="High" name="priority" /> <label htmlFor="high">High</label>
              <input type="radio" id="medium" value="Medium" name="priority" /> <label htmlFor="medium">Medium</label>
              <input type="radio" id="low" value="Low" name="priority" /> <label htmlFor="low">Low</label>
            </div>

            {errorPriority && (
              <p
                className="modal-input__error__message--name"
                style={{ top: "120%" }}
              >
                Please select priority
              </p>
            )}
          </div>

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

          <div className="add-task__status">
            <p>Status</p>
            <div className="dropdown-wrapper">
              <div
                className={`dropdown__selected ${
                  noColumnSelected
                    ? " dropdown__selected-wrong"
                    : "dropdown__selected-right"
                }`}
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
                  {activeBoardColumns.map((col, index) => (
                    <div
                      key={index}
                      className={`dropdown__option ${
                        columnName === col.name && "dropdown__option--selected"
                      }`}
                      style={{ borderColor: "#ea5555", borderWidth: "2px" }}
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        setColumnID(col.id);
                        setColumnName(col.name);
                        setOpenDropdown(false);
                        if (noColumnSelected) setNoColumnSelected(false);
                      }}
                    >
                      {col.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <button
            className="btn-modal-submit"
            onClick={(e) => {
              e.preventDefault();
              handleAddTask();
            }}
          >
            Create Task
          </button>
        </motion.div>
      </form>
    </Backdrop>
  );
};

export default AddTaskModal;
