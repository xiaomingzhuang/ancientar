var renderer;
var text2;
var camera;
function initRenderer()
{
	//建立renderer
	renderer = new THREE.WebGLRenderer();
	renderer.sortObjects = false;
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.autoClear = false;
	var glCanvas = renderer.domElement;
	var s = glCanvas.style;
	document.body.appendChild(glCanvas);
}
function initText()
{
	//建立text
	text2 = document.createElement('div');
	text2.setAttribute("id", "Div1");
	text2.setAttribute("class","sidebar");
  //text2.style.position = 'absolute';
  text2.style.display="none";
  //text2.style.zIndex = 1;    // if you still don't see the label, try uncommenting this
  //text2.style.width = 100;
  //text2.style.height = 100;
  //text2.style.backgroundColor = "blue";
 
 // text2.style.top = 200 + 'px';
  text2.style.left = 700 + 'px';
	document.body.appendChild(text2);
}

function createSceneAndCamera()
{
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 100000);
	camera.position.z = 0;
	camera.position.y = 0;
	camera.position.x = 0;
	scene.add(camera);
	param.copyCameraMatrix(tmp, 10, 10000);
	camera.projectionMatrix.setFromArray(tmp);	
}
