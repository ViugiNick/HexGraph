var canvas = <HTMLCanvasElement> document.getElementById("mycanvas");
var ctx = canvas.getContext("2d");


var TOP = 120;
var LEFT = 100;

var BOTTOM = 100 + 801;
var RIGHT = 100 + 801;

canvas.width = 901;
canvas.height = 901;

class Hexagon
{
	private image;
    	
    picLoaded : boolean = false;
	x : number;
	y : number; 
	sizeOfCell : number;
	type : string;

	realX : number;
	realY : number;

	constructor (x: number, y: number, t : string, sizeOfCell : number) 
	{ 
		this.x = x;
		this.y = y;

        this.type = t;
		this.sizeOfCell = sizeOfCell;

		this.image = new Image();
    }

	printImage(x : number, y : number) 
	{
		this.picLoaded = true;
		ctx.drawImage(this.image, x - this.sizeOfCell, y - (Math.sqrt(3) * this.sizeOfCell) / 2);
		//console.log("DRAWWWWWWWWWWWWWW " + x + " " + y);
	}

	drawHex()
	{
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
	}
} 

class Point
{
	x : number;
	y : number;

	constructor(x : number, y : number)
	{
		this.x = x;
		this.y = y;
	}

	sqrDist(p : Point)
	{
		return (p.x - this.x)*(p.x - this.x) + (p.y - this.y)*(p.y - this.y); 
	}
}

class HexGrid
{
	sizeOfCell : number;
    
    flag = new Array(25);
    map = new Array(25);
    centersOfCells = new Array(25);

    oldPosition : Point;
    isMoving : boolean = false;
    movingHex : Hexagon;

    constructor (size: number) 
	{ 
		this.sizeOfCell = size;
	
        for(var i = 0; i < 25; i++)
		{
			this.flag[i] = new Array <boolean>(25);
			this.map[i] = new Array <Hexagon>(25);
			this.centersOfCells[i] = new Array <Point>(25);
			
            for(var j = 0; j < 25; j++)
				this.flag[i][j] = false;
		}

		var id : number = 0;
		var currX : number = -1; 
		var currY : number = -1;

		for(var x = LEFT + this.sizeOfCell; x + this.sizeOfCell < RIGHT; x += 3 * this.sizeOfCell / 2)
		{
			id++;
            currX++;
            currY = -1;

            console.log(x);

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
				
				this.centersOfCells[currX][currY] = new Point(x, y);
			}
        }
    }

	drawGrid()
	{
		//console.log("New Phase");
		ctx.fillStyle = "#171d25";
		ctx.strokeStyle = "#ffbc06";

		ctx.fillRect(0, 0, canvas.width, canvas.height);

		ctx.fillStyle = "#ffbc06";
		ctx.strokeStyle = "#ffbc06";

		ctx.fillRect(0, 115, 900, 5);
		ctx.fillRect(95, 0, 5, 900);

		for(var i = 0; i < 25; i++)
        {
        	for(var j = 0; j < 25; j++)
        	{
            	if(this.centersOfCells[i][j])
            	{
            		this.drawHex(this.centersOfCells[i][j].x, this.centersOfCells[i][j].y);
            	
            		if(this.flag[i][j])
            		{
            			//console.log(i + " " + j);
            		
            			this.map[i][j].drawHex();
        			}
        		}
        	}
        }
    }
	
	drawHex(x : number, y : number)
	{
		ctx.beginPath();
		ctx.moveTo(x - this.sizeOfCell/2, y - (Math.sqrt(3) * this.sizeOfCell / 2));
		ctx.lineTo(x + this.sizeOfCell/2, y - (Math.sqrt(3) * this.sizeOfCell / 2));
		
		ctx.lineTo(x + this.sizeOfCell, y);
		
		ctx.lineTo(x + this.sizeOfCell/2, y + (Math.sqrt(3) * this.sizeOfCell / 2));
		ctx.lineTo(x - this.sizeOfCell/2, y + (Math.sqrt(3) * this.sizeOfCell / 2));
	
		ctx.lineTo(x - this.sizeOfCell, y);
		
		ctx.closePath();
		ctx.stroke();
	}
	
	addHex(positionX : number, positionY : number, type : string)
	{
		this.map[positionX][positionY] = new Hexagon(positionX, positionY, type, this.sizeOfCell);
		this.flag[positionX][positionY] = true;
	}

	
	myMove(e)
	{
 		//console.log("!!!");
 		
 		if (mainField.isMoving)
 		{
  			//console.log("!!!");
 		
  			mainField.drawGrid();
 		
 			mainField.movingHex.printImage(e.pageX, e.pageY);
 			mainField.isMoving = true;
 			//mainField.drawHex(e.pageX, e.pageY);
 		}
	}

	myDown(e)
	{
 		for(var i = 0; i < 25; i++)
        {
        	for(var j = 0; j < 25; j++)
        	{
            	if(mainField.centersOfCells[i][j])
            	{
            		//console.log(i + " " + j);
 		
            		var tmp = new Point(e.pageX, e.pageY);
            		
            		if(mainField.flag[i][j] && mainField.centersOfCells[i][j].sqrDist(tmp) < (3 * (mainField.sizeOfCell) * (mainField.sizeOfCell) / 4))
            		{
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
	}

	myUp(e)
	{
 		mainField.drawGrid();
 		
 		for(var i = 0; i < 25; i++)
        {
        	for(var j = 0; j < 25; j++)
        	{
            	if(mainField.centersOfCells[i][j])
            	{
            		var tmp = new Point(e.pageX, e.pageY);
            		
            		if(!mainField.flag[i][j] && mainField.centersOfCells[i][j].sqrDist(tmp) < (3 * (mainField.sizeOfCell) * (mainField.sizeOfCell) / 4))
            		{
            			
            			//console.log("---");
            			//mainField.oldPosition = mainField.centersOfCells[i][j];
            			mainField.isMoving = false;
            			
            			mainField.map[i][j] = mainField.movingHex; 
						
						mainField.map[i][j].x = i;
						mainField.map[i][j].y = j;

						mainField.map[i][j].realX = tmp.x;
						mainField.map[i][j].realY = tmp.y;

            			mainField.flag[i][j] = true;
            			
            			canvas.onmousemove = null;	
            			
            			mainField.drawGrid();
            		}
        		}
        	}
        }

        if(mainField.isMoving && mainField.movingHex != null)
        {
        	var tmp = new Point(mainField.movingHex.x, mainField.movingHex.y);

        	mainField.isMoving = false;
   			mainField.map[tmp.x][tmp.y] = mainField.movingHex;
   			 
   			
   			mainField.flag[tmp.x][tmp.y] = true;
   			
   			canvas.onmousemove = null;	
   			mainField.isMoving = false;

   			mainField.drawGrid();
        }

        mainField.movingHex = null;
 		canvas.onmousemove = null;
	}
	
}

var mainField = new HexGrid(25);
mainField.addHex(15, 15, "a.svg");
mainField.addHex(5, 5, "b.svg");
mainField.drawGrid();

canvas.onmousedown = mainField.myDown;
canvas.onmouseup = mainField.myUp;
