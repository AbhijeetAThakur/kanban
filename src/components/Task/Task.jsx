import React from "react";
import "./task.scss";
import { useDispatch } from "react-redux";
import { changeTaskColumn } from "../../features/boards/boardSlice";
import { openViewTaskModal } from "../../features/global/modalSlice";

import { Draggable } from "react-beautiful-dnd";
import { flexbox } from "@mui/system";
const Task = ({ boardID, columnID, task, index, columnIDs }) => {
  const dispatch = useDispatch();

  const result = columnIDs.findIndex(({ id }) => id === columnID);
  return (
    <Draggable draggableId={task.id.toString()} index={index} key={task.id}>
      {(provided) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          className="task bg-task"
          onClick={() => dispatch(openViewTaskModal(task))}
        >
          <h4 className="task__name f-task-title">{task.name}</h4>
          <div className="task__sub f-task-subtitle">
            Priority: {task.priority ? task.priority : "NA"}
          </div>
          <div className="task__sub f-task-subtitle">
            Deadline: {task.deadline ? task.deadline : "NA"}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span
              onClick={(e) => {
                e.stopPropagation();
                dispatch(
                  changeTaskColumn({
                    boardID: task.boardID,
                    taskID: task.id,
                    newColumnID: columnIDs[result - 1].id,
                    oldColumnID: task.columnID,
                  })
                );
              } }
            >
            {result-1 >= 0 ? '<<' : ''}
            </span>
            <span
              onClick={(e) => {
                e.stopPropagation();
                dispatch(
                  changeTaskColumn({
                    boardID: task.boardID,
                    taskID: task.id,
                    newColumnID: columnIDs[result + 1].id,
                    oldColumnID: task.columnID,
                  })
                );
              }}
            >
              {result+1 < columnIDs.length ? '>>' : ''}
            </span>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default Task;
