/*样式二*/
/* 控制下雪 */
function snowFall(snow) {
    /* 可配置属性 */
    snow = snow || {};
    this.maxFlake = snow.maxFlake || 200; /* 最多片数 */
    this.flakeSize = snow.flakeSize || 10; /* 雪花形状 */
    this.fallSpeed = snow.fallSpeed || 1; /* 坠落速度 */
}
/* 兼容写法 */
requestAnimationFrame = window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    function (callback) {
        setTimeout(callback, 1000 / 60);
    };

cancelAnimationFrame = window.cancelAnimationFrame ||
    window.mozCancelAnimationFrame ||
    window.webkitCancelAnimationFrame ||
    window.msCancelAnimationFrame ||
    window.oCancelAnimationFrame;
/* 开始下雪 */
snowFall.prototype.start = function () {
    if (!this.canvas) {
        /* 创建画布 */
        snowCanvas.apply(this);
        /* 创建雪花形状 */
        createFlakes.apply(this);
    }
    this.enabled = true;
    this.canvas.style.display = "";
    this.lastFrameTime = performance.now();
    /* 画雪 */
    if (!this.loop) drawSnow.apply(this)
}
/* 停止下雪 */
snowFall.prototype.stop = function () {
    this.enabled = false;
    if (this.loop) cancelAnimationFrame(this.loop);
    this.loop = null;
    if (this.canvas) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.canvas.style.display = "none";
    }
}
/* 创建画布 */
function snowCanvas() {
    /* 添加Dom结点 */
    var snowcanvas = document.createElement("canvas");
    snowcanvas.id = "snowfall";
    snowcanvas.width = window.innerWidth;
    snowcanvas.height = window.innerHeight;
    snowcanvas.setAttribute("style", "position:fixed; inset:0; z-index:1; pointer-events:none;");
    document.getElementsByTagName("body")[0].appendChild(snowcanvas);
    this.canvas = snowcanvas;
    this.ctx = snowcanvas.getContext("2d");
    /* 窗口大小改变的处理 */
    window.addEventListener("resize", function () {
        snowcanvas.width = window.innerWidth;
        snowcanvas.height = window.innerHeight;
    }, { passive: true });
}
/* 雪运动对象 */
function flakeMove(canvasWidth, canvasHeight, flakeSize, fallSpeed) {
    this.x = Math.floor(Math.random() * canvasWidth); /* x坐标 */
    this.y = Math.floor(Math.random() * canvasHeight); /* y坐标 */
    this.size = Math.random() * flakeSize + 2; /* 形状 */
    this.maxSize = flakeSize; /* 最大形状 */
    this.speed = Math.random() * 1 + fallSpeed; /* 坠落速度 */
    this.fallSpeed = fallSpeed; /* 坠落速度 */
    this.speedScale = 0.68; /* 固定帧率后的缓慢系数 */
    this.velY = this.speed; /* Y方向速度 */
    this.velX = 0; /* X方向速度 */
    this.stepSize = Math.random() / 30; /* 步长 */
    this.step = 0 /* 步数 */
}
flakeMove.prototype.update = function (frameRatio) {
    var x = this.x,
        y = this.y;
    /* 左右摆动(余弦) */
    this.velX *= 0.98;
    if (this.velY <= this.speed) {
        this.velY = this.speed
    }
    this.velX += Math.cos(this.step += .05) * this.stepSize;

    var motion = (frameRatio || 1) * this.speedScale;
    this.y += this.velY * motion;
    this.x += this.velX * motion;
    /* 飞出边界的处理 */
    if (this.x >= canvas.width || this.x <= 0 || this.y >= canvas.height || this.y <= 0) {
        this.reset(canvas.width, canvas.height)
    }
};
/* 飞出边界-放置最顶端继续坠落 */
flakeMove.prototype.reset = function (width, height) {
    this.x = Math.floor(Math.random() * width);
    this.y = 0;
    this.size = Math.random() * this.maxSize + 2;
    this.speed = Math.random() * 1 + this.fallSpeed;
    this.velY = this.speed;
    this.velX = 0;
};
// 渲染雪花-随机形状（此处可修改雪花颜色！！！）
flakeMove.prototype.render = function (ctx) {
    var snowFlake = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
    snowFlake.addColorStop(0, "rgba(255, 255, 255, 0.9)"); /* 此处是雪花颜色，默认是白色 */
    snowFlake.addColorStop(.5, "rgba(255, 255, 255, 0.5)"); /* 若要改为其他颜色，请自行查 */
    snowFlake.addColorStop(1, "rgba(255, 255, 255, 0)"); /* 找16进制的RGB 颜色代码。 */
    ctx.save();
    ctx.fillStyle = snowFlake;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
};
/* 创建雪花-定义形状 */
function createFlakes() {
    var maxFlake = this.maxFlake,
        flakes = this.flakes = [],
        canvas = this.canvas;
    for (var i = 0; i < maxFlake; i++) {
        flakes.push(new flakeMove(canvas.width, canvas.height, this.flakeSize, this.fallSpeed))
    }
}
/* 画雪 */
function drawSnow() {
    if (!this.enabled) {
        this.loop = null;
        return;
    }
    var maxFlake = this.maxFlake,
        flakes = this.flakes;
    ctx = this.ctx, canvas = this.canvas, that = this;
    var now = arguments.length && typeof arguments[0] === 'number' ? arguments[0] : performance.now();
    var previous = this.lastFrameTime || now;
    var frameRatio = Math.max(0.35, Math.min(1.35, (now - previous) / 16.6667));
    this.lastFrameTime = now;
    /* 清空雪花 */
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (var e = 0; e < maxFlake; e++) {
        flakes[e].update(frameRatio);
        flakes[e].render(ctx);
    }
    /*  一帧一帧的画 */
    this.loop = requestAnimationFrame(function (timestamp) {
        drawSnow.call(that, timestamp);
    });
}
/* 调用及控制方法 */
var snow = new snowFall({
    maxFlake: 60
});
var snowEnabled = localStorage.getItem('snowfall-enabled') !== 'false';
if (snowEnabled) snow.start();

function updateSnowButton() {
    var button = document.getElementById('snow-toggle');
    if (!button) return;
    var enabled = !!snow.enabled;
    button.setAttribute('aria-pressed', String(enabled));
    button.title = enabled ? button.dataset.titleOff : button.dataset.titleOn;
    button.querySelector('i').className = enabled ? 'fas fa-snowflake' : 'fas fa-ban';
}

window.toggleSnowfall = function () {
    snow.enabled ? snow.stop() : snow.start();
    localStorage.setItem('snowfall-enabled', String(!!snow.enabled));
    if (snow.enabled && typeof syncHomepageSnow === 'function') syncHomepageSnow();
    updateSnowButton();
};

updateSnowButton();

if (document.body.classList.contains('vexpaer-home-page')) {
    var snowScrollFrame = 0;
    var syncHomepageSnow = function () {
        snowScrollFrame = 0;
        if (!snow.enabled || !snow.canvas) return;
        var hero = document.getElementById('page-header');
        var heroHeight = hero ? hero.offsetHeight : window.innerHeight;
        var progress = window.scrollY / Math.max(1, heroHeight);
        var opacity = Math.max(0, Math.min(1, (progress - 0.55) / 0.45));
        snow.canvas.style.opacity = opacity.toFixed(3);
        snow.canvas.style.visibility = opacity > 0.01 ? 'visible' : 'hidden';
    };
    var requestSnowSync = function () {
        if (!snowScrollFrame) snowScrollFrame = requestAnimationFrame(syncHomepageSnow);
    };
    window.addEventListener('scroll', requestSnowSync, { passive: true });
    window.addEventListener('resize', requestSnowSync, { passive: true });
    syncHomepageSnow();
}
