// /canvas/randomparticles
<script setup lang="ts">
const canvas = ref<HTMLCanvasElement>();
interface Particle {
  canvas: HTMLCanvasElement | null;
  ctx: CanvasRenderingContext2D | null;
  x: number;
  y: number;
  deltaX: number;
  deltaY: number;
  size: number;
  color: string;
}

class Dot {
  /**
   * 粒子属性
   */
  //创建粒子时的坐标
  private x: number;
  private y: number;
  //粒子坐标变化
  private deltaX: number;
  private deltaY: number;
  //粒子大小
  private size: number;
  //粒子颜色
  private color: string;
  //粒子属性对象
  private particle: Particle = {
    canvas: null,
    ctx: null,
    x: 0,
    y: 0,
    deltaX: Math.random() * 10 - 6,
    deltaY: Math.random() * 10 - 6,
    size: 2,
    color: "white",
  };

  /**
   * canvas对象
   */
  //传入的canvas对象
  static canvas: HTMLCanvasElement;
  static ctx: CanvasRenderingContext2D;

  //requestAnimationFrame标记
  static rafNum: number;

  //构造函数
  // constructor(
  //   canvas: HTMLCanvasElement,
  //   ctx: CanvasRenderingContext2D,
  //   x: number,
  //   y: number,
  //   deltaX: number = Math.random() * 10 - 6,
  //   deltaY: number = Math.random() * 10 - 6,
  //   size: number = 2,
  //   color: string = "white",
  // ) {
  //   Dot.canvas = canvas;
  //   Dot.ctx = ctx;
  //   this.x = x;
  //   this.y = y;
  //   this.deltaX = deltaX;
  //   this.deltaY = deltaY;
  //   this.size = size;
  //   this.color = color;
  // }

  //构造函数
  constructor(particleData: any) {
    this.particle = Object.assign(this.particle, particleData);
    if (this.particle.canvas && this.particle.ctx) {
      Dot.canvas = this.particle.canvas;
      Dot.ctx = this.particle.ctx;
    } else {
      throw new Error("there is no canvas or ctx for particle");
    }
    this.x = this.particle.x;
    this.y = this.particle.y;
    this.deltaX = this.particle.deltaX;
    this.deltaY = this.particle.deltaY;
    this.size = this.particle.size;
    this.color = this.particle.color;
  }

  //创建粒子方法
  draw() {
    Dot.ctx.beginPath();
    Dot.ctx.fillStyle = this.color;
    Dot.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    Dot.ctx.fill();
    // this.ctx.closePath();
  }

  //粒子运动方法
  move() {
    if (this.x > Dot.canvas.width || this.x <= 0) {
      this.deltaX = -this.deltaX;
    }
    if (this.y > Dot.canvas.height || this.y <= 0) {
      this.deltaY = -this.deltaY;
    }
    this.x = this.x + this.deltaX;
    this.y = this.y + this.deltaY;
    this.draw();
  }

  //静态方法：粒子组动画
  static animation(dots: Array<Dot>) {
    Dot.rafNum = requestAnimationFrame(function () {
      Dot.animation(dots);
    });
    Dot.ctx.clearRect(0, 0, Dot.canvas.width, Dot.canvas.height);
    //requestAnimationFrame函数中this指向问题
    dots.forEach((originDot, originIndex) => {
      originDot.move();
      dots.forEach((anotherDot, anotherIndex) => {
        if (anotherIndex === originIndex) return;
        if (
          Math.abs(anotherDot.x - originDot.x) < 120 &&
          Math.abs(anotherDot.y - originDot.y) < 120
        ) {
          originDot.setLine(
            originDot.x,
            originDot.y,
            anotherDot.x,
            anotherDot.y,
          );
        }
      });
    });
    console.log(Dot.rafNum);
  }

  //粒子间连线方法
  setLine(x1: number, y1: number, x2: number, y2: number) {
    Dot.ctx.beginPath();
    Dot.ctx.strokeStyle = "gray";
    Dot.ctx.moveTo(x1, y1);
    Dot.ctx.lineTo(x2, y2);
    Dot.ctx.stroke();
    Dot.ctx.closePath();
  }

  //取消requestAnimationFrame方法
  static cancelAnimation() {
    cancelAnimationFrame(Dot.rafNum);
  }
}
onMounted(() => {
  if (canvas.value) {
    canvas.value.width = window.innerWidth;
    canvas.value.height = window.innerHeight;
    canvas.value.style.width =
      window.innerWidth / window.devicePixelRatio + "px";
    canvas.value.style.height =
      window.innerHeight / window.devicePixelRatio + "px";
    const ctx = canvas.value.getContext("2d");

    if (ctx) {
      const dots = [];
      for (let i = 0; i < 30; i++) {
        dots.push(
          new Dot({
            canvas: canvas.value,
            ctx: ctx,
            x: (i + 1) * Math.random(),
            y: (i + 1) * Math.random(),
            size: 20,
            color: `rgb(${Math.floor(Math.random() * 255)},${Math.floor(
              Math.random() * 255,
            )},${Math.floor(Math.random() * 255)})`,
          }),
        );
      }
      // console.log(dots);
      Dot.animation(dots);
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
  background-color: #000;
}
</style>
