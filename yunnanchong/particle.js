var particles;
var values_size;
var values_color;
var heartShape, particleCloud, sparksEmitter, emitterpos;
var speed = 50;
var group;
var timeOnShapePath = 0;
var pointLight;
var deltapar = 1;
var timerid2;//用于粒子效果停止后粒子消失
attributes = {
	size : {
		type : 'f',
		value : []
	},
	pcolor : {
		type : 'c',
		value : []
	}
};
function particleUpdate(delta) {
	deltapar = speed * delta;
	particleCloud.geometry.verticesNeedUpdate = true;
	attributes.size.needsUpdate = true;
	attributes.pcolor.needsUpdate = true;
	//particleCloud.rotation.y += 0.05;
	group.rotation.y += (0 - group.rotation.y) * 0.05;
}

function initparticle() {
	var directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
	directionalLight.position.set(0,  - 1, 1);
	directionalLight.position.normalize();
	pointLight = new THREE.PointLight(0xffffff, 2, 300);
	pointLight.position.set(0, 0, 0);
	group = new THREE.Object3D();
	group.add(directionalLight);
	group.add(pointLight);
	// Create particle objects for Three.js
	var particlesLength = 70000;
	particles = new THREE.Geometry();

	for (i = 0; i < particlesLength; i++) {
		particles.vertices.push(newpos(Math.random() * 200 - 100, Math.random() * 100 + 150, Math.random() * 50));
		Pool.add(i);
	}
	// Create pools of vectors
	//var sprite = generateSprite();
	//texture = new THREE.Texture(sprite);
	texture = new THREE.ImageUtils.loadTexture('textures/haizao2.png');
	texture.needsUpdate = true;
	uniforms = {
		texture : {
			type : "t",
			value : texture
		}
	};

	var shaderMaterial = new THREE.ShaderMaterial({
			uniforms : uniforms,
			attributes : attributes,
			vertexShader : document.getElementById('vertexshader').textContent,
			fragmentShader : document.getElementById('fragmentshader').textContent,
			//blending : THREE.AdditiveBlending,
			depthWrite : false,
			transparent : true
		});
	particleCloud = new THREE.ParticleSystem(particles, shaderMaterial);
	particleCloud.dynamic = true;
	// particleCloud.sortParticles = true;
	var vertices = particleCloud.geometry.vertices;
	values_size = attributes.size.value;
	values_color = attributes.pcolor.value;
	for (var v = 0; v < vertices.length; v++) {
		values_size[v] = 50;
		values_color[v] = new THREE.Color(0x000000);
		particles.vertices[v].set(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY);
	}
	group.add(particleCloud);
	group.scale.x = 0.3;
	group.scale.y = 0.3;
	group.scale.z = 0.3;
	particleCloud.y = 800;
	// Create Particle Systems
	// EMITTER STUFF
	// Heart
	var x = 0,
	y = 30;
	heartShape = new THREE.Shape();
	heartShape.moveTo(x + 25, y + 25);
	heartShape.bezierCurveTo(x + 25, y + 25, x + 20, y, x, y);
	heartShape.bezierCurveTo(x - 30, y, x - 30, y + 35, x - 30, y + 35);
	heartShape.bezierCurveTo(x - 30, y + 55, x - 10, y + 77, x + 25, y + 95);
	heartShape.bezierCurveTo(x + 60, y + 77, x + 80, y + 55, x + 80, y + 35);
	heartShape.bezierCurveTo(x + 80, y + 35, x + 80, y, x + 50, y);
	heartShape.bezierCurveTo(x + 35, y, x + 25, y + 25, x + 25, y + 25);

	var engineLoopUpdate = function () {};
	sparksEmitter = new SPARKS.Emitter( new SPARKS.SteadyCounter( 100 ) );
	emitterpos = new THREE.Vector3(0, 0, 0);
	sparksEmitter.addInitializer(new SPARKS.Position(new SPARKS.PointZone(emitterpos)));
	sparksEmitter.addInitializer( new SPARKS.Lifetime( 1, 10 ));
	sparksEmitter.addInitializer(new SPARKS.Target(null, setTargetParticle));
	sparksEmitter.addInitializer(new SPARKS.Velocity(new SPARKS.PointZone(new THREE.Vector3(0,  - 5, 1))));
	sparksEmitter.addAction(new SPARKS.Age());
	sparksEmitter.addAction( new SPARKS.Accelerate( 0, 100, 0 ) );
	sparksEmitter.addAction(new SPARKS.Move());
	sparksEmitter.addAction( new SPARKS.RandomDrift( 90, 100, 100 ) );
	sparksEmitter.addCallback("created", onParticleCreated);
	sparksEmitter.addCallback("dead", onParticleDead);
}

var Pool = {
	__pools : [], // Get a new Vector
	get : function () {
		if (this.__pools.length > 0) {
			return this.__pools.pop();
		}
		console.log("pool ran out!");
		return null;
	}, // Release a vector back into the pool
	add : function (v) {
		this.__pools.push(v);
	},

};

function generateSprite() {
	var canvas = document.createElement('canvas');
	canvas.width = 128;
	canvas.height = 128;
	var context = canvas.getContext('2d');
	context.beginPath();
	context.arc(64, 64, 60, 0, Math.PI * 2, false);
	context.lineWidth = 0.5;
	//0.05
	context.stroke();
	context.restore();
	var gradient = context.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2);
	gradient.addColorStop(0, 'rgba(255,255,255,1)');
	gradient.addColorStop(0.2, 'rgba(255,255,255,1)');
	gradient.addColorStop(0.4, 'rgba(200,200,200,1)');
	gradient.addColorStop(1, 'rgba(0,0,0,1)');
	context.fillStyle = gradient;
	context.fill();
	return canvas;
}
var setTargetParticle = function () {
	var target = Pool.get();
	values_size[target] = Math.random() * 200 + 100;
	return target;
};
var hue = 0;
var onParticleCreated = function (p) {
	var position = p.position;
	p.target.position = position;
	var target = p.target;
	if (target) {
		// console.log(target,particles.vertices[target]);
		// values_size[target]
		// values_color[target]
		hue += 0.0003 * deltapar;
		if (hue > 1)
			hue -= 1;
		// TODO Create a PointOnShape Action/Zone in the particle engine
		timeOnShapePath += 0.0035 * deltapar;
		if (timeOnShapePath > 1)
			timeOnShapePath -= 1;
		var pointOnShape = heartShape.getPointAt(timeOnShapePath);
		emitterpos.x = pointOnShape.x * 3 - 100;
        emitterpos.z = -pointOnShape.y * 3;
        emitterpos.y=40*Math.cos(timeOnShapePath)-350;
		// pointLight.position.copy( emitterpos );
		pointLight.position.x = emitterpos.x;
		pointLight.position.y = emitterpos.y;
		pointLight.position.z = 100;
		particles.vertices[target] = p.position;
		values_color[target].setHSL(hue, 0.6, 0.1);
		pointLight.color.setHSL(hue, 0.8, 0.5);
	};
};
var onParticleDead = function (particle) {
	var target = particle.target;
	if (target) {
		// Hide the particle
		values_color[target].setRGB(0, 0, 0);
		particles.vertices[target].set(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY);
		// Mark particle system as available by returning to pool
		Pool.add(particle.target);
	}
};

function parstop() {
		console.log("par stop");
		sparksEmitter.stop();
		timerid2 = setTimeout(function () {
				for (i = 0; i < particles.vertices.length; i++) {
					particles.vertices[i].x = Number.POSITIVE_INFINITY;
					particles.vertices[i].y = Number.POSITIVE_INFINITY;
					particles.vertices[i].z = Number.POSITIVE_INFINITY;
				}
			}, 1000);
	}
var engine;
var engineroot;

function initParticleEngine() {
	engineroot = new THREE.Object3D();
	engine = new ParticleEngine();
	engine.setValues(Examples.fountain);
	engine.initialize();
}