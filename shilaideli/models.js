var light1;
var light2;
function createLight()
{
	light1 = new THREE.PointLight(0xffffff);
	light1.position.set(0, 100, 100);
	light2 = new THREE.PointLight(0xffffff);
	light2.position.set(0,  - 100, 100);
}
var cubemesh;
var spheres = [];
function createBubbleAndBox()
{
	var path = "textures/";
	var format = '.png';
	var urls = [path + 'px' + format, path + 'nx' + format, path + 'py' + format, path + 'ny' + format, path + 'pz' + format, path + 'nz' + format];
	var textureCube = THREE.ImageUtils.loadTextureCube(urls);
	var textureCube_refraction = THREE.ImageUtils.loadTextureCube(urls, new THREE.CubeRefractionMapping());
	var cubeMaterial_refract = new THREE.MeshBasicMaterial({
			color : 0xccddff,
			envMap : textureCube_refraction,
			refractionRatio : 0.8,
			reflectivity : 0.98
		});
	var material_reflect = new THREE.MeshBasicMaterial({
			color : 0xffffff,
			envMap : textureCube
		});
	//气泡
	var geometry = new THREE.SphereGeometry(20, 16, 16);
	for (var i = 0; i < 30; i++) {
		var mesh = new THREE.Mesh(geometry, cubeMaterial_refract);
		mesh.position.x = Math.random() * 200 - 100;
		mesh.position.y = Math.random() * 170 - 100;
		mesh.position.z = Math.random() * 200 - 100;
		mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.random() * 0.1 + 0.05;
		spheres.push(mesh);
	}
	for (var i = 0; i < 30; i++) {
		var mesh = new THREE.Mesh(geometry, material_reflect);
		mesh.position.x = Math.random() * 200 - 100;
		mesh.position.y = Math.random() * 170 - 100;
		mesh.position.z = Math.random() * 200 - 100;
		mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.random() * 0.1 + 0.05;
		spheres.push(mesh);
	}
	//包围盒
	var shader = THREE.ShaderLibzxm["cube"];
	shader.uniforms["tCube"].value = textureCube;
	var material = new THREE.ShaderMaterial({
			fragmentShader : shader.fragmentShader,
			vertexShader : shader.vertexShader,
			uniforms : shader.uniforms,
			depthWrite : false,
			side : THREE.FrontSide
		});
	cubemesh = new THREE.Mesh(new THREE.CubeGeometry(200, 200, 200), material);
}
var horsemesh;
var animation;
function loadFirstModel()
{
	loader.load("models/shidelaili66.js", function (geometry, materials) {
		var material = new THREE.MeshFaceMaterial(materials);
		var originalMaterial = materials[0];
		originalMaterial.skinning = true;
		originalMaterial.transparent = true;
		//originalMaterial.alphaTest = 0.75;
		THREE.AnimationHandler.add(geometry.animation);
		horsemesh = new THREE.SkinnedMesh(geometry, material, false);
		var sc = 1.5;
		horsemesh.position.set(40, 0, 0);
		horsemesh.rotation.x = Math.PI / 8;
		horsemesh.scale.set(sc, sc, sc);
		horsemesh.matrixAutoUpdate = false;
		horsemesh.updateMatrix();
		animation = new THREE.Animation(horsemesh, "Action");
		animation.play();
	});
}

var lightmesh;
var horsemesh2;
function loadThirdModel()
{
	loader.load("models/shidelaili661.js", function (geometry, materials) {
		var material_horse2 = new THREE.MeshFaceMaterial(materials);
		var originalMaterial = materials[0];
		originalMaterial.skinning = true;
		originalMaterial.transparent = true;
		//originalMaterial.alphaTest = 0.75;
		//THREE.AnimationHandler.add(geometry.animation);
		horsemesh2 = new THREE.SkinnedMesh(geometry, material_horse2, false);
		//scene.add( buffalo );
		var sc = 3;
		horsemesh2.scale.set(sc, sc, sc);
		horsemesh2.matrixAutoUpdate = false;
		horsemesh2.updateMatrix();
	});
}

var verticalMirrorMesh;
function loadWaterFace()
{
	var noiseTexture = new THREE.ImageUtils.loadTexture('textures/cloud.png');
	noiseTexture.wrapS = noiseTexture.wrapT = THREE.RepeatWrapping;
	// MIRORR plane
	verticalMirror = new THREE.FlatMirror(renderer, camera, {
			clipBias : 0.003,
			textureWidth : 800,
			textureHeight : 600,
			color : 0x1919B3, //333366,
			baseTexture : THREE.ImageUtils.loadTexture("textures/water.jpg"),
			baseSpeed : 1.15,
			noiseTexture : noiseTexture,
			noiseScale : 0.2,
			alpha : 0.8,
			time : 0.0
		});
	verticalMirrorMesh = new THREE.Mesh(new THREE.PlaneGeometry(200, 200, 5, 5), verticalMirror.material);
	verticalMirrorMesh.add(verticalMirror);
	verticalMirror.material.side = THREE.DoubleSide;
	verticalMirrorMesh.position.set(0, 90, 0);
	verticalMirrorMesh.rotation.x = Math.PI / 2;
}

var treemesh;
function loadEarth()
{
	var tex = THREE.ImageUtils.loadTexture('models/skins/2008142271953.jpg', null, function () {
			var mat = new THREE.MeshBasicMaterial({
					map : tex
				});
			loader.load('models/diqiuyi.js', function (geo) {
				treemesh = new THREE.Mesh(geo, mat);
				treemesh.position.set(30, 0, 0);
				treemesh.rotation.y =  - Math.PI / 1.7;
				treemesh.rotation.x = Math.PI / 3;
				var sc = 2;
				treemesh.scale.set(sc, sc, sc);
				treemesh.matrixAutoUpdate = false;
				treemesh.updateMatrix();
				// etc, etc
			});
		});
}

var stonemesh;
function loadStone()
{
	loader.load('models/stone.js', function (geo, materials) {
		var material_stone = new THREE.MeshFaceMaterial(materials);
		stonemesh = new THREE.Mesh(geo, material_stone);
		stonemesh.position.set(0, 0, 0);
		stonemesh.rotation.y =  - Math.PI / 1.7;
		stonemesh.rotation.x = Math.PI / 3;
		var sc = 2;
		stonemesh.scale.set(sc, sc, sc);
		stonemesh.matrixAutoUpdate = false;
		stonemesh.updateMatrix();
		// etc, etc
	});
}

var pyramidmesh;
function loadPyramid()
{
	loader.load('models/jinzi.js', function (geo, materials) {
		var material_jinzi = new THREE.MeshFaceMaterial(materials);
		pyramidmesh = new THREE.Mesh(geo, material_jinzi);
		pyramidmesh.position.set(0, 0, 0);
		//pyramidmesh.rotation.y = -Math.PI / 1.7;
		pyramidmesh.rotation.x =  - Math.PI / 3;
		var sc = 5;
		pyramidmesh.scale.set(sc, sc, sc);
		pyramidmesh.matrixAutoUpdate = false;
		pyramidmesh.updateMatrix();
		// etc, etc
	});
}

var models = new Array(6);
function generateModels()
{
	//场景一对象
	models[0] = new THREE.Object3D();
	//场景二对象
	models[1] = new THREE.Object3D();
	//场景三对象
	models[2] = new THREE.Object3D();
	//场景四对象
	models[3] = new THREE.Object3D();
	//场景五对象
	models[4] = new THREE.Object3D();
	//场景六对象
	models[5] = new THREE.Object3D();
}













