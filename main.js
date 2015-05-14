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
        //console.log("DRAWWWWWWWWWWWWWW " + x + " " + y, this.image.src);
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
        ctx.fillStyle = "grey";
        ctx.beginPath();
        ctx.arc(this.realX + this.sizeOfCell, this.realY, 5, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();
    };
    return Hexagon;
})();
var Graph = (function () {
    function Graph(size) {
        this.arrayOfPoints = [];
        this.newCoordToOld = new Array(110);
        this.map = new Array(110);
        this.badPoints = new Array(110);
        this.isCenter = new Array(110);
        this.sizeOfCell = size;
        for (var i1 = 0; i1 < 110; i1++) {
            this.map[i1] = new Array(110);
            for (var i2 = 0; i2 < 110; i2++) {
                this.map[i1][i2] = [];
            }
            this.badPoints[i1] = new Array(110);
            this.isCenter[i1] = new Array(110);
            for (var j = 0; j < 110; j++) {
                this.badPoints[i1][j] = false;
                this.isCenter[i1][j] = false;
            }
        }
        var id = 0;
        var currX = -1;
        var currY = -1;
        for (var x = LEFT + this.sizeOfCell; x + this.sizeOfCell < RIGHT; x += 3 * this.sizeOfCell / 2) {
            id++;
            currX++;
            currY = -1;
            var startY;
            if (id % 2 == 1) {
                startY = Math.sqrt(3) * this.sizeOfCell / 2;
            }
            else {
                startY = (Math.sqrt(3) * this.sizeOfCell);
            }
            for (var y = TOP + startY; y + (Math.sqrt(3) * this.sizeOfCell / 2) < BOTTOM; y += (Math.sqrt(3) * this.sizeOfCell)) {
                this.addPoint(x - this.sizeOfCell / 2);
                this.addPoint(x + this.sizeOfCell / 2);
                this.addPoint(x + this.sizeOfCell);
                this.addPoint(x - this.sizeOfCell);
                this.addPoint(y - (Math.sqrt(3) * this.sizeOfCell / 2));
                this.addPoint(y + (Math.sqrt(3) * this.sizeOfCell / 2));
                this.addPoint(y);
                this.addPoint(x);
            }
        }
        this.arrayOfPoints.sort();
        for (var i = 0; i < this.arrayOfPoints.length; i++) {
            this.newCoordToOld[this.arrayOfPoints[i]] = i;
        }
        id = 0;
        currX = -1;
        currY = -1;
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
                //console.log("Point : " + x + " " + y);
                /*
                ..+++..
                .*****.
                ..***..
                */
                //this.map[this.newCoord(x - this.sizeOfCell/2)][this.newCoord(y - (Math.sqrt(3) * this.sizeOfCell / 2))][this.newCoord(x + this.sizeOfCell/2)][this.newCoord(y - (Math.sqrt(3) * this.sizeOfCell / 2))] = true;
                this.addEdge(x - this.sizeOfCell / 2, y - (Math.sqrt(3) * this.sizeOfCell / 2), x + this.sizeOfCell / 2, y - (Math.sqrt(3) * this.sizeOfCell / 2));
                this.addEdge(x + this.sizeOfCell / 2, y - (Math.sqrt(3) * this.sizeOfCell / 2), x - this.sizeOfCell / 2, y - (Math.sqrt(3) * this.sizeOfCell / 2));
                /*
                ..**+..
                .****+.
                ..***..
                */
                //this.map[this.newCoord(x + this.sizeOfCell/2)][this.newCoord(y - (Math.sqrt(3) * this.sizeOfCell / 2))][this.newCoord(x + this.sizeOfCell)][this.newCoord(y)] = true;
                this.addEdge(x + this.sizeOfCell / 2, y - (Math.sqrt(3) * this.sizeOfCell / 2), x + this.sizeOfCell, y);
                this.addEdge(x + this.sizeOfCell, y, x + this.sizeOfCell / 2, y - (Math.sqrt(3) * this.sizeOfCell / 2));
                /*
                ..***..
                .****+.
                ..**+..
                */
                //this.map[this.newCoord(x + this.sizeOfCell)][this.newCoord(y)][this.newCoord(x + this.sizeOfCell/2)][this.newCoord(y + (Math.sqrt(3) * this.sizeOfCell / 2))] = true;
                this.addEdge(x + this.sizeOfCell, y, x + this.sizeOfCell / 2, y + (Math.sqrt(3) * this.sizeOfCell / 2));
                this.addEdge(x + this.sizeOfCell / 2, y + (Math.sqrt(3) * this.sizeOfCell / 2), x + this.sizeOfCell, y);
                /*
                ..***..
                .*****.
                ..+++..
                */
                //this.map[this.newCoord(x + this.sizeOfCell/2)][this.newCoord(y + (Math.sqrt(3) * this.sizeOfCell / 2))][this.newCoord(x - this.sizeOfCell/2)][this.newCoord(y + (Math.sqrt(3) * this.sizeOfCell / 2))] = true;
                this.addEdge(x + this.sizeOfCell / 2, y + (Math.sqrt(3) * this.sizeOfCell / 2), x - this.sizeOfCell / 2, y + (Math.sqrt(3) * this.sizeOfCell / 2));
                this.addEdge(x - this.sizeOfCell / 2, y + (Math.sqrt(3) * this.sizeOfCell / 2), x + this.sizeOfCell / 2, y + (Math.sqrt(3) * this.sizeOfCell / 2));
                /*
                ..***..
                .+****.
                ..+**..
                */
                //this.map[this.newCoord(x - this.sizeOfCell/2)][this.newCoord(y + (Math.sqrt(3) * this.sizeOfCell / 2))][this.newCoord(x - this.sizeOfCell)][this.newCoord(y)] = true;
                this.addEdge(x - this.sizeOfCell / 2, y + (Math.sqrt(3) * this.sizeOfCell / 2), x - this.sizeOfCell, y);
                this.addEdge(x - this.sizeOfCell, y, x - this.sizeOfCell / 2, y + (Math.sqrt(3) * this.sizeOfCell / 2));
                /*
                ..+**..
                .+****.
                ..***..
                */
                //this.map[this.newCoord(x - this.sizeOfCell)][this.newCoord(y)][this.newCoord(x - this.sizeOfCell/2)][this.newCoord(y - (Math.sqrt(3) * this.sizeOfCell / 2))] = true;
                this.addEdge(x - this.sizeOfCell, y, x - this.sizeOfCell / 2, y - (Math.sqrt(3) * this.sizeOfCell / 2));
                this.addEdge(x - this.sizeOfCell / 2, y - (Math.sqrt(3) * this.sizeOfCell / 2), x - this.sizeOfCell, y);
                /*
                ..***..
                .+++++.
                ..***..
                */
                //this.map[this.newCoord(x - this.sizeOfCell)][this.newCoord(y)][this.newCoord(x)][this.newCoord(y)] = true;
                //this.map[this.newCoord(x)][this.newCoord(y)][this.newCoord(x + this.sizeOfCell)][this.newCoord(y)] = true;
                this.addEdge(x - this.sizeOfCell, y, x, y);
                this.addEdge(x, y, x - this.sizeOfCell, y);
                //this.map[this.newCoord(x + this.sizeOfCell)][this.newCoord(y)][this.newCoord(x)][this.newCoord(y)] = true;
                //this.map[this.newCoord(x)][this.newCoord(y)][this.newCoord(x - this.sizeOfCell)][this.newCoord(y)] = true;
                this.addEdge(x + this.sizeOfCell, y, x, y);
                this.addEdge(x, y, x + this.sizeOfCell, y);
                this.isCenter[this.newCoord(x)][this.newCoord(y)] = true;
            }
        }
    }
    Graph.prototype.newCoord = function (x) {
        return this.newCoordToOld[Math.floor(x)];
    };
    Graph.prototype.addEdge = function (x1, y1, x2, y2) {
        var flag = true;
        for (var i = 0; i < this.map[this.newCoord(x1)][this.newCoord(y1)].length; i++)
            if (this.map[this.newCoord(x1)][this.newCoord(y1)].x == this.newCoord(x2) && this.map[this.newCoord(x1)][this.newCoord(y1)].y == this.newCoord(y2))
                flag = false;
        if (flag)
            this.map[this.newCoord(x1)][this.newCoord(y1)].push(new Point(this.newCoord(x2), this.newCoord(y2)));
    };
    Graph.prototype.addPoint = function (z) {
        z = Math.floor(z);
        var flag = true;
        for (var i = 0; i < this.arrayOfPoints.length; i++) {
            if (z == this.arrayOfPoints[i])
                flag = false;
        }
        if (flag)
            this.arrayOfPoints.push(z);
    };
    Graph.prototype.markPoints = function (x, y) {
        this.badPoints[this.newCoord(x - this.sizeOfCell / 2)][this.newCoord(y - (Math.sqrt(3) * this.sizeOfCell / 2))] = true;
        this.badPoints[this.newCoord(x + this.sizeOfCell / 2)][this.newCoord(y - (Math.sqrt(3) * this.sizeOfCell / 2))] = true;
        this.badPoints[this.newCoord(x - this.sizeOfCell / 2)][this.newCoord(y + (Math.sqrt(3) * this.sizeOfCell / 2))] = true;
        this.badPoints[this.newCoord(x + this.sizeOfCell / 2)][this.newCoord(y + (Math.sqrt(3) * this.sizeOfCell / 2))] = true;
        this.badPoints[this.newCoord(x + this.sizeOfCell)][this.newCoord(y)] = true;
        this.badPoints[this.newCoord(x - this.sizeOfCell)][this.newCoord(y)] = true;
        //console.log(this.newCoord(x - this.sizeOfCell/2));
        //console.log(this.newCoord(x + this.sizeOfCell/2));
        //console.log(this.newCoord(y - (Math.sqrt(3) * this.sizeOfCell / 2)));
        //console.log(this.newCoord(y + (Math.sqrt(3) * this.sizeOfCell / 2)));
    };
    Graph.prototype.bfs = function (v1, v2) {
        var used = new Array(110);
        var parent = new Array(110);
        for (var i = 0; i < 110; i++) {
            used[i] = new Array(110);
            parent[i] = new Array(110);
            for (var j = 0; j < 110; j++)
                used[i][j] = false;
        }
        var queue = [];
        queue.push(v1);
        used[v1.x][v1.y] = true;
        while (queue.length > 0) {
            var v = queue.shift();
            for (var i = 0; i < this.map[v.x][v.y].length; i++) {
                var newPoint = this.map[v.x][v.y][i];
                if (!used[newPoint.x][newPoint.y] && (!this.badPoints[newPoint.x][newPoint.y] || (newPoint.x == v2.x && newPoint.y == v2.y))) {
                    if (!(newPoint.x == v2.x && newPoint.y == v2.y && this.isCenter[v.x][v.y])) {
                        used[newPoint.x][newPoint.y] = true;
                        parent[newPoint.x][newPoint.y] = v;
                        queue.push(newPoint);
                    }
                }
            }
        }
        var answer = [];
        var tempX = v2.x;
        var tempY = v2.y;
        //console.log(v1.x + " " + v1.y + " -> " + v2.x + " " + v2.y);
        //console.log(parent[v2.x][v2.y].x + " " + parent[v2.x][v2.y].y);
        answer.push(new Point(tempX, tempY));
        //console.log(used[tempX][tempY]);
        if (used[tempX][tempY]) {
            while (!(tempX == v1.x && tempY == v1.y)) {
                //console.log("Rebro");
                var oldX = tempX;
                var oldY = tempY;
                tempX = parent[oldX][oldY].x;
                tempY = parent[oldX][oldY].y;
                answer.push(new Point(tempX, tempY));
            }
            answer.push(new Point(v1.x, v1.y));
            return answer;
        }
    };
    Graph.prototype.findPath = function (vertex1, vertex2) {
        //console.log((vertex1 == undefined) + " " + (vertex2 == undefined));
        if (vertex1 != undefined && vertex2 != undefined) {
            var vertex1array = new Array(6);
            vertex1array[0] = new Point(Math.floor(vertex1.realX - this.sizeOfCell / 2), Math.floor(vertex1.realY - (Math.sqrt(3) * this.sizeOfCell / 2)));
            vertex1array[1] = new Point(Math.floor(vertex1.realX + this.sizeOfCell / 2), Math.floor(vertex1.realY - (Math.sqrt(3) * this.sizeOfCell / 2)));
            vertex1array[2] = new Point(Math.floor(vertex1.realX + this.sizeOfCell), Math.floor(vertex1.realY));
            vertex1array[3] = new Point(Math.floor(vertex1.realX + this.sizeOfCell / 2), Math.floor(vertex1.realY + (Math.sqrt(3) * this.sizeOfCell / 2)));
            vertex1array[4] = new Point(Math.floor(vertex1.realX - this.sizeOfCell / 2), Math.floor(vertex1.realY + (Math.sqrt(3) * this.sizeOfCell / 2)));
            vertex1array[5] = new Point(Math.floor(vertex1.realX - this.sizeOfCell), Math.floor(vertex1.realY));
            var vertex2array = new Array(6);
            vertex2array[0] = new Point(Math.floor(vertex2.realX - this.sizeOfCell / 2), Math.floor(vertex2.realY - (Math.sqrt(3) * this.sizeOfCell / 2)));
            vertex2array[1] = new Point(Math.floor(vertex2.realX + this.sizeOfCell / 2), Math.floor(vertex2.realY - (Math.sqrt(3) * this.sizeOfCell / 2)));
            vertex2array[2] = new Point(Math.floor(vertex2.realX + this.sizeOfCell), Math.floor(vertex2.realY));
            vertex2array[3] = new Point(Math.floor(vertex2.realX + this.sizeOfCell / 2), Math.floor(vertex2.realY + (Math.sqrt(3) * this.sizeOfCell / 2)));
            vertex2array[4] = new Point(Math.floor(vertex2.realX - this.sizeOfCell / 2), Math.floor(vertex2.realY + (Math.sqrt(3) * this.sizeOfCell / 2)));
            vertex2array[5] = new Point(Math.floor(vertex2.realX - this.sizeOfCell), Math.floor(vertex2.realY));
            for (var i = 0; i < 6; i++) {
                vertex1array[i].x = this.newCoordToOld[vertex1array[i].x];
                vertex1array[i].y = this.newCoordToOld[vertex1array[i].y];
                vertex2array[i].x = this.newCoordToOld[vertex2array[i].x];
                vertex2array[i].y = this.newCoordToOld[vertex2array[i].y];
            }
            var minPath = 100000;
            var answer = new Array();
            for (var i1 = 0; i1 < 6; i1++) {
                for (var i2 = 0; i2 < 6; i2++) {
                    //console.log(i1 + " " + i2);
                    var tmp = [];
                    tmp = this.bfs(vertex1array[i1], vertex2array[i2]);
                    if (tmp != undefined) {
                        if (tmp.length < minPath) {
                            minPath = tmp.length;
                            answer = tmp;
                        }
                    }
                }
            }
            //console.log(minPath);
            if (answer[0] != undefined) {
                ctx.strokeStyle = 'red';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.moveTo(this.arrayOfPoints[answer[0].x], this.arrayOfPoints[answer[0].y]);
                for (var i = 0; i < answer.length; i++) {
                    ctx.lineTo(this.arrayOfPoints[answer[i].x], this.arrayOfPoints[answer[i].y]);
                    //console.log(answer[i].x + " " + answer[i].y);
                    this.badPoints[answer[i].x][answer[i].y] = true;
                }
                //console.log("------------------------");
                ctx.stroke();
                //Arrow drawing
                var xA = this.arrayOfPoints[answer[1].x] - this.arrayOfPoints[answer[0].x];
                var yA = this.arrayOfPoints[answer[1].y] - this.arrayOfPoints[answer[0].y];
                var xA1 = (xA * Math.cos(10) - yA * Math.sin(10)) / 2;
                var yA1 = (xA * Math.sin(10) + yA * Math.cos(10)) / 2;
                var xA2 = (xA * Math.cos(-10) - yA * Math.sin(-10)) / 2;
                var yA2 = (xA * Math.sin(-10) + yA * Math.cos(-10)) / 2;
                ctx.beginPath();
                ctx.moveTo(this.arrayOfPoints[answer[0].x] - xA1, this.arrayOfPoints[answer[0].y] - yA1);
                ctx.lineTo(this.arrayOfPoints[answer[0].x], this.arrayOfPoints[answer[0].y]);
                ctx.lineTo(this.arrayOfPoints[answer[0].x] - xA2, this.arrayOfPoints[answer[0].y] - yA2);
                //console.log(answer[1].x + xA1 + " : " + answer[1].y + yA1);
                ctx.stroke();
                ctx.lineWidth = 1;
            }
        }
    };
    Graph.prototype.setBadPoint = function (x, y, b) {
        this.badPoints[x][y] = b;
    };
    return Graph;
})();
var Point = (function () {
    function Point(x, y) {
        this.x = x;
        this.y = y;
    }
    Point.prototype.add = function (x, y) {
        return new Point(this.x + x, this.y + y);
    };
    Point.prototype.sqrDist = function (p) {
        return (p.x - this.x) * (p.x - this.x) + (p.y - this.y) * (p.y - this.y);
    };
    return Point;
})();
var HexGrid = (function () {
    function HexGrid(size) {
        var _this = this;
        this.flag = new Array(25);
        this.map = new Array(25);
        this.centersOfCells = new Array(25);
        this.garbageImage = new Image();
        this.paletteFlag = new Array(25);
        this.palette = new Array(25);
        this.paletteCenters = new Array(25);
        this.listOfPathS = new Array();
        this.listOfPathE = new Array();
        this.isMoving = false;
        this.isEdging = false;
        this.sizeOfCell = size;
        this.mainGraph = new Graph(size);
        this.garbageImage.src = 'garbage.svg';
        this.garbageImage.onload = (function () { return _this.printGarbageImage(3, 13); });
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
    HexGrid.prototype.printGarbageImage = function (x, y) {
        ctx.drawImage(this.garbageImage, x, y);
    };
    HexGrid.prototype.drawGrid = function () {
        //console.log("New Phase");
        ctx.fillStyle = "white";
        ctx.strokeStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "grey";
        ctx.strokeStyle = "black";
        ctx.fillRect(0, 115, 900, 5);
        ctx.fillRect(95, 0, 5, 900);
        for (var i = 0; i < 25; i++) {
            for (var j = 0; j < 25; j++) {
                if (this.centersOfCells[i][j]) {
                    this.drawHex(this.centersOfCells[i][j].x, this.centersOfCells[i][j].y);
                    if (this.flag[i][j]) {
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
        for (var i1 = 0; i1 < 110; i1++) {
            for (var i2 = 0; i2 < 110; i2++) {
                this.mainGraph.setBadPoint(i1, i2, false);
            }
        }
        for (var i = 0; i < 25; i++) {
            for (var j = 0; j < 25; j++) {
                if (mainField.centersOfCells[i][j]) {
                    if (mainField.flag[i][j]) {
                        this.mainGraph.markPoints(mainField.centersOfCells[i][j].x, mainField.centersOfCells[i][j].y);
                    }
                }
            }
        }
        for (var i = 0; i < this.listOfPathS.length; i++) {
            this.mainGraph.findPath(this.listOfPathS[i], this.listOfPathE[i]);
        }
        this.printGarbageImage(3, 13);
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
        if (mainField.isMoving) {
            mainField.drawGrid();
            mainField.movingHex.printImage(e.pageX, e.pageY);
            mainField.isMoving = true;
        }
        if (mainField.isEdging) {
            mainField.drawGrid();
            ctx.lineWidth = 3;
            ctx.strokeStyle = 'red';
            ctx.beginPath();
            ctx.moveTo(mainField.oldPosition.x, mainField.oldPosition.y);
            ctx.lineTo(e.pageX, e.pageY);
            ctx.stroke();
            ctx.lineWidth = 1;
            for (var i = 0; i < 25; i++) {
                for (var j = 0; j < 25; j++) {
                    if (mainField.centersOfCells[i][j]) {
                        var tmp = new Point(e.pageX, e.pageY);
                        var port = mainField.centersOfCells[i][j].add(mainField.sizeOfCell, 0);
                        if (mainField.flag[i][j]) {
                            if (port.sqrDist(tmp) <= 150) {
                                ctx.fillStyle = "red";
                                ctx.beginPath();
                                ctx.arc(port.x, port.y, 5, 0, Math.PI * 2, true);
                                ctx.closePath();
                                ctx.fill();
                            }
                        }
                    }
                }
            }
        }
    };
    HexGrid.prototype.myDown = function (e) {
        for (var i = 0; i < 25; i++) {
            for (var j = 0; j < 25; j++) {
                if (mainField.centersOfCells[i][j]) {
                    var tmp = new Point(e.pageX, e.pageY);
                    if (mainField.flag[i][j] && mainField.centersOfCells[i][j].sqrDist(tmp) < (3 * (mainField.sizeOfCell) * (mainField.sizeOfCell) / 4)) {
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
                    mainField.oldPosition = new Point(-1, -1);
                    mainField.isMoving = true;
                    mainField.movingHex = new Hexagon(-100, -100, -100, -100, mainField.palette[i].type, mainField.sizeOfCell); //mainField.map[i][j];
                    canvas.onmousemove = mainField.myMove;
                    mainField.drawGrid();
                }
            }
        }
        for (var i = 0; i < 25; i++) {
            for (var j = 0; j < 25; j++) {
                if (mainField.centersOfCells[i][j]) {
                    var tmp = new Point(e.pageX, e.pageY);
                    var port = mainField.centersOfCells[i][j].add(mainField.sizeOfCell, 0);
                    if (mainField.flag[i][j]) {
                        if (port.sqrDist(tmp) <= 150) {
                            //console.log("!!!");
                            mainField.isEdging = true;
                            mainField.oldPosition = new Point(mainField.centersOfCells[i][j].x + mainField.sizeOfCell, mainField.centersOfCells[i][j].y);
                            mainField.movingHex = mainField.map[i][j];
                            canvas.onmousemove = mainField.myMove;
                        }
                    }
                }
            }
        }
    };
    HexGrid.prototype.myUp = function (e) {
        mainField.drawGrid();
        if (mainField.isMoving) {
            if (e.pageX < LEFT && e.pageY < TOP) {
                for (var i = 0; i < mainField.listOfPathS.length; i++) {
                    if (mainField.listOfPathS[i] == mainField.movingHex || mainField.listOfPathE[i] == mainField.movingHex) {
                        mainField.listOfPathS.splice(i, 1);
                        mainField.listOfPathE.splice(i, 1);
                        i--;
                    }
                }
                delete mainField.movingHex;
                mainField.drawGrid();
            }
            for (var i = 0; i < 25; i++) {
                for (var j = 0; j < 25; j++) {
                    if (mainField.centersOfCells[i][j]) {
                        var tmp = new Point(e.pageX, e.pageY);
                        if (!mainField.flag[i][j] && mainField.centersOfCells[i][j].sqrDist(tmp) < (3 * (mainField.sizeOfCell) * (mainField.sizeOfCell) / 4)) {
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
        }
        if (mainField.isEdging) {
            mainField.isEdging = false;
            for (var i = 0; i < 25; i++) {
                for (var j = 0; j < 25; j++) {
                    if (mainField.centersOfCells[i][j]) {
                        var tmp = new Point(e.pageX, e.pageY);
                        var port = mainField.centersOfCells[i][j].add(mainField.sizeOfCell, 0);
                        if (mainField.flag[i][j]) {
                            if (port.sqrDist(tmp) <= 150) {
                                mainField.listOfPathS.push(mainField.movingHex);
                                mainField.listOfPathE.push(mainField.map[i][j]);
                                mainField.drawGrid();
                            }
                        }
                    }
                }
            }
        }
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