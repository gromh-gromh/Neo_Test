class SineGraph {

    constructor(canvasId) {

        // Canvas
        this._graph = document.querySelector(canvasId);
        this._context = this._graph.getContext("2d");

        // Математика
        this._sine = [];
        this._amplitude;
        this._period;
        this._phase;

        // Вспомогательные параметры отрисовки
        this._verticalDivision = 10;
        this._horizontalDivision = 10;
        this._halfHeight;
        this._halfWidth;
        this._verticalGap;
        this._horizontalGap;
        this._gridStartPoint;
        this._gridEndPoint;
    }

    // Метод, устанавливающий размеры окна вывода графика
    setSize(width, height) {

        this._graph.setAttribute("width", width);
        this._graph.setAttribute("height", height);

        this._halfHeight = Math.floor(height / 2);
        this._halfWidth = Math.floor(width / 2);
    }

    // Метод для отрисовки графика синуса
    drawSineGraph(amplitude, period, phase) {

        this._amplitude = amplitude;
        this._period = period;
        this._phase = phase;
        this._verticalGap = Math.floor(graph.height / this._verticalDivision);
        this._horizontalGap = Math.floor(graph.width / this._horizontalDivision);
        this._gridStartPoint = - this._horizontalGap * (this._phase % 1);
        this._gridEndPoint = this._graph.width + this._gridStartPoint;

        this._calculateSine();

        this._context.clearRect(0, 0, this._graph.width, this._graph.height);
        this._drawGrid();
        this._drawAxis();
        this._drawSine();
        this._drawNumbers();
    }

    // Вспомогательный метод для вычисления точек синуса
    _calculateSine() {
        let xStart = - (360 * this._period) * 5;
        let xEnd = (360 * this._period) * 5;

        for(let x = xStart; x <= xEnd; x++) {

            let angleDegrees = x / this._period + this._phase;
            let angleRadians = angleDegrees * (Math.PI / 180);
            let y = this._amplitude * Math.sin(angleRadians);

            this._sine.push({'x': x, 'y': y});
        }
    }

    // Вспомогательный метод для отрисовки клеток
    _drawGrid() {

        this._context.beginPath();

        // Горизонтальные линии
        for(let i = 0; i < this._graph.height; i += this._verticalGap) {
            this._context.moveTo(0, i);
            this._context.lineTo(this._graph.width, i);
        }

        // Вертикальные линии
        for(let j = this._gridStartPoint; j <= this._gridEndPoint; j += this._horizontalGap) {
            this._context.moveTo(j, 0);
            this._context.lineTo(j, this._graph.height);
        }

        this._context.strokeStyle = 'blue';
        this._context.lineWidth = 0.3;
        this._context.stroke();

        this._context.closePath();
    }

    // Вспомогательный метод для отрисовки осей
    _drawAxis() {

        this._context.beginPath();

        // Ось X
        this._context.moveTo(0, this._halfHeight);
        this._context.lineTo(this._graph.width, this._halfHeight);

        // Ось Y
        this._context.moveTo(this._halfWidth - this._horizontalGap * this._phase, 0);
        this._context.lineTo(this._halfWidth - this._horizontalGap * this._phase, this._graph.height);

        this._context.lineWidth = 3;
        this._context.strokeStyle = 'black';
        this._context.stroke();
        
        this._context.closePath();
    }

    // Вспомогательный метод для отрисовки синуса
    _drawSine() {

        let aspectRatio = this._halfWidth / ((360 * this._period) * 5);

        this._context.beginPath();

        for(let point of this._sine) {
            let x = Math.floor(point['x'] * aspectRatio) + this._halfWidth;
            let y = (point['y'] * this._verticalGap) + this._halfHeight;
            this._context.lineTo(x, y);
        }

        this._context.strokeStyle = 'green';
        this._context.stroke();

        this._context.closePath();
    }

    // Вспомогательный метод для отрисовки нумерации делений осей
    _drawNumbers() {

        this._context.beginPath();

        this._context.font = "15px Times";
        this._context.fillStyle = "red";
        
        let verticalPadding = 3;
        let horizontalPadding = 3;

        // Вдоль оси Y
        for(let i = 0; i < this._graph.height; i += this._verticalGap) {
            let text = `${(this._halfHeight - i) / this._verticalGap}`;
            this._context.fillText(text, this._halfWidth - this._horizontalGap * this._phase + horizontalPadding, i - verticalPadding);
        }

        // Вдоль оси X
        for(let j = this._gridStartPoint; j <= this._gridEndPoint; j += this._horizontalGap){
            let text = Number((((j - this._halfWidth ) / this._horizontalGap + this._phase) * this._period).toFixed(1));
            if(text) {
                this._context.fillText(text, j + horizontalPadding, this._halfHeight - verticalPadding);
            }
        }

        this._context.closePath();
    }

}

// Функция, демонстрирующая работу с написанным классом
function main(event){

    event.preventDefault();

    let graph = new SineGraph(canvasId = "#graph");
    let form = event.target;

    let width = Number(form.width.value);
    let height = Number(form.height.value);

    let amplitude = Number(form.amplitude.value);
    let period = Number(form.period.value);
    let phase = Number(form.phase.value);

    // Установка размеров графика
    graph.setSize(width, height);

    //Отрисовка синуса
    graph.drawSineGraph(amplitude, period, phase);

}