/**  @typedef {{attribs: Object.<string, number>, uniforms: Object.<string, WebGLUniformLocation>, program: WebGLProgram }} ShaderProgramInfo; */

/**
 *
 * @param {WebGLRenderingContext} gl
 * @param {string} vertPath
 * @param {string} fragPath
 * @returns {Promise.<ShaderProgramInfo>}
 */
async function shader__loadShaderProgram(gl, vertPath, fragPath) {
  const vertexShaderSource = await fetch(vertPath).then((res) => res.text());
  const fragmentShaderSource = await fetch(fragPath).then((res) => res.text());
  return shader__getShaderProgramLocations(gl, shader__initShaderProgram(gl, vertexShaderSource, fragmentShaderSource));
}

/**
 *
 * @param {WebGLRenderingContext} gl
 * @param {WebGLProgram} program
 * @returns {ShaderProgramInfo}
 */
function shader__getShaderProgramLocations(gl, program) {
  /** @type {Object.<string, number>} */
  const attribs = {};

  {
    const count = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);
    for (let i = 0; i < count; i++) {
      const { name } = gl.getActiveAttrib(program, i);
      attribs[name] = gl.getAttribLocation(program, name);
    }
  }

  /** @type {Object.<string, WebGLUniformLocation>} */
  const uniforms = {};

  {
    const count = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
    for (let i = 0; i < count; i++) {
      const { name } = gl.getActiveUniform(program, i);
      uniforms[name] = gl.getUniformLocation(program, name);
    }
  }

  return { attribs, uniforms, program };
}

/**
 *
 * @param {WebGLRenderingContext} gl
 * @param {string} vertexShaderSource
 * @param {string} fragmentShaderSource
 */
function shader__initShaderProgram(gl, vertexShaderSource, fragmentShaderSource) {
  const vertexShader = shader__loadShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  const fragmentShader = shader__loadShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    throw new Error('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
  }

  return shaderProgram;
}
/**
 *
 * @param {WebGLRenderingContext} gl
 * @param {number} type gl.VERTEX_SHADER or gl.FRAGMENT_SHADER
 * @param {string} source
 */
function shader__loadShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    throw new Error('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
  }
  return shader;
}
