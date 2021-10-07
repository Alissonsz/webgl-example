
var canvas, gl, shaderProgram;
const perfectFrameTime = 1000 / 60;
var deltaTime = 0;
var lastTimestamp = Date.now();
var xRotate = 0;
var yRotate = 0;

const vertices = [
  // BACK QUAD
  -0.5, 0.5, 0.5, 0.0, 0.0, 1.0,
  -0.5, -0.5, 0.5, 0.0, 0.0, 1.0,
  0.5, -0.5, 0.5, 0.0, 0.0, 1.0,
  -0.5, 0.5, 0.5, 0.0, 0.0, 1.0,
  0.5, -0.5, 0.5, 0.0, 0.0, 1.0,
  0.5, 0.5, 0.5, 0.0, 0.0, 1.0,

  // LEFT QUAD
  -0.5, 0.5, -0.5, 0.0, 1.0, 0.0,
  -0.5, -0.5, -0.5, 0.0, 1.0, 0.0,
  -0.5, -0.5, 0.5, 0.0, 1.0, 0.0,
  -0.5, 0.5, -0.5, 0.0, 1.0, 0.0,
  -0.5, -0.5, 0.5, 0.0, 1.0, 0.0,
  -0.5, 0.5, 0.5, 0.0, 1.0, 0.0,

  // RIGHT QUAD
  0.5, 0.5, -0.5, 1.0, 0.0, 0.0,
  0.5, -0.5, -0.5, 1.0, 0.0, 0.0,
  0.5, -0.5, 0.5, 1.0, 0.0, 0.0,
  0.5, 0.5, -0.5, 1.0, 0.0, 0.0,
  0.5, -0.5, 0.5, 1.0, 0.0, 0.0,
  0.5, 0.5, 0.5, 1.0, 0.0, 0.0,

  // FRONT QUAD
  -0.5, 0.5, -0.5, 1.0, 0.0, 1.0,
  -0.5, -0.5, -0.5, 1.0, 0.0, 1.0,
  0.5, -0.5, -0.5, 1.0, 0.0, 1.0,
  -0.5, 0.5, -0.5, 1.0, 0.0, 1.0,
  0.5, -0.5, -0.5, 1.0, 0.0, 1.0,
  0.5, 0.5, -0.5, 1.0, 0.0, 1.0,

  // BOTTOM QUAD
  -0.5, -0.5, -0.5, 0.0, 0.0, 1.0,
  -0.5, -0.5, 0.5, 0.0, 0.0, 1.0,
  0.5, -0.5, -0.5, 0.0, 0.0, 1.0,
  -0.5, -0.5, 0.5, 0.0, 0.0, 1.0,
  0.5, -0.5, -0.5, 0.0, 0.0, 1.0,
  0.5, -0.5, 0.5, 0.0, 0.0, 1.0,

  // TOP QUAD
  -0.5, 0.5, -0.5, 0.0, 0.0, 1.0,
  -0.5, 0.5, 0.5, 0.0, 0.0, 1.0,
  0.5, 0.5, -0.5, 0.0, 0.0, 1.0,
  -0.5, 0.5, 0.5, 0.0, 0.0, 1.0,
  0.5, 0.5, -0.5, 0.0, 0.0, 1.0,
  0.5, 0.5, 0.5, 0.0, 0.0, 1.0,
]

window.addEventListener('load', () => {
  const vertexShaderCode = `
  // an attribute will receive data from a buffer
  attribute vec3 a_position;
  attribute vec3 a_color;

  uniform mat4 view;

  varying vec3 fColor;

  void main() {
    vec3 pos = a_position;

    fColor = a_color;
    gl_Position = view * vec4(pos, 1);
  }`;

  const fragmentShaderCode = `
  // fragment shaders don't have a default precision so we need
  // to pick one. mediump is a good default. It means "medium precision"
  precision mediump float;

  varying vec3 fColor;
  void main() {
    gl_FragColor = vec4(fColor, 1);
  }
  `;

  canvas = document.getElementById('c');
  gl = canvas.getContext('experimental-webgl');

  let vertex_buffer = gl.createBuffer();

  // Bind appropriate array buffer to it
  gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);

  // Pass the vertex data to the buffer
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);


  let vertShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderCode);

  let fragShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderCode);

  // Create a shader program object to store
  // the combined shader program
  shaderProgram = gl.createProgram();

  // Attach a vertex shader
  gl.attachShader(shaderProgram, vertShader);

  // Attach a fragment shader
  gl.attachShader(shaderProgram, fragShader);

  // Link both the programs
  gl.linkProgram(shaderProgram);

  let success = gl.getProgramParameter(shaderProgram, gl.LINK_STATUS);
  console.log(success);

  // Use the combined shader program object
  gl.useProgram(shaderProgram);

  gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

  let posLocation = gl.getAttribLocation(shaderProgram, 'a_position');
  let fragColorLocation = gl.getAttribLocation(shaderProgram, 'a_color');

  gl.enableVertexAttribArray(posLocation);
  gl.vertexAttribPointer(posLocation, 3, gl.FLOAT, gl.FALSE, 6 * 4, 0);

  gl.enableVertexAttribArray(fragColorLocation);
  gl.vertexAttribPointer(fragColorLocation, 3, gl.FLOAT, gl.FALSE, 6 * 4, 3 * 4);

  window.addEventListener('keydown', (event) => {
    if (event.key == "ArrowRight") {
      console.log('coe');
      xRotate += 0.001;
    }
    if (event.key == "ArrowLeft") {
      xRotate -= 0.001;
    }
    if (event.key == "ArrowUp") {
      yRotate += 0.001;
    }
    if (event.key == "ArrowDown") {
      yRotate -= 0.001;
    }
  });

  draw();
});

const draw = () => {
  console.log('kk');
  let timestamp = Date.now();
  deltaTime = (timestamp - lastTimestamp) / perfectFrameTime;
  lastTimestamp = timestamp;

  gl.clearColor(1.0, 1.0, 1.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  //gl.enable(gl.CULL_FACE);
  gl.enable(gl.DEPTH_TEST);

  gl.viewport(0, 0, canvas.width, canvas.height);

  let rotationX = Math.sin(xRotate) * 200;
  let rotationY = Math.sin(yRotate) * 200;

  let perspective = m4.perspective((45 * Math.PI) / 180.0, canvas.width / canvas.height, 0.1, 10);
  perspective = m4.translate(perspective, 0, 0, -5);
  perspective = m4.xRotate(perspective, rotationY);
  perspective = m4.yRotate(perspective, rotationX);
  

  let viewLocation = gl.getUniformLocation(shaderProgram, "view");
  gl.uniformMatrix4fv(viewLocation, false, perspective);

  gl.drawArrays(gl.TRIANGLES, 0, vertices.length / 6);
  requestAnimationFrame(draw);
}


const createShader = (gl, type, source) => {
  let shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) {
    return shader;
  }
  console.log(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
}

const createProjection = (fov, aspect, near, far) => {
  const projection = new Float32Array([
    [1 / (aspect * Math.tan(fov/2)), 0, 0, 0],
    [0, 1 / (Math.tan(fov/2)), 0, 0],
    [0, 0, - (near+far) / (near-far), - (2*near*far) / (near-far)],
    [0, 0, -1, 0]
  ]);

  return projection;
}

function radToDeg(r) {
  return r * 180 / Math.PI;
}

function degToRad(d) {
  return d * Math.PI / 180;
}

var m4 = {

  perspective: function(fieldOfViewInRadians, aspect, near, far) {
    var f = Math.tan(Math.PI * 0.5 - 0.5 * fieldOfViewInRadians);
    var rangeInv = 1.0 / (near - far);

    return [
      f / aspect, 0, 0, 0,
      0, f, 0, 0,
      0, 0, (near + far) * rangeInv, -1,
      0, 0, near * far * rangeInv * 2, 0
    ];
  },

  projection: function(width, height, depth) {
    // Note: This matrix flips the Y axis so 0 is at the top.
    return [
       2 / width, 0, 0, 0,
       0, -2 / height, 0, 0,
       0, 0, 2 / depth, 0,
      -1, 1, 0, 1,
    ];
  },

  multiply: function(a, b) {
    var a00 = a[0 * 4 + 0];
    var a01 = a[0 * 4 + 1];
    var a02 = a[0 * 4 + 2];
    var a03 = a[0 * 4 + 3];
    var a10 = a[1 * 4 + 0];
    var a11 = a[1 * 4 + 1];
    var a12 = a[1 * 4 + 2];
    var a13 = a[1 * 4 + 3];
    var a20 = a[2 * 4 + 0];
    var a21 = a[2 * 4 + 1];
    var a22 = a[2 * 4 + 2];
    var a23 = a[2 * 4 + 3];
    var a30 = a[3 * 4 + 0];
    var a31 = a[3 * 4 + 1];
    var a32 = a[3 * 4 + 2];
    var a33 = a[3 * 4 + 3];
    var b00 = b[0 * 4 + 0];
    var b01 = b[0 * 4 + 1];
    var b02 = b[0 * 4 + 2];
    var b03 = b[0 * 4 + 3];
    var b10 = b[1 * 4 + 0];
    var b11 = b[1 * 4 + 1];
    var b12 = b[1 * 4 + 2];
    var b13 = b[1 * 4 + 3];
    var b20 = b[2 * 4 + 0];
    var b21 = b[2 * 4 + 1];
    var b22 = b[2 * 4 + 2];
    var b23 = b[2 * 4 + 3];
    var b30 = b[3 * 4 + 0];
    var b31 = b[3 * 4 + 1];
    var b32 = b[3 * 4 + 2];
    var b33 = b[3 * 4 + 3];
    return [
      b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30,
      b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31,
      b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32,
      b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33,
      b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30,
      b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31,
      b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32,
      b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33,
      b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30,
      b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31,
      b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32,
      b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33,
      b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30,
      b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31,
      b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32,
      b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33,
    ];
  },

  translation: function(tx, ty, tz) {
    return [
       1,  0,  0,  0,
       0,  1,  0,  0,
       0,  0,  1,  0,
       tx, ty, tz, 1,
    ];
  },

  xRotation: function(angleInRadians) {
    var c = Math.cos(angleInRadians);
    var s = Math.sin(angleInRadians);

    return [
      1, 0, 0, 0,
      0, c, s, 0,
      0, -s, c, 0,
      0, 0, 0, 1,
    ];
  },

  yRotation: function(angleInRadians) {
    var c = Math.cos(angleInRadians);
    var s = Math.sin(angleInRadians);

    return [
      c, 0, -s, 0,
      0, 1, 0, 0,
      s, 0, c, 0,
      0, 0, 0, 1,
    ];
  },

  zRotation: function(angleInRadians) {
    var c = Math.cos(angleInRadians);
    var s = Math.sin(angleInRadians);

    return [
       c, s, 0, 0,
      -s, c, 0, 0,
       0, 0, 1, 0,
       0, 0, 0, 1,
    ];
  },

  scaling: function(sx, sy, sz) {
    return [
      sx, 0,  0,  0,
      0, sy,  0,  0,
      0,  0, sz,  0,
      0,  0,  0,  1,
    ];
  },

  translate: function(m, tx, ty, tz) {
    return m4.multiply(m, m4.translation(tx, ty, tz));
  },

  xRotate: function(m, angleInRadians) {
    return m4.multiply(m, m4.xRotation(angleInRadians));
  },

  yRotate: function(m, angleInRadians) {
    return m4.multiply(m, m4.yRotation(angleInRadians));
  },

  zRotate: function(m, angleInRadians) {
    return m4.multiply(m, m4.zRotation(angleInRadians));
  },

  scale: function(m, sx, sy, sz) {
    return m4.multiply(m, m4.scaling(sx, sy, sz));
  },

  inverse: function(m) {
    var m00 = m[0 * 4 + 0];
    var m01 = m[0 * 4 + 1];
    var m02 = m[0 * 4 + 2];
    var m03 = m[0 * 4 + 3];
    var m10 = m[1 * 4 + 0];
    var m11 = m[1 * 4 + 1];
    var m12 = m[1 * 4 + 2];
    var m13 = m[1 * 4 + 3];
    var m20 = m[2 * 4 + 0];
    var m21 = m[2 * 4 + 1];
    var m22 = m[2 * 4 + 2];
    var m23 = m[2 * 4 + 3];
    var m30 = m[3 * 4 + 0];
    var m31 = m[3 * 4 + 1];
    var m32 = m[3 * 4 + 2];
    var m33 = m[3 * 4 + 3];
    var tmp_0  = m22 * m33;
    var tmp_1  = m32 * m23;
    var tmp_2  = m12 * m33;
    var tmp_3  = m32 * m13;
    var tmp_4  = m12 * m23;
    var tmp_5  = m22 * m13;
    var tmp_6  = m02 * m33;
    var tmp_7  = m32 * m03;
    var tmp_8  = m02 * m23;
    var tmp_9  = m22 * m03;
    var tmp_10 = m02 * m13;
    var tmp_11 = m12 * m03;
    var tmp_12 = m20 * m31;
    var tmp_13 = m30 * m21;
    var tmp_14 = m10 * m31;
    var tmp_15 = m30 * m11;
    var tmp_16 = m10 * m21;
    var tmp_17 = m20 * m11;
    var tmp_18 = m00 * m31;
    var tmp_19 = m30 * m01;
    var tmp_20 = m00 * m21;
    var tmp_21 = m20 * m01;
    var tmp_22 = m00 * m11;
    var tmp_23 = m10 * m01;

    var t0 = (tmp_0 * m11 + tmp_3 * m21 + tmp_4 * m31) -
        (tmp_1 * m11 + tmp_2 * m21 + tmp_5 * m31);
    var t1 = (tmp_1 * m01 + tmp_6 * m21 + tmp_9 * m31) -
        (tmp_0 * m01 + tmp_7 * m21 + tmp_8 * m31);
    var t2 = (tmp_2 * m01 + tmp_7 * m11 + tmp_10 * m31) -
        (tmp_3 * m01 + tmp_6 * m11 + tmp_11 * m31);
    var t3 = (tmp_5 * m01 + tmp_8 * m11 + tmp_11 * m21) -
        (tmp_4 * m01 + tmp_9 * m11 + tmp_10 * m21);

    var d = 1.0 / (m00 * t0 + m10 * t1 + m20 * t2 + m30 * t3);

    return [
      d * t0,
      d * t1,
      d * t2,
      d * t3,
      d * ((tmp_1 * m10 + tmp_2 * m20 + tmp_5 * m30) -
            (tmp_0 * m10 + tmp_3 * m20 + tmp_4 * m30)),
      d * ((tmp_0 * m00 + tmp_7 * m20 + tmp_8 * m30) -
            (tmp_1 * m00 + tmp_6 * m20 + tmp_9 * m30)),
      d * ((tmp_3 * m00 + tmp_6 * m10 + tmp_11 * m30) -
            (tmp_2 * m00 + tmp_7 * m10 + tmp_10 * m30)),
      d * ((tmp_4 * m00 + tmp_9 * m10 + tmp_10 * m20) -
            (tmp_5 * m00 + tmp_8 * m10 + tmp_11 * m20)),
      d * ((tmp_12 * m13 + tmp_15 * m23 + tmp_16 * m33) -
            (tmp_13 * m13 + tmp_14 * m23 + tmp_17 * m33)),
      d * ((tmp_13 * m03 + tmp_18 * m23 + tmp_21 * m33) -
            (tmp_12 * m03 + tmp_19 * m23 + tmp_20 * m33)),
      d * ((tmp_14 * m03 + tmp_19 * m13 + tmp_22 * m33) -
            (tmp_15 * m03 + tmp_18 * m13 + tmp_23 * m33)),
      d * ((tmp_17 * m03 + tmp_20 * m13 + tmp_23 * m23) -
            (tmp_16 * m03 + tmp_21 * m13 + tmp_22 * m23)),
      d * ((tmp_14 * m22 + tmp_17 * m32 + tmp_13 * m12) -
            (tmp_16 * m32 + tmp_12 * m12 + tmp_15 * m22)),
      d * ((tmp_20 * m32 + tmp_12 * m02 + tmp_19 * m22) -
            (tmp_18 * m22 + tmp_21 * m32 + tmp_13 * m02)),
      d * ((tmp_18 * m12 + tmp_23 * m32 + tmp_15 * m02) -
            (tmp_22 * m32 + tmp_14 * m02 + tmp_19 * m12)),
      d * ((tmp_22 * m22 + tmp_16 * m02 + tmp_21 * m12) -
            (tmp_20 * m12 + tmp_23 * m22 + tmp_17 * m02))
    ];
  },

  vectorMultiply: function(v, m) {
    var dst = [];
    for (var i = 0; i < 4; ++i) {
      dst[i] = 0.0;
      for (var j = 0; j < 4; ++j) {
        dst[i] += v[j] * m[j * 4 + i];
      }
    }
    return dst;
  },

};


