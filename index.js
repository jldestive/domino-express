const express = require('express')
const app = express();
const port = 8000;

app.use(express.json());

let position, max_number, pieces = [], timeout, score, doble = [], cantNumber = [];
let fichas = [], playerPases = [];
app.post('/reset', function(req, res){
  // const { position, pieces, max_number, timeout, score } = req.params;
  const body = req.body;
  position = body.position;
  max_number = body.max_number;
  pieces = body.pieces;
  timeout = body.timeout;
  score = body.score;

  for(let i = 0; i <= max_number; i++){
    cantNumber[i] = 0;
  }

  pieces.forEach(piece => {
    if(piece[0] !== piece[1]){
      cantNumber[piece[0]]++;
      cantNumber[piece[1]]++;
    }else{
      doble.push(piece[0]);
      cantNumber[piece[0]]++;
    }
  });

  res.status(200).json({
    "position" : position,
    "max_number" :  max_number,
    "pieces" : pieces,
    "timeout" : timeout,
    "score" : score,
    "cantNumber" : cantNumber,
    "doble" : doble

  });
});

app.get('/start', (req, res) => {
  let start = false;

  doble.forEach(d => {
    if(max_number === 6){
      if(cantNumber[d] >= 3){
        start = true;
      }
    }else{
      if(max_number === 9){
        if(cantNumber[d] >= 4){
          start = true;
        }
      }
    }
  })

  res.status(200).json({
    "start" : start
  });
});

app.post('/step', (req, res) => {
  let heads = req.body;
  let ok = false;
  let piece = [null, null], sum = 0, head = null;
  playerPases.forEach(pases => {
    if(pases[0] == (position + 1) % 4){
      pieces.forEach(p => {
        if(pases[1] === p[0] && cantNumber[p[0]] > 0 && cantNumber[p[0]] - cantNumber[p[1]] >= sum){
          if(heads[1] === p[1]){
            piece = p;
            ok = true;
            head = 1;
            sum = cantNumber[p[0]] - cantNumber[p[1]];
          }

          if(heads[0] === p[1]){
            piece = p;
            ok = true;
            head = 0;
            sum = cantNumber[p[0]] - cantNumber[p[1]];
          }
        }

        if(pases[1] === p[1] && cantNumber[p[1]] > 0 && cantNumber[p[1]] - cantNumber[p[0]] >= sum){
          if(heads[1] === p[0]){
            piece = p;
            ok = true;
            head = 1;
            sum = cantNumber[p[1]] - cantNumber[p[0]]
          }

          if(heads[0] === p[0]){
            piece = p;
            ok = true;
            head = 0;

            sum = cantNumber[p[1]] - cantNumber[p[0]];
          }
        }

        if(pases[1] === p[1] && cantNumber[p[1]] > 0 && cantNumber[p[1]] - cantNumber[p[0]] >= sum){
          if(heads[1] === p[0]){
            piece = p;
            ok = true;
            head = 1;
            sum = cantNumber[p[1]] - cantNumber[p[0]];
          }

          if(heads[0] === p[0]){
            piece = p;
            ok = true;
            head = 0;
            sum = cantNumber[p[1]] - cantNumber[p[0]];
          }
        }

        if(pases[1] === p[0] && cantNumber[p[0]] > 0 && cantNumber[p[0]] - cantNumber[p[1]] >= sum){
          if(heads[1] === p[1]){
            piece = p;
            ok = true;
            head = 1;
            sum = cantNumber[p[0]] - cantNumber[p[1]];
          }

          if(heads[0] === p[1]){
            piece = p;
            ok = true;
            head = 0;
            sum = cantNumber[p[0]] - cantNumber[p[1]];
          }
        }
      })
    }
  });

  if(ok === false){
        pieces.forEach(p => {
          if(heads[0] === p[0]){
            piece = p;
            ok = true;
            head = 0;
          }

          if(heads[0] === p[1]){
            piece = p;
            ok = true;
            head = 0;
          }

          if(heads[1] === p[1]){
            piece = p;
            ok = true;
            head = 1;
          }

          if(heads[1] === p[0]){
            piece = p;
            ok = true;
            head = 1;
          }
        });
  }

  if(heads[0] === null && heads[1] === null){
    // console.log("ok");
    sum = 0;
    doble.forEach(d => {
      if(cantNumber[d] > sum){
        let temp = [];
        temp.push(d);
        temp.push(d);
        piece = temp;
        ok = true
        sum = cantNumber[d];
      }
    })
  }


  cantNumber[piece[0]]--;
  cantNumber[piece[1]]--;
  pieces.forEach(p => {
    if(p[0] === piece[0] && p[1] === piece[1]){
      p[0] = -1;
      p[1] = -1;
    }
  })

  res.status(200).json({
    "piece" : piece,
    "head" : head,
    "pieces" : pieces
  });
});

app.post('/log', (req, res) => {
  const body = req.body;

  if(body[0] === "PASS"){
    let temp = [];
    temp.push(body[1]);
    temp.push(fichas[fichas.length - 1][0][1]);

    playerPases.push(temp);
  }else{
    if(body[0] === "MOVE"){
      let temp = [];
      temp.push(body[1][1]);
      temp.push(body[1][2]);

      fichas.push(temp);
    }
  }

  res.status(200).json({
    "playerPases" : playerPases,
    "fichas" : fichas
  })
});

app.listen(port, () => {
  console.log("My port " + port);
})




