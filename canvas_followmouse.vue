/canvas/followmouse
<script setup lang="ts">
const canvas = ref<HTMLCanvasElement>();

class Spline {
  //初始位置
  private x: number;
  private y: number;
  //随机启动角 随机启动半径
  private angle: number = Math.PI * 2 * Math.random();
  private radius = Math.random() * 100;

  //随机颜色
  private color: string = "red";

  /**
   * 鼠标坐标
   */
  static mouseX: number;
  static mouseY: number;

  /**
   * canvas对象
   */
  //传入的canvas对象
  static canvas: HTMLCanvasElement;
  static ctx: CanvasRenderingContext2D;

  constructor(
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    color: string,
  ) {
    Spline.canvas = canvas;
    Spline.ctx = ctx;
    this.x = x;
    this.y = y;
    this.color = color;
    Spline.mouseX = canvas.width / 2;
    Spline.mouseY = canvas.height / 2;
  }

  //跟踪鼠标坐标
  static mouseMove(mouseX: number, mouseY: number) {
    Spline.mouseX = mouseX;
    Spline.mouseY = mouseY;
  }

  /**
   * 划线函数：在鼠标周围形成环绕的线条
   * 原理：在对象创建时，@radius 和 @angle 就已经固定，
   * 因此 @x 和 @y 的值就是绕着 鼠标的坐标 @mouseX 和 @mouseY 旋转
   * 当 @angle 的变化值很小的时候， @function{moveTo} 和 @function{lineTo} 画出的线就非常短，
   * 视觉上就是围绕着鼠标坐标旋转的“点”
   */
  draw() {
    Spline.ctx.beginPath();
    Spline.ctx.strokeStyle = this.color;
    Spline.ctx.moveTo(this.x, this.y);
    // if (this.angle < -20) return;
    // this.angle -= 2;
    this.angle -= 0.02;
    this.x = Spline.mouseX + this.radius * Math.cos(this.angle);
    this.y = Spline.mouseY + this.radius * Math.sin(this.angle);
    Spline.ctx.lineTo(this.x, this.y);
    Spline.ctx.lineWidth = 5;
    Spline.ctx.stroke();
    Spline.ctx.closePath();
  }

  //动画方法
  static animation(splines: Array<Spline>) {
    // Spline.ctx.clearRect(0, 0, Spline.canvas.width, Spline.canvas.height);
    requestAnimationFrame(function () {
      Spline.animation(splines);
    });
    Spline.ctx.fillStyle = "rgba(0,0,0,0.05)";
    Spline.ctx.fillRect(0, 0, Spline.canvas.width, Spline.canvas.height);
    splines.forEach((spline) => {
      spline.draw();
    });
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

    const splines: Array<Spline> = [];

    if (ctx) {
      // const spline = new Spline(canvas.value, ctx, 200, 200);
      for (let i = 0; i < 10; i++) {
        splines.push(
          new Spline(
            canvas.value,
            ctx,
            (i + 1) * 10,
            (i + 1) * 10,
            `rgb(${Math.random() * 255},${Math.random() * 255},${
              Math.random() * 255
            })`,
          ),
        );
      }
      Spline.animation(splines);
    }

    canvas.value.addEventListener("mousemove", (e) => {
      Spline.mouseMove(e.offsetX, e.offsetY);
    });
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
  // overflow: hidden;
}
</style>
