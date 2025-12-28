/* eslint-disable react/no-unknown-property */
/// <reference path="./meshline.d.ts" />
'use client';
import { useEffect, useRef, useState } from 'react';
import { Canvas, extend, useFrame } from '@react-three/fiber';
import { useGLTF, useTexture, Environment, Lightformer } from '@react-three/drei';
import {
  BallCollider,
  CuboidCollider,
  Physics,
  RigidBody,
  useRopeJoint,
  useSphericalJoint,
  type RigidBodyProps
} from '@react-three/rapier';
import { MeshLineGeometry, MeshLineMaterial } from 'meshline';
import * as THREE from 'three';

// replace with your own imports, see the usage snippet for details
import cardGLB from './card.glb';
import lanyard from './lanyard.png';
// Public assets should be referenced as string paths, not imported
const profilePhoto = '/Tushar_Deomare.jpg';

extend({ MeshLineGeometry, MeshLineMaterial });

// Function to create premium navy blue ribbon texture
function createPremiumRibbonTexture(width: number = 1024, height: number = 1024): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    const fallbackCanvas = document.createElement('canvas');
    fallbackCanvas.width = width;
    fallbackCanvas.height = height;
    const fallbackCtx = fallbackCanvas.getContext('2d');
    if (fallbackCtx) {
      fallbackCtx.fillStyle = '#1e3a8a';
      fallbackCtx.fillRect(0, 0, width, height);
    }
    return new THREE.CanvasTexture(fallbackCanvas);
  }

  // Base premium navy blue gradient with ultra-rich tones and depth
  const baseGradient = ctx.createLinearGradient(0, 0, 0, height);
  baseGradient.addColorStop(0, '#0f172a'); // Ultra deep navy top
  baseGradient.addColorStop(0.15, '#1e3a8a'); // Deep navy
  baseGradient.addColorStop(0.3, '#3b82f6'); // Bright blue highlight
  baseGradient.addColorStop(0.4, '#2563eb'); // Brilliant blue peak
  baseGradient.addColorStop(0.5, '#1e40af'); // Rich navy center
  baseGradient.addColorStop(0.6, '#2563eb'); // Bright blue
  baseGradient.addColorStop(0.7, '#1e3a8a'); // Return to deep navy
  baseGradient.addColorStop(0.85, '#1e3a5f'); // Darker navy
  baseGradient.addColorStop(1, '#0f172a'); // Ultra deep navy bottom
  ctx.fillStyle = baseGradient;
  ctx.fillRect(0, 0, width, height);
  
  // Add radial depth gradient from center
  ctx.save();
  ctx.globalAlpha = 0.2;
  const radialDepth = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, height);
  radialDepth.addColorStop(0, 'rgba(59, 130, 246, 0.3)'); // Bright center
  radialDepth.addColorStop(0.5, 'rgba(30, 58, 138, 0.2)'); // Medium
  radialDepth.addColorStop(1, 'rgba(15, 23, 42, 0.4)'); // Dark edges
  ctx.fillStyle = radialDepth;
  ctx.fillRect(0, 0, width, height);
  ctx.restore();

  // Add premium satin weave pattern with diagonal lines
  ctx.save();
  ctx.globalAlpha = 0.2;
  ctx.strokeStyle = '#3b82f6'; // Brighter blue for weave
  ctx.lineWidth = 0.5;
  
  // Diagonal satin weave pattern
  for (let i = -width; i < height + width; i += 6) {
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(width, i + width);
    ctx.stroke();
  }
  
  // Reverse diagonal for cross-weave
  ctx.strokeStyle = '#2563eb';
  ctx.globalAlpha = 0.15;
  for (let i = -width; i < height + width; i += 6) {
    ctx.beginPath();
    ctx.moveTo(width, i);
    ctx.lineTo(0, i + width);
    ctx.stroke();
  }
  ctx.restore();

  // Add horizontal satin stripes for premium fabric look
  ctx.save();
  ctx.globalAlpha = 0.12;
  ctx.strokeStyle = '#60a5fa';
  ctx.lineWidth = 1;
  for (let y = 0; y < height; y += 4) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
  ctx.restore();

  // Add ultra-premium metallic highlights with multiple sophisticated layers
  ctx.save();
  ctx.globalAlpha = 0.35;
  const highlightGradient = ctx.createLinearGradient(0, 0, 0, height);
  highlightGradient.addColorStop(0, 'rgba(255, 255, 255, 0.5)'); // Ultra bright top highlight
  highlightGradient.addColorStop(0.1, 'rgba(191, 219, 254, 0.4)'); // Sky blue-white
  highlightGradient.addColorStop(0.2, 'rgba(147, 197, 253, 0.35)'); // Bright blue-white
  highlightGradient.addColorStop(0.3, 'rgba(96, 165, 250, 0.2)'); // Light blue
  highlightGradient.addColorStop(0.4, 'transparent');
  highlightGradient.addColorStop(0.6, 'transparent');
  highlightGradient.addColorStop(0.7, 'rgba(30, 58, 95, 0.25)'); // Darker bottom
  highlightGradient.addColorStop(0.85, 'rgba(15, 23, 42, 0.35)'); // Deep shadow
  highlightGradient.addColorStop(1, 'rgba(0, 0, 0, 0.4)'); // Ultra deep shadow
  ctx.fillStyle = highlightGradient;
  ctx.fillRect(0, 0, width, height);
  ctx.restore();
  
  // Add secondary highlight layer for extra depth
  ctx.save();
  ctx.globalAlpha = 0.2;
  const secondaryHighlight = ctx.createLinearGradient(0, 0, 0, height * 0.4);
  secondaryHighlight.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
  secondaryHighlight.addColorStop(0.5, 'rgba(191, 219, 254, 0.2)');
  secondaryHighlight.addColorStop(1, 'transparent');
  ctx.fillStyle = secondaryHighlight;
  ctx.fillRect(0, 0, width, height * 0.4);
  ctx.restore();

  // Add ultra-premium center highlight stripe with multiple layers for satin effect
  ctx.save();
  ctx.globalAlpha = 0.4;
  const centerStripe = ctx.createLinearGradient(width / 2 - width * 0.15, 0, width / 2 + width * 0.15, 0);
  centerStripe.addColorStop(0, 'transparent');
  centerStripe.addColorStop(0.3, 'rgba(255, 255, 255, 0.15)');
  centerStripe.addColorStop(0.5, 'rgba(255, 255, 255, 0.3)'); // Bright center
  centerStripe.addColorStop(0.7, 'rgba(191, 219, 254, 0.2)'); // Blue-white
  centerStripe.addColorStop(1, 'transparent');
  ctx.fillStyle = centerStripe;
  ctx.fillRect(0, 0, width, height);
  ctx.restore();
  
  // Add secondary center stripe for extra satin depth
  ctx.save();
  ctx.globalAlpha = 0.25;
  const secondaryStripe = ctx.createLinearGradient(width / 2 - width * 0.08, 0, width / 2 + width * 0.08, 0);
  secondaryStripe.addColorStop(0, 'transparent');
  secondaryStripe.addColorStop(0.5, 'rgba(255, 255, 255, 0.25)');
  secondaryStripe.addColorStop(1, 'transparent');
  ctx.fillStyle = secondaryStripe;
  ctx.fillRect(0, 0, width, height);
  ctx.restore();

  // Add sophisticated texture noise for ultra-premium depth
  ctx.save();
  ctx.globalAlpha = 0.1;
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    // More sophisticated noise pattern
    const noise = (Math.random() - 0.5) * 20;
    const blueNoise = (Math.random() - 0.5) * 12; // Slight blue tint variation
    data[i] = Math.max(0, Math.min(255, data[i] + noise));     // R
    data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise * 0.8)); // G
    data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise + blueNoise)); // B (more variation)
  }
  ctx.putImageData(imageData, 0, 0);
  ctx.restore();
  
  // Add subtle fabric texture overlay
  ctx.save();
  ctx.globalAlpha = 0.06;
  ctx.fillStyle = '#1e3a8a';
  for (let y = 0; y < height; y += 2) {
    for (let x = 0; x < width; x += 2) {
      if ((x + y) % 4 === 0) {
        ctx.fillRect(x, y, 1, 1);
      }
    }
  }
  ctx.restore();

  // Add ultra-premium shimmer effect with multiple layers for satin look
  ctx.save();
  ctx.globalAlpha = 0.2;
  for (let y = 0; y < height; y += 15) {
    const shimmerGradient = ctx.createLinearGradient(0, y, 0, y + 12);
    shimmerGradient.addColorStop(0, 'rgba(255, 255, 255, 0.15)');
    shimmerGradient.addColorStop(0.3, 'rgba(191, 219, 254, 0.2)');
    shimmerGradient.addColorStop(0.5, 'rgba(147, 197, 253, 0.2)');
    shimmerGradient.addColorStop(0.7, 'rgba(96, 165, 250, 0.15)');
    shimmerGradient.addColorStop(1, 'transparent');
    ctx.fillStyle = shimmerGradient;
    ctx.fillRect(0, y, width, 12);
  }
  ctx.restore();
  
  // Add micro-shimmer for ultra-premium effect
  ctx.save();
  ctx.globalAlpha = 0.15;
  for (let y = 0; y < height; y += 8) {
    const microShimmer = ctx.createLinearGradient(0, y, 0, y + 4);
    microShimmer.addColorStop(0, 'rgba(255, 255, 255, 0.08)');
    microShimmer.addColorStop(0.5, 'rgba(147, 197, 253, 0.1)');
    microShimmer.addColorStop(1, 'transparent');
    ctx.fillStyle = microShimmer;
    ctx.fillRect(0, y, width, 4);
  }
  ctx.restore();
  
  // Add embossed edge highlights for 3D effect
  ctx.save();
  ctx.globalAlpha = 0.3;
  const edgeHighlight = ctx.createLinearGradient(0, 0, width, 0);
  edgeHighlight.addColorStop(0, 'rgba(255, 255, 255, 0.2)');
  edgeHighlight.addColorStop(0.1, 'transparent');
  edgeHighlight.addColorStop(0.9, 'transparent');
  edgeHighlight.addColorStop(1, 'rgba(255, 255, 255, 0.2)');
  ctx.fillStyle = edgeHighlight;
  ctx.fillRect(0, 0, width, height * 0.2);
  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.anisotropy = 16; // Maximum anisotropy for premium quality
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = true;
  texture.needsUpdate = true;
  return texture;
}

// Function to create ID card texture from canvas
function createIDCardTexture(
  _logoImage: HTMLImageElement | null,
  profileImage: HTMLImageElement | null,
  width: number = 1750,
  height: number = 2500
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    // Fallback: create a simple white texture
    const fallbackCanvas = document.createElement('canvas');
    fallbackCanvas.width = width;
    fallbackCanvas.height = height;
    const fallbackCtx = fallbackCanvas.getContext('2d');
    if (fallbackCtx) {
      fallbackCtx.fillStyle = '#ffffff';
      fallbackCtx.fillRect(0, 0, width, height);
    }
    return new THREE.CanvasTexture(fallbackCanvas);
  }

  // Background - increased brightness by 30% (brighter neutral off-white gradient)
  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, '#acacac'); // Increased brightness by 30% from #848484 (132 * 1.3 = 172)
  gradient.addColorStop(0.5, '#b0b0b0'); // Increased brightness by 30% from #878787 (135 * 1.3 = 176)
  gradient.addColorStop(1, '#a8a8a8'); // Increased brightness by 30% from #818181 (129 * 1.3 = 168)
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  
  // Add subtle radial highlight from top center for depth
  ctx.save();
  ctx.globalAlpha = 0.15;
  const radialHighlight = ctx.createRadialGradient(
    width / 2, 
    height * 0.1, 
    0,
    width / 2, 
    height * 0.1, 
    height * 0.6
  );
  radialHighlight.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
  radialHighlight.addColorStop(0.5, 'rgba(255, 255, 255, 0.1)');
  radialHighlight.addColorStop(1, 'transparent');
  ctx.fillStyle = radialHighlight;
  ctx.fillRect(0, 0, width, height);
  ctx.restore();

  // Add subtle geometric pattern overlay for premium look
  ctx.save();
  ctx.globalAlpha = 0.03;
  ctx.strokeStyle = '#2563eb';
  ctx.lineWidth = 1;
  const patternSize = 40;
  for (let x = 0; x < width; x += patternSize) {
    for (let y = 0; y < height; y += patternSize) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + patternSize, y + patternSize);
      ctx.stroke();
    }
  }
  ctx.restore();
  
  // Add subtle corner accent decorations for premium feel
  ctx.save();
  ctx.globalAlpha = 0.08;
  ctx.strokeStyle = '#929292'; // Increased brightness by 30% from #707070 (112 * 1.3 = 146)
  ctx.lineWidth = 2;
  const cornerSize = 15;
  // Top-left corner
  ctx.beginPath();
  ctx.moveTo(10, 10);
  ctx.lineTo(10 + cornerSize, 10);
  ctx.moveTo(10, 10);
  ctx.lineTo(10, 10 + cornerSize);
  ctx.stroke();
  // Top-right corner
  ctx.beginPath();
  ctx.moveTo(width - 10, 10);
  ctx.lineTo(width - 10 - cornerSize, 10);
  ctx.moveTo(width - 10, 10);
  ctx.lineTo(width - 10, 10 + cornerSize);
  ctx.stroke();
  // Bottom-left corner
  ctx.beginPath();
  ctx.moveTo(10, height - 10);
  ctx.lineTo(10 + cornerSize, height - 10);
  ctx.moveTo(10, height - 10);
  ctx.lineTo(10, height - 10 - cornerSize);
  ctx.stroke();
  // Bottom-right corner
  ctx.beginPath();
  ctx.moveTo(width - 10, height - 10);
  ctx.lineTo(width - 10 - cornerSize, height - 10);
  ctx.moveTo(width - 10, height - 10);
  ctx.lineTo(width - 10, height - 10 - cornerSize);
  ctx.stroke();
  ctx.restore();

  // Punch hole at the top center with subtle ring enhancement
  const punchHoleRadius = width * 0.03; // ~3% of width
  const punchHoleY = height * 0.05; // 5% from top
  
  // Outer subtle ring for depth
  ctx.save();
  ctx.globalAlpha = 0.3;
  ctx.strokeStyle = '#929292';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(width / 2, punchHoleY, punchHoleRadius + 2, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
  
  ctx.fillStyle = '#000000';
  ctx.beginPath();
  ctx.arc(width / 2, punchHoleY, punchHoleRadius, 0, Math.PI * 2);
  ctx.fill();
  
  // Inner white circle for punch hole effect (increased brightness by 30%)
  ctx.fillStyle = '#b6b6b6'; // Increased brightness by 30% from #8c8c8c (140 * 1.3 = 182)
  ctx.beginPath();
  ctx.arc(width / 2, punchHoleY, punchHoleRadius * 0.7, 0, Math.PI * 2);
  ctx.fill();
  
  // Subtle top highlight on punch hole
  ctx.save();
  ctx.globalAlpha = 0.4;
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(width / 2, punchHoleY - punchHoleRadius * 0.2, punchHoleRadius * 0.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Profile photo - circular with premium border (logo removed, moved up)
  if (profileImage) {
    const photoSize = width * 0.558; // 55.8% of width - increased by 50% from 0.372
    const photoX = (width - photoSize) / 2;
    const photoY = height * 0.15; // Adjusted position to accommodate larger photo
    
    // Enhanced shadow with multiple layers for depth
    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx.shadowBlur = 25;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 6;
    // Create clipping path that extends slightly beyond to avoid white ring
    ctx.beginPath();
    ctx.arc(photoX + photoSize / 2, photoY + photoSize / 2, photoSize / 2 + 1, 0, Math.PI * 2);
    ctx.clip();
    
    // Adjust brightness (increased by 30% from 0.5 to 0.65)
    ctx.filter = 'brightness(0.65)';
    // Draw image slightly larger to fill the entire circle and prevent white ring
    ctx.drawImage(profileImage, photoX - 2, photoY - 2, photoSize + 4, photoSize + 4);
    ctx.filter = 'none';
    ctx.restore();
    
    // Add subtle gradient overlay for depth enhancement
    ctx.save();
    const photoGradient = ctx.createRadialGradient(
      photoX + photoSize / 2, 
      photoY + photoSize / 2, 
      photoSize * 0.3,
      photoX + photoSize / 2, 
      photoY + photoSize / 2, 
      photoSize / 2
    );
    photoGradient.addColorStop(0, 'rgba(255, 255, 255, 0.1)');
    photoGradient.addColorStop(0.7, 'transparent');
    photoGradient.addColorStop(1, 'rgba(0, 0, 0, 0.2)');
    ctx.fillStyle = photoGradient;
    ctx.beginPath();
    ctx.arc(photoX + photoSize / 2, photoY + photoSize / 2, photoSize / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    
    // Premium triple border around photo (increased brightness by 30%)
    // Outer glow border
    ctx.save();
    ctx.globalAlpha = 0.2;
    ctx.strokeStyle = '#929292'; // Increased brightness by 30% from #707070 (112 * 1.3 = 146)
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.arc(photoX + photoSize / 2, photoY + photoSize / 2, photoSize / 2 + 2, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
    
    // Main border
    ctx.strokeStyle = '#929292'; // Increased brightness by 30% from #707070 (112 * 1.3 = 146)
    ctx.lineWidth = 6; // Increased border width for more prominence
    ctx.beginPath();
    ctx.arc(photoX + photoSize / 2, photoY + photoSize / 2, photoSize / 2, 0, Math.PI * 2);
    ctx.stroke();
    
    // Middle accent border
    ctx.strokeStyle = '#a1a1a1'; // Increased brightness by 30% from #7c7c7c (124 * 1.3 = 161)
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(photoX + photoSize / 2, photoY + photoSize / 2, photoSize / 2 - 3, 0, Math.PI * 2);
    ctx.stroke();
    
    // Inner border (increased brightness by 30%)
    ctx.strokeStyle = '#adadad'; // Increased brightness by 30% from #858585 (133 * 1.3 = 173)
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(photoX + photoSize / 2, photoY + photoSize / 2, photoSize / 2 - 6, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Name - ultra bold black with maximum font weight and size
  ctx.shadowColor = 'rgba(255, 255, 255, 0.95)';
  ctx.shadowBlur = 8;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
  ctx.fillStyle = '#000000';
  ctx.font = `900 ${width * 0.095}px -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', 'SF Pro Display', Roboto, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.letterSpacing = '0.8px'; // Increased letter spacing for more impact
  const nameY = profileImage ? height * 0.62 : height * 0.45; // Adjusted for larger photo
  ctx.fillText('Tushar Deomare', width / 2, nameY);
  ctx.shadowBlur = 0;
  ctx.letterSpacing = 'normal';

  // Title - ultra bold black with maximum font weight and size
  ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
  ctx.shadowBlur = 6;
  ctx.fillStyle = '#000000';
  ctx.font = `900 ${width * 0.060}px -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', 'SF Pro Display', Roboto, sans-serif`;
  ctx.letterSpacing = '0.5px'; // Increased letter spacing
  const titleY = nameY + height * 0.055;
  ctx.fillText('Software Engineer', width / 2, titleY);
  ctx.shadowBlur = 0;
  ctx.letterSpacing = 'normal';

  // Premium divider with gradient effect (increased brightness by 30%)
  const dividerY = titleY + height * 0.045;
  
  // Subtle shadow below divider for depth
  ctx.save();
  ctx.globalAlpha = 0.1;
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(width * 0.12, dividerY + 1);
  ctx.lineTo(width * 0.88, dividerY + 1);
  ctx.stroke();
  ctx.restore();
  
  const dividerGradient = ctx.createLinearGradient(width * 0.15, dividerY, width * 0.85, dividerY);
  dividerGradient.addColorStop(0, 'transparent');
  dividerGradient.addColorStop(0.5, '#929292'); // Increased brightness by 30% from #707070 (112 * 1.3 = 146)
  dividerGradient.addColorStop(1, 'transparent');
  ctx.strokeStyle = dividerGradient;
  ctx.lineWidth = 2; // Increased line width for more visibility
  ctx.beginPath();
  ctx.moveTo(width * 0.12, dividerY);
  ctx.lineTo(width * 0.88, dividerY);
  ctx.stroke();
  
  // Enhanced accent dots with subtle glow (increased brightness by 30%)
  ctx.save();
  ctx.shadowColor = '#696969';
  ctx.shadowBlur = 3;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
  ctx.fillStyle = '#696969'; // Increased brightness by 30% from #515151 (81 * 1.3 = 105)
  ctx.beginPath();
  ctx.arc(width * 0.12, dividerY, 3, 0, Math.PI * 2); // Increased dot size
  ctx.fill();
  ctx.beginPath();
  ctx.arc(width * 0.88, dividerY, 3, 0, Math.PI * 2); // Increased dot size
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.restore();

  // Contact info - ultra bold black with maximum font weight, size, and icons
  ctx.shadowColor = 'rgba(255, 255, 255, 0.7)';
  ctx.shadowBlur = 4;
  ctx.fillStyle = '#000000';
  ctx.font = `900 ${width * 0.050}px -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', 'SF Pro Display', Roboto, sans-serif`;
  ctx.textAlign = 'center';
  ctx.letterSpacing = '0.3px'; // Increased letter spacing
  
  const contactStartY = dividerY + height * 0.07;
  const lineHeight = height * 0.038;
  
  // Icons for contact information
  const icons = ['📞', '✉️', '💼', '🐙'];
  
  const contactInfo = [
    '+91 95275 57455',
    'tdeomare1@gmail.com',
    'linkedin.com/in/tushar-deomare',
    'github.com/tushar-deomare'
  ];
  
  contactInfo.forEach((info, index) => {
    // Draw icon and text together with spacing
    const iconText = `${icons[index]} ${info}`;
    // Add subtle background highlight for each contact line
    ctx.save();
    ctx.globalAlpha = 0.05;
    ctx.fillStyle = '#000000';
    const lineY = contactStartY + (index * lineHeight);
    ctx.fillRect(width * 0.1, lineY - height * 0.012, width * 0.8, height * 0.024);
    ctx.restore();
    
    ctx.fillText(iconText, width / 2, lineY);
  });
  ctx.shadowBlur = 0;
  ctx.letterSpacing = 'normal';

  // Premium border with subtle shadow effect (increased brightness by 30%)
  ctx.strokeStyle = '#a1a1a1'; // Increased brightness by 30% from #7c7c7c (124 * 1.3 = 161)
  ctx.lineWidth = 3; // Increased border width for more definition
  ctx.strokeRect(2, 2, width - 4, height - 4);
  
  // Inner subtle border (increased brightness by 30%)
  ctx.strokeStyle = '#adadad'; // Increased brightness by 30% from #858585 (133 * 1.3 = 173)
  ctx.lineWidth = 1.5; // Increased border width
  ctx.strokeRect(4, 4, width - 8, height - 8);
  
  // Add subtle outer glow effect for premium look
  ctx.save();
  ctx.globalAlpha = 0.15;
  ctx.shadowColor = '#000000';
  ctx.shadowBlur = 20;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 1;
  ctx.strokeRect(1, 1, width - 2, height - 2);
  ctx.restore();
  
  // Add subtle inner highlight at top for embossed effect
  ctx.save();
  ctx.globalAlpha = 0.2;
  const topHighlight = ctx.createLinearGradient(0, 0, 0, height * 0.15);
  topHighlight.addColorStop(0, 'rgba(255, 255, 255, 0.5)');
  topHighlight.addColorStop(1, 'transparent');
  ctx.fillStyle = topHighlight;
  ctx.fillRect(5, 5, width - 10, height * 0.15);
  ctx.restore();

  // Flip the canvas content both horizontally and vertically
  const flippedCanvas = document.createElement('canvas');
  flippedCanvas.width = width;
  flippedCanvas.height = height;
  const flippedCtx = flippedCanvas.getContext('2d');
  if (flippedCtx) {
    // Translate to center, scale to flip, then translate back
    flippedCtx.translate(width, height);
    flippedCtx.scale(-1, -1);
    flippedCtx.drawImage(canvas, 0, 0);
  }

  const texture = new THREE.CanvasTexture(flippedCanvas || canvas);
  texture.flipY = false; // Canvas is already flipped
  texture.needsUpdate = true;
  return texture;
}

interface LanyardProps {
  position?: [number, number, number];
  gravity?: [number, number, number];
  fov?: number;
  transparent?: boolean;
}

export default function Lanyard({
  position = [0, 0, 30],
  gravity = [1, -40, 1],
  fov = 20,
  transparent = false
}: LanyardProps) {
  const [isMobile, setIsMobile] = useState<boolean>(() => typeof window !== 'undefined' && window.innerWidth < 768);

  useEffect(() => {
    const handleResize = (): void => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div 
      className="relative z-0 w-full h-screen flex justify-center items-center transform scale-100 origin-center"
      style={{ touchAction: 'none', WebkitTouchCallout: 'none', userSelect: 'none' }}
    >
      <Canvas
        camera={{ position, fov }}
        dpr={[1, isMobile ? 1.5 : 2]}
        gl={{ alpha: transparent }}
        onCreated={({ gl }) => gl.setClearColor(new THREE.Color(0x000000), transparent ? 0 : 1)}
        style={{ touchAction: 'none' }}
      >
        <ambientLight intensity={Math.PI} />
        <Physics gravity={gravity} timeStep={isMobile ? 1 / 30 : 1 / 60}>
          <Band isMobile={isMobile} fov={fov} cameraZ={position[2]} />
        </Physics>
        <Environment blur={0.75}>
          <Lightformer
            intensity={2}
            color="white"
            position={[0, -1, 5]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={3}
            color="white"
            position={[-1, -1, 1]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={3}
            color="white"
            position={[1, 1, 1]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={10}
            color="white"
            position={[-10, 0, 14]}
            rotation={[0, Math.PI / 2, Math.PI / 3]}
            scale={[100, 10, 1]}
          />
        </Environment>
      </Canvas>
    </div>
  );
}

interface BandProps {
  maxSpeed?: number;
  minSpeed?: number;
  isMobile?: boolean;
  fov?: number;
  cameraZ?: number;
}

function Band({ maxSpeed = 50, minSpeed = 0, isMobile = false, fov = 20, cameraZ = 30 }: BandProps) {
  // Using "any" for refs since the exact types depend on Rapier's internals
  const band = useRef<any>(null);
  const fixed = useRef<any>(null);
  const j1 = useRef<any>(null);
  const j2 = useRef<any>(null);
  const j3 = useRef<any>(null);
  const card = useRef<any>(null);

  const vec = new THREE.Vector3();
  const ang = new THREE.Vector3();
  const rot = new THREE.Vector3();
  const dir = new THREE.Vector3();
  
  // Calculate the top of the viewport in 3D space
  // This ensures the ribbon starts from the top of the screen for all screen sizes
  const getTopYPosition = () => {
    const distance = Math.abs(cameraZ);
    const fovRad = fov * (Math.PI / 180); // Convert to radians
    const height = 2 * Math.tan(fovRad / 2) * distance;
    return height / 2; // Top of viewport
  };
  
  const topY = getTopYPosition();

  const segmentProps: any = {
    type: 'dynamic' as RigidBodyProps['type'],
    canSleep: true,
    colliders: false,
    angularDamping: 4,
    linearDamping: 4
  };

  // Load assets - hooks must be called unconditionally
  // The placeholder files allow the module to load, but may not have the expected structure
  const gltfData = useGLTF(cardGLB) as any;
  const textureData = useTexture(lanyard);
  const photoTexture = useTexture(profilePhoto);
  
  const { nodes = {}, materials = {} } = gltfData || {};
  const texture = textureData;
  
  // State for ID card texture
  const [idCardTexture, setIdCardTexture] = useState<THREE.CanvasTexture | null>(null);
  const [logoImage, setLogoImage] = useState<HTMLImageElement | null>(null);
  const [profileImage, setProfileImage] = useState<HTMLImageElement | null>(null);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  
  // Premium navy blue ribbon texture
  const [ribbonTexture, setRibbonTexture] = useState<THREE.CanvasTexture | null>(null);
  
  // Create premium ribbon texture on mount with higher resolution
  useEffect(() => {
    const premiumTexture = createPremiumRibbonTexture(1024, 1024);
    // Configure texture for premium quality
    premiumTexture.anisotropy = 16;
    premiumTexture.minFilter = THREE.LinearMipmapLinearFilter;
    premiumTexture.magFilter = THREE.LinearFilter;
    setRibbonTexture(premiumTexture);
  }, []);

  // Load logo (favicon) and profile images
  useEffect(() => {
    let logoLoaded = false;
    let profileLoaded = false;
    
    const checkAllLoaded = () => {
      if (logoLoaded && profileLoaded) {
        setImagesLoaded(true);
      }
    };

    // Load favicon/logo
    const logo = new Image();
    logo.crossOrigin = 'anonymous';
    logo.onload = () => {
      setLogoImage(logo);
      logoLoaded = true;
      checkAllLoaded();
    };
    logo.onerror = () => {
      console.warn('Failed to load logo');
      setLogoImage(null);
      logoLoaded = true;
      checkAllLoaded();
    };
    logo.src = '/favicon.svg';

    // Load profile photo
    const profile = new Image();
    profile.crossOrigin = 'anonymous';
    profile.onload = () => {
      setProfileImage(profile);
      profileLoaded = true;
      checkAllLoaded();
    };
    profile.onerror = () => {
      console.warn('Failed to load profile photo');
      setProfileImage(null);
      profileLoaded = true;
      checkAllLoaded();
    };
    profile.src = profilePhoto;
  }, []);

  // Create ID card texture when images are loaded (or failed to load)
  useEffect(() => {
    if (imagesLoaded) {
      // Wait a bit to ensure images are fully loaded
      const timer = setTimeout(() => {
        const cardTexture = createIDCardTexture(logoImage, profileImage);
        // Configure texture properties
        cardTexture.wrapS = cardTexture.wrapT = THREE.ClampToEdgeWrapping;
        cardTexture.flipY = true; // Three.js uses flipped Y by default for textures
        setIdCardTexture(cardTexture);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [imagesLoaded, logoImage, profileImage]);
  const [curve] = useState(
    () =>
      new THREE.CatmullRomCurve3([new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()])
  );
  const [dragged, drag] = useState<false | THREE.Vector3>(false);
  const [hovered, hover] = useState(false);
  const pointerIdRef = useRef<number | null>(null);

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1]);
  useSphericalJoint(j3, card, [
    [0, 0, 0],
    [0, 1.45, 0]
  ]);

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = dragged ? 'grabbing' : 'grab';
      return () => {
        document.body.style.cursor = 'auto';
      };
    }
  }, [hovered, dragged]);

  useFrame((state, delta) => {
    if (dragged && typeof dragged !== 'boolean') {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));
      [card, j1, j2, j3, fixed].forEach(ref => ref.current?.wakeUp());
      card.current?.setNextKinematicTranslation({
        x: vec.x - dragged.x,
        y: vec.y - dragged.y,
        z: vec.z - dragged.z
      });
    }
    if (fixed.current) {
      [j1, j2].forEach(ref => {
        if (!ref.current.lerped) ref.current.lerped = new THREE.Vector3().copy(ref.current.translation());
        const clampedDistance = Math.max(0.1, Math.min(1, ref.current.lerped.distanceTo(ref.current.translation())));
        ref.current.lerped.lerp(
          ref.current.translation(),
          delta * (minSpeed + clampedDistance * (maxSpeed - minSpeed))
        );
      });
      curve.points[0].copy(j3.current.translation());
      curve.points[1].copy(j2.current.lerped);
      curve.points[2].copy(j1.current.lerped);
      curve.points[3].copy(fixed.current.translation());
      band.current.geometry.setPoints(curve.getPoints(isMobile ? 16 : 32));
      ang.copy(card.current.angvel());
      rot.copy(card.current.rotation());
      card.current.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z });
    }
  });

  curve.curveType = 'chordal';
  if (texture && texture.isTexture) {
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  }
  if (ribbonTexture && ribbonTexture.isTexture) {
    ribbonTexture.wrapS = ribbonTexture.wrapT = THREE.RepeatWrapping;
  }

  return (
    <>
      <group position={[0, topY, 0]}>
        <RigidBody ref={fixed} {...segmentProps} type={'fixed' as RigidBodyProps['type']} />
        <RigidBody position={[0.5, 0, 0]} ref={j1} {...segmentProps} type={'dynamic' as RigidBodyProps['type']}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1, 0, 0]} ref={j2} {...segmentProps} type={'dynamic' as RigidBodyProps['type']}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1.5, 0, 0]} ref={j3} {...segmentProps} type={'dynamic' as RigidBodyProps['type']}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody
          position={[2, 0, 0]}
          ref={card}
          {...segmentProps}
          type={dragged ? ('kinematicPosition' as RigidBodyProps['type']) : ('dynamic' as RigidBodyProps['type'])}
        >
          <CuboidCollider args={[0.875, 1.25, 0.01]} />
          <group
            scale={2.5}
            position={[0, -1.7, -0.05]}
            onPointerOver={() => hover(true)}
            onPointerOut={() => hover(false)}
            onPointerUp={(e: any) => {
              const nativeEvent = e.nativeEvent || e;
              if (pointerIdRef.current !== null && nativeEvent.pointerId === pointerIdRef.current) {
                try {
                  if (nativeEvent.target && typeof nativeEvent.target.releasePointerCapture === 'function') {
                    nativeEvent.target.releasePointerCapture(nativeEvent.pointerId);
                  }
                } catch (err) {
                  // Pointer capture might fail on some devices, ignore
                }
                pointerIdRef.current = null;
              }
              drag(false);
            }}
            onPointerDown={(e: any) => {
              const nativeEvent = e.nativeEvent || e;
              // Note: preventDefault may not work in passive listeners, but touchAction: 'none' CSS handles this
              pointerIdRef.current = nativeEvent.pointerId;
              try {
                if (nativeEvent.target && typeof nativeEvent.target.setPointerCapture === 'function') {
                  nativeEvent.target.setPointerCapture(nativeEvent.pointerId);
                }
              } catch (err) {
                // Pointer capture might fail on some devices, continue anyway
              }
              const offset = new THREE.Vector3().copy(e.point).sub(vec.copy(card.current.translation()));
              drag(offset);
            }}
            onPointerMove={() => {
              // No need to preventDefault - touchAction CSS handles it
            }}
            onPointerCancel={(e: any) => {
              const nativeEvent = e.nativeEvent || e;
              if (pointerIdRef.current !== null && nativeEvent.pointerId === pointerIdRef.current) {
                try {
                  if (nativeEvent.target && typeof nativeEvent.target.releasePointerCapture === 'function') {
                    nativeEvent.target.releasePointerCapture(nativeEvent.pointerId);
                  }
                } catch (err) {
                  // Pointer capture might fail on some devices, ignore
                }
                pointerIdRef.current = null;
              }
              drag(false);
            }}
          >
            {nodes.card?.geometry ? (
              <mesh geometry={nodes.card.geometry} rotation={[0, Math.PI, Math.PI]}>
                <meshPhysicalMaterial
                  map={idCardTexture || photoTexture || materials.base?.map}
                  map-anisotropy={16}
                  clearcoat={isMobile ? 0 : 1.2}
                  clearcoatRoughness={0.1}
                  roughness={0.3}
                  metalness={0.1}
                  side={THREE.DoubleSide}
                />
              </mesh>
            ) : (
              // Fallback: simple box geometry if GLB is not loaded - with ID card texture
              <mesh rotation={[0, Math.PI, Math.PI]}>
                <boxGeometry args={[1.75, 2.5, 0.02]} />
                <meshPhysicalMaterial
                  map={idCardTexture || photoTexture}
                  color="#ffffff"
                  clearcoat={isMobile ? 0 : 1.2}
                  clearcoatRoughness={0.1}
                  roughness={0.3}
                  metalness={0.1}
                  side={THREE.DoubleSide}
                />
              </mesh>
            )}
            {/* Premium 3D Metal Hook */}
            <group position={[0, 1.125, 0.015]}>
              {/* Main hook body - curved cylinder */}
              <mesh rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.09, 0.09, 0.18, 16]} />
                <meshPhysicalMaterial
                  metalness={0.95}
                  roughness={0.15}
                  clearcoat={1}
                  clearcoatRoughness={0.1}
                  color="#d0d0d0"
                />
              </mesh>
              {/* Hook attachment plate */}
              <mesh position={[0, 0, 0.09]} rotation={[0, 0, 0]}>
                <boxGeometry args={[0.2, 0.12, 0.03]} />
                <meshPhysicalMaterial
                  metalness={0.95}
                  roughness={0.15}
                  clearcoat={1}
                  clearcoatRoughness={0.1}
                  color="#d0d0d0"
                />
              </mesh>
              {/* Hook opening/clip detail */}
              <mesh position={[0, -0.06, 0.09]} rotation={[Math.PI / 6, 0, 0]}>
                <boxGeometry args={[0.15, 0.08, 0.02]} />
                <meshPhysicalMaterial
                  metalness={0.95}
                  roughness={0.15}
                  clearcoat={1}
                  clearcoatRoughness={0.1}
                  color="#c0c0c0"
                />
              </mesh>
            </group>
            {nodes.clip?.geometry && (
              <mesh geometry={nodes.clip.geometry} material={materials.metal} material-roughness={0.3} />
            )}
            {nodes.clamp?.geometry && (
              <mesh geometry={nodes.clamp.geometry} material={materials.metal} />
            )}
          </group>
        </RigidBody>
      </group>
      <mesh ref={band}>
        {/* @ts-expect-error - meshline extended components */}
        <meshLineGeometry />
        {/* @ts-expect-error - meshline extended components */}
        <meshLineMaterial
          color="#1e3a8a"
          depthTest={false}
          resolution={isMobile ? [1500, 3000] : [3000, 3000]}
          useMap
          map={ribbonTexture || texture}
          repeat={[-8, 1]}
          lineWidth={1.8}
          transparent={true}
          opacity={0.98}
        />
      </mesh>
    </>
  );
}
