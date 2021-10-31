
function PointData(x,y,z)
{
    this.x = x ? x: 0;
    this.y = y ? y: 0;
    this.z = z ? z: 0;
}

function BoxData(width, height, depth)
{
    this.width = width ? width: 1;
    this.height = height? height: 1;
    this.depth = depth ? depth : 1;
}

function BabylonJsDrawApi()
{
    this.drawBox = function(boxData, position){
        const options = {
            height: boxData.height,
            width: boxData.width, 
            depth: boxData.depth
        }
        const box = BABYLON.MeshBuilder.CreateBox("box", options);
        box.position = new BABYLON.Vector3(position.x, position.y, position.z);    
    }

    this.drawSphere = function(radius, position)
    {
        const options = { diameter: radius * 2 }
        const object = BABYLON.MeshBuilder.CreateSphere("sphere", options);
        object.position = new BABYLON.Vector3(position.x, position.y, position.z);    
    }
}

//================================================================================

//http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

//================================================================================

function rgb(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

//================================================================================

function Bot()
{
	this.angle_in_radians = 0;
	this.positionX = 0;
	this.positionY = 0;
	this.positionZ = 20;
	this.drawColor = "red";
    this.drawApi = new BabylonJsDrawApi();

//================================================================================

	this.drawBoxAt = function(width,height,depth,x,y,z)
	{
        if(!width) throw new Error("width is not defined");
        if(!height) throw new Error("height is not defined");
        if(!depth) throw new Error("depth is not defined");
        if(!x) throw new Error("x is not defined");
        if(!y) throw new Error("y is not defined");
        if(!z) throw new Error("z is not defined");
        
        const boxData = new BoxData(width, height, depth);
        const pointData = new PointData(x,y,z);
        this.drawApi.drawBox(boxData, pointData);
	}

//================================================================================

	this.drawBox = function(width,height,depth)
	{
		if(!height)
			height = width;
	
		if(!depth)
			depth = width;

		var entityEl = document.createElement('a-entity');
		entityEl.setAttribute('geometry', {
		  primitive: 'box',
		  height: height,
		  width: width,
		  depth: depth
		
		});

		var cubeX = this.positionX + width/2;
		var cubeY = this.positionY + height/2;
		var cubeZ = this.positionZ + depth/2;
		var cubeRotationY = this.angle_in_radians;

        // todo - restore rotation!!
        const boxData = new BoxData(width, height, depth);
        const pointData = new PointData(cubeX,cubeY,cubeZ);
        this.drawApi.drawBox(boxData, pointData);
	}

//================================================================================

	this.drawSphere = function(radius)
	{
		var sX = this.positionX + radius/2;
		var sY = this.positionY + radius/2;
		var sZ = this.positionZ + radius/2;
	    const position = new PointData(sX, sY, sZ);
        this.drawApi.drawSphere(radius, position);
	}

//================================================================================

	this.drawSphereAt = function(radius,x,y,z)
	{
		var sX = this.positionX + radius/2;
		var sY = this.positionY + radius/2;
		var sZ = this.positionZ + radius/2;
	    const position = new PointData(x, y, z);
        this.drawApi.drawSphere(radius, position);
	}
	
//================================================================================

	this.moveUp = function(steps)
	{
		this.positionY += steps;
	}

//================================================================================

	this.forward = function(steps)
	{
		var deltaX = steps * Math.cos(this.angle_in_radians);
		var deltaZ = steps * Math.sin(this.angle_in_radians);

		this.positionX += deltaX;
		this.positionZ += deltaZ;
	}

//================================================================================

	this.moveLeft = function(steps)
 	{
		var deltaX = steps * Math.cos(this.angle_in_radians - (Math.PI/2));
		var deltaZ = steps * Math.sin(this.angle_in_radians- (Math.PI/2));

		this.positionX += deltaX;
		this.positionZ += deltaZ;
	}

//================================================================================

	this.moveRight = function(steps)
	{
		this.moveLeft(steps * -1);
	}

//================================================================================

	this.setAngle = function(degrees)
	{
		this.angle_in_radians = degrees* (Math.PI/180.0);
     
	}

//================================================================================

	this.getAngle = function()
	{
		return this.angle_in_radians * (180.0/Math.PI);
	}

//================================================================================

	this.turn = function(angle)
	{
		var currentAngle = this.getAngle();
        let newAngle = currentAngle + angle;
        if(newAngle >= 360)
            newAngle = newAngle - 360;
		this.setAngle(newAngle);
	}

//================================================================================

	this.locations = new Array();
	this.saveLocation = function(locationName)
	{
		var aPoint = {}
		aPoint.x = this.positionX;
		aPoint.y = this.positionY;
		aPoint.z = this.positionZ;
		aPoint.angle = this.getAngle();
		this.locations[locationName] = aPoint;
	}

//================================================================================

	this.moveToLocation = function(locationName)
	{
		var aPoint = this.locations[locationName];
		this.positionX = aPoint.x;
		this.positionY = aPoint.y;
		this.positionZ = aPoint.z;
		this.setAngle(aPoint.angle);

	}

}




