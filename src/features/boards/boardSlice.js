import { createSlice, nanoid, current } from "@reduxjs/toolkit";
import boards from "../../app/data.json";
import { randomHexColor } from "./boardHelper";

// The Board has the following properties:
// board: [{name: "Board Name", id: nanoid()}{
// columns: [{id: nanoid()}, boardID: 1{
// tasks: [{name: "Task Name"}, {columnID: 1}{id: nanoid()},{

const initialState = {
  boards: boards.boards,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

export const boardsSlice = createSlice({
  name: "boards",
  initialState,
  reducers: {
    addBoard: (state, action) => {
      const newID = nanoid();
      const { boardName } = action.payload;
      const { columnNames } = action.payload;
      const columns = columnNames.map((name) => {
        return {
          id: nanoid(),
          boardID: newID,
          color: randomHexColor(),
          name: name,
          tasks: [],
        };
      });
      const newBoard = {
        id: newID,
        name: boardName,
        columns: columns,
      };
      state.boards.push(newBoard);
    },
    dragAndDropBoard: (state, action) => {
      const { source, destination } = action.payload;
      const board = state.boards[source.index];
      state.boards.splice(source.index, 1);
      state.boards.splice(destination.index, 0, board);
    },

    deleteBoard: (state, action) => {
      const boardID = action.payload;
      state.boards = state.boards.filter((board) => board.id !== boardID);
      // Set active board to the first board in the array
      state.boards[0].active = true;
    },
    editBoard: (state, action) => {
      const { columns, boardID, boardName } = action.payload;
      const board = state.boards.find((board) => board.id === boardID);
      if (board) {
        board.name = boardName;
        board.columns = columns;
      }
    },

    clearBoard: (state, action) => {
      const board = state.boards.find((board) => board.id === action.payload);
      if (board) {
        board.columns = [];
      }
    },
    setActiveBoard: (state, action) => {
      // First remove active from all boards
      state.boards.forEach((board) => {
        board.active = false;
      });
      const board = state.boards.find((board) => board.id === action.payload);
      if (board) {
        board.active = true;
      }
    },

    // Columns
    addColumn: {
      reducer: (state, action) => {},
      // Column has color which will be generated randomly
      prepare: (name, boardID) => {
        return {
          payload: {
            id: nanoid(),
            name,
            boardID,
            color: randomHexColor(),
            tasks: [],
          },
        };
      },
    },
    deleteColumn: (state, action) => {},
    editColumn: (state, action) => {},

    // Tasks
    addTask: (state, action) => {
      const {
        boardID,
        columnID,
        taskName,
        taskDescription,
        priority,
        deadline
      } = action.payload;
      const board = state.boards.find((b) => b.id === boardID);
      const column = board.columns.find((c) => c.id === columnID);
      const newTaskID = nanoid();

      const newTask = {
        id: newTaskID,
        columnID: columnID,
        boardID: boardID,
        name: taskName,
        description: taskDescription,
        priority,
        deadline
      };
      console.log(newTask);
      column.tasks.push(newTask);
    },

    deleteTask: (state, action) => {
      const { task } = action.payload;
      const board = state.boards.find((b) => b.id === task.boardID);
      const column = board.columns.find((c) => c.id === task.columnID);

      // Remove the task from the column
      column.tasks = column.tasks.filter((t) => t.id !== task.id);
    },
    editTask: (state, action) => {
      const {
        boardID,
        oldColumnID,
        columnID,
        task,
        taskName,
        taskDescription,
        priority,
        deadline
      } = action.payload;
      const board = state.boards.find((b) => b.id === boardID);
      const oldColumn = board.columns.find((c) => c.id === oldColumnID);
      const newColumn = board.columns.find((c) => c.id === columnID);
      const stateTask = oldColumn.tasks.find((t) => t.id === task.id);

      let newTask = [];

      // Check if its the same column
      if (oldColumnID === columnID) {
        newTask = {
          ...task,
          name: taskName,
          description: taskDescription,
          priority,
          deadline
        };
        // Replace the task in the column
        oldColumn.tasks = oldColumn.tasks.map((t) => {
          if (t.id === task.id) {
            return newTask;
          } else {
            return t;
          }
        });
      } else {
        
        newTask = {
          ...task,
          name: taskName,
          description: taskDescription,
          columnID: columnID,
          priority,
          deadline
        };

        // Remove the task from the old column
        oldColumn.tasks = oldColumn.tasks.filter((t) => t.id !== task.id);
        // Add the task to the new column
        newColumn.tasks.push(newTask);
        console.log(newColumn.tasks);
      }
      console.log(current(stateTask));
    },
    reorderTaskDragDrop: (state, action) => {
      const { source, destination } = action.payload;
      console.log('action', action.payload);
      const activeBoard = state.boards.find((b) => b.active === true);
      // destion.dropableId is the index of the column
      const sourceColumn = activeBoard.columns[source.droppableId];
      const destinationColumn = activeBoard.columns[destination.droppableId];
      const task = sourceColumn.tasks[source.index];
      sourceColumn.tasks.splice(source.index, 1);
      destinationColumn.tasks.splice(destination.index, 0, task);
      const intDestId = parseInt(destination.droppableId);
      task.columnID = destinationColumn.id;
    },
    changeTaskColumn: (state, action) => {
      const { boardID, oldColumnID, newColumnID, taskID } = action.payload;
      const board = state.boards.find((b) => b.id === boardID);
      const oldColumn = board.columns.find((c) => c.id === oldColumnID);
      const newColumn = board.columns.find((c) => c.id === newColumnID);
      const task = oldColumn.tasks.find((t) => t.id === taskID);
      oldColumn.tasks = oldColumn.tasks.filter((t) => t.id !== taskID);
      task.columnID = newColumnID;
      newColumn.tasks.push(task);
    }
  },
});


export const findActiveBoard = (state) => {
  // Find the board that has the attribute active = true
  return state.boards.boards.find((b) => b.active);
};

export const {
  addBoard,
  deleteBoard,
  editBoard,
  setActiveBoard,
  addColumn,
  deleteColumn,
  editColumn,
  addTask,
  dragAndDropBoard,
  deleteTask,
  editTask,
  changeTaskColumn,
  reorderTaskDragDrop,
  clearBoard,
} = boardsSlice.actions;

export default boardsSlice.reducer;
