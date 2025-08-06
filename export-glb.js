const fs = require('fs');
const { Document, NodeIO } = require('@gltf-transform/core');
// const { Materials } = require('@gltf-transform/extensions');

const json = JSON.parse(fs.readFileSync('./obj0.bin', 'utf8'));
const imageBuffer = fs.readFileSync('__.jpg');

const doc = new Document();
const buffer = doc.createBuffer();

// 创建纹理
const texture = doc.createTexture('texture')
  .setImage(imageBuffer)
  .setMimeType('image/jpeg');

// 创建材质
const material = doc.createMaterial('material')
  .setBaseColorTexture(texture)
  .setMetallicFactor(0.2)
  .setRoughnessFactor(0.8);

// 创建几何体
const position = doc.createAccessor()
  .setType('VEC3')
  .setArray(new Float32Array(json.vertexPositions))
  .setBuffer(buffer);

const normal = doc.createAccessor()
  .setType('VEC3')
  .setArray(new Float32Array(json.vertexNormals))
  .setBuffer(buffer);

const texcoord = doc.createAccessor()
  .setType('VEC2')
  .setArray(new Float32Array(json.vertexTextureCoords))
  .setBuffer(buffer);

const indices = doc.createAccessor()
  .setType('SCALAR')
  .setArray(new Uint16Array(json.indices))
  .setBuffer(buffer);

const prim = doc.createPrimitive()
  .setAttribute('POSITION', position)
  .setAttribute('NORMAL', normal)
  .setAttribute('TEXCOORD_0', texcoord)
  .setIndices(indices)
  .setMaterial(material);

const mesh = doc.createMesh('mesh').addPrimitive(prim);
const node = doc.createNode('node').setMesh(mesh);
doc.createScene('scene').addChild(node);

// 导出
async function exportGLB() {
  const io = new NodeIO();
  const glbBuffer = await io.writeBinary(doc); // 等待 Promise 解析
  fs.writeFileSync('model.glb', glbBuffer);
  console.log('✅ model.glb 已导出');
}

exportGLB().catch(console.error);