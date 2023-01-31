import React, { useRef, useState } from "react";
import "./taskModal.scss";
import { ReactComponent as Elipsis } from "../../../assets/Icons/icon-vertical-ellipsis.svg";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";

import { useSelector, useDispatch } from "react-redux";
import {
  closeViewTaskModal,
  openEditTaskModal,
  closeAllModals,
  openDeleteTaskModal,
} from "../../../features/global/modalSlice";
import Backdrop from "../Backdrop/Backdrop";

import "../../Extra/DropdownSettings.scss";

import { useOutsideClick } from "../../../hooks/useOutsideClick";

import { motion } from "framer-motion";
import DropdownStatus from "../../Extra/DropdownStatus";

const ViewTaskModal = ({ handleClose }) => {
  const [openSettings, setOpenSettings] = useState(false);
  const dispatch = useDispatch();
  const task = useSelector((state) => state.modal.viewTaskModal.task);
  const handleCloseSettings = () => {
    setOpenSettings(false);
  };

  const elipsisRef = useRef(null);
  const wrapperRef = useOutsideClick(handleCloseSettings, elipsisRef);

  const closeModal = () => {
    dispatch(closeViewTaskModal());
  };
  return (
    <Modal closeModal={closeModal} open={true} onClose={closeModal}>
      <Box
        className="view-task"
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          border: "none",
          // Remove outline on focus
          outline: "none",
        }}
      >
        <div className="view-task__header | flex">
          <h2 className="view-task__header__title">{task.name}</h2>
          <div className="view-tastk__settings">
            <div
              className="view-task__header__icon"
              style={{ cursor: "pointer" }}
              ref={elipsisRef}
              onClick={() => {
                setOpenSettings(!openSettings);
              }}
            >
              <Elipsis />
            </div>
            {openSettings && (
              <div className="dropdown-settings__task" ref={wrapperRef}>
                <div
                  className="dropdown-settings__item"
                  onClick={() => {
                    dispatch(closeAllModals());
                    dispatch(openEditTaskModal(task));
                  }}
                >
                  Edit Task
                </div>
                <div
                  className="dropdown-settings__item"
                  onClick={() => {
                    dispatch(closeAllModals());
                    dispatch(openDeleteTaskModal(task));
                  }}
                >
                  Delete Task
                </div>
              </div>
            )}
          </div>
        </div>
        <p className="view-task__description">{task.description}</p>

        <div
            className={`modal__input-container "
            }`}
          >
            <h3 className="modal-label">Priority {task.priority}</h3>
        
            <div style={{display:'flex', justifyContent:'space-around'}}>
              <input disabled checked={task.priority === "High"} type="radio" id="high" value="High" name="priority" /> <label htmlFor="high">High</label>
              <input disabled checked={task.priority === "Medium"} type="radio" id="medium" value="Medium" name="priority" /> <label htmlFor="medium">Medium</label>
              <input disabled checked={task.priority === "Low"} type="radio" id="low" value="Low" name="priority" /> <label htmlFor="low">Low</label>
            </div>
            
          </div>

          <div
            className={`modal__input-container "
            }`}
          >
            <h3 className="modal-label">Task Deadline</h3>
        
              <input type="date" id="deadline" value={task.deadline} disabled name="deadline" /> 

          </div>
        
        <div className="view-task__status">
          <p>Current Status</p>
          <DropdownStatus click={handleCloseSettings} task={task} />
        </div>
      </Box>
    </Modal>
  );
};

export default ViewTaskModal;
