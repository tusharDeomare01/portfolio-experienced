// Minimal GLB file structure (just header and JSON chunk)
const fs = require('fs');

// GLB file format: 12-byte header + JSON chunk + BIN chunk (empty)
const glbHeader = Buffer.alloc(12);
glbHeader.writeUInt32LE(0x46546C67, 0); // "glTF" magic
glbHeader.writeUInt32LE(2, 4); // version 2
glbHeader.writeUInt32LE(20, 8); // total length (12 header + 8 JSON chunk header)

// JSON chunk header (8 bytes)
const jsonChunkHeader = Buffer.alloc(8);
const jsonContent = JSON.stringify({
  asset: { version: "2.0", generator: "placeholder" },
  scenes: [{ nodes: [] }],
  scene: 0,
  nodes: [],
  meshes: [],
  materials: [],
  textures: [],
  images: [],
  accessors: [],
  bufferViews: [],
  buffers: []
});
const jsonBuffer = Buffer.from(jsonContent, 'utf8');
jsonChunkHeader.writeUInt32LE(jsonBuffer.length, 0); // chunk length
jsonChunkHeader.writeUInt32LE(0x4E4F534A, 4); // "JSON" chunk type

// Update total length
glbHeader.writeUInt32LE(12 + 8 + jsonBuffer.length, 8);

// Write GLB file
const glbFile = Buffer.concat([glbHeader, jsonChunkHeader, jsonBuffer]);
fs.writeFileSync('card.glb', glbFile);
console.log('Created placeholder card.glb');
