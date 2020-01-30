import React, { Component, Fragment } from 'react';

class Pollen extends Component {
  state = {
    alpha: 0.8,
    count: 300,
    frameInterval: 15,
    gradient: false,
    speed: 2,
  }

  supportsAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame;
  colors = [
    "rgba(30,144,255,",
    "rgba(107,142,35,",
    "rgba(255,215,0,",
    "rgba(255,192,203,",
    "rgba(106,90,205,",
    "rgba(173,216,230,",
    "rgba(238,130,238,",
    "rgba(152,251,152,",
    "rgba(70,130,180,",
    "rgba(244,164,96,",
    "rgba(210,105,30,",
    "rgba(220,20,60,"
  ];

  context = null;
  lastFrameTime = Date.now();
  particles = [];
  streaming = false;
  timeout = 5000;
  waveAngle = 0;

  componentDidMount() {
    this.init();
    this.status();
    this.intervalId = setInterval(this.status.bind(this), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  status() {
    if (this.streaming && !this.props.status) {
      this.stop();
    }
    if (!this.streaming && this.props.status) {
      this.start();
    }
  }

  init() {
    var width = window.innerWidth;
    var height = window.innerHeight;

    var canvas = document.getElementById("pollen-canvas");
    if (canvas === null) {
      canvas = document.createElement("canvas");
      canvas.setAttribute("id", "pollen-canvas");
      canvas.setAttribute("style", "display:block;z-index:999999;pointer-events:none;position:fixed;top:0");
      document.body.prepend(canvas);
      canvas.width = width;
      canvas.height = height;
      window.addEventListener("resize", function () {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }, true);
      this.context = canvas.getContext("2d");
    } else if (this.context === null) {
      this.context = canvas.getContext("2d");
    }

    this.animate(this.context);
  }

  start() {
    this.streaming = true;

    var width = window.innerWidth;
    var height = window.innerHeight;

    while (this.particles.length < this.state.count) {
      this.particles.push(this.particle(width, height));
    }

    // this.animate(this.context);
    // requestAnimationFrame(() => this.animate(this.context));
  }

  stop() {
    this.streaming = false;
  }

  animate = c => {
    // console.log(`Pollen animate ${this.particles.length}`);

    if (this.particles.length === 0) {
      c.clearRect(0, 0, window.innerWidth, window.innerHeight);
    } else {
      var now = Date.now();
      var delta = now - this.lastFrameTime;
      if (!this.supportsAnimationFrame || delta > this.state.frameInterval) {
        c.clearRect(0, 0, window.innerWidth, window.innerHeight);
        this.update();
        this.draw(c);
        this.lastFrameTime = now - (delta % this.state.frameInterval);
      }
    }

    requestAnimationFrame(() => this.animate(c));
  }

  particle(width, height) {
    return {
      color1: this.colors[(Math.random() * this.colors.length) | 0] + (this.state.alpha + ")"),
      color2: this.colors[(Math.random() * this.colors.length) | 0] + (this.state.alpha + ")"),
      diameter: Math.random() * 10 + 10,
      tilt: Math.random() * 10 - 10,
      tiltAngle: Math.random() * Math.PI,
      tiltAngleIncrement: Math.random() * 0.07 + 0.05,
      x: Math.random() * width,
      y: Math.random() * height - height,
    }
  }

  update() {
    var w = window.innerWidth;
    var h = window.innerHeight;
    var particle;
    for (var i = 0; i < this.particles.length; i++) {
      particle = this.particles[i];
      if (!this.streaming && particle.y < -15) {
        particle.y = h + 100;
      } else {
        particle.y += (particle.diameter + this.state.speed) * 0.5;
        particle.tiltAngle += particle.tiltAngleIncrement;
        particle.tilt = Math.sin(particle.tiltAngle) * 15;
      }
      if (particle.y > h) {
        if (this.streaming) {
          this.particles[i] = this.particle(w, h);
        } else {
          this.particles.splice(i, 1);
          i--;
        }
      }
    }
  }

  draw(context) {
    var particle;
    var x, x2, y2;
    for (var i = 0; i < this.particles.length; i++) {
      particle = this.particles[i];
      context.beginPath();
      context.lineWidth = particle.diameter;
      x2 = particle.x + particle.tilt;
      x = x2 + particle.diameter / 2;
      y2 = particle.y + particle.tilt + particle.diameter / 2;
      if (this.state.gradient) {
        var gradient = context.createLinearGradient(x, particle.y, x2, y2);
        gradient.addColorStop("0.0", particle.color1);
        gradient.addColorStop("1.0", particle.color2);
        context.strokeStyle = gradient;
      } else {
        context.strokeStyle = particle.color1;
      }
      context.moveTo(x, particle.y);
      context.lineTo(x2, y2);
      context.stroke();
    }
  }

  render() {
    return (
      <Fragment>
        <div id="canvas" className="pollen"></div>
      </Fragment>
    );
  }
}

export default Pollen;
