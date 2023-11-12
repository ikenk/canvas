// /canvas/particleclock
<script setup lang="ts">
const canvas = ref<HTMLCanvasElement>();

/**
 * 非类方式创建粒子时钟
 */
/**
 * 获取[min,max]范围内的随机数
 */
function getRandom(min: number, max: number) {
  return Math.floor(Math.random() * (max + 1 - min) + min);
}

/**
 * 获取需要绘制的时间文本
 */
function getText() {
  return new Date().toTimeString().slice(0, 8);
}

//颗粒数量
const PARTICLE_NUM = 1500;
//绘制文本
let text = "";
//绘制文本的字体大小
const FONT_SIZE = 140;
//颗粒对象形成数组
const particles = new Array(PARTICLE_NUM);
//颗粒颜色
const COLOR = "#5445544d";
//随机尺寸范围
const SIZE = [2, 7];
//开始移动时间
let startMoveTime = 0;
//弃用
function init(canvas: HTMLCanvasElement) {
  //初始化画布尺寸
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  canvas.style.width = window.innerWidth / window.devicePixelRatio + "px";
  canvas.style.height = window.innerHeight / window.devicePixelRatio + "px";
  // 初始化颗粒对象数组
  const cx = canvas.width / 2;
  const cy = canvas.height / 2;
  //循环创建每一个颗粒点
  for (let i = 0; i < particles.length; i++) {
    const rad = Math.random() * 2 * Math.PI;
    const size = getRandom(SIZE[0], SIZE[1]);
    const r = canvas.height / 2;
    particles[i] = {
      sx: cx + Math.cos(rad) * r,
      sy: cy + Math.sin(rad) * r,
      x: cx + Math.cos(rad) * r,
      y: cy + Math.sin(rad) * r,
      size,
    };
    // drawParticle(particles[i]);
  }
}

function drawParticle(ctx: CanvasRenderingContext2D, p) {
  ctx.beginPath();
  ctx.fillStyle = "red";
  ctx.arc(p.sx, p.sy, p.size, 0, Math.PI * 2);
  ctx.fill();
  ctx.closePath();
}

//绘制文本并获得像素点信息
function getBMP(ctx: CanvasRenderingContext2D) {
  const { width, height } = canvas.value!;
  // text = getText();
  clear(ctx);
  ctx.fillStyle = "#fff";
  ctx.textBaseline = "middle";
  ctx.font = `${FONT_SIZE}px Arial`;
  const textWidth = ctx.measureText(text).width;
  ctx.fillText(text, (width - textWidth) / 2, height / 2);
  const imageData = ctx.getImageData(0, 0, width, height);
  console.log(imageData);
  return imageData;
}

//刷新绘制
function fps(ctx: CanvasRenderingContext2D) {
  requestAnimationFrame(() => {
    //要绘制的文本
    const curText = getText();
    if (curText !== text) {
      console.log(curText, text);
      text = curText;
      //更新颗粒起始坐标
      for (const p of particles) {
        p.sx = p.x;
        p.sy = p.y;
      }
      startMoveTime = Date.now();
    }
    //获取像素点
    const imageData = getBMP(ctx);
    //更新绘制
    update(ctx, imageData);
    fps(ctx);
  });
}

function clear(ctx: CanvasRenderingContext2D) {
  ctx.clearRect(0, 0, canvas.value!.width, canvas.value!.height);
}

function update(ctx: CanvasRenderingContext2D, imageData: ImageData) {
  clear(ctx);
  const { width, height, data } = imageData;
  //取点
  const dis = 4; //间隔距离
  const pxls = []; //颗粒目标坐标
  for (let w = 0; w < width; w += dis) {
    for (let h = 0; h < height; h += dis) {
      const i = (w + h * width) * 4;
      if (data[i] > 10) {
        pxls.push([w, h]);
      }
    }
  }
  const count = Math.min(particles.length, pxls.length);
  //多长时间到达目标位置 毫秒
  const duration = 400;
  //现在已经过了多长时间
  const timeSpane = Date.now() - startMoveTime;
  for (let i = 0; i < count; i++) {
    const p = particles[i];
    //起始位置
    const { sx, sy } = p;
    //目标位置
    const [tx, ty] = pxls[i];
    console.log(sx, sy, tx, ty);
    //x和y的移动距离
    const disX = tx - sx;
    const disY = ty - sy;
    //得到这一次的移动偏移量
    let moveX = (disX / duration) * timeSpane;
    let moveY = (disY / duration) * timeSpane;
    if (Math.abs(moveX) > Math.abs(disX)) {
      moveX = disX;
    }
    if (Math.abs(moveY) > Math.abs(disY)) {
      moveY = disY;
    }
    //设置新的坐标
    p.x = moveX + sx;
    p.y = moveY + sy;
    drawParticle(ctx, p);
  }
}

/**
 * 类方式创建粒子时钟
 */
interface Particle {
  x: number;
  y: number;
  size: number;
}

class PartiClock {
  /**
   * 粒子属性
   */
  //颗粒数量
  private particleNum: number;
  //绘制文本的字体大小
  private fontSize: number;
  //颗粒颜色
  private color: string = "#5445544d";
  //随机尺寸范围
  private particleSize: Array<number> = [5, 7];

  //颗粒对象形成数组
  private partiArr: Array<Particle> = [];

  //粒子开始运动时的时间戳，即时间文本变化时刻
  private startTime: number = Date.now();

  //是否执行粒子运动函数
  private isRunning = true;

  /**
   * 文本
   */
  private text: string;

  /**
   * canvas像素点
   */
  private imageData: ImageData;

  /**
   * canvas
   */
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  /**
   * 获取[min,max]范围内的随机数
   */
  static getRandom(min: number, max: number) {
    return Math.floor(Math.random() * (max + 1 - min) + min);
  }

  constructor(
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    particleNum: number,
    fontSize: number,
    color: string,
    particleSize: Array<number>,
  ) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.particleNum = particleNum;
    this.fontSize = fontSize;
    this.color = color;
    this.particleSize = particleSize;
    this.text = this.getText();
    this.imageData = this.ctx.getImageData(
      0,
      0,
      this.canvas.width,
      this.canvas.height,
    );
    // 初始化颗粒对象数组
    for (let i = 0; i < this.particleNum; i++) {
      /**
       * 方法一：所有粒子呈圆形分布
       * @param {x,y} 圆心坐标，始终是canvas的中心点
       * @param radian 为了确定粒子的x/y坐标而生成的随机弧度
       * @param radius 粒子距离圆心的距离，始终固定为canvas高度的一半
       */
      //圆心坐标
      const partiStartX = this.canvas.width / 2;
      const partiStartY = this.canvas.height / 2;
      //生成随机弧度
      // const radian = Math.random() * 2 * Math.PI;
      //生成圆周半径
      // const radius = (this.canvas.height / 2) * 0.8;
      //选择粒子的大小
      const size: number = PartiClock.getRandom(
        this.particleSize[0],
        this.particleSize[1],
      );
      this.partiArr[i] = {
        x: partiStartX,
        y: partiStartY,
        // x: partiStartX + Math.cos(radian) * radius,
        // y: partiStartY + Math.sin(radian) * radius,
        size,
      };

      /**
       * 方法二：所有粒子集中在canvas中心
       */
      // //初始化粒子的位置
      // const partiStartX: number = this.canvas.width / 2,
      //   partiStartY: number = this.canvas.height / 2;
      // //选择粒子的大小
      // const size: number = PartiClock.getRandom(
      //   this.particleSize[0],
      //   this.particleSize[1],
      // );
      // this.partiArr[i] = {
      // x: partiStartX + Math.cos(radian) * radius,
      // y: partiStartY + Math.sin(radian) * radius,
      //   size: size,
      // };
    }
  }

  /**
   * 获取需要绘制的时间文本
   */
  getText() {
    return new Date().toTimeString().slice(0, 8);
  }

  drawPaticle(particle: Particle) {
    this.ctx.beginPath();
    this.ctx.fillStyle = this.color;
    this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    this.ctx.fill();
  }

  //画出text并获取相应的像素点
  getTextBMP() {
    this.clear();
    this.ctx.beginPath();
    this.ctx.fillStyle = "rgba(255,255,255,0.05)";
    this.ctx.font = `${this.fontSize}px Arial`;
    this.ctx.textBaseline = "middle";
    this.ctx.textAlign = "center";
    this.ctx.fillText(this.text, this.canvas.width / 2, this.canvas.height / 2);
    this.ctx.closePath();
    /**
     * 按需获取像素点信息
     */
    //获取整张画布canvas的像素点信息，数量单位：百万
    this.imageData = this.ctx.getImageData(
      0,
      0,
      this.canvas.width,
      this.canvas.height,
    );
    //仅获取时间文本的像素点信息，数量单位：万、十万 无法做到精准定位
    // this.imageData = this.ctx.getImageData(
    //   (this.canvas.width - this.ctx.measureText(this.text).width) / 2,
    //   this.canvas.height / 2 - this.fontSize / 2,
    //   this.ctx.measureText(this.text).width,
    //   this.fontSize,
    // );

    // let imageDataWidthStart =
    //     (this.canvas.width - this.ctx.measureText(this.text).width) / 2,
    //   imageDataHeightStart = this.canvas.height / 2 - this.fontSize / 2;

    // return { imageDataWidthStart, imageDataHeightStart };

    console.log(this.imageData);
  }

  //移动粒子
  moveParticle() {
    //获取当前时间文本
    const curText = this.getText();
    //间隔pixelGapNum个像素
    const pixelGapNum: number = 10;
    //获取
    const newPixels = [];
    if (curText !== text) {
      this.startTime = Date.now();
      this.text = curText;
      this.getTextBMP();
      for (let w = 0; w < this.imageData.width; w += pixelGapNum) {
        for (let h = 0; h < this.imageData.height; h += pixelGapNum) {
          console.log("getImageData");
          //获取像素rgba中的r/g/b/a的值
          const r = (w + h * this.canvas.width) * 4;
          // const g = (w + h * this.canvas.width) * 4 + 1;
          // const b = (w + h * this.canvas.width) * 4 + 2;
          // const a = (w + h * this.canvas.width) * 4 + 3;
          if (this.imageData.data[r] > 0) {
            newPixels.push({
              targetX: w,
              targetY: h,
            });
          }
        }
      }
    }
    //新像素数组与粒子数组相比较，取length较短的为循环次数
    const cyclingCount = Math.min(this.partiArr.length, newPixels.length);
    //多长时间到达目标位置 毫秒
    const duration = 100;
    let timeStep = Date.now() - this.startTime;
    for (let i = 0; i < cyclingCount; i++) {
      const disX = newPixels[i].targetX - this.partiArr[i].x;
      const disY = newPixels[i].targetY - this.partiArr[i].y;
      let moveX = (disX / duration) * timeStep;
      let moveY = (disY / duration) * timeStep;
      if (Math.abs(moveX) > Math.abs(disX)) {
        moveX = disX;
      }
      if (Math.abs(moveY) > Math.abs(disY)) {
        moveY = disY;
      }
      this.partiArr[i].x += moveX;
      this.partiArr[i].y += moveY;
      this.drawPaticle(this.partiArr[i]);
    }
  }

  animation() {
    requestAnimationFrame(() => {
      this.animation();
    });
    if (this.isRunning) {
      this.moveParticle();
    }
    this.isRunning = !this.isRunning;
  }

  //清空画布
  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}

onMounted(() => {
  if (canvas.value) {
    canvas.value.width = 600;
    canvas.value.height = 300;
    canvas.value.style.width = 400 / window.devicePixelRatio + "px";
    canvas.value.style.height = 200 / window.devicePixelRatio + "px";
    const ctx = canvas.value.getContext("2d", { willReadFrequently: true });

    if (ctx) {
      text = getText();
      const clock = new PartiClock(
        canvas.value,
        ctx,
        2000,
        150,
        "skyblue",
        [5, 7],
      );
      // clock.getTextBMP();
      // clock.animation();
    }
  }
});
</script>

<template>
  <div class="container">
    <canvas ref="canvas" class="canvas"></canvas>
  </div>
</template>

<style lang="scss" scoped>
.container {
  // background-color: #000;
  // overflow: hidden;

  .canvas {
    background-color: #000;
  }
}
</style>
