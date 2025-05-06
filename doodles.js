class Doodle {
    constructor(x, y, type, size) {
        this.x = x;
        this.y = y;
        this.originalX = x;
        this.originalY = y;
        this.type = type;
        this.size = 8; 
        this.opacity = 0.4;
        this.velocityX = 0;
        this.velocityY = 0;
        this.rotation = 0;
        this.rotationVelocity = 0;
    }

    update(mouseX, mouseY) {
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        const radius = 150;
        
        if (distance < radius) {
            const force = (1 - distance / radius) * 2.0;
            const angle = Math.atan2(dy, dx);
            
            const randomAngle = angle + (Math.random() - 0.5) * Math.PI * 0.5;
            this.velocityX -= Math.cos(randomAngle) * force * 2;
            this.velocityY -= Math.sin(randomAngle) * force * 2;
            
            this.rotationVelocity += (Math.random() - 0.5) * 0.2;
        }

        const returnForce = 0.08;
        const displacement = {
            x: this.originalX - this.x,
            y: this.originalY - this.y
        };
        const displacementDistance = Math.sqrt(displacement.x * displacement.x + displacement.y * displacement.y);
        
        const elasticForce = returnForce * (1 + displacementDistance / 50);
        this.velocityX += displacement.x * elasticForce;
        this.velocityY += displacement.y * elasticForce;

        this.velocityX *= 0.9;
        this.velocityY *= 0.9;
        this.rotationVelocity *= 0.95;

        this.x += this.velocityX;
        this.y += this.velocityY;
        this.rotation += this.rotationVelocity;

        const speed = Math.sqrt(this.velocityX * this.velocityX + this.velocityY * this.velocityY);
        this.opacity = 0.4 + speed * 0.4;
    }
}

const doodles = [
    (ctx, x, y, size) => {
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
            const angle = (i * 4 * Math.PI) / 5;
            const px = x + size * Math.cos(angle);
            const py = y + size * Math.sin(angle);
            i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
        }
        ctx.closePath();
    },
    (ctx, x, y, size) => {
        ctx.beginPath();
        for (let i = 0; i < 20; i++) {
            const angle = i * 0.5;
            const radius = i * size / 15;
            const px = x + radius * Math.cos(angle);
            const py = y + radius * Math.sin(angle);
            i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
        }
    },
    (ctx, x, y, size) => {
        ctx.beginPath();
        ctx.moveTo(x, y + size * 0.3);
        ctx.bezierCurveTo(x, y, x - size, y, x - size, y + size * 0.3);
        ctx.bezierCurveTo(x - size, y + size * 0.6, x, y + size, x, y + size);
        ctx.bezierCurveTo(x, y + size, x + size, y + size * 0.6, x + size, y + size * 0.3);
        ctx.bezierCurveTo(x + size, y, x, y, x, y + size * 0.3);
    },
    (ctx, x, y, size) => {
        ctx.beginPath();
        ctx.arc(x, y, size * 0.5, 0, Math.PI * 2);
        ctx.arc(x + size * 0.4, y - size * 0.2, size * 0.3, 0, Math.PI * 2);
        ctx.arc(x - size * 0.4, y - size * 0.1, size * 0.4, 0, Math.PI * 2);
    },
    (ctx, x, y, size) => {
        ctx.beginPath();
        ctx.arc(x - size * 0.5, y + size * 0.5, size * 0.3, 0, Math.PI * 2);
        ctx.moveTo(x - size * 0.5, y - size * 0.5);
        ctx.lineTo(x - size * 0.5, y + size * 0.5);
        ctx.lineTo(x + size * 0.5, y + size * 0.3);
    },
    (ctx, x, y, size) => {
        for (let i = 0; i < 6; i++) {
            const angle = (i * Math.PI) / 3;
            ctx.beginPath();
            ctx.arc(
                x + Math.cos(angle) * size * 0.5,
                y + Math.sin(angle) * size * 0.5,
                size * 0.3,
                0,
                Math.PI * 2
            );
        }
        ctx.beginPath();
        ctx.arc(x, y, size * 0.2, 0, Math.PI * 2);
    }
];

class DoodleManager {
    constructor() {
        this.canvas = document.getElementById('doodleCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.doodleInstances = [];
        this.mouseX = -1000;
        this.mouseY = -1000;
        this.mouseTrail = [];
        this.maxTrailLength = 40
        this.init();
    }

    init() {
        this.resizeCanvas();
        window.addEventListener('resize', () => {
            this.resizeCanvas();
            this.redistributeDoodles();
        });

        window.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouseX = e.clientX - rect.left;
            this.mouseY = e.clientY - rect.top;
            
            this.mouseTrail.push({ 
                x: this.mouseX + 35, 
                y: this.mouseY + 35, 
                age: 1 
            });
            if (this.mouseTrail.length > this.maxTrailLength) {
                this.mouseTrail.shift();
            }
        });

        window.addEventListener('mouseout', (e) => {
            if (e.relatedTarget === null) {
                this.mouseX = -1000;
                this.mouseY = -1000;
                this.mouseTrail = [];
            }
        });

        this.createDoodles();
        this.animate();
    }

    createDoodles() {
        this.doodleInstances = [];
        const numRows = 8;
        const numCols = 12;
        
        const cellWidth = this.canvas.width / numCols;
        const cellHeight = this.canvas.height / numRows;
        
        for (let row = 0; row < numRows; row++) {
            for (let col = 0; col < numCols; col++) {
                const x = (col + 0.2 + Math.random() * 0.6) * cellWidth;
                const y = (row + 0.2 + Math.random() * 0.6) * cellHeight;
                
                if (Math.random() > 0.2) {
                    this.doodleInstances.push(new Doodle(
                        x,
                        y,
                        Math.floor(Math.random() * doodles.length),
                        8
                    ));
                }
            }
        }

        const extraDoodles = Math.floor((numRows * numCols) * 0.1);
        for (let i = 0; i < extraDoodles; i++) {
            this.doodleInstances.push(new Doodle(
                Math.random() * this.canvas.width,
                Math.random() * this.canvas.height,
                Math.floor(Math.random() * doodles.length),
                8
            ));
        }
    }

    redistributeDoodles() {
        const oldDoodles = this.doodleInstances;
        this.createDoodles();
        
        for (let i = 0; i < Math.min(oldDoodles.length, this.doodleInstances.length); i++) {
            this.doodleInstances[i].velocityX = oldDoodles[i].velocityX;
            this.doodleInstances[i].velocityY = oldDoodles[i].velocityY;
        }
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.doodleInstances.forEach(doodle => {
            doodle.update(this.mouseX, this.mouseY);
            
            this.ctx.save();
            this.ctx.translate(doodle.x, doodle.y);
            this.ctx.rotate(doodle.rotation);
            
            // Get the computed style to access CSS variables
            const computedStyle = getComputedStyle(document.body);
            const doodleColor = computedStyle.getPropertyValue('--doodle-color').trim();
            this.ctx.strokeStyle = `rgba(${hexToRgb(doodleColor)}, ${doodle.opacity})`;
            doodles[doodle.type](this.ctx, 0, 0, doodle.size);
            this.ctx.stroke();
            
            this.ctx.restore();
        });

        if (this.mouseTrail.length > 1) {
            this.ctx.beginPath();
            this.ctx.moveTo(this.mouseTrail[0].x, this.mouseTrail[0].y);
            
            for (let i = 1; i < this.mouseTrail.length; i++) {
                const opacity = i / this.mouseTrail.length;
                const hue = (i / this.mouseTrail.length) * 360;
                this.ctx.strokeStyle = `hsla(${hue}, 70%, 50%, ${opacity})`;
                this.ctx.lineWidth = 2 * (i / this.mouseTrail.length);
                
                this.ctx.beginPath();
                this.ctx.moveTo(this.mouseTrail[i-1].x, this.mouseTrail[i-1].y);
                this.ctx.lineTo(this.mouseTrail[i].x, this.mouseTrail[i].y);
                this.ctx.stroke();
            }
        }

        this.mouseTrail.forEach(point => {
            point.age *= 0.95;
        });

        requestAnimationFrame(() => this.animate());
    }
}

function hexToRgb(hex) {
    // Remove the # if present
    hex = hex.replace('#', '');
    
    // Parse the hex values
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    return `${r}, ${g}, ${b}`;
}

document.addEventListener('DOMContentLoaded', () => {
    new DoodleManager();
}); 