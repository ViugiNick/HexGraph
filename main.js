var canvas = document.getElementById("mycanvas");
var ctx = canvas.getContext("2d");
var TOP = 120;
var LEFT = 100;
var BOTTOM = 100 + 801;
var RIGHT = 100 + 801;
var PALETTEX = 50;
canvas.width = 901;
canvas.height = 901;
var Hexagon = (function () {
    function Hexagon(x, y, realX, realY, t, sizeOfCell) {
        var _this = this;
        this.picLoaded = false;
        this.x = x;
        this.y = y;
        this.realX = realX;
        this.realY = realY;
        this.type = t;
        this.sizeOfCell = sizeOfCell;
        this.image = new Image();
        this.image.src = this.type;
        this.image.onload = (function () { return _this.printImage(-100, -100); });
    }
    Hexagon.prototype.printImage = function (x, y) {
        this.picLoaded = true;
        ctx.drawImage(this.image, x - this.sizeOfCell, y - (Math.sqrt(3) * this.sizeOfCell) / 2);
        console.log("DRAWWWWWWWWWWWWWW " + x + " " + y, this.image.src);
    };
    Hexagon.prototype.drawHex = function () {
        var _this = this;
        if (this.picLoaded) {
            this.printImage(this.realX, this.realY);
        }
        else {
            this.image.src = this.type;
            this.image.onload = (function () { return _this.printImage(_this.realX, _this.realY); });
        }
        /*
        var id : number = 0;
        var currX : number = -1;
        var currY : number = -1;

        for(var x = LEFT + this.sizeOfCell; x + this.sizeOfCell < RIGHT; x += 3 * this.sizeOfCell / 2)
        {
            id++;
            currX++;
            currY = -1;

            var startY : number;

            if(id % 2 == 1)
            {
                startY =  Math.sqrt(3) * this.sizeOfCell / 2;
            }
            else
            {
                startY = (Math.sqrt(3) * this.sizeOfCell);
            }

            for(var y = TOP + startY; y + (Math.sqrt(3) * this.sizeOfCell / 2) < BOTTOM; y += (Math.sqrt(3) * this.sizeOfCell))
            {
                currY++;
                
                if(currX == this.x && currY == this.y)
                {
                    //console.log("DRAW" + this.image.src + " " + this.type);
                            
                    this.realX = x;
                    this.realY = y;
                    
                    if(this.picLoaded)
                    {
                        this.printImage(this.realX, this.realY);
                    }
                    else
                    {
                        this.image.src = this.type;
                        this.image.onload = (() => this.printImage(this.realX, this.realY));
                    }
                }
            }
        }
        */
    };
    return Hexagon;
})();
var Point = (function () {
    function Point(x, y) {
        this.x = x;
        this.y = y;
    }
    Point.prototype.sqrDist = function (p) {
        return (p.x - this.x) * (p.x - this.x) + (p.y - this.y) * (p.y - this.y);
    };
    return Point;
})();
var HexGrid = (function () {
    function HexGrid(size) {
        this.flag = new Array(25);
        this.map = new Array(25);
        this.centersOfCells = new Array(25);
        this.paletteFlag = new Array(25);
        this.palette = new Array(25);
        this.paletteCenters = new Array(25);
        this.isMoving = false;
        this.sizeOfCell = size;
        for (var i = 0; i < 25; i++) {
            this.flag[i] = new Array(25);
            this.map[i] = new Array(25);
            this.centersOfCells[i] = new Array(25);
            for (var j = 0; j < 25; j++)
                this.flag[i][j] = false;
        }
        var id = 0;
        var currX = -1;
        var currY = -1;
        var currYY = -1;
        for (var y = 150; y + (Math.sqrt(3) * this.sizeOfCell / 2) < BOTTOM; y += (Math.sqrt(3) * this.sizeOfCell)) {
            currYY++;
            this.paletteCenters[currYY] = new Point(PALETTEX, y);
        }
        for (var x = LEFT + this.sizeOfCell; x + this.sizeOfCell < RIGHT; x += 3 * this.sizeOfCell / 2) {
            id++;
            currX++;
            currY = -1;
            //console.log(x);
            var startY;
            if (id % 2 == 1) {
                startY = Math.sqrt(3) * this.sizeOfCell / 2;
            }
            else {
                startY = (Math.sqrt(3) * this.sizeOfCell);
            }
            for (var y = TOP + startY; y + (Math.sqrt(3) * this.sizeOfCell / 2) < BOTTOM; y += (Math.sqrt(3) * this.sizeOfCell)) {
                currY++;
                this.centersOfCells[currX][currY] = new Point(x, y);
            }
        }
    }
    HexGrid.prototype.drawGrid = function () {
        //console.log("New Phase");
        ctx.fillStyle = "#171d25";
        ctx.strokeStyle = "#ffbc06";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#ffbc06";
        ctx.strokeStyle = "#ffbc06";
        ctx.fillRect(0, 115, 900, 5);
        ctx.fillRect(95, 0, 5, 900);
        for (var i = 0; i < 25; i++) {
            for (var j = 0; j < 25; j++) {
                if (this.centersOfCells[i][j]) {
                    this.drawHex(this.centersOfCells[i][j].x, this.centersOfCells[i][j].y);
                    if (this.flag[i][j]) {
                        //console.log(i + " " + j);
                        this.map[i][j].drawHex();
                    }
                }
            }
        }
        for (var i = 0; i < 25; i++) {
            if (this.paletteCenters[i]) {
                this.drawHex(this.paletteCenters[i].x, this.paletteCenters[i].y);
                if (this.paletteFlag[i]) {
                    this.palette[i].drawHex();
                }
            }
        }
    };
    HexGrid.prototype.drawHex = function (x, y) {
        ctx.beginPath();
        ctx.moveTo(x - this.sizeOfCell / 2, y - (Math.sqrt(3) * this.sizeOfCell / 2));
        ctx.lineTo(x + this.sizeOfCell / 2, y - (Math.sqrt(3) * this.sizeOfCell / 2));
        ctx.lineTo(x + this.sizeOfCell, y);
        ctx.lineTo(x + this.sizeOfCell / 2, y + (Math.sqrt(3) * this.sizeOfCell / 2));
        ctx.lineTo(x - this.sizeOfCell / 2, y + (Math.sqrt(3) * this.sizeOfCell / 2));
        ctx.lineTo(x - this.sizeOfCell, y);
        ctx.closePath();
        ctx.stroke();
    };
    HexGrid.prototype.addHex = function (positionX, positionY, type) {
        this.map[positionX][positionY] = new Hexagon(positionX, positionY, this.centersOfCells[positionX][positionY].x, this.centersOfCells[positionX][positionY].y, type, this.sizeOfCell);
        this.flag[positionX][positionY] = true;
    };
    HexGrid.prototype.addToPalette = function (positionY, type) {
        this.palette[positionY] = new Hexagon(-1, positionY, this.paletteCenters[positionY].x, this.paletteCenters[positionY].y, type, this.sizeOfCell);
        this.paletteFlag[positionY] = true;
    };
    HexGrid.prototype.myMove = function (e) {
        //console.log("!!!");
        if (mainField.isMoving) {
            console.log("!!!");
            mainField.drawGrid();
            mainField.movingHex.printImage(e.pageX, e.pageY);
            mainField.isMoving = true;
        }
    };
    HexGrid.prototype.myDown = function (e) {
        for (var i = 0; i < 25; i++) {
            for (var j = 0; j < 25; j++) {
                if (mainField.centersOfCells[i][j]) {
                    //console.log(i + " " + j);
                    var tmp = new Point(e.pageX, e.pageY);
                    if (mainField.flag[i][j] && mainField.centersOfCells[i][j].sqrDist(tmp) < (3 * (mainField.sizeOfCell) * (mainField.sizeOfCell) / 4)) {
                        //console.log(i + " " + j);
                        mainField.oldPosition = mainField.centersOfCells[i][j];
                        mainField.isMoving = true;
                        mainField.movingHex = mainField.map[i][j];
                        mainField.flag[i][j] = false;
                        delete mainField.map[i][j];
                        canvas.onmousemove = mainField.myMove;
                        mainField.drawGrid();
                    }
                }
            }
        }
        for (var i = 0; i < 25; i++) {
            if (mainField.paletteCenters[i]) {
                var tmp = new Point(e.pageX, e.pageY);
                if (mainField.paletteFlag[i] && mainField.paletteCenters[i].sqrDist(tmp) < (3 * (mainField.sizeOfCell) * (mainField.sizeOfCell) / 4)) {
                    console.log("!!!", mainField.palette[i].type);
                    mainField.oldPosition = new Point(-1, -1);
                    mainField.isMoving = true;
                    mainField.movingHex = new Hexagon(-100, -100, -100, -100, mainField.palette[i].type, mainField.sizeOfCell); //mainField.map[i][j];
                    canvas.onmousemove = mainField.myMove;
                    mainField.drawGrid();
                }
            }
        }
    };
    HexGrid.prototype.myUp = function (e) {
        mainField.drawGrid();
        for (var i = 0; i < 25; i++) {
            for (var j = 0; j < 25; j++) {
                if (mainField.centersOfCells[i][j]) {
                    var tmp = new Point(e.pageX, e.pageY);
                    if (!mainField.flag[i][j] && mainField.centersOfCells[i][j].sqrDist(tmp) < (3 * (mainField.sizeOfCell) * (mainField.sizeOfCell) / 4)) {
                        //console.log("---");
                        //mainField.oldPosition = mainField.centersOfCells[i][j];
                        mainField.isMoving = false;
                        mainField.map[i][j] = mainField.movingHex;
                        mainField.map[i][j].x = i;
                        mainField.map[i][j].y = j;
                        mainField.map[i][j].realX = mainField.centersOfCells[i][j].x;
                        mainField.map[i][j].realY = mainField.centersOfCells[i][j].y;
                        mainField.flag[i][j] = true;
                        canvas.onmousemove = null;
                        mainField.drawGrid();
                    }
                }
            }
        }
        if (mainField.isMoving && mainField.movingHex != null) {
            if (mainField.movingHex.x == -100 && mainField.movingHex.y == -100) {
                delete mainField.movingHex;
                mainField.isMoving = false;
            }
            else {
                var tmp = new Point(mainField.movingHex.x, mainField.movingHex.y);
                mainField.isMoving = false;
                mainField.map[tmp.x][tmp.y] = mainField.movingHex;
                mainField.flag[tmp.x][tmp.y] = true;
                canvas.onmousemove = null;
                mainField.isMoving = false;
                mainField.drawGrid();
            }
        }
        mainField.movingHex = null;
        canvas.onmousemove = null;
    };
    return HexGrid;
})();
var mainField = new HexGrid(25);
mainField.addToPalette(0, "a.svg");
mainField.addToPalette(1, "b.svg");
mainField.drawGrid();
canvas.onmousedown = mainField.myDown;
canvas.onmouseup = mainField.myUp;
//# sourceMappingURL=main.js.map