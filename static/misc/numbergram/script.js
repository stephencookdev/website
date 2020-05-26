const app = document.getElementById("app");

const isBetween = (x, a, b) => {
  return (a <= x && x <= b) || (b <= x && x <= a);
};

const touchToMouse = {
  start: "down",
  end: "up"
};
const addTouchListener = (target, type, callback) => {
  const mouseType = touchToMouse[type] || type;
  [`mouse${mouseType}`, `touch${type}`].forEach(t =>
    target.addEventListener(t, callback)
  );
};
const removeTouchListener = (target, type, callback) => {
  const mouseType = touchToMouse[type] || type;
  [`mouse${mouseType}`, `touch${type}`].forEach(t =>
    target.removeEventListener(t, callback)
  );
};

// Grid code

class Grid {
  constructor(setCount, setSize) {
    const size = setCount * setSize;
    this.size = size;
    this.cells = [];
    for (let i = 0; i < size * size; i++) {
      this.cells[i] = {
        guessed: false,
        dom: document.createElement("div"),
        value: Math.random() < 0.3 ? 0 : 1
      };
    }

    this.containerDom = document.createElement("div");
    this.containerDom.className = "grid";
    this.containerDom.style = `grid-template-columns: repeat(${size}, 1fr)`;

    for (let i = 0; i < setCount - 1; i++) {
      const setBorder = document.createElement("div");
      setBorder.className = "set-border-x";
      setBorder.style = `left: ${((i + 1) * 100) / setCount}%`;

      this.containerDom.appendChild(setBorder);
    }
    for (let j = 0; j < setCount - 1; j++) {
      const setBorder = document.createElement("div");
      setBorder.className = "set-border-y";
      setBorder.style = `top: ${((j + 1) * 100) / setCount}%`;

      this.containerDom.appendChild(setBorder);
    }
  }

  setGuiNode = node => {
    this._guiNode = node;
  };

  isGuiOpen = () => {
    return this._guiNode.hasAttribute("data-show");
  };

  _getCell = (i, j) => {
    return this.cells[i + j * this.size];
  };

  getCellValue = (i, j) => {
    return this._getCell(i, j).value;
  };

  getCellDom = (i, j) => {
    return this._getCell(i, j).dom;
  };

  _getMouseMoveCell = e => {
    const containerRect = this.containerDom.getBoundingClientRect();

    const clientX =
      typeof e.clientX === "number" ? e.clientX : e.targetTouches[0].clientX;
    const clientY =
      typeof e.clientY === "number" ? e.clientY : e.targetTouches[0].clientY;
    const x =
      (this.size * (clientX - containerRect.left)) / containerRect.width;
    const y =
      (this.size * (clientY - containerRect.top)) / containerRect.height;

    const boundX = Math.max(0, Math.min(this.size - 1, x));
    const boundY = Math.max(0, Math.min(this.size - 1, y));

    return [boundX, boundY];
  };

  startTracking = e => {
    const [rawStartX, rawStartY] = this._getMouseMoveCell(e);
    const startX = Math.floor(rawStartX);
    const startY = Math.floor(rawStartY);

    this._highlightCells([startX, startY], [startX, startY]);

    this._onMouseMove = e => {
      const [rawX, rawY] = this._getMouseMoveCell(e);
      const floorX = Math.floor(rawX);
      const floorY = Math.floor(rawY);
      const diffX = Math.abs(startX - floorX);
      const diffY = Math.abs(startY - floorY);

      const useX = diffX > diffY;
      const endX = useX ? floorX : startX;
      const endY = useX ? startY : floorY;

      if (this._validateCache([endX, endY]))
        this._highlightCells([startX, startY], [endX, endY]);
    };
    addTouchListener(document, "move", this._onMouseMove);
  };

  stopTracking = () => {
    if (this._onMouseMove) {
      this._guiNode.setAttribute("data-show", true);
      removeTouchListener(document, "move", this._onMouseMove);

      delete this._cacheEntry;
      delete this._onMouseMove;
    }
  };

  _validateCache = cellArr => {
    const cacheKey = cellArr.join("/");
    if (this._cacheEntry !== cacheKey) {
      this._cacheEntry = cacheKey;
      return true;
    }
    return false;
  };

  _highlightCells = (start, end) => {
    this._highlightStart = start;
    this._highlightEnd = end;

    if (start && end) this.containerDom.setAttribute("data-highlight", true);
    else this.containerDom.removeAttribute("data-highlight");

    for (let j = 0; j < this.size; j++) {
      for (let i = 0; i < this.size; i++) {
        const curCellNode = this._getCell(i, j).dom;
        const shouldHighlight =
          start &&
          end &&
          isBetween(i, start[0], end[0]) &&
          isBetween(j, start[1], end[1]);
        const currentHighlight = curCellNode.hasAttribute("data-highlight");
        if (shouldHighlight !== currentHighlight && start && end)
          navigator.vibrate(5);

        if (shouldHighlight) curCellNode.setAttribute("data-highlight", true);
        else curCellNode.removeAttribute("data-highlight");
      }
    }
  };

  _checkIfAllCellsComplete = cells => {
    return cells.every(cell => cell.value === 0 || cell.guessed);
  };

  _checkIfRowComplete = row => {
    const cells = new Array(this.size)
      .fill()
      .map((_, i) => this._getCell(i, row));
    if (this._checkIfAllCellsComplete(cells)) {
      document
        .querySelectorAll(".row-info")
        [row].setAttribute("data-complete", true);

      cells.forEach(cell => {
        if (!cell.guessed) {
          cell.guessed = true;
          cell.dom.setAttribute("data-show", 0);
        }
        cell.dom.setAttribute("data-complete", true);
      });

      setTimeout(() => {
        cells.forEach(cell => {
          cell.dom.removeAttribute("data-complete");
        });
      }, 500);
    }
  };

  _checkIfColumnComplete = column => {
    const cells = new Array(this.size)
      .fill()
      .map((_, i) => this._getCell(column, i));
    if (this._checkIfAllCellsComplete(cells)) {
      document
        .querySelectorAll(".column-info")
        [column].setAttribute("data-complete", true);

      cells.forEach(cell => {
        if (!cell.guessed) {
          cell.guessed = true;
          cell.dom.setAttribute("data-show", 0);
        }
        cell.dom.setAttribute("data-complete", true);
      });

      setTimeout(() => {
        cells.forEach(cell => {
          cell.dom.removeAttribute("data-complete");
        });
      }, 500);
    }
  };

  closeGuessAttempt = () => {
    if (!this.guessesComplete()) {
      this._highlightCells(null, null); // un-highlight all the cells
      this._guiNode.removeAttribute("data-show");
    }
  };

  guessesComplete = () => {
    return this._checkIfAllCellsComplete(this.cells);
  };

  guessSelected = selected => {
    if (
      this._highlightStart &&
      this._highlightEnd &&
      typeof selected === "number"
    ) {
      const startX = Math.min(this._highlightStart[0], this._highlightEnd[0]);
      const endX = Math.max(this._highlightStart[0], this._highlightEnd[0]);
      const startY = Math.min(this._highlightStart[1], this._highlightEnd[1]);
      const endY = Math.max(this._highlightStart[1], this._highlightEnd[1]);

      let allCorrect = true;

      for (let j = startY; j <= endY; j++) {
        for (let i = startX; i <= endX; i++) {
          const cell = this._getCell(i, j);
          allCorrect = allCorrect && cell.value === selected;
          if (!allCorrect) break;
        }
      }

      if (allCorrect) {
        for (let j = startY; j <= endY; j++) {
          for (let i = startX; i <= endX; i++) {
            const cell = this._getCell(i, j);
            if (!cell.guessed) {
              cell.guessed = true;
              cell.dom.setAttribute("data-show", cell.value);

              if (cell.value === 1) {
                this._checkIfColumnComplete(i);
                this._checkIfRowComplete(j);
              }
            }
          }
        }
      } else {
        navigator.vibrate(400);
        this.containerDom.classList.add("error-shake");
        setTimeout(
          () => this.containerDom.classList.remove("error-shake"),
          1000
        );
      }
    }

    if (this.guessesComplete()) {
      this._guiNode.setAttribute("data-complete", true);
    } else {
      this.closeGuessAttempt();
    }
  };
}

const getBasicArrayText = basicArray => {
  const textArray = [0];
  basicArray.forEach(val => {
    if (val === 1)
      textArray[textArray.length - 1] = textArray[textArray.length - 1] + 1;
    else if (textArray[textArray.length - 1] !== 0) textArray.push(0);
  });

  return textArray.filter(val => val !== 0);
};

const getColumnText = (dataGrid, column) => {
  const basicArray = new Array(dataGrid.size).fill().map((_, i) => {
    return dataGrid.getCellValue(column, i);
  });

  return getBasicArrayText(basicArray);
};

const getRowText = (dataGrid, row) => {
  const basicArray = new Array(dataGrid.size).fill().map((_, i) => {
    return dataGrid.getCellValue(i, row);
  });

  return getBasicArrayText(basicArray);
};

const setCount = 3;
const setSize = 5;

function makeGame() {
  const dataGrid = new Grid(setCount, setSize);

  const gridWrapper = document.createElement("div");
  gridWrapper.className = "grid-wrapper";

  const columnInfoWrapper = document.createElement("div");
  columnInfoWrapper.className = "column-info-wrapper";
  const rowInfoWrapper = document.createElement("div");
  rowInfoWrapper.className = "row-info-wrapper";

  for (let i = 0; i < dataGrid.size; i++) {
    const columnInfo = document.createElement("span");
    columnInfo.className = "column-info";
    getColumnText(dataGrid, i).forEach(val => {
      const valNode = document.createElement("span");
      valNode.innerText = val;
      columnInfo.appendChild(valNode);
    });
    columnInfoWrapper.appendChild(columnInfo);
  }
  for (let j = 0; j < dataGrid.size; j++) {
    const rowInfo = document.createElement("span");
    rowInfo.className = "row-info";
    getRowText(dataGrid, j).forEach(val => {
      const valNode = document.createElement("span");
      valNode.innerText = val;
      rowInfo.appendChild(valNode);
    });
    rowInfoWrapper.appendChild(rowInfo);
  }

  gridWrapper.appendChild(rowInfoWrapper);
  gridWrapper.appendChild(columnInfoWrapper);

  const gridContainer = dataGrid.containerDom;

  for (let j = 0; j < dataGrid.size; j++) {
    for (let i = 0; i < dataGrid.size; i++) {
      const cell = dataGrid.getCellDom(i, j);
      cell.className = "cell";
      gridContainer.appendChild(cell);
    }
  }

  addTouchListener(gridContainer, "start", e => {
    if (!dataGrid.isGuiOpen()) {
      e.preventDefault();
      dataGrid.startTracking(e);
    }
  });
  addTouchListener(document, "end", e => {
    if (!dataGrid.isGuiOpen()) {
      dataGrid.stopTracking();
    }
  });

  gridWrapper.appendChild(gridContainer);

  app.appendChild(gridWrapper);

  // Gui code

  const guiWrapper = document.createElement("div");
  guiWrapper.className = "gui";

  addTouchListener(guiWrapper, "end", e => {
    if (e.target.className === "gui") {
      e.preventDefault();
      e.stopPropagation();
      dataGrid.closeGuessAttempt();
    }
  });

  const optionList = document.createElement("div");
  optionList.className = "option-list";

  const blockOptionLink = document.createElement("div");
  blockOptionLink.className = "block-option";
  optionList.appendChild(blockOptionLink);

  blockOptionLink.addEventListener("click", e => {
    e.preventDefault();
    e.stopPropagation();
    dataGrid.guessSelected(1);
  });

  const xOptionLink = document.createElement("div");
  xOptionLink.className = "x-option";
  optionList.appendChild(xOptionLink);

  xOptionLink.addEventListener("click", e => {
    e.preventDefault();
    e.stopPropagation();
    dataGrid.guessSelected(0);
  });

  const completeNotice = document.createElement("div");
  completeNotice.className = "complete-notice";
  completeNotice.innerText = "🎉 Nice one! 😊";

  const retryButton = document.createElement("button");
  retryButton.className = "retry-notice";
  retryButton.innerText = "Go again";
  completeNotice.appendChild(retryButton);

  retryButton.addEventListener("click", () => {
    while (app.firstChild) {
      app.removeChild(app.firstChild);
    }

    makeGame();
  });

  optionList.appendChild(completeNotice);

  dataGrid.setGuiNode(guiWrapper);

  guiWrapper.appendChild(optionList);
  app.appendChild(guiWrapper);
}

makeGame();
