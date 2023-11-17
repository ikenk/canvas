// /canvas/explosionparticles
<script setup lang="ts">
const canvas = ref<HTMLCanvasElement>();

class ExplosionBall {
  //小球的起始坐标
  private x: number;
  private y: number;
  //爆炸方向
  private dirX: number;
  private dirY: number;
  //小球大小
  private radius: number;
  //小球透明度
  private opacity: number;
  //小球颜色
  private color: string;

  /**
   * canvas对象
   */
  static canvas: HTMLCanvasElement;
  static ctx: CanvasRenderingContext2D;

  //构造函数
  constructor(
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    dirX: number,
    dirY: number,
    radius: number = 3,
    opacity: number = 5,
    color: string,
  ) {
    ExplosionBall.canvas = canvas;
    ExplosionBall.ctx = ctx;
    this.x = x;
    this.y = y;
    this.dirX = dirX;
    this.dirY = dirY;
    this.radius = radius;
    this.opacity = opacity;
    this.color = color;
  }

  //画出一个小球
  draw() {
    ExplosionBall.ctx.beginPath();
    ExplosionBall.ctx.fillStyle = this.color;
    ExplosionBall.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ExplosionBall.ctx.fill();
    ExplosionBall.ctx.closePath();
  }

  //小球运动
  move() {
    this.dirX *= 0.99;
    this.dirY *= 0.99;
    this.dirY += 0.05;
    this.x += this.dirX;
    this.y += this.dirY;
    this.opacity -= 0.02;
    this.draw();
  }

  //爆炸动画
  static animation(balls: Array<ExplosionBall>) {
    let rafNum = requestAnimationFrame(function () {
      ExplosionBall.animation(balls);
    });
    ExplosionBall.ctx.fillStyle = "rgba(0,0,0,0.05)";
    ExplosionBall.ctx.fillRect(
      0,
      0,
      ExplosionBall.canvas.width,
      ExplosionBall.canvas.height,
    );
    balls.forEach((ball, index) => {
      ball.move();
      //将透明度小于0.1的小球从balls数组中删除
      if (ball.opacity <= 0.01) {
        balls.splice(index, 1);
      }
      if (balls.length === 0) {
        ExplosionBall.clearCanvas();
        cancelAnimationFrame(rafNum);
      }
    });
    console.log(rafNum);
  }

  //清屏操作
  static clearCanvas() {
    ExplosionBall.ctx.clearRect(
      0,
      0,
      ExplosionBall.canvas.width,
      ExplosionBall.canvas.height,
    );
  }
}

//小球数组
const balls: Array<ExplosionBall> = [];

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
      canvas.value.addEventListener("click", (e: MouseEvent) => {
        // console.log(e);
        //创建的小球数量
        let num = 300;
        //每个小球的偏移弧度
        let hd = (Math.PI * 2) / num;
        //循环创建小球
        for (let i = 0; i < num; i++) {
          balls.push(
            new ExplosionBall(
              //canvas
              canvas.value!,
              ctx,
              //位置
              e.x,
              e.y,
              //爆炸方向
              Math.cos(hd * i) * (Math.random() * 3),
              Math.sin(hd * i) * (Math.random() * 3),
              //大小
              5,
              //透明度
              4,
              //颜色
              `hsl(${Math.random() * 360},50%,50%)`,
            ),
          );
        }
        ExplosionBall.animation(balls);
        // console.log(balls[0]);
      });
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
  // overflow: hidden;
}
</style>
