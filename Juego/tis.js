(function() {
    var
        doc = document,
        addEventListener = 'addEventListener',
        charCodeAt = 'charCodeAt',
        keyCode = 'keyCode',
        keydown = 'keydown',
  
        nextCodeChar = 0,
        state; // 0|undefined=QUIT, 1=CLEARING, 2=LOST, 3=PLAYING
  
    doc[addEventListener](keydown, function(e) {
      nextCodeChar = e[keyCode] == "&&((%'%'BA"[charCodeAt](nextCodeChar) ? nextCodeChar + 1 : 0;
      if (!state && nextCodeChar > 9) {
        state = 3;
        (function() {
          var
              win = window,
  
              createElement = 'createElement',
              removeEventListener = 'removeEventListener',
              keyup = 'keyup',
  
              math = Math,
  
              baseBass = 'LSOSLSOSKSNSKSNS',
              music = [
                '`+,^,+Y),`.,C,^`\\Yq^.1e31H,01.,C,^`\\Yq',
                'T$$T,+)$),Y))<$TTYTl.).1^..D,\\.,<$TTTTT`',
                // All notes are eighths.
                // Subtract 64 to get MIDI note number - 33.
                'GNKNGNKN' + baseBass + 'LSNSL@BCESOSESOSCOCOCOCOBNBN?J?J@CGL@@@@'
              ],
              thirdVerse = [
                // Treble voices
                'xtvstqpsxtvs\\`}|x',
                'tqspqqpptqspY`xx\u007f',
                // Bass voice
                baseBass+baseBass+baseBass+baseBass
              ],
  
                    sounds = [],
  
              // First 2 invisible lines, then 20 visible lines, then 2 for the Next display.
              grid = [],
              shadowGrid = [],
              w = 10,
              h = 22,
              s = w*h+20,
  
              // x I J L O S T Z
              colors = '08080890dd936f9e809dd090e09c0c9f22'.split(9),
  
                shapes = atob('8ABERAAPIiJxACYCcAQiA3QAIgZwASMCZgBmAGYAZgA2AGIEYAMxAnIAYgJwAjICYwBkAjAGMgE'),
  
            
              wallKickTableI = '203(C214A,241<!230#8', // I
              wallKickTableRest = '219"!23+BC23;"#21)BA', // other blocks, including no-op O
  
              bag = [],
              currentTetromino,
              currentX,
              currentY,
              currentRotation,
  
              stateTime,
              linesClearing,
  
              score = 0,
              lines = 0,
              level = 1,
  
              delta,
              gravityTimer, // between 0 and 1
              lockTimer = 2,
              keysPressed = [],
              lastFrame,
  
              i, j, x, y, tmp, tmp2, tmp3, tmp4, tmp5,
  
              divStyleMargin = '<div style="margin:',
              divEnd = '</div>',
  
              // 1pc = 16px
              font= "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;"
              html =
                divStyleMargin + '-14pc -10pc;position:fixed;width:20pc;left:50%;top:50%;font:12px '+font+';background:rgba(225,225,225);box-shadow: 0 9px rgb(200, 200, 200);border-radius:1pc">' +
                  divStyleMargin + '1pc 2pc;color:rgb(15,15,15);font-family: '+ font +'">' +
                    'Tetris es un famoso juego que se publicó originalmente el 6 de Junio de 1984 por Alekséi Pajitnov.<br><br>' +
                    'Left/Right: Mover | Up/Ctrl/Alt: Rotar | Esc: Parar el juego<br>' +
                    'Down/Space: Caida rapida/dura | M: Música' +
                  divEnd +
                  divStyleMargin + '0 1pc;float:right;color:rgb(27,27,27);font-size:1pc;font-family: '+ font +'">' +
                    '<div id="tis-status">' + divEnd +
                    'Siguiente:' + divStyleMargin + '8px 0;width:4pc">'
              ;
  
          tmp2 = divStyleMargin + '0;width:1pc;height:1pc;float:left; 0 9px rgb(250, 250, 250);border-radius: 3px" id="tis-';
          for (i = 220; i < s; i++) {
            if (i % w < 4) {
              html += tmp2 + i + '">' + divEnd;
            }
          }
          html +=   divEnd +
                  divEnd +
                  divStyleMargin + '0 2pc 2pc;background:#000;width:10pc;height:20pc;border-radius: 10px;overflow:hidden;">';
  
          for (i = 0; i < s; i++) {
            grid.push(0);
            if (i > 19 && i < 220) {
              html += tmp2 + i + '">' + divEnd;
            }
          }
  
          html += divEnd +
                divEnd;
          tmp = doc[createElement]('div');
          tmp.innerHTML = html;
          doc.body.appendChild(html = tmp);
  
          // Music!
          // 4593 samples/eighth * 8 eighths/bar * 24 bars = 881856 samples
          tmp = new Uint8Array(881856);
          // delta is voice index; note that it is a string!
          for (delta in music) {
            music[delta] += music[delta] + thirdVerse[delta];
            for (i = 0, j = 0; j < music[delta].length;) {
              tmp3 = music[delta][charCodeAt](j++) - (delta == 2 ? 64 : 32);
  
              x = .00499 * math.pow(2, (tmp3 % 24 + (delta == 2 ? 0 : 27)) / 12);
              tmp2 = [15, 9, 9][delta];
              for (y = 0; y < 4593 * [1, 3, 2, 4][~~(tmp3 / 24)];) {
  
                tmp[i++] = (tmp[i] || 127) + (y++ * x % 2 < 1 ? tmp2 : -tmp2);
                tmp2 *= 0.9999;
              }
            }
          }
          music = makeAudio(tmp);
          music.play();
          music.loop = 1;
  
          function playSoundEffect(encoding) {
            if (!(tmp5 = sounds[encoding])) {
              tmp5 = new Uint8Array(9e3);
              tmp4 = 50; // amplitude
              for (j in tmp5) {
                tmp3 = j > 1e3 ? (encoding >> 4) & 63 : encoding >> 10; // period
                tmp5[j] = 127 + (tmp4 *= 1 - (encoding&15) / 1e4) * (j/10%tmp3 < tmp3 / 2 ? -1 : 1);
              }
              tmp5 = sounds[i] = makeAudio(tmp5);
            } else {
              tmp5.currentTime = 0;
            }
            tmp5.play();
          }
  
          function makeAudio(wavArray) {
            tmp5 = wavArray.length;
  
            return new Audio(URL.createObjectURL(new Blob([
              'RIFF',
              // Assuming that this will be stored in little-endian.
              // It's actually platform-specific...
              new Uint32Array([tmp5 + 36, 0x45564157, 0x20746d66, 16, 65537, 22050, 22050, 524289, 0x61746164, tmp5]),
              wavArray
            ], {type: 'audio/wav'})));
          }
  
          function isSolidAt(x, y, rotation, tetromino) {
            return currentTetromino &&
              !(x & ~3) && !(y & ~3) && // range check for [0, 4)
              (shapes[charCodeAt](8*(tetromino || currentTetromino) - 8 + 2*rotation + (y>>1)) & (1 << (4 * (y&1) + x)));
          }
  
          function render() {
            tmp = currentY;
            while (currentTetromino && tryMove(currentX, currentY+1, currentRotation, 1));
            for (y = 0; y < h+4; y++) {
              for (x = 0; x < w; x++) {
                i = y*w + x;
                if (y >= h) {
                  grid[i] = isSolidAt(x, y-h, 0, bag[0]) ? bag[0] : 0;
                }
                shadowGrid[i] =
                  isSolidAt(x-currentX, y-tmp, currentRotation) ? currentTetromino :
                  isSolidAt(x-currentX, y-currentY, currentRotation) ? currentTetromino + 8 :
                  grid[i] || 0;
                if (tmp3 = win['tis-' + i]) {
                  tmp3 = tmp3.style;
                  tmp3.background = '#' + (
                      state == 1 && stateTime % 4 < 2 && linesClearing[y] ?
                      'fff' :
                      colors[shadowGrid[i] % 8]);
                  tmp3.opacity = shadowGrid[i] > 7 ? 0.2 : 1;
                }
              }
            }
            currentY = tmp;
            tmp = divStyleMargin + '0;text-align:right;font-size:150%">';
            win['tis-status'].innerHTML = 'Puntuación' + tmp + score + divEnd + 'Lineas' + tmp + lines + divEnd + 'Nivel' + tmp + level + divEnd;
          }
  
          function tryMove(posX, posY, rotation, doNotRender) {
            for (j = 0; x = (j&3), y = (j>>2), j < 16; j++) {
              if (isSolidAt(x, y, rotation) &&
                  ((x += posX) < 0 || x >= w || (y += posY) < 0 || y >= h || grid[y*w + x])) {
                return;
              }
            }
            currentX = posX;
            currentY = posY;
            currentRotation = rotation;
            lockTimer = 0;
            doNotRender || render();
            return 1;
          }
  
          function frame(now) {
            if (!state) return;
            delta = (now - lastFrame) / 1e3 || 0;
            if (delta > .1) delta = .1;
            lastFrame = now;
            if (state == 2) { // Game over
              if (stateTime-- > 4 && !(stateTime % 4)) {
                for (x = 0; x < w;) {
                  grid[stateTime*w/4 + x++] = 1 + ~~(math.random() * 7);
                }
                render();
              }
            } else if (state == 1) { // Clearing
              if (--stateTime < 0) {
                for (y in linesClearing) {
                  for (i = y*w+w-1; i >= 0; i--) {
                    grid[i] = grid[i-w];
                  }
                }
                state = 3;
              }
              render();
            } else { // state == 3: Regular gameplay
              // Handle keyboard input
              for (tmp2 in keysPressed) {
                if (tmp2 == 37 || tmp2 == 39) {
                  // Move
                  if (keysPressed[tmp2] >= 0) {
                    keysPressed[tmp2] -= keysPressed[tmp2] ? .05 : .2;
                    tryMove(currentX + 1 - 2 * (tmp2 == 37), currentY, currentRotation);
                  }
                }
                if (tmp2 == 32){ //AQUI 
                  // Space: hard drop
                  if (!keysPressed[tmp2]) {
                    while (tryMove(currentX, currentY + 1, currentRotation));
                    lockTimer = 9;
                  }
                }
                if (tmp2 == 38 || tmp2 == 18 || tmp2 == 17) {
                  // Rotate
                  // -1 for left, 1 for right
                  tmp4 = 1 - 2 * (tmp2 == 17);
                  if (!keysPressed[tmp2]) {
                    for (i = 0; i < 5;) {
                      tmp = (currentTetromino == 1 ? wallKickTableI : wallKickTableRest)[charCodeAt](((currentRotation + 4 + (tmp4-1)/2))%4 * 5 + i++) - 32;
                      if (tryMove(currentX + tmp4 * ((tmp & 7) - 2), currentY + tmp4 * (2 - (tmp >> 3)), (currentRotation+4+tmp4) % 4)) {
                        playSoundEffect(8303);
                        break;
                      }
                    }
                  }
                }
                keysPressed[tmp2] += delta;
              }
  
              // Apply gravity
              gravityTimer += math.max(
                  keysPressed[40] ? 0.2 : 0,
                  delta * math.pow(1.23, level));
              if (gravityTimer > 1) {
                gravityTimer = 0;
                tryMove(currentX, currentY + 1, currentRotation);
              }
  
              if (lockTimer > 1) {
                if (currentTetromino) playSoundEffect(31445);
  
                // Lock it in place; we assume that the render was just done
                for (i in grid) grid[i] = shadowGrid[i];
  
                // Find full rows
                tmp2 = 0;
                linesClearing = [];
                rowNotFull:
                for (y = 0; y < h; y++) {
                  for (x = 0; x < w;) {
                    if (!grid[y*w + x++]) {
                      continue rowNotFull;
                    }
                  }
                  linesClearing[y] = state = 1;
                  tmp2++;
                  stateTime = 6;
                }
                if (tmp2) playSoundEffect([, 8392, 8260, 8242, 8225][tmp2]);
                score += 100 * [0, 1, 3, 5, 8][tmp2] * level;
                lines += tmp2;
                level = 1 + ~~(lines / 10);
  
                // Shuffle bag if needed
                if (bag.length < 2) {
                  // tmp is a bitmask that tracks which tetrominos we've already added.
                  // bit 0 is just a sentinel, bits 1-7 correspond to tetrominos.
                  for (tmp = 1; tmp != 255;) {
                    for (j = 0; tmp & (1 << j); j = 1 + ~~(math.random() * 7));
                    tmp |= 1 << j;
                    bag.push(j);
                  }
                }
  
                // Spawn new tetromino
                currentTetromino = bag.shift();
                gravityTimer = 0;
                if (!tryMove(3, 0, 0)) {
                  // Game over
                  currentTetromino = 0;
                  state = 2;
                  stateTime = 4*h;
                  playSoundEffect(31360);
                }
              }
              lockTimer += delta;
            }
  
            requestAnimationFrame(frame);
          }
          frame(0);
  
          function onKeyDown(e) {
            tmp = e[keyCode];
            if (tmp == 77) {
              music[music.paused ? 'play' : 'pause']();
            }
            if (tmp == 27) { // Quit
              doc.body.removeChild(html);
              doc[removeEventListener](keydown, onKeyDown);
              doc[removeEventListener](keyup, onKeyUp);
              music.pause();
              state = 0;
            }
            keysPressed[tmp] = keysPressed[tmp] || 0;
            if ([17, 18, 27, 37, 38, 39, 40, 77].indexOf(tmp) >= 0) {
              e.preventDefault();
            }
          }
  
          function onKeyUp(e) {
            delete keysPressed[e[keyCode]];
          }
  
          doc[addEventListener](keydown, onKeyDown);
          doc[addEventListener](keyup, onKeyUp);
        })();
      }
    });
  })();