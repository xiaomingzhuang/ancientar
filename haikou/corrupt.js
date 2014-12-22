var meshes = [], clonemeshes = [];
var parent;
var deltapar2;
function initCorrupt() {
	parent = new THREE.Object3D();
	loader.load("models/haikou1.js", function (geometry) {
		createMesh(geometry, scene, 2, 0, 0, 0, 0xff7744, true);
	});
}

function corruptUpdate(delta){
	deltapar2 = 10 * delta;
	deltapar2 = deltapar2 < 2 ? deltapar2 : 2;
	//parent.rotation.y +=  - 0.02 * deltapar2;
	for (j = 0, jl = clonemeshes.length; j < jl; j++) {
		cm = clonemeshes[j];
		cm.mesh.rotation.y +=  - 0.1 * delta * cm.speed;
	}
	for (j = 0, jl = meshes.length; j < jl; j++) {
		data = meshes[j];
		mesh = data.mesh;
		vertices = data.vertices;
		vertices_tmp = data.vertices_tmp;
		vl = data.vl;
		if (!data.dynamic)
			continue;
		if (data.start > 0) {
			data.start -= 2;
		} else {
			if (!data.started) {
				data.direction =  - 1;
				data.started = true;
			}
		}
		for (i = 0; i < vl; i++) {
			p = vertices[i];
			vt = vertices_tmp[i];
			// falling down
			if (data.direction < 0) {
				// var d = Math.abs( p.x - vertices_tmp[ i ][ 0 ] ) + Math.abs( p.y - vertices_tmp[ i ][ 1 ] ) + Math.abs( p.z - vertices_tmp[ i ][ 2 ] );
				// if ( d < 200 ) {
				if (p.y >  - 40) {
					// p.y += data.direction * data.speed * delta;
					p.x += 1.5 * (0.50 - Math.random()) * data.speed * delta;
					p.y += 3.0 * (0.25 - Math.random()) * data.speed * delta;
					p.z += 1.5 * (0.50 - Math.random()) * data.speed * delta;
				} else {
					if (!vt[3]) {
						vt[3] = 1;
						data.down += 1;
					}
				}
			}
			// rising up
			if (data.direction > 0) {
				//if ( p.y < vertices_tmp[ i ][ 1 ] ) {
				//  p.y += data.direction * data.speed * delta;
				d = Math.abs(p.x - vt[0]) + Math.abs(p.y - vt[1]) + Math.abs(p.z - vt[2]);
				if (d > 1) {
					p.x +=  - (p.x - vt[0]) / d * data.speed * delta * (0.85 - Math.random());
					p.y +=  - (p.y - vt[1]) / d * data.speed * delta * (1 + Math.random());
					p.z +=  - (p.z - vt[2]) / d * data.speed * delta * (0.85 - Math.random());
				} else {
					if (!vt[4]) {
						vt[4] = 1;
						data.up += 1;
					}
				}
			}
		}
		// all down
		if (data.down === vl) {
			if (data.delay === 0) {
				data.direction = 1;
				data.speed = 10;
				data.down = 0;
				data.delay = 320;
				for (i = 0; i < vl; i++) {
					vertices_tmp[i][3] = 0;
				}
			} else {
				data.delay -= 1;
			}
		}
		// all up
		if (data.up === vl) {
			if (data.delay === 0) {
				data.direction = -1;
				data.speed = 35;
				data.up = 0;
				data.delay = 120;
				for (i = 0; i < vl; i++) {
					vertices_tmp[i][4] = 0;
				}
			} else {
				data.delay -= 1;
			}
		}
		mesh.geometry.verticesNeedUpdate = true;
	}
}

// PARAMETERS
// Steadycounter
// Life
// Opacity
// Hue Speed
// Movement Speed
function createMesh(originalGeometry, scene, scale, x, y, z, color, dynamic) {
	var i,
	c;
	var vertices = originalGeometry.vertices;
	var vl = vertices.length;
	var geometry = new THREE.Geometry();
	var vertices_tmp = [];
	for (i = 0; i < vl; i++) {
		p = vertices[i];
		geometry.vertices[i] = p.clone();
		vertices_tmp[i] = [p.x, p.y, p.z, 0, 0];
	}
	var clones = [ [  600, 0, -400 ],
          [  500, 0, 0 ],
          [  100, 0, 500 ],
          [  100, 0, -500 ],
          [  400, 0, 200 ],
          [ -400, 0, 100 ],
          [ -500, 0, -500 ],
		[0, 0, 0]];
	if (dynamic) {
		for (i = 0; i < clones.length; i++) {
			c = (i < clones.length - 1) ? 0x252525 : color;
			mesh = new THREE.ParticleSystem(geometry, new THREE.ParticleBasicMaterial({
						size : 3,
						color : c
					}));
			mesh.scale.x = mesh.scale.y = mesh.scale.z = scale;
			mesh.position.x = x + clones[i][0];
			mesh.position.y = y + clones[i][1];
			mesh.position.z = z + clones[i][2];
			parent.add(mesh);
			clonemeshes.push({
				mesh : mesh,
				speed : 0.5 + Math.random()
			});
		}
		totaln += clones.length;
		total += clones.length * vl;
	} else {
		mesh = new THREE.ParticleSystem(geometry, new THREE.ParticleBasicMaterial({
					size : 3,
					color : color
				}));
		mesh.scale.x = mesh.scale.y = mesh.scale.z = scale;
		mesh.position.x = x;
		mesh.position.y = y;
		mesh.position.z = z;
		parent.add(mesh);
		totaln += 1;
		total += vl;
	}

	meshes.push({
		mesh : mesh,
		vertices : geometry.vertices,
		vertices_tmp : vertices_tmp,
		vl : vl,
		down : 0,
		up : 0,
		direction : 0,
		speed : 35,
		delay : Math.floor(200 + 200 * Math.random()),
		started : false,
		start : Math.floor(100 + 200 * Math.random()),
		dynamic : dynamic
	});
}