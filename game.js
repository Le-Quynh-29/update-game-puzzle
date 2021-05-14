class game {
    constructor() {
        this.init();
        this.loadImage();
        this.loop();
        this.listenMouseEvent();
    }
    init(){
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = GAME_WIDTH;
        this.canvas.height = GAME_HEIGHT;

        this.img = null;
        this.pieces = [];
        this.defaultPieces = [];

        this.selectedPiece = {};
        this.emptyPiece = {row:0,col:0};

        document.body.appendChild(this.canvas);
    }
    loadImage(){
        this.img = new Image();
        this.img.onload = () =>{
            this.startGame();
        }
        this.img.src = 'img/anime1.jpg';
    }


    listenMouseEvent(){
        this.canvas.addEventListener('mousedown',(event) => this.mouseDown(event));
        this.canvas.addEventListener('mouseup',(event) => this.mouseUp(event));
    }
    getMousePos(event){
            var rect = this.canvas.getBoundingClientRect();
            return {
                x:event.clientX - rect.left,
                y:event.clientY - rect.top
            };
        }

    getCorByMousePosition(mousePos){
       return  {
                col: Math.floor(mousePos.x/PIECE_SIZE),
                row: Math.floor(mousePos.y/PIECE_SIZE),
        }
    }

    mouseDown(event){
        let mousePos = this.getMousePos(event);
        this.selectedPiece = this.getCorByMousePosition(mousePos);
    }
    mouseUp(event){
        let mousePos = this.getMousePos(event);
        let mouseUpCor = this.getCorByMousePosition(mousePos);
       if(
           mouseUpCor.row !== this.emptyPiece.row ||
           mouseUpCor.col !== this.emptyPiece.col
       )
       {
           return ;
       }

        if(
            (
            this.selectedPiece.row === this.emptyPiece.row &&
            ( this.selectedPiece.col-1 === this.emptyPiece.col || this.selectedPiece.col+1 === this.emptyPiece.col)
            )
            ||
            (
                this.selectedPiece.col === this.emptyPiece.col &&
                (this.selectedPiece.row -1 === this.emptyPiece.row || this.selectedPiece.row +1 === this.emptyPiece.row)
            )
        ) {
            //swap object in data
            this.swapPiece(this.selectedPiece,mouseUpCor);
        }
    }

    swapPiece(piece1, piece2){
        let tmp = this.pieces[piece1.row][piece1.col];
        this.pieces[piece2.row][piece2.col] = tmp;
        this.pieces[piece1.row][piece1.col] = null;

        this.pieces[piece2.row][piece2.col].row = piece2.row;
        this.pieces[piece2.row][piece2.col].col = piece2.col;


        //
        this.emptyPiece = piece1;
    }

    startGame() {
        //create pieces
        this.pieces = [
            [null, null, null],
            [null, null, null],
            [null, null, null],
            [null, null, null],
        ];
        this.defaultPieces = [
            [null, null, null],
            [null, null, null],
            [null, null, null],
        ];

        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                let pieceCanvas = document.createElement('canvas');
                pieceCanvas.width = PIECE_SIZE;
                pieceCanvas.height = PIECE_SIZE;
                let pieceCtx = pieceCanvas.getContext('2d');

                pieceCtx.drawImage(
                    this.img,
                    col * PIECE_SIZE,
                    row * PIECE_SIZE,
                    PIECE_SIZE,
                    PIECE_SIZE,
                    0,
                    0,
                    PIECE_SIZE,
                    PIECE_SIZE
                );
                //create pieces
                let newPiece = new piece(this, row*3+col,col, row + 1, pieceCanvas);
                this.pieces[row + 1][col] = newPiece;
                this.defaultPieces[row][col] = newPiece.id;
            }
        }
        //random game
        for (let randomTime = 0; randomTime < 100; randomTime++) {
            this.randomMove();
        }

    }
    checkWin() {

        let flag = true;
        for (let i = 0; i < this.defaultPieces.length; i++) {
            for (let j = 0; j < this.defaultPieces.length; j++) {
                if(this.defaultPieces[i][j] !== this.pieces[i+1][j].id){
                    return false;
                }
            }
        }
        return true;
    }

    randomMove(){
        let r = Math.round(Math.random()*3);
        let willMove = null;
        switch (r){
            case 0:
                if(this.emptyPiece.row > 2){
                    willMove = {row:this.emptyPiece.row-1,col: this.emptyPiece.col};
                }
                break;
            case 1:
                if(this.emptyPiece.row < 3){
                    willMove = {row:this.emptyPiece.row+1,col: this.emptyPiece.col};
                }
                break;
            case 2:
                if(this.emptyPiece.col > 0){
                    willMove = {row:this.emptyPiece.row,col: this.emptyPiece.col-1};
                }
                break;
            case 3:
                if(this.emptyPiece.col <2 && this.emptyPiece.row >1 ){
                    willMove = {row:this.emptyPiece.row,col: this.emptyPiece.col+1};
                }
                break;

        }
        if(willMove!== null) {
            this.swapPiece(willMove, this.emptyPiece);
        }
    }

    loop(){
        this.update();
        this.draw();
            setTimeout(() => {
                this.loop();
            }, 20);
    }


    update(){
        this.pieces.forEach(row =>{
            row.forEach(piece => {
                if (piece !== null){
                        piece.update();
                }
            });
        });
    }

    draw(){
        //clear screen
        this.ctx.fillStyle = 'black'
        this.ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

        this.pieces.forEach(row =>{
            row.forEach(piece => {
                if (piece !== null){
                    piece.draw();
                }
            });
        });
    }
}