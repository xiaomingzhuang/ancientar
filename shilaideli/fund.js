function newpos(x, y, z) {
	return new THREE.Vector3(x, y, z);
}

THREE.Matrix4.prototype.setFromArray = function (m) {
	return this.set(m[0], m[4], m[8], m[12], m[1], m[5], m[9], m[13], m[2], m[6], m[10], m[14], m[3], m[7], m[11], m[15]);
};

function copyMatrix(mat, cm) {
	cm[0] = mat.m00;
	cm[1] =  - mat.m10;
	cm[2] = mat.m20;
	cm[3] = 0;
	cm[4] = mat.m01;
	cm[5] =  - mat.m11;
	cm[6] = mat.m21;
	cm[7] = 0;
	cm[8] =  - mat.m02;
	cm[9] = mat.m12;
	cm[10] =  - mat.m22;
	cm[11] = 0;
	cm[12] = mat.m03;
	cm[13] =  - mat.m13;
	cm[14] = mat.m23;
	cm[15] = 1;
}

THREE.ShaderLibzxm = {
	'cube' : {
		uniforms : {
			"tCube" : {
				type : "t",
				value : null
			},
			"tFlip" : {
				type : "f",
				value :  - 1
			}
		},
		vertexShader : ["varying vec3 vWorldPosition;", "void main() {", "vec4 worldPosition = vec4( position, 1.0 );", "vWorldPosition = worldPosition.xyz;", "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );", "}"].join("\n"),
		fragmentShader : ["uniform samplerCube tCube;", "uniform float tFlip;", "varying vec3 vWorldPosition;", "void main() {", "gl_FragColor = textureCube( tCube, vec3( tFlip * vWorldPosition.x, vWorldPosition.yz ) );", "}"].join("\n")
	}
};